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
}