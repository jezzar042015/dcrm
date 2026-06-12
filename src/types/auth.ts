export interface AuthResponse {
    status: 200 | 201 | 400 | 401 | 403 | 500
    message: string
    token?: {
        token: string,
        ts: string,
    }
    data?: AuthenticatedUser
}

export interface AuthenticatedUser {
    name: string
    username: string
    id: string
    role: 'admin' | 'elder' | 'ms' | 'pub'
}

export interface NewUser {
    name: string
    username: string
    password: string
}