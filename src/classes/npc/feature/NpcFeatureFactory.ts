import { ContentPack } from '../../ContentPack'
import { INpcFeatureData, NpcFeature } from './NpcFeature'
import { NpcReaction, INpcReactionData } from './NpcItem/NpcReaction'
import { NpcSystem, INpcSystemData } from './NpcItem/NpcSystem'
import { NpcTech, INpcTechData } from './NpcItem/NpcTech'
import NpcTrait from './NpcItem/NpcTrait'
import { NpcWeapon, INpcWeaponData } from './NpcItem/NpcWeapon'
import { transformV2NpcFeatureData } from './v2compat'

class NpcFeatureFactory {
  public static Build<T>(data: INpcFeatureData, pack?: ContentPack): T {
    const raw = data as Record<string, any>

    // transforms v2 bonus data. safe to call on v3 data
    transformV2NpcFeatureData(raw)

    const t = data.type?.toLowerCase() || 'trait'
    let feature: NpcFeature
    if (t === 'reaction') feature = new NpcReaction(data as INpcReactionData, pack)
    else if (t === 'system') feature = new NpcSystem(data as INpcSystemData, pack)
    else if (t === 'tech') feature = new NpcTech(data as INpcTechData, pack)
    else if (t === 'weapon') feature = new NpcWeapon(data as INpcWeaponData, pack)
    else feature = new NpcTrait(data, pack)

    return feature as T
  }
}

export { NpcFeatureFactory }
