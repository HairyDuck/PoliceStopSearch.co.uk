export interface StopSearchLocation {
  latitude: string
  longitude: string
  street: {
    id: number
    name: string
  }
}

export interface OutcomeObject {
  id: string
  name: string
}

export interface StopSearchIncident {
  age_range: string | null
  officer_defined_ethnicity: string | null
  involved_person: boolean
  self_defined_ethnicity: string | null
  gender: string | null
  legislation: string | null
  outcome_linked_to_object_of_search: boolean | null
  datetime: string
  outcome_object: OutcomeObject | null
  location: StopSearchLocation
  object_of_search: string | null
  operation: string | null
  outcome: string | null
  type: 'Person search' | 'Vehicle search' | 'Person and Vehicle search'
  operation_name: string | null
  removal_of_more_than_outer_clothing: boolean | null
} 