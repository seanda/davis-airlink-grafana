const axios = require('axios')
const express = require('express')
const promClient = require('prom-client')

const davisAirlinkIp = '192.168.1.XX' // Put your Airlink LAN IP address here

const davisAQ = axios.create({
  baseURL: `http://${davisAirlinkIp}/v1`,
  headers: {
    'Content-Type': 'application/json'
  }
})

async function getCurrentConditions() {
  await davisAQ.get(`/current_conditions`, null)
    .then((response) => {
      let data = response.data.data.conditions[0]

      davisHumidity.set(data.hum)

      davisTemperature.set(FtoC(data.temp))
      davisDewPoint.set(FtoC(data.dew_point))
      davisWetBulb.set(FtoC(data.wet_bulb))
      davisHeatIndex.set(FtoC(data.heat_index))

      davisPm1.set(data.pm_1)

      davisPm2p5.set(data.pm_2p5)
      davisPm2p5Last1h.set(data.pm_2p5_last_1_hour)
      davisPm2p5Last3h.set(data.pm_2p5_last_3_hours)
      davisPm2p5Last24h.set(data.pm_2p5_last_24_hours)
      davisPm2p5nowcast.set(data.pm_2p5_nowcast)

      davisPm10.set(data.pm_10)
      davisPm10Last1h.set(data.pm_10_last_1_hour)
      davisPm10Last3h.set(data.pm_10_last_3_hours)
      davisPm10Last24h.set(data.pm_10_last_24_hours)
      davisPm10nowcast.set(data.pm_10_nowcast)

      davisPmAvailData1h.set(data.pct_pm_data_last_1_hour)
      davisPmAvailData3h.set(data.pct_pm_data_last_3_hours)
      davisPmAvailData24h.set(data.pct_pm_data_last_24_hours)
      davisPmAvailDataNowcast.set(data.pct_pm_data_nowcast)

    })
}

// Prometheus client
const register = new promClient.Registry()

const davisTemperature = new promClient.Gauge({
  name: 'davis_airlink_temperature_c',
  help: 'The tempearture in celcius from the provided Davis Airlink',
})
register.registerMetric(davisTemperature)

const davisHumidity = new promClient.Gauge({
  name: 'davis_airlink_humidity',
  help: 'The humidity from the provided Davis Airlink'
})
register.registerMetric(davisHumidity)

const davisDewPoint = new promClient.Gauge({
  name: 'davis_airlink_dew_point_c',
  help: 'The dew point in celcius from the provided Davis Airlink'
})
register.registerMetric(davisDewPoint)

const davisWetBulb = new promClient.Gauge({
  name: 'davis_airlink_web_bulb_c',
  help: 'The wet bulb in celcius from the provided Davis Airlink'
})
register.registerMetric(davisWetBulb)

const davisHeatIndex = new promClient.Gauge({
  name: 'davis_airlink_heat_index_c',
  help: 'The heat index in celcius from the provided Davis Airlink'
})
register.registerMetric(davisHeatIndex)

const davisPm1 = new promClient.Gauge({
  name: 'davis_airlink_pm_1',
  help: 'The pm1 reading from the provided Davis Airlink'
})
register.registerMetric(davisPm1)

const davisPm2p5 = new promClient.Gauge({
  name: 'davis_airlink_pm_2_point_5',
  help: 'The pm2.5 instant reading from the provided Davis Airlink'
})
register.registerMetric(davisPm2p5)

const davisPm2p5Last1h = new promClient.Gauge({
  name: 'davis_airlink_pm_2_point_5_last_1_hour',
  help: 'The pm2.5 last 1 hour reading from the provided Davis Airlink'
})
register.registerMetric(davisPm2p5Last1h)

const davisPm2p5Last3h = new promClient.Gauge({
  name: 'davis_airlink_pm_2_point_5_last_3_hours',
  help: 'The pm2.5 last 3 hours reading from the provided Davis Airlink'
})
register.registerMetric(davisPm2p5Last3h)

const davisPm2p5Last24h = new promClient.Gauge({
  name: 'davis_airlink_pm_2_point_5_last_24_hours',
  help: 'The pm2.5 last 24 hours reading from the provided Davis Airlink'
})
register.registerMetric(davisPm2p5Last24h)

const davisPm2p5nowcast = new promClient.Gauge({
  name: 'davis_airlink_pm_2_point_5_nowcasts',
  help: 'The pm2.5 nowcast reading from the provided Davis Airlink'
})
register.registerMetric(davisPm2p5nowcast)

const davisPm10 = new promClient.Gauge({
  name: 'davis_airlink_pm_10',
  help: 'The pm10 instant reading from the provided Davis Airlink'
})
register.registerMetric(davisPm10)

const davisPm10Last1h = new promClient.Gauge({
  name: 'davis_airlink_pm_10_last_1_hour',
  help: 'The pm10 last 1 hour reading from the provided Davis Airlink'
})
register.registerMetric(davisPm10Last1h)

const davisPm10Last3h = new promClient.Gauge({
  name: 'davis_airlink_pm_10_last_3_hours',
  help: 'The pm10 last 3 hours reading from the provided Davis Airlink'
})
register.registerMetric(davisPm10Last3h)

const davisPm10Last24h = new promClient.Gauge({
  name: 'davis_airlink_pm_10_last_24_hours',
  help: 'The pm10 last 24 hours reading from the provided Davis Airlink'
})
register.registerMetric(davisPm10Last24h)

const davisPm10nowcast = new promClient.Gauge({
  name: 'davis_airlink_pm_10_nowcasts',
  help: 'The pm10 nowcast reading from the provided Davis Airlink'
})
register.registerMetric(davisPm10nowcast)

const davisPmAvailData1h = new promClient.Gauge({
  name: 'davis_airlink_pm_available_data_last_hour',
  help: 'The amount of PM data available to calculate averages in the last hour (rounded down to the nearest percent)'
})
register.registerMetric(davisPmAvailData1h)

const davisPmAvailData3h = new promClient.Gauge({
  name: 'davis_airlink_pm_available_data_last_3_hours',
  help: 'The amount of PM data available to calculate averages in the last 3 hours (rounded down to the nearest percent)'
})
register.registerMetric(davisPmAvailData3h)

const davisPmAvailData24h = new promClient.Gauge({
  name: 'davis_airlink_pm_available_data_last_24_hours',
  help: 'The amount of PM data available to calculate averages in the last 24 hours (rounded down to the nearest percent)'
})
register.registerMetric(davisPmAvailData24h)

const davisPmAvailDataNowcast = new promClient.Gauge({
  name: 'davis_airlink_pm_available_data_nowcast',
  help: 'The amount of PM data available to calculate averages in the nowcast (rounded down to the nearest percent)'
})
register.registerMetric(davisPmAvailDataNowcast)

// Publish Prometheus Data via Express
const app = express();
const port = 9101;

app.listen(port, () => {
  console.log(`[${new Date().toISOString()}] Davis Airlink is running on port ${port}.`)
})

app.get('/metrics', async (request, response) => {
  await getCurrentConditions();
  response.set('Content-Type', register.contentType)
  response.status(200).send(await register.metrics())
})

//Helper Functions
function FtoC(F) {
  let C = ((F - 32) * 5 / 9).toFixed(2)
  return parseFloat(C)
}