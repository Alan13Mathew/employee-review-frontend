export interface Employee {
    _id: string;
    full_name: string;
    email: string;
    password: string;
    gender: string;
    role: "admin" | "employee";
    position?: string;
}
