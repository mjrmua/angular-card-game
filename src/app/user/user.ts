import { Avatar } from 'app/avatar/avatar.service';
export class User {
    constructor(
        public name: string,
        public avatar: Avatar
    ) {};
};
