export class UserDetails {
    id: string
    email: string
    password: string;
    firstName: string;
    lastName: string;
    gender: string;
    birthDate: string;
    phoneNumber: string;
    hasFarm: boolean;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}