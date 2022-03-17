const fs = require('fs')

// Get the admin data from the datasource file
const adminData = JSON.parse(fs.readFileSync('./datasource.json', 'utf-8'))

module.exports = {adminData}