import { IExpensesDetails } from 'src/app/common/interfaces/IExpensesDetails';

export class ExpensesGroup{
    date: Date;
    totalPrice: number;
    expensesList: Array<IExpensesDetails>;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}