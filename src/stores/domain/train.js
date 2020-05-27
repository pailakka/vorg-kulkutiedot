export class Train {
  constructor (rawTrain) {
    for (const k in rawTrain) {
      if (!rawTrain.hasOwnProperty(k)) {
        continue
      }
      this[k] = rawTrain[k]

      this.key = this.departureDate + '/' + this.trainNumber
    }
  }

}