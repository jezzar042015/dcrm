export interface Queue {
  id: string
  url: string
  method: 'POST' | 'PUT'
  payload: [any][]
  timestamp: string
}

export interface Contact {
  id: string
  firstname: string
  lastname: string
  pic: string
  nickname: string | null
  signname: string | null
  birthdate: string | null
  age: number | null
  status: 'Territory' | 'Bible Study' | 'Moved' | 'Deceased' | 'Baptized Publisher' | 'Return Visit' | 'Not Deaf'
  publisher: string | null
  territory: string | null
  location_sketch: string | null
  landmark: string | null
  address: string | null
  brgy: string | null
  town: string | null
  province: string | null
  gender: 'Male' | 'Female'
  civil_status: 'Single' | 'Partner' | 'Minor' | 'Other' | 'Live-in' | 'Widower' | 'Separated' | 'Married' | 'Widow' | 'Single Parent' | 'Orphan'
  sign_language_skill: 'Natural Signs' | 'Skilled' | 'Semi-Skilled'
  remarks_family: string | null
  remarks_deaf: string | null
}

export type ContactRow = [
  id: string,
  firstname: string,
  lastname: string,
  pic: string,
  nickname: string | null,
  signname: string | null,
  birthdate: string | null,
  age: number | null,
  status: 'Territory' | 'Bible Study' | 'Moved' | 'Deceased' | 'Baptized Publisher' | 'Return Visit' | 'Not Deaf',
  publisher: string | null,
  territory: string | null,
  location_sketch: string | null,
  landmark: string | null,
  address: string | null,
  brgy: string | null,
  town: string | null,
  province: string | null,
  gender: 'Male' | 'Female',
  civil_status: 'Single' | 'Partner' | 'Minor' | 'Other' | 'Live-in' | 'Widower' | 'Separated' | 'Married' | 'Widow' | 'Single Parent' | 'Orphan',
  sign_language_skill: 'Natural Signs' | 'Skilled' | 'Semi-Skilled',
  remarks_family: string | null,
  remarks_deaf: string | null,
]

export type TerritoryRow = [
  id: string,
  code: string,
  descriptions: string,
  geo_inclusions: string,
  group: string,
  latest_assignment: string,
  latest_completion: string,
  aging: number,
  history: string,
  dcrs: number,
]

export type ContactCallRow = [
  id: string,	
  dcr_id: string,	
  coverage_id: string,	
  date_assigned: string,	
  date_actual: string,	
  publishers: string,	
  mode: string,	
  status: string,	
  remarks: string,
]

export type GroupedContactsByStatus = {
  status: string;
  contacts: ContactRow[];
};

export type GroupedContactsByTown = {
  town: string;
  contacts: ContactRow[];
};