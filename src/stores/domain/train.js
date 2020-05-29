class TimeTableRow {
  constructor (ttr, trainkey) {
    for (const k in ttr) {
      if (!ttr.hasOwnProperty(k)) {
        continue
      }
      this[k] = ttr[k]
    }

    this.scheduledTime = this.scheduledTime && new Date(this.scheduledTime)
    this.actualTime = this.actualTime && new Date(this.actualTime)
    this.liveEstimateTime = this.liveEstimateTime && new Date(this.liveEstimateTime)

    this.referenceTime = this.getReferenceTime()

    if (this.commercialStop) {
      this.richType = 'COMMERCIAL_' + this.type
    } else if (!this.trainStopping) {
      this.richType = 'PASS'
    } else {
      this.richType = this.type
    }

    this.key = `${trainkey}/${this.stationShortCode}/${this.type}/${this.scheduledTime.toISOString()}`
  }

  getReferenceTime = () => {
    if (this.actualTime) return this.actualTime
    if (this.liveEstimateTime) return this.liveEstimateTime
    return this.scheduledTime
  }
}

const LATE_TOLERANCE = {
  'Long-distance': 5,
  'Commuter': 3,
  'Cargo': 2
}

export class Train {
  constructor (rawTrain) {
    for (const k in rawTrain) {
      if (!rawTrain.hasOwnProperty(k)) {
        continue
      }
      this[k] = rawTrain[k]
    }

    this.key = this.departureDate + '/' + this.trainNumber
    this.timeTableRows = this.timeTableRows.map(ttr => new TimeTableRow(ttr, this.key))

    this.running = this.runningCurrently
    this.firstTimetableRow = this.getFirstTimetableRow()
    this.lastTimetableRow = this.getLastTimetableRow()
    this.lastTrainReady = this.getLastTrainReady()
    this.isUpcoming = this.firstTimetableRow && !this.running && !this.firstTimetableRow.actualTime
    this.isPast = this.lastTimetableRow && !this.running && this.lastTimetableRow.actualTime
    this.lastPassedTimetableRow = this.getLastPassedTimetableRow()
    this.lateToleranceMinutes = LATE_TOLERANCE[this.trainCategory]
    this.isLate = this.lastPassedTimetableRow && this.lastPassedTimetableRow.differenceInMinutes >= this.lateToleranceMinutes
    this.isEarly = this.lastPassedTimetableRow && this.lastPassedTimetableRow.differenceInMinutes < 0
    this.isPartcancelled = this.timeTableRows.some(ttr => ttr.cancelled)
    this.hasTrainReady = this.timeTableRows.some(ttr => ttr.trainReady !== undefined)
  }

  getFirstTimetableRow = () => {
    for (let i = 0; i < this.timeTableRows.length; i++) {
      const ttr = this.timeTableRows[i]
      if (!ttr.cancelled) return this.timeTableRows[i]
    }
  }

  getLastTimetableRow = () => {
    for (let i = this.timeTableRows.length - 1; i >= 0; i--) {
      const ttr = this.timeTableRows[i]
      if (!ttr.cancelled) return this.timeTableRows[i]
    }
  }

  getLastPassedTimetableRow = () => {
    for (let i = this.timeTableRows.length - 1; i >= 0; i--) {
      const ttr = this.timeTableRows[i]
      if (ttr.actualTime) {
        return ttr
      }
    }
  }

  getLastTrainReady () {
    for (let i = this.timeTableRows.length - 1; i >= 0; i--) {
      const ttr = this.timeTableRows[i]
      if (ttr.trainReady) {
        return ttr.trainReady
      }
    }
  }
}