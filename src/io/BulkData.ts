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

  const skipCollections = ['settings', 'v2_backup']
  Object.keys(storeRegistry).forEach(store => {
    if (skipCollections.includes(store)) return
    promises.push(GetAll(store).then(items => data.data.push({ collection: store, items })))
  })

  data = await Promise.all(promises).then(() => data)

  return data as exportArchive
}

const importAll = async function (data: any, overwrite: boolean): Promise<void> {
  if (!data || !data.data || !Array.isArray(data.data)) {
    logger.error('Invalid data format for import!')
    return
  }

  if (overwrite) {
    logger.info('Overwriting all existing data with imported data')
    await ClearAllData()
    await Initialize()
  } else {
    logger.info('Merging imported data with existing data')
  }

  const skipCollections = ['settings', 'v2_backup']
  for (const collection in storeRegistry) {
    if (skipCollections.includes(collection)) continue
    const collectionData = data.data.find((d: any) => d.collection.toLowerCase() === collection)
    if (collectionData) {
      await SetAll(collection, collectionData.items)
    }
  }

  logger.info('Import data loaded! Running startup...')
  await Startup(true)
}

export { exportAll, importAll }
