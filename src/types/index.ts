export interface User {
    id: string;
    login: string;
    password: string;
    role: Role;
}

export type Role = 'admin' | 'user';