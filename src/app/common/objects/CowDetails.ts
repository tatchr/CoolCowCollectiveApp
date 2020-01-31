export class CowDetails{
    id: number;
    farmId: string;
    tagNumber: string;
    name: string;
    birthDate: Date;
    breed: string;
    cowType: string;
    cowStatus: string;
    cowState: string;
    registrationDate: Date;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}