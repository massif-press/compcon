const { writeFileSync } = require('fs')
const { resolve, join } = require('path')


const basePath = join(__dirname, '..')


const mainPackage = require(resolve(basePath, 'package.json'))
const electronPackage = require(resolve(basePath, 'electron/package.json'))


const newPackage = Object.assign({}, electronPackage)

newPackage.name = mainPackage.name
newPackage.version = mainPackage.version
newPackage.author = mainPackage.author
newPackage.license = mainPackage.license


writeFileSync(resolve(basePath, 'electron/package.json'), JSON.stringify(newPackage, null, 2))