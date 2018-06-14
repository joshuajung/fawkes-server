// External imports

// Internal imports

export type AdvancedQueryVariable = string | number

export interface AdvancedQuery {
  components: Array<string>
  variables: Array<AdvancedQueryVariable>
}