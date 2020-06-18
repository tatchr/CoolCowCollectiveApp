export class UserDetails {
    id: number
    email: string
    password: string;
    firstName: string;
    lastName: string;
    gender: string;
    birthDate: Date;
    phoneNumber: string;
    hasFarm: boolean;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}