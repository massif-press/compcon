const shells = require("../../extraResources/data/shells.json");
const weapons = require("../../extraResources/data/weapons.json");
const mods = require("../../extraResources/data/mods.json");
const systems = require("../../extraResources/data/systems.json");

const items = weapons.concat(mods).concat(systems);

function getLicenseList() {
  var ll = [];
  for (let i = 0; i < shells.length; i++) {
    const s = shells[i];
    if (s.id === "everest") {
      ll.push({
        source: "GMS",
        name: "GMS",
        unlocks: [["EVEREST Shell"],[],[]]
      })
    } else {
      ll.push({
        source: s.source.toUpperCase(),
        name: s.name.toUpperCase(),
        unlocks: [[],[`${s.name.toUpperCase()} Shell`],[]]
      })    
    }
  }

  for (let j = 0; j < items.length; j++) {
    const i = items[j];
    if (i.source === "Special" || i.license === "") continue;
    else if (i.source === "GMS") {
      var idx = ll.findIndex(x => x.source === "GMS")
      if (idx === -1) {
        console.error("GMS license item not found!")
        continue;
      } else {
        ll[idx].unlocks[0].push(i.name);
      }
    } else {
      var idx = ll.findIndex(x => x.name === i.license.toUpperCase())
      if (idx === -1) {
        console.error(i.source + " license item not found!", i)
        continue;
      } else {       
        ll[idx].unlocks[i.license_level-1].push(i.name);
      }    
    }
  }
  return ll;
}

function getLicenseRequirements(shell, items, pilot) {
  var licenses = [{
    "source": shell.source,
    "name": shell.id === "everest" ? "" : shell.name,
    "level": shell.id === "everest" ? "" : 2,
    "items": `${shell.source} ${shell.name} Shell`
  }]

  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    if (item.source == "Special" || (item.license === "" && item.source !== "GMS")) continue;
    var lIndex = licenses.findIndex(l => l.name === item.license);
    if (lIndex > -1) {
      if (licenses[lIndex].level < item.license_level) { //if our new item exceeds our current license level
        var upperIdx = licenses.findIndex(l => l.level === item.license_level);
        if (upperIdx < 0) { //if we don't already have this license recorded, add it
          licenses.push({
            "source": item.source,
            "name": item.license,
            "level": item.license_level,
            "items": item.name
          })
        } else {
          licenses[upperIdx].items += ", " + item.name;  //otherwise, mark the system on the higher level license
        }
      }
      licenses[lIndex].items += ", " + item.name;
    } else {
      licenses.push({
        "source": item.source,
        "name": item.license,
        "level": item.license_level,
        "items": item.name
      })
    }
  }

  for (var i = 0; i < licenses.length; i++) {
    var l = licenses[i];
    if (l.source === "GMS") {
      licenses[i].locked = false;
    } else {
      var lockIndex = pilot.licenses.findIndex(pl => pl.name === l.name);
      if (lockIndex == -1) licenses[i].locked = true;
      else if (pilot.licenses[lockIndex].level < l.level) licenses[i].locked = true;
      else licenses[i].locked = false;
    }
  }

  //move gms to the front of the license block
  var gmsIndex = licenses.findIndex(l => l.source === "GMS");
  if (gmsIndex > 0) move(licenses, gmsIndex, 0);

  //make sure the shell is the second item
  var shellIndex = licenses.findIndex(l => l.source === shell.source);
  if (shellIndex > 1) move(licenses, shellIndex, 1);

  return licenses;
}

function move(arr, old_index, new_index) {
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
};

module.exports.getLicenseList = getLicenseList
module.exports.getLicenseRequirements = getLicenseRequirements