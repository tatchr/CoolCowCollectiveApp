export class MilkSalesDetails {
    id: number;
    farmId: string;
    date: string;
    litersSold: number;
    pricePerLiter: number;
    offtaker: string;
    offtakerName: string;
    fullAmountPaid: boolean;
    timestamp: Date;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}