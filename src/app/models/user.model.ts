import { environment } from "src/environments/environment";

const api_url = environment.base_url;

export class User {
    constructor(
        public first_name: string,
        public email: string,
        public password?: string,
        public img?: string,
        public google_auth?: boolean,
        public role?: string,
        public uid?: string,
    ) { }

    get getImage(): string {
        if (this.img) {
            return this.img.includes('https') ? this.img : `${api_url}/uploads/users/${this.img}`;
        } else {
            return `${api_url}/uploads/users/no-image`;
        }
    }
}