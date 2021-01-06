import PromisifyFileReader from 'promisify-file-reader'

const ensureDataDir = function(): void {
  return
}

const writeFile = async function(name: string, data: string): Promise<void> {
  localStorage.setItem(name, data)
}

const readFile = async function(name: string): Promise<string> {
  return localStorage.getItem(name)
}

const exists = async function(name: string): Promise<boolean> {
  return Boolean(localStorage.getItem(name))
}

const saveData = async function<T>(fileName: string, data: T): Promise<void> {
  return writeFile(fileName, JSON.stringify(data))
}

const loadData = async function<T>(fileName: string): Promise<T[]> {
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

const importData = async function<T>(file: File): Promise<T> {
  const text = await PromisifyFileReader.readAsText(file)
  return JSON.parse(text) as T
}

const USER_DATA_PATH = 'localStorage'

export {
  ensureDataDir,
  writeFile,
  readFile,
  saveData,
  loadData,
  importData,
  exists,
  USER_DATA_PATH,
}
