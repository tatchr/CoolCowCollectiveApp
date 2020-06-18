export class FarmDetails{
    id: string;
    name: string;
    email: string;
    phone: string;
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