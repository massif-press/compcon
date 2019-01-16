import path from 'path'
import { remote } from 'electron'

export default ({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/data.db')
})
