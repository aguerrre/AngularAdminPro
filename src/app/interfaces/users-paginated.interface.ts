import { User } from "../models/user.model";

export interface UsersPaginated {
    total: number;
    totalPages: number;
    users: User[];
}