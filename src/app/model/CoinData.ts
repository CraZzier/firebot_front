import { stringify } from "@angular/compiler/src/util"



export class AlgorithmTransactionsFull {
	Transaction:AlgorithmTransactions[];
	Finalusdt:number;
	Transamount :number;
	SuccessfulTrans:number;
	LostTrans:number;
}

//AlgorithmTransactions keeps packet of trasnactions main data
export class AlgorithmTransactions {
	StartBalance:number;
	EntryFee:number;
	Stoploss:Stoploss[];
	Leverage :number;
	BuyingPrice:number;
	BalanceMinusFee:number;
	EntryTime:number;

	FinishBalance:number;
	ClosingFee:number;
	Type:string
	ClosingTime:number;
	SellingPrice:number;
	LongOrShort:string;

	FeeSum:number;
	ProfitWithoutFee:number;
	Profit:number;
}
export class Stoploss{
    Timestamp:number
}
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
export class CountingEMAs{
	EmaNum:      number[];
	EmaInterval: string;

	AverageTimeCrossPlus: number;
	AverageDeviationPlus: number;
	MaxDevationPlus:      number;
	CasesPlus:            number;
	MaxTimePlus:          number;

	AverageTimeCrossMinus: number;
	AverageDeviationMinus: number;
	MaxDevationMinus:     number;
	CasesMinus:            number;
	MaxTimeMinus:          number;
}