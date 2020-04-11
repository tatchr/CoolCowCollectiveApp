export class OtherSalesDetails {
    id: number;
    farmId: number;
    date: string;
    itemSold: string;
    cowIdSold: string;
    price: number;
    quantity: number;
    offtakerName: string;
    offtakerCompany: string;
    timestamp: Date;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}