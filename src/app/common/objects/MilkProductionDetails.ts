export class MilkProductionDetails{
    id: string;
    farmId: number;
    cowId: number;
    cowName: string;
    tagNumber: string;
    date: Date;
    timeOfDay: string;
    amount: number;
    createdByUserId: number;
    registrationDate: Date;
    updateDate: Date;

    hasBeenUpdated: boolean;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}