import { OtherSalesDetails } from 'src/app/common/objects/OtherSalesDetails';

export class OtherSalesGroup{
    date: string;
    otherSalesList: Array<OtherSalesDetails>
    open: boolean;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}