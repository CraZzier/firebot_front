import { HttpErrorResponse } from '@angular/common/http';
import { normalizeGenFileSuffix } from '@angular/compiler/src/aot/util';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import iziToast from 'izitoast';
import { createChart } from 'node_modules/lightweight-charts';
import { DownloadchartService } from '../downloadchart.service';
import { CoinFormula } from '../model/CoinData';
declare var TradingView: any;
declare var $: any;
declare var moment:any;
@Component({
  selector: 'app-mainsite',
  templateUrl: './mainsite.component.html',
  styleUrls: ['./mainsite.component.scss']
})
export class MainsiteComponent implements OnInit {

  rawCandledata = [];
  volumeCandledata = [];
  coin = new FormGroup({
    coinname: new FormControl(''),
    from: new FormControl(''),
    to: new FormControl(''),
  });
  constructor(
    private downloadchart : DownloadchartService,
    private router: Router
  ) {}

  timeConverter(timestamp): string{
    var time = moment(timestamp).format("YYYY-MM-DD hh:mm:ss");
    console.log(time);
    return time;
  }
  onSubmit(): void{

  //Walidacja pól formularza oraz zgody
    iziToast.success({
      title: 'Ok',
      message: 'Oczekiwanie na odpowiedź serwera',
    });
  
      let coinformula= new CoinFormula();
      coinformula.CoinName = this.coin.value.coinname;
      coinformula.From = this.coin.value.from;
      coinformula.To =  this.coin.value.to;
      this.downloadchart.getCandles(coinformula).subscribe(
        response=>{
          iziToast.success({
            title: 'Odpowiedź w trakcie ładowania',
            message: 'Poczekaj na update wykresu'
          });
          console.log(response);
          for(let i=0;i<response.length;i++){
            let timetemp = response[i].openTime/1000 + 3600;
            let opentemp = parseFloat(response[i].open);
            let hightemp = parseFloat(response[i].high);
            let lowtemp = parseFloat(response[i].low);
            let closetemp = parseFloat(response[i].close);
            let volume = parseFloat(response[i].volume);
            volume = volume *45;
            this.rawCandledata.push({time: timetemp, open:opentemp, high:hightemp, low:lowtemp, close: closetemp});
            if(opentemp >=closetemp){
              this.volumeCandledata.push({time: timetemp, open:volume, high:volume, low:0, close: 0});
            }else{
              this.volumeCandledata.push({time: timetemp, open:0, high:0, low:volume, close: volume});
            }
          }
          console.log(this.rawCandledata);
          this.updateChart(this.rawCandledata, this.volumeCandledata);
        },
        (error: HttpErrorResponse)=>{
          iziToast.error({
            title: 'Error',
            message: error.message,
          });
        }
      )
    }
  updateChart( candles, volume):void{
    const chart = createChart(document.getElementById("tradingview_782b5"), {
      leftPriceScale: {
        visible: true,
        borderColor: 'rgba(197, 203, 206, 1)',
        autoScale: false,
        scaleMargins: {top:0.70, bottom:0.05},
      },
      rightPriceScale: {
        visible: true,
        borderColor: 'rgba(197, 203, 206, 1)',
        
      },
    });
    chart.applyOptions({
      crosshair :{
        mode: 0,
      },
      timeScale: {
        rightOffset: 50,
        barSpacing: 10,
        fixLeftEdge: false,
        lockVisibleTimeRangeOnResize: true,
        rightBarStaysOnScroll: true,
        borderVisible: true,
        borderColor: '#fff000',
        visible: true,
        timeVisible: true,
        secondsVisible: true,
    }, 
    layout: {
      backgroundColor: '#000000',
      textColor: '#696969',
      fontSize: 12,
      fontFamily: 'Calibri',
    },
    grid: {
      
      vertLines: {
          color: 'rgba(70, 130, 180, 0.5)',
          style: 1,
          visible: false,
      },
      horzLines: {
          color: 'rgba(70, 130, 180, 0.5)',
          style: 1,
          visible: false,
      },
  },
    })
    
    var candleSeries = chart.addCandlestickSeries({
      upColor: '#20C20E',
      downColor: '#000000',
    });
    
    var data = candles;
    
    candleSeries.setData(data);
    var volumeSeries = chart.addCandlestickSeries({
      priceScaleId: 'left'
    });
    volumeSeries.setData(volume);

    //  var trading = document.getElementById("tradingview_782b5");
    //  if(trading.children.length>1){
    //    trading.removeChild(trading.firstChild);
    // }
  }

  ngOnInit(): void {

  }

}
