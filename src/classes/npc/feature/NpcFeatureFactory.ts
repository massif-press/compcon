import { ContentPack } from '@/class';
import { INpcFeatureData } from './NpcFeature';
import { NpcReaction, INpcReactionData } from './NpcItem/NpcReaction';
import { NpcSystem, INpcSystemData } from './NpcItem/NpcSystem';
import { NpcTech, INpcTechData } from './NpcItem/NpcTech';
import NpcTrait from './NpcItem/NpcTrait';
import { NpcWeapon, INpcWeaponData } from './NpcItem/NpcWeapon';

class NpcFeatureFactory {
  public static Build<T>(data: INpcFeatureData, pack?: ContentPack): T {
    const t = data.type.toLowerCase();
    if (t === 'reaction') return new NpcReaction(data as INpcReactionData, pack) as T;
    if (t === 'system') return new NpcSystem(data as INpcSystemData, pack) as T;
    if (t === 'tech') return new NpcTech(data as INpcTechData, pack) as T;
    if (t === 'weapon') return new NpcWeapon(data as INpcWeaponData, pack) as T;
    return new NpcTrait(data, pack) as T;
  }
}

export { NpcFeatureFactory };
