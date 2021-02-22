import { stringify } from "@angular/compiler/src/util"

export class CoinFormula{
    CoinName: string;
    From: string;
    To: string;
}
export class CandleData{
    openTime:number;  
    open:string ;
    high:string ;
    low:string ;
    close:string ;
    volume:string;
    closeTime:number;  
    quoteAssetVolume:string ;
    tradeNum :number ; 
    takerBuyBaseAssetVolume:string ;
    takerBuyQuoteAssetVolume:string ;
}
export class CandleDataArray{
    candlesticks: CandleData[];
}
export class ServerConstants{
    public static host = "http://127.0.0.1:8080";
    public static client = "http://127.0.0.1:4200";
}
export class ReadyCandleData{
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
}