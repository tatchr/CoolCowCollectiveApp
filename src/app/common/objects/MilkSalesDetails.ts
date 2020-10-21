export class MilkSalesDetails {
    id: string;
    farmId: string;
    date: Date;
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