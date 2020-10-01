import { TimeOfDay } from '../Enums';
import { MilkTotals } from '../MilkTotals';

export class MilkTimeOfDayGroup{
    timeOfDay: TimeOfDay;    
    milkTotals: MilkTotals[];

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}