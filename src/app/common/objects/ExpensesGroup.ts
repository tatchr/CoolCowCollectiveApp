import { ExpensesDetails } from 'src/app/common/objects/ExpensesDetails';

export class ExpensesGroup{
    date: Date;
    totalPrice: number;
    expensesList: Array<ExpensesDetails>

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}