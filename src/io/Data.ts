import PromisifyFileReader from 'promisify-file-reader'
import localForage from 'localforage'

const writeFile = async function (name: string, data: string): Promise<void> {
  localForage.setItem(name, data)
}

const readFile = async function (name: string): Promise<string> {
  return localForage.getItem(name)
}

const exists = async function (name: string): Promise<boolean> {
  return Boolean(localForage.getItem(name))
}

const saveData = async function <T>(fileName: string, data: T): Promise<void> {
  return writeFile(fileName, JSON.stringify(data))
}

const saveDelta = async function <T>(filename: string, data: T[]): Promise<void> {
  if (!data.length) return
  const ls = await localForage.getItem(filename)
  const mem = ls ? JSON.parse(ls as string) : []
  data.forEach((e: any) => {
    const idx = mem.findIndex((x: any) => x.id === e.id)
    if (idx > -1) mem[idx] = e
    else mem.push(e)
  })
  writeFile(filename, JSON.stringify(mem))
}

const deleteDataById = async function (filename: string, ids: string[]): Promise<void> {
  if (!ids.length) return
  const item = await localForage.getItem(filename)
  const mem = JSON.parse(item as string)
  ids.forEach((e: any) => {
    const idx = mem.findIndex((x: any) => x.id === e)
    if (idx > -1) mem.splice(idx, 1)
  })
  writeFile(filename, JSON.stringify(mem))
}

const loadData = async function <T>(fileName: string): Promise<T[]> {
  const fileExists = await exists(fileName)
  if (fileExists) {
    try {
      const dataText = await readFile(fileName)
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

const USER_DATA_PATH = 'localForage'

export {
  writeFile,
  readFile,
  saveData,
  saveDelta,
  deleteDataById,
  loadData,
  importData,
  exists,
  USER_DATA_PATH,
}
