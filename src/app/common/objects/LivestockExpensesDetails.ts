import { CowDetails } from './CowDetails';

export class LivestockExpensesDetails{
    id: string;
    farmId: string;
    date: string;
    cowDetails: CowDetails;
    price: number;
    sellerName: string;
    sellerCompany: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}