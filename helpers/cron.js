const CronJob = require('cron').CronJob;
const auth = require('./auth');
const config = require('../config');

module.exports = new CronJob('00 30 11 * * 1-5', function() {
    
}, null, true, 'Europe/Rome');
