import { derived, readable } from 'svelte/store';
import { Trains } from './domain/trains'
import { DTMQTT } from './mqttClient'

export const baseTrains = readable(new Trains(), (set) => {
  fetch('https://rata.digitraffic.fi/api/v1/live-trains')
    .then(r => r.json())
    .then(rawTrains => {
      const trains = new Trains(rawTrains)
      set(trains)
      fetch('https://rata.digitraffic.fi/api/v1/live-trains?version=' + trains.maxVersion)
        .then(r => r.json())
        .then(rawTrains => {
          trains.addTrains(rawTrains)
          set(trains)
        }).catch((e) => {
        throw e
      })
    }).catch((e) => {
    throw e
  })

  return function stop () {
    console.log('baseTrains', 'stop')
  }
})

export const trains = derived(baseTrains, (trains,set) => {
  set(trains)
  DTMQTT.addSubscription('trains/#',(topic, message) => {
    const train = JSON.parse(message)
    trains.setTrain(train)
    set(trains)

  })
})