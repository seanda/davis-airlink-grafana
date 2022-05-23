# README #

Runs a prometheus client to collect weather system data from a local Davis Airlink Air Qualtiy Monitor.

### What is this repository for? ###

With the help of a pm2 process running on a Linux machine (Raspberry Pi for example) you can turn your Davis Airlink data into a prometheus client and collect and display weather data on a Grafana dashboard

### How do I get set up? ###

* use `npm install` to install all the dependancies
* run using `node index.js`

If you wish to schedule using the PM2 process manager run with

`pm2 start pm2-process.json` and it'll run in the background in the PM2 Process monitor.
