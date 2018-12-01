const shells = require("../../resources/data/shells.json");
const weapons = require("../../resources/data/weapons.json");
const mods = require("../../resources/data/mods.json");
const systems = require("../../resources/data/systems.json");

const items = weapons.concat(mods).concat(systems);

function generateLicenseList() {
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

module.exports = generateLicenseList