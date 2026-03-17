import Startup from './Startup'
import { GetAll, storeRegistry, SetAll, ClearAllData, Initialize } from './Storage'
import logger from '@/user/logger'

type exportArchive = {
  data: [
    {
      collection: string
      items: any[]
    },
  ]
}

const exportAll = async function (): Promise<exportArchive> {
  let data = { data: [] as { collection: string; items: any[] }[] }
  const promises = [] as Promise<any>[]

  Object.keys(storeRegistry).forEach(store => {
    promises.push(GetAll(store).then(items => data.data.push({ collection: store, items })))
  })

  data = await Promise.all(promises).then(() => data)

  return data as exportArchive
}

const importAll = async function (data: any): Promise<void> {
  await ClearAllData()
  await Initialize()

  console.log(data)

  for (const collection in storeRegistry) {
    const collectionData = data.data.find((d: any) => d.collection.toLowerCase() === collection)
    if (collectionData) {
      await SetAll(collection, collectionData.items)
    }
  }

  logger.info('Import data loaded! Running startup...')
  await Startup(true)
}

export { exportAll, importAll }
