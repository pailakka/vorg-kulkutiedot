import {derived, readable} from 'svelte/store';
import {Trains} from './domain/trains'
import {DTMQTT} from './mqttClient'
import {trains} from "./trains";
import {getDigitrafficEndpoint} from "../lib/util";

const loadedDepartureDates = {}
let trainCompositions = {}
let lastLoadedVersion = -1
let maxVersion = -1;

const handleTrainCompositions = (hasTrain) => (compositions) => {
    const newCompositions = {}
    compositions.forEach(composition => {
        const key = `${composition.departureDate}/${composition.trainNumber}`
        if (!hasTrain(key)) {
            return false;
        }
        composition.key = key

        loadedDepartureDates[composition.departureDate] = true
        newCompositions[key] = composition

        if (composition.version > maxVersion) {
            maxVersion = composition.version
        }
    })

    trainCompositions = {...trainCompositions, ...newCompositions}

}

export const baseCompositions = derived(trains, (trains, set) => {
    const datesToLoad = Array.from(new Set(Object.values(trains.trains).map(t => t.departureDate))).filter(d => loadedDepartureDates[d] === undefined)

    if (datesToLoad.length === 0) {
        set(trainCompositions)
    } else {
        datesToLoad.forEach(d => loadedDepartureDates[d] = true)
        Promise.all(datesToLoad.map(date => getDigitrafficEndpoint(`compositions/${date}`)))
            .then(dateCompositions => {
                dateCompositions.forEach(handleTrainCompositions(trains.hasTrain))
                set(trainCompositions)
                return maxVersion
            })
            .then((maxVersion) => {
                if (maxVersion > lastLoadedVersion) {
                    getDigitrafficEndpoint(`compositions?version=${maxVersion}`)
                        .then(compositions => {
                            compositions.forEach(handleTrainCompositions(trains.hasTrain))
                        })
                        .then(() => {
                            set(trainCompositions)
                        })
                }
            })
    }

    return function stop() {

    }
})

export const compositions = derived([baseCompositions,trains], ([originalCompositions,trains], set) => {
    set(originalCompositions)
    let compositionUpdateQueue = []
    DTMQTT.addSubscription('compositions/#', (topic, message) => {
        compositionUpdateQueue.push(JSON.parse(message))
    })

    const emptyInterval = setInterval(() => {
        if (compositionUpdateQueue.length > 0) {
            handleTrainCompositions(trains.hasTrain)(compositionUpdateQueue)
            set(trainCompositions)
            compositionUpdateQueue = []
        }
    }, 500);

    return () => {
        clearInterval(emptyInterval);
    };

}, {})