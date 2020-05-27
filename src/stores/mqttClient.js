import * as mqtt from '../lib/browserMqtt'
import mqttMatch from 'mqtt-match'

class DigitrafficMQTTClient {
  constructor () {
    this.client = null
    this.subscriptions = {}
  }

  connect = () => {
    this.client = mqtt.connect('wss://rata.digitraffic.fi/mqtt')
    this.client.on('connect', () => {
      this._doSubscriptions()
    })

    this.client.on('message', (topic, message) => {
      console.log('message from', topic, Object.keys(this.subscriptions))
      for (const subbedTopic in this.subscriptions) {
        if (!this.subscriptions.hasOwnProperty(subbedTopic)) {
          continue
        }
        if (mqttMatch(subbedTopic, topic)) {
          console.log('matched with', subbedTopic)
          this.subscriptions[subbedTopic](topic, message)
          break
        }
      }

    })
  }

  addSubscription = (topic, handler) => {
    this.subscriptions[topic] = handler
    this._doSubscriptions()
  }

  _doSubscriptions () {
    this.client.subscribe(Object.keys(this.subscriptions), err => {
      if (err) {
        return console.error(err)
      }
      console.log('subbed to', Object.keys(this.subscriptions))
    })
  }
}

const DTMQTT = new DigitrafficMQTTClient()
DTMQTT.connect()

export {
  DTMQTT
}