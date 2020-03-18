import { MilkSalesDetails } from 'src/app/common/objects/MilkSalesDetails';

export class MilkSalesGroup{
    date: Date;
    milkSalesList: Array<MilkSalesDetails>
    open: boolean;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}