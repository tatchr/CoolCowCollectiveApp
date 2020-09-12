import { CowDetails } from './CowDetails';
import { IExpensesDetails } from 'src/app/common/interfaces/IExpensesDetails';

export class LivestockExpensesDetails implements IExpensesDetails{
    id: string;
    farmId: string;
    date: Date;
    type: string = 'Livestock';
    cowDetails: CowDetails;
    price: number;
    sellerName: string;
    sellerCompany: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}