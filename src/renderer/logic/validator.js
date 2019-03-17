function isValidJSON (text) {
  try {
    JSON.parse(text)
    return true
  } catch (e) {
    return false
  }
}

export default {
  pilot (data) {
    // this is largely a stub for future work (and potetentially version-checking)
    // pilots should "work" with basically a blank object to write to
    return data.id && data.name && data.callsign && data.level
  },
  clipboardPilot (data, callback) {
    var err = null
    var result = null
    if (!isValidJSON(data)) {
      err = 'Clipboard contents are not valid Pilot data'
    } else {
      var p = JSON.parse(data)
      console.log(p)
      if (this.pilot(p)) {
        result = p
      } else {
        err = 'Invalid pilot data'
      }
    }
    callback(err, result)
  },
  config (data) {
    // see above
    return data.frame_id
  },
  clipboardConfig (data, callback) {
    var err = null
    var result = null
    if (!isValidJSON(data)) {
      err = 'Clipboard contents are not valid Config data'
    } else {
      var p = JSON.parse(data)
      console.log(p)
      if (this.config(p)) {
        result = p
      } else {
        err = 'Invalid config data'
      }
    }
    callback(err, result)
  }
}
