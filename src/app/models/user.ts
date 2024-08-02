export interface UserResponse {
    id?:                string;
    name?:              string;
    email?:             string;
}

export interface UserRequest {
    email?:    string;
    password?: string;
}
