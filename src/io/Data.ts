import PromisifyFileReader from 'promisify-file-reader'
import localForage from 'localforage'

const canPersistData = async function (): Promise<boolean> {
  const capable = await navigator.storage.persist()
  const q = await navigator.permissions.query({ name: 'persistent-storage' })
  const allowed = q.state === 'granted'

  return capable && allowed
}

const writeFile = async function (name: string, data: any): Promise<void> {
  localForage.setItem(name, data)
}

const readFile = async function (name: string): Promise<string> {
  return localForage.getItem(name)
}

const exists = async function (name: string): Promise<boolean> {
  return Boolean(localForage.getItem(name))
}

const saveData = async function <T>(collection: string, data: T): Promise<void> {
  const p = await canPersistData()
  return writeFile(collection, p ? data : JSON.stringify(data))
}

const saveDelta = async function <T>(collection: string, data: T[]): Promise<void> {
  if (!data.length) return
  const ls = await localForage.getItem(collection)
  const mem = ls ? JSON.parse(ls as string) : []
  data.forEach((e: any) => {
    const idx = mem.findIndex((x: any) => x.id === e.id)
    if (idx > -1) mem[idx] = e
    else mem.push(e)
  })
  writeFile(collection, JSON.stringify(mem))
}

// const saveDeltaPersistent = async function <T>(collection: string, data: T[]): Promise<void> {

// }

// const saveDeltaLocal = async function <T>(collection: string, data: T[]): Promise<void> {
// }

const deleteDataById = async function (collection: string, ids: string[]): Promise<void> {
  if (!ids.length) return
  const item = await localForage.getItem(collection)
  const mem = JSON.parse(item as string)
  ids.forEach((e: any) => {
    const idx = mem.findIndex((x: any) => x.id === e)
    if (idx > -1) mem.splice(idx, 1)
  })
  writeFile(collection, JSON.stringify(mem))
}

const loadData = async function <T>(collection: string): Promise<T[]> {
  const fileExists = await exists(collection)
  if (fileExists) {
    try {
      const dataText = await readFile(collection)
      return (JSON.parse(dataText) || []) as T[]
    } catch (err) {
      console.error(err)
    }
  } else {
    return []
  }
}

const importData = async function <T>(file: File): Promise<T> {
  const text = await PromisifyFileReader.readAsText(file)
  return JSON.parse(text) as T
}

export { writeFile, readFile, saveData, saveDelta, deleteDataById, loadData, importData, exists }
