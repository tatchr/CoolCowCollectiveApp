import { MilkTimeOfDayGroup } from '../../groups/MilkTimeOfDayGroup';

export class MilkProductionChartData{
    days: string[];
    milkTimeOfDayGroups: MilkTimeOfDayGroup[];

    constructor(days: string[], milkTimeOfDayGroups: MilkTimeOfDayGroup[]){
        this.days = days;
        this.milkTimeOfDayGroups = milkTimeOfDayGroups;
    }
}