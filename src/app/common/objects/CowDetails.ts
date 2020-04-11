export class CowDetails{
    id: string;
    farmId: string;
    tagNumber: string;
    name: string;
    birthDate: Date;
    breed: string;
    cowType: string;
    cowStatus: string;
    cowState: string;
    lactatingSinceDate: Date;
    registrationDate: Date;
    updateDate: Date;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}