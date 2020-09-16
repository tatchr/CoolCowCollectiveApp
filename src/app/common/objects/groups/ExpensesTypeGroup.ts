export class ExpensesTypeGroup{
    type: string;
    totalPrice: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}