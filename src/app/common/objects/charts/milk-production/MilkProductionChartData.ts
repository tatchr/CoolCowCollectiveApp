import { MilkPartOfDayGroup } from '../../groups/MilkPartOfDayGroup';

export class MilkProductionChartData{
    days: string[];
    milkPartOfDayGroups: MilkPartOfDayGroup[];

    constructor(days: string[], milkPartOfDayGroups: MilkPartOfDayGroup[]){
        this.days = days;
        this.milkPartOfDayGroups = milkPartOfDayGroups;
    }
}