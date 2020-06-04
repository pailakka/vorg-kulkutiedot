import * as mqtt from '../lib/browserMqtt'
import mqttMatch from 'mqtt-match'

class DigitrafficMQTTClient {
  constructor () {
    console.log('DigitrafficMQTTClient', 'constructor')
    this.client = null
    this.subscriptions = {}
  }

  connect = () => {
    this.client = mqtt.connect('wss://rata.digitraffic.fi/mqtt')
    this.client.on('connect', () => {
      this._doSubscriptions()
    })

    this.client.on('message', (topic, message) => {
      for (const subbedTopic in this.subscriptions) {
        if (!this.subscriptions.hasOwnProperty(subbedTopic)) {
          continue
        }
        if (mqttMatch(subbedTopic, topic)) {
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

  removeSubscription = (topic) => {
    this.subscriptions[topic] = undefined
    delete this.subscriptions[topic]
    this.client.unsubscribe(topic)
    console.log('unsubscribe', topic, this.subscriptions)
  }

  _doSubscriptions () {
    console.log('subscribe', this.subscriptions)
    this.client.subscribe(Object.keys(this.subscriptions), err => {
      if (err) {
        return console.error(err)
      }
    })
  }
}

const DTMQTT = new DigitrafficMQTTClient()
DTMQTT.connect()

export {
  DTMQTT
}