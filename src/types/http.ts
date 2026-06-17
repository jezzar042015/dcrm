import type { ContactCallRow, ContactRow, PublisherRow, TerritoryRow } from "./data"

export interface ContactResponse {
    status: 200 | 403
    message: string
    data: ContactRow[]
}

export interface TerritoryResponse {
    status: 200 | 403
    message: string
    data: TerritoryRow[]
}

export interface ContactCallResponse {
    status: 200 | 403
    message: string
    data: ContactCallRow[]
}

export interface PublishersResponse {
    status: 200 | 403
    message: string
    data: PublisherRow[]
}