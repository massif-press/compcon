var fs = require('fs')
var contents = fs.readFileSync('./package.json')
var jsonContent = JSON.parse(contents)
console.log(jsonContent.version)
