const { resolve } = require('path')
const { writeFile, mkdirSync, existsSync } = require('fs')
const { promisify } = require('util')
const TJS = require('typescript-json-schema');

const settings = {
  required: true
}

console.log('Creating TS program...')

const program = TJS.programFromConfig(resolve(__dirname, '../tsconfig.json'))

console.log('Done.')

const schemasWanted = [
  'manifest',
  'manufacturers',
  'core_bonus',
  'frames',
  'weapons',
  'systems',
  'mods',
  'pilot_gear',
  'talents',
  'tags',
  'npc_classes',
  'npc_features',
  'npc_templates',
]

console.log('Generating schemas...')

const schemaMap = schemasWanted.reduce(function (map, schemaName) {
  map[schemaName] = TJS.generateSchema(program, `SCHEMA__${schemaName}`, settings);
  return map;
}, {});

console.log('Done.')
console.log('Emitting schemas...')

const outputDirPath = resolve(__dirname, '../schema_out')
if (!existsSync(outputDirPath)) {
  mkdirSync(outputDirPath)
}

const writeFilePromise = promisify(writeFile)

const promises = Object.entries(schemaMap).map(([name, schema]) => {
  return writeFilePromise(
    resolve(outputDirPath, `${name}.schema.json`),
    JSON.stringify(schema, null, 2)
  )
})

Promise.all(promises).then(
  () => console.log('Done.')
)