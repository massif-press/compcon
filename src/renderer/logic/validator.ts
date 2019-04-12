function isValidJSON(text: string) {
  try {
    JSON.parse(text)
    return true
  } catch (e) {
    return false
  }
}

export default {
  pilot(data: Pilot) {
    // this is largely a stub for future work (and potetentially version-checking)
    // pilots should "work" with basically a blank object to write to
    return data.id && data.name && data.callsign
  },
  clipboardPilot(data: string, callback: (err: any, result: any) => void) {
    let err = null
    let result = null
    if (!isValidJSON(data)) {
      err = 'Clipboard contents are not valid Pilot data'
    } else {
      const p = JSON.parse(data)
      if (this.pilot(p)) {
        result = p
      } else {
        err = 'Invalid pilot data'
      }
    }
    callback(err, result)
  },
  config(data: MechConfig) {
    // see above
    return data.frame_id
  },
  clipboardConfig(data: string, callback: (err: any, result: any) => void) {
    let err = null
    let result = null
    if (!isValidJSON(data)) {
      err = 'Clipboard contents are not valid Config data'
    } else {
      const p = JSON.parse(data)
      if (this.config(p)) {
        result = p
      } else {
        err = 'Invalid config data'
      }
    }
    callback(err, result)
  },
}
