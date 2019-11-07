import fs from 'fs'

function saveFile(dataPath: string, data: any): void {
  fs.writeFileSync(dataPath, data, 'utf8')
}

export { saveFile }
