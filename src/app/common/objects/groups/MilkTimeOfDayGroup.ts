import { TimeOfDay } from '../Enums';

export class MilkTimeOfDayGroup{
    timeOfDay: TimeOfDay;
    date: Date;
    totalMilk: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}