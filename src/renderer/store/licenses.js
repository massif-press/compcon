export default {
  collect (state) {
    var licenses = []
    state.Frames.filter(x => x.source.toLowerCase() !== 'gms').forEach((frame) => {
      licenses.push({
        source: frame.source.toLowerCase(),
        license: frame.name.toLowerCase(),
        unlocks: [
          [], // level 1
          [frame], // level 2
          [] // level 3
        ]
      })
    })
    state.MechWeapons
      .concat(state.WeaponMods, state.WeaponAmmo, state.MechSystems)
      .filter(x => x.source.toLowerCase() !== 'gms' && x.source.toLowerCase() !== '')
      .forEach((item) => {
        var idx = licenses.findIndex(x => x.license === item.license.toLowerCase())
        licenses[idx].unlocks[item.license_level - 1].push(item)
      })
    return licenses
  }
}
