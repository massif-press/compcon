const fs = require('fs');
const path = require('path');

function readTemplate(filename) {
  return fs.readFileSync(path.join(__dirname, '..', `templates/${filename}.hbs`), "utf8");
}

function writeJson(filename, obj) {
  var p = path.join(__dirname, '..', '..', `extraResources/data/${filename}.json`)
  fs.writeFile(p, JSON.stringify(obj, null, 2), 'utf8', function (err) {
      if (err) alert(`ERROR: Unable to save data to ${filename}.json. Ensure you have write access to ${p}`);
  });
}

function newID() {
  return Math.random().toString(36).substr(2, 9);
}


module.exports.writeJson = writeJson;
module.exports.readTemplate = readTemplate;
module.exports.newID = newID;