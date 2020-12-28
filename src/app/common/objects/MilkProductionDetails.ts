export class MilkProductionDetails{
    id: string;
    farmId: number;
    cowId: string;
    cowName: string;
    tagNumber: string;
    date: string;
    partOfDay: string;
    amount: number;
    createdByUserId: number;
    registrationDate: Date;
    updateDate: Date;

    hasBeenUpdated: boolean;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}