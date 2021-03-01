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
  defaultPair = "BTCUSDT";
  defaultFrom = "2021-02-11";
  defaultTo = "2021-02-12";
  actualFrom = "2021-02-11";
  actualTo = "2021-02-11";
  actualCoinName = "BTCUSDT";
  chart:any;
  candleSeries:any;
  volumeSeries:any;
  maSeries: any;
  rawCandledata = [];
  volumeCandledata = [];
  rawCandleDatacopy = [];
  maLines = [];
  emaLines =[];
  markers =[];
  coin = new FormGroup({
    coinname: new FormControl(''),
    from: new FormControl(''),
    to: new FormControl(''),
  });
  ma = new FormGroup({
    which: new FormControl(''),
    range: new FormControl(''),
  });
  ema = new FormGroup({
    which: new FormControl(''),
    range: new FormControl(''),
  });
  constructor(
    private downloadchart : DownloadchartService,
    private router: Router
  ) {}
  emaSubmit():void{
    iziToast.success({
      title: 'Ok',
      message: 'Dodawanie MA',
    });

    let maArr = this.emaCalculate(this.rawCandleDatacopy, this.ema.value.which, this.ema.value.range);
    let emalength= this.emaLines.length;
    let color1='blue';
    if(emalength%4==0){
      color1 = 'pink';
    }else if(emalength%4==1){
      color1 = 'purple';
    }else if(emalength%4==2){
      color1 = 'red';
    }else{
      color1 = 'lime';
    }
    this.emaLines[emalength] = this.chart.addLineSeries({
      upColor: 'purple',
      downColor: 'purple',
      priceLineVisible: false,
      priceLineWidth: 1,
      priceLineColor: 'purple',
      priceLineStyle: 1,
      color: color1
    });
    this.emaLines[emalength].setData(maArr);
  }
  maSubmit():void{
    iziToast.success({
      title: 'Ok',
      message: 'Dodawanie MA',
    });

    let maArr = this.maCalculate(this.rawCandleDatacopy, this.ma.value.which, this.ma.value.range);
    let malength= this.maLines.length;
    let color1='purple';
    if(malength%4==0){
      color1 = 'purple';
    }else if(malength%4==1){
      color1 = 'orange';
    }else if(malength%4==2){
      color1 = 'yellow';
    }else{
      color1 = 'white';
    }
    this.maLines[malength] = this.chart.addLineSeries({
      upColor: 'purple',
      downColor: 'purple',
      priceLineVisible: false,
      priceLineWidth: 1,
      priceLineColor: 'purple',
      priceLineStyle: 1,
      color: color1
    });
    this.maLines[malength].setData(maArr);
  }
  emaCalculate(candlesticks, which, range){
    let emaArr = [];
    let margin = (2/(1+range));
    let ma = this.maCalculate(candlesticks, which, range);
    let first = ma[range-1].value;
    let firsttime = ma[range-1].time;
    emaArr.push({time:firsttime, value:first});

    for(let i=range;i<candlesticks.length;i++){
      let ema=0.0;
      if(which == "close"){

        ema = parseFloat(candlesticks[i].close) * margin + emaArr[i-range].value * (1-margin);
      }else{
        ema = parseFloat(candlesticks[i].open) * margin + emaArr[i-range].value * (1-margin);
      }
      emaArr.push({time: candlesticks[i].time, value: ema});
    }
    console.log(emaArr);
    return emaArr;
  }
  maCalculate(candlesticks, which, range){
    let maArr = [];
    for(let i=range-1;i<candlesticks.length;i++){
      let suma=0.00;
      for(let p=i-range+1;p<=i;p++){
        if(which == "close"){
          suma+=candlesticks[p].close;
        }else{
          suma+=candlesticks[p].open;
        }
      }
      let score = suma/parseFloat(range);
      let score1 = score+ (1/10000*(candlesticks[i].close));
      maArr.push({time: candlesticks[i].time, value: score});
      //maArr.push({time: candlesticks[i].time, open: score, high:score1, low:score, close:score1})
    }
    return maArr;
  }
  timeConverter(timestamp): string{
    var time = moment(timestamp).format("YYYY-MM-DD HH:mm:ss");
    return time;
  }
  timeConverterReverseDate(date): number{
    date = date.split("-");
    var newDate = new Date( date[0], date[1], date[2]);
    return newDate.getTime();
  }
  timeConverterReverseDatetime(date): number{
    date = date.split("-");
    var newDate = new Date( date[0], date[1], date[2], date[3], date[4], date[5]);
    return newDate.getTime();
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
      this.actualFrom = this.coin.value.from;
      this.actualTo = this.coin.value.to;
      this.actualCoinName = this.coin.value.coinname;
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
  clearIndicators(): void{
    for(let i=0;i<this.maLines.length;i++){
      this.chart.removeSeries(this.maLines[i]);
    }
    this.maLines=[];
    for(let i=0;i<this.emaLines.length;i++){
      this.chart.removeSeries(this.emaLines[i]);
    }
    this.emaLines=[];
  }
  updateChart( candles, volume):void{
    this.rawCandleDatacopy = this.rawCandledata;
    this.volumeCandledata=[];
    this.rawCandledata=[];
    if(this.candleSeries != null){
      this.chart.removeSeries(this.candleSeries);
    }
    if(this.volumeSeries != null){
      this.chart.removeSeries(this.volumeSeries);
    }
    this.clearIndicators();
  
    this.candleSeries = this.chart.addCandlestickSeries({
      upColor: '#20C20E',
      downColor: '#000000',
      priceLineVisible: false,
      priceLineWidth: 2,
      priceLineColor: '#4682B4',
      priceLineStyle: 3
    });
    
    var data = candles;
    
    this.candleSeries.setData(data);
    this.volumeSeries = this.chart.addCandlestickSeries({
      priceScaleId: 'left',
      priceLineVisible: false,
      priceLineWidth: 2,
      priceLineColor: '#4682B4',
      priceLineStyle: 3
    });
    this.volumeSeries.setData(volume);;
  }
  showTransactionTable(Transobj):void{
    let finish = `
    <div class="general-transaction-window">
    <table class="table">
        <thead class="thead-dark">
            <tr class="sum-row">
                <th>Finish Balance</th>
                <th>Transactions</th>
                <th>Succesful</th>
                <th>Lost</th>
            </tr>
        </thead>
        <tr class="sum-row-data">
            <td>${Transobj.Finalusdt.toFixed(2)}</td>
            <td>${Transobj.Transamount}</td>
            <td>${Transobj.SuccessfulTrans}</td>
            <td>${Transobj.LostTrans}</td>     
        </tr>
    </table>
  </div>`
    $("#server-text-cont div").remove();
    $("#server-text-cont").append(finish);
    for(let i=0;i<Transobj.Transaction.length;i++){
      let from = this.timeConverterReverseDate(this.actualFrom);
      let to = this.timeConverterReverseDate(this.actualTo);
      let temp = Transobj.Transaction[i];
      if(temp.EntryTime>from && temp.EntryTime<to && temp.ClosingTime>from && temp.ClosingTime<to){
        this.markers.push({time:temp.EntryTime/1000+3600, position:'aboveBar', color:'green', shape: 'arrowDown',text:'Entry', size:3});
        this.markers.push({time:temp.ClosingTime/1000+3600, position:'belowBar', color:'red', shape: 'arrowUp',text:'Close', size:3});
      }
      let content = `
      <div class="single-transaction-window">
      <table class="table table-dark">
          <thead class="thead-dark">
              <tr class="entry-row">
                  <th>Entry Time</th>
                  <th>Start Balance</th>
                  <th>Buying Price</th>
                  <th>Entry Fee</th>
                  <th>Stoploss</th>
                  <th>Leverage</th>
                  <th>Balance - Fee</th>
              </tr>
          </thead>
          <tr>
              <td>${this.timeConverter(temp.EntryTime)}</td>
              <td>${temp.StartBalance.toFixed(2)}</td>
              <td>${temp.BuyingPrice.toFixed(2)}</td>
              <td>${temp.EntryFee.toFixed(2)}</td>
              <td>${temp.Stoploss[0].Value.toFixed(2)}</td>
              <td>${temp.Leverage}</td>
              <td>${temp.BalanceMinusFee.toFixed(2)}</td>       
          </tr>
          <thead class="thead-dark">
              <tr class="exit-row">
                  <th>Close Time</th>
                  <th>Finish Balance</th>
                  <th>Selling Price</th>
                  <th>Closing Fee</th>
                  <th colspan="2">Type</th>
                  <th></th>   
              </tr>
          </thead>
          <tr>
              <td>${this.timeConverter(temp.ClosingTime)}</td>
              <td>${temp.FinishBalance.toFixed(2)}</td>
              <td colspan="2">${temp.SellingPrice.toFixed(2)}</td>
              <td colspan="2">${temp.ClosingFee.toFixed(2)}</td>
              <td>${temp.Type}</td>       
          </tr>
          <thead class="thead-dark">
              <tr class="single-sum-row">
                  <th>Profit</th>
                  <th>Profit No Fee</th>
                  <th>Profit Percent</th>
                  <th colspan="4">Sum of Fees</th>
              </tr>
          </thead>
          <tr>
              <td>${temp.Profit.toFixed(2)}</td>
              <td>${temp.ProfitWithoutFee.toFixed(2)}</td>
              <td>${((temp.Profit / temp.StartBalance)*100).toFixed(2)}</td>
              <td colspan="4">${temp.FeeSum.toFixed(2)}</td>       
          </tr>
      </table>
    </div>
      `;
      $("#server-text-cont").append(content);
      
    }
    this.candleSeries.setMarkers(this.markers);
   
  }
  testBot():void{
    let coin = new CoinFormula()
    coin.From = this.actualFrom;
    coin.To = this.actualTo;
    coin.CoinName =  this.actualCoinName;
    this.downloadchart.TestBot(coin).subscribe(
      response=>{
        iziToast.success({
          title: 'Odpowiedź w trakcie ładowania',
          message: 'Poczekaj na update wykresu'
        });
        console.log(response);
        this.showTransactionTable(response);

      },
      (error: HttpErrorResponse)=>{
        iziToast.error({
          title: 'Error',
          message: error.message,
        });
      }
    )
  }
  ngOnInit(): void {
    this.chart = createChart(document.getElementById("tradingview_782b5"), {
      leftPriceScale: {
        visible: true,
        borderColor: 'rgba(197, 203, 206, 1)',
        autoScale: true,
        scaleMargins: {top:0.70, bottom:0.00},
      },
      rightPriceScale: {
        visible: true,
        borderColor: 'rgba(197, 203, 206, 1)',
        
      },
    });
    this.chart.applyOptions({
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
        borderColor: '#03404B',
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
  }
}
