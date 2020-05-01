import { ExpensesDetails } from 'src/app/common/objects/ExpensesDetails';

export class ExpensesRecurringGroup{
    rootExpense: ExpensesDetails;
    totalPrice: number;
    expensesList: Array<ExpensesDetails>
    open: boolean;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}