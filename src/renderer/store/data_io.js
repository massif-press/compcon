import fs from 'fs'
import path from 'path'

export default {
  loadData (filename) {
    var p = path.join(__static, '..', 'src', 'renderer', 'assets', 'data', filename + '.json')
    if (fs.existsSync(p)) {
      return JSON.parse(fs.readFileSync(p))
    } else {
      console.warn(`file ${filename} does not exist at ${p}.`)
      return []
    }
  }
}
