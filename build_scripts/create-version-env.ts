const fs = require('fs')
const contents = fs.readFileSync('./package.json')
const jsonContent = JSON.parse(contents)
console.log(jsonContent.version)
