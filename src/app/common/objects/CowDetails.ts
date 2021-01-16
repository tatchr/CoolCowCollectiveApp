export class CowDetails{
    id: string;
    farmId: string;
    tagNumber: string;
    name: string;
    birthDate: string;
    breed: string;
    cowType: string;
    cowStatus: string;
    cowState: string;
    lactatingSinceDate: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}