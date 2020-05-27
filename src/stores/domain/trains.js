import { Train } from './train'

const CATEGORY_ORDER = ["Long-distance", "Commuter", "Cargo", "Locomotive", "Shunting", "On-track machines"]

export class Trains {
  constructor (rawTrains) {
    this.trains = {}
    this.maxVersion = 0
    this.updated = null
    this.addTrains(rawTrains)
  }

  setTrain = (rawTrain) => {
    const train = new Train(rawTrain)
    if (train.version > this.maxVersion) {
      this.maxVersion = train.version
    }
    this.trains[train.key] = train
    this.updated = Date.now()
  }

  getTrain = (trainKey) => {
    return this.trains[trainKey]
  }

  addTrains = (rawTrains) => {
    rawTrains && rawTrains.forEach(this.setTrain)
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
}
