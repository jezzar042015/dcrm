import type { ContactCallRow, ContactLocationRow, ContactRow, PublisherRow, TerritoryCoverageRow, TerritoryRow } from "./data"

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

export interface ContactLocationsResponse {
    status: 200 | 403
    message: string
    data: ContactLocationRow[]
}

export interface TerritoryCoveragesResponse {
    status: 200 | 403
    message: string
    data: TerritoryCoverageRow[]
}