import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AlgorithmTransactionsFull, CandleData, CandleDataArray, CoinFormula, ServerConstants } from './model/CoinData';
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
}
