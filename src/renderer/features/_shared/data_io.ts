const randomNameFiles: { [key: string]: string } = {}
;['mechnames.txt', 'callsigns.txt', 'firstnames.txt', 'lastnames.txt'].forEach(filename => {
  randomNameFiles[filename] = require('@/../../static/generators/' + filename)
})

export default {
  getFrameImageURI(frameID: string): string {
    return `/static/img/frames/${frameID}.png`
  },
  loadUserData(_, path) {
    const data = localStorage.getItem(path)
    if (data) return JSON.parse(data)
    else return []
  },
  saveUserData(_, path, data, callback) {
    localStorage.setItem(path, JSON.stringify(data))
    callback()
  },
  backup(_) {
    localStorage.setItem('pilots.old', localStorage.getItem('pilots.json'))
  },
  randomName(filename) {
    const choices = randomNameFiles[filename].split('\n')
    return choices[Math.floor(Math.random() * choices.length)].replace(/[\n\r]/g, '')
  },
  loadBrewData: (...args) => null,
  findBrewData: (...args) => null,
  setBrewActive: (...args) => null,
  importFile: (...args) => null,
  deleteImage: (...args) => null,
  getImages: (...args) => [],
}
