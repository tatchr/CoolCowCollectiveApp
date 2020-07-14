export class OtherSalesDetails {
    id: number;
    farmId: string;
    date: string;
    itemSold: string;
    itemDescription: string;
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