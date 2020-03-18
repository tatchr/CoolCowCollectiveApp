export class ExpensesDetails{
    id: number;
    farmId: number;
    date: string;
    type: string;
    itemBought: string;
    price: number;
    quantity: number;
    quantityUnit: string;
    totalPrice: number;
    sellerName: string;
    sellerCompany: string;
    isRootRecord: boolean;
    recurringPeriodInDays: number;  
    recurringId: string;  
    timestamp: Date;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}