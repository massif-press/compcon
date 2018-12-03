const fs = require('fs');
const path = require('path');

function readTemplate(filename) {
  return fs.readFileSync(path.join(__dirname, '..', `templates/${filename}.hbs`), "utf8");
}

function writeJson(jsonfile, obj) {
  fs.writeFile(`${__dirname}/../extraResources/data/${jsonfile}.json`, JSON.stringify(obj), 'utf8', function (err) {
    if (err) alert(`ERROR: Unable to save data to ${jsonfile}.json. Ensure you have write access to ${__dirname}`);
  });
}

function newID() {
  return Math.random().toString(36).substr(2, 9);
}


module.exports.writeJson = writeJson;
module.exports.readTemplate = readTemplate;
module.exports.newID = newID;