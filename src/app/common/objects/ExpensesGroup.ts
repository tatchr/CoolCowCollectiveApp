import { ExpensesDetails } from 'src/app/common/objects/ExpensesDetails';
import { LivestockExpensesDetails } from 'src/app/common/objects/LivestockExpensesDetails';

export class ExpensesGroup{
    date: Date;
    totalPrice: number;
    expensesList: Array<ExpensesDetails>;
    livestockExpensesList: Array<LivestockExpensesDetails>;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}