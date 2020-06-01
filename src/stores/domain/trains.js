import { Train } from './train'
import { cloneDeep } from 'lodash'

const CATEGORY_ORDER = ["Long-distance", "Commuter", "Cargo", "Locomotive", "Shunting", "On-track machines", "Test drive"]

export class Trains {
  constructor (rawTrains) {
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
    train.updated = Date.now()
    this.trains[train.key] = train
    // console.log('setTrain', new Date(), train.key, train)
    this.updated = Date.now()
    this.categories.add(train.trainCategory)
    return train
  }

  getTrain = (trainKey) => {
    return this.trains[trainKey]
  }

  addTrains = (rawTrains) => {
    if (!rawTrains || rawTrains.length === 0) return this;
    console.log('addTrains',rawTrains.map(t => t.trainNumber))
    let changedTrains = {}
    rawTrains.forEach(rw => {
      const nt = this.setTrain(rw)
      changedTrains[nt.key] = nt
    })

    Object.assign(this.trains,changedTrains)
    return this
  }
  getCategories = () => {
    return Array.from(this.categories)
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

  static cloneFrom (other) {
    console.log('cloneFrom')
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
