export class FarmDetails{
    farmId: string;
    userId: number;
    userRole: string;
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    county: string;
    country: string;
    description: string;
    registrationDate: Date;
    updateDate: Date;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}