import { writable } from 'svelte/store'

const DEFAULT_SETTINGS = {
  showOnlyRunning: true,
  filterTrainCategories: [],
  filterTrainTypes: '',
  filterCommuterLineID: '',
  showPassing: false,
  hideEmptyStations: false

}
export const settings = writable(DEFAULT_SETTINGS)