import { PartOfDay } from '../Enums';
import { MilkTotals } from '../MilkTotals';

export class MilkPartOfDayGroup{
    partOfDay: PartOfDay;    
    milkTotals: MilkTotals[];

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}