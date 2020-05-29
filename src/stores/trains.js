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
          set(trains.addTrains(rawTrains))
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

export const trains = derived(baseTrains, (trains, set) => {
  set(trains)
  let trainUpdateQueue = []
  DTMQTT.addSubscription('trains/#', (topic, message) => {
    trainUpdateQueue.push(JSON.parse(message))

  })

  const emptyInterval = setInterval(() => {
    if (trainUpdateQueue.length > 0) {
      console.log('trainUpdateQueue',trainUpdateQueue.map(t => t.trainNumber))
      set(trains.addTrains(trainUpdateQueue))
      trainUpdateQueue = []
    }
  }, 500);

  return () => {
    clearInterval(emptyInterval);
  };

}, new Trains())