import { INpcFeatureData } from './NpcFeature';
import { NpcReaction, INpcReactionData } from './NpcItem/NpcReaction';
import { NpcSystem, INpcSystemData } from './NpcItem/NpcSystem';
import { NpcTech, INpcTechData } from './NpcItem/NpcTech';
import NpcTrait from './NpcItem/NpcTrait';
import { NpcWeapon, INpcWeaponData } from './NpcItem/NpcWeapon';

class NpcFeatureFactory {
  public static Build<T>(data: INpcFeatureData, packName?: string): T {
    if (!data.type) console.log(data);
    const t = data.type.toLowerCase();
    if (t === 'reaction') return new NpcReaction(data as INpcReactionData, packName) as T;
    if (t === 'system') return new NpcSystem(data as INpcSystemData, packName) as T;
    if (t === 'tech') return new NpcTech(data as INpcTechData, packName) as T;
    if (t === 'weapon') return new NpcWeapon(data as INpcWeaponData, packName) as T;
    return new NpcTrait(data, packName) as T;
  }
}

export { NpcFeatureFactory };
