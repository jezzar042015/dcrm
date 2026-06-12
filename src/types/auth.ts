export interface AuthResponse {
    status: 200 | 201 | 202 | 400 | 401 | 403 | 409 | 500
    message: string
    token?: {
        token: string,
        ts: string,
    }
    data?: AuthenticatedUser | DisallowedUser
}

export interface AuthenticatedUser {
    name: string
    username: string
    id: string
    role: 'admin' | 'elder' | 'ms' | 'pub'
}

export interface DisallowedUser {
    username: string
    accountStatus: 'pending' | 'inactive' | 'active'
    createdAt: string
}

export interface NewUser {
    name: string
    username: string
    password: string
}