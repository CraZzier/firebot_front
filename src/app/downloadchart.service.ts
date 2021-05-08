import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AlgorithmTransactionsFull, CandleData, CandleDataArray, CoinFormula, CountingEMAs, ServerConstants } from './model/CoinData';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DownloadchartService {

  public host = ServerConstants.host;
  public client = ServerConstants.client;
  constructor(private http: HttpClient) { }
  
  getCandles(file: CoinFormula): Observable<CandleData[]> {
    return this.http.post<CandleData[]>(`${this.client}/backend/botCandles`, file, {withCredentials:true});
  }
  TestBot(file: CoinFormula): Observable<AlgorithmTransactionsFull> {
    return this.http.post<AlgorithmTransactionsFull>(`${this.client}/backend/botTest`, file, {withCredentials:true});
  }
  TestEMAs(file: CoinFormula): Observable<CountingEMAs> {
    return this.http.post<CountingEMAs>(`${this.client}/backend/botEmas`,file, {withCredentials:true});
  }
  TestCharts(file: CoinFormula): Observable<string> {
    return this.http.post<string>(`${this.client}/backend/botChart`,file, {withCredentials:true});
  }
  Initialise(): Observable<string> {
    return this.http.get<string>(`${this.client}/backend/init`);
  }
  RealBot(): Observable<string> {
    return this.http.get<string>(`${this.client}/backend/realBot`);
  }
}
