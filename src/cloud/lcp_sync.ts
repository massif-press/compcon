import { store, CompendiumStore } from '../store'
import { Auth, Storage } from 'aws-amplify'
import { getModule } from 'vuex-module-decorators'
import { ContentPack } from '@/class'
import { IContentPack } from '@/classes/ContentPack'
const semverCompare = require('semver/functions/compare')
const semverCoerce = require('semver/functions/coerce')

const currentCognitoIdentity = async (): Promise<any> =>
  Auth.currentUserCredentials()
    .then(res => res.identityId)
    .catch(() => '')

const GetLCPCloudData = async (): Promise<ContentPack[]> => {
  const url = await Storage.get('extra_content.json', { level: 'private' })

  if (typeof url === 'object') throw new Error('Unsupported S3 return type')

  const data = await fetch(url).then(res => {
    return res.ok ? res.text() : null
  })

  const packs = data ? JSON.parse(data).map(d => new ContentPack(d)) : []

  return packs
}

const GetLCPLocalData = async (): Promise<ContentPack[]> => {
  return await getModule(CompendiumStore, store).ContentPacks
}

const ListCloudItems = async (): Promise<any> => {
  const id = await currentCognitoIdentity()
  return Storage.list('', { level: 'protected' })
    .then(result => {
      return result
    })
    .catch(err => console.error(err))
}

type LCPItem = {
  localData: ContentPack
  cloudData: ContentPack
  data?: ContentPack
  id: string
  name: string
  localVersion: string
  cloudVersion: string
  latest: string
}

function determineLatest(item: LCPItem): string {
  if (!item.localVersion) return 'cloud'
  if (!item.cloudVersion) return 'local'

  const versionCompare = semverCompare(
    semverCoerce(item.cloudVersion.toString()),
    semverCoerce(item.localVersion.toString())
  )
  if (versionCompare === 1) {
    return 'cloud'
  } else if (versionCompare === -1) {
    return 'local'
  } else {
    return 'synced'
  }
}

const GetItemsList = async (): Promise<LCPItem[]> => {
  const cloud = await GetLCPCloudData()
  const local = await GetLCPLocalData()

  const output = [] as LCPItem[]

  local.forEach((item: ContentPack) =>
    output.push({
      localData: item,
      cloudData: null,
      localVersion: item.Version,
      cloudVersion: '',
      id: item.ID,
      name: item.Name,
      latest: 'local',
    })
  )

  cloud.forEach((item: ContentPack) => {
    const idx = output.findIndex(
      x => x.localData && (x.localData.ID === item.ID || x.localData.Name === item.Name)
    )
    if (idx > -1) {
      output[idx].cloudData = item
      output[idx].cloudVersion = item.Version
    } else {
      output.push({
        localData: null,
        cloudData: item,
        localVersion: '',
        cloudVersion: item.Version,
        id: item.ID,
        name: item.Name,
        latest: 'local',
      })
    }
  })

  output.forEach(x => {
    x.latest = determineLatest(x)
    x.data = x.latest === 'cloud' ? x.cloudData : x.localData
  })

  return output
}

const SyncLCPs = async (): Promise<any> => {
  const allLcps = await GetItemsList()
  const latest = []
  allLcps.forEach(item => {
    if (item.latest === 'cloud') latest.push(item.cloudData.Serialize())
    else latest.push(item.localData.Serialize())
  })
  await setLocalLCPs(latest)
  await updateCloudLCPs(latest)
}

const setLocalLCPs = async (lcps: IContentPack[]): Promise<any> => {
  localStorage.setItem(`extra_content.json`, JSON.stringify(lcps))
  const cs = getModule(CompendiumStore, store)
  cs.refreshExtraContent()
}

// updates local and cloud to latest version
const updateCloudLCPs = async (lcps: IContentPack[]): Promise<any> => {
  Storage.put(`extra_content.json`, JSON.stringify(lcps), {
    level: 'private',
    contentType: 'text/plain',
  }).catch(err => console.error(err))
}

const DeleteLCP = async (lcp: LCPItem): Promise<any> => {
  let lcps = [...(await GetItemsList())]
  const idx = lcps.findIndex(x => x.id === lcp.id)
  if (idx > -1) lcps.splice(idx, 1)

  await setLocalLCPs(lcps.map(x => x.localData.Serialize()))
  await updateCloudLCPs(lcps.map(x => x.cloudData.Serialize()))
}

const DeleteAllLocal = async (): Promise<any> => {
  await setLocalLCPs([])
}

const DeleteAllCloud = async (): Promise<any> => {
  await updateCloudLCPs([])
}

export {
  GetItemsList,
  ListCloudItems,
  GetLCPCloudData,
  GetLCPLocalData,
  SyncLCPs,
  DeleteLCP,
  DeleteAllCloud,
  DeleteAllLocal,
}
