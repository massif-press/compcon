export default {
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
  loadBrewData: (...args) => null,
  findBrewData: (...args) => null,
  setBrewActive: (...args) => null,
}
