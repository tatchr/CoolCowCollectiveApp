import { Period } from 'src/app/common/objects/Enums';

export class PeriodDetails{
    value: Period;
    label: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}