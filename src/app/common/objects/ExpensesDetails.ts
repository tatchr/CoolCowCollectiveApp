import { IExpensesDetails } from 'src/app/common/interfaces/IExpensesDetails';

export class ExpensesDetails implements IExpensesDetails{
    id: string;
    farmId: string;
    date: Date;
    type: string;
    itemBought: string;
    price: number;
    quantity: number;
    quantityUnit: string;
    cowName: string;
    cowStatus: string;
    totalPrice: number;
    sellerName: string;
    sellerCompany: string;
    isRootRecord: boolean;
    recurringIsActive: boolean;
    recurringPeriodInDays: number;  
    recurringFromDate: Date;
    recurringId: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}