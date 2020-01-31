export class OtherSalesDetails {
    id: number;
    farmId: number;
    date: string;
    itemSold: string;
    cowIdSold: number;
    price: number;
    quantity: number;
    offtakerName: string;
    offtakerCompany: string;
    timestamp: Date;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}