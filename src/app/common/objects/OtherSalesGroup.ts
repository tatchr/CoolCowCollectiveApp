import { OtherSalesDetails } from 'src/app/common/objects/OtherSalesDetails';

export class OtherSalesGroup{
    date: Date;
    otherSalesList: Array<OtherSalesDetails>
    open: boolean;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}