import {Train} from './train'
import {cloneDeep} from 'lodash'

export const CATEGORY_ORDER = ["Long-distance", "Commuter", "Cargo", "Locomotive", "Shunting", "On-track machines", "Test drive"]

export const CATEGORY_TRANSLATE = {
    "Long-distance": "Kaukoliikenne",
    "Commuter": "Lähiliikenne",
    "Cargo": "Tavaraliikenne",
    "Locomotive": "Veturijunat",
    "Shunting": "Vaihtotyöt",
    "On-track machines": "Työkoneet",
    "Test drive": "Koeajot"
}


export class Trains {
    constructor(rawTrains) {
        this.trains = {}
        this.maxVersion = 0
        this.updated = null
        this.categories = new Set()
        this.addTrains(rawTrains)
    }

    setTrain = (rawTrain) => {
        const train = new Train(rawTrain)
        if (train.version > this.maxVersion) {
            this.maxVersion = train.version
        }
        train.updated = new Date()
        this.trains[train.key] = train
        this.updated = new Date()
        this.categories.add(train.trainCategory)
        return train
    }

    getTrain = (trainKey) => {
        return this.trains[trainKey]
    }

    hasTrain = (trainKey) => {
        return !!this.trains[trainKey]
    }

    addTrains = (rawTrains) => {
        if (!rawTrains || rawTrains.length === 0) return this;
        let changedTrains = {}
        rawTrains.forEach(rw => {
            const nt = this.setTrain(rw)
            changedTrains[nt.key] = nt
        })

        Object.assign(this.trains, changedTrains)
        return this
    }

    getCategories = () => {
        return Array.from(this.categories)
    }

    getTrainsByKeys = (keys, filterFunc) => {
        return keys.map(this.getTrain).filter(train => !filterFunc || filterFunc(train))
    }

    trainsByCategory = () => {
        let categories = {}
        for (const tk in this.trains) {
            if (!this.trains.hasOwnProperty(tk)) {
                continue
            }
            const train = this.trains[tk]

            if (categories[train.trainCategory] === undefined) {
                categories[train.trainCategory] = []
            }

            categories[train.trainCategory].push(train)
        }

        return CATEGORY_ORDER.filter(key => !!categories[key])
            .map(key => {
                categories[key].sort((t1, t2) => t1.trainNumber - t2.trainNumber)
                return {key, trains: categories[key]}
            })
    }

    trainsByStation = (onlyStation, filterFunc) => {
        let stations = {}
        for (const tk in this.trains) {
            if (!this.trains.hasOwnProperty(tk)) {
                continue
            }
            const train = this.trains[tk]

            if (filterFunc && !filterFunc(train)) {
                continue
            }


            train.timeTableRows.forEach(ttr => {
                const {stationShortCode} = ttr
                if (onlyStation && stationShortCode !== onlyStation) {
                    return true
                }

                if (stations[stationShortCode] === undefined) {
                    stations[stationShortCode] = []
                }

                stations[stationShortCode].push({train, ttr})
            })
        }

        if (onlyStation) {
            return stations[onlyStation]
        }
        return stations
    }

    static cloneFrom(other) {
        const newTrains = new Trains([])
        for (const tk in other.trains) {
            if (!other.trains.hasOwnProperty(tk)) {
                continue
            }
            newTrains.trains[tk] = cloneDeep(other.trains[tk])
        }
        newTrains.maxVersion = other.maxVersion
        newTrains.updated = other.updated
        newTrains.categories = other.categories
        return newTrains
    }
}
