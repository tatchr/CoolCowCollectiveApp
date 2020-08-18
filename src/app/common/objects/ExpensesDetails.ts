export class ExpensesDetails{
    id: string;
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
    recurringIsActive: boolean;
    recurringPeriodInDays: number;  
    recurringFromDate: Date;
    recurringId: string;  
    //registrationDate: Date;
    //updateDate: Date;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}