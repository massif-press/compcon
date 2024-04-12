import { h } from 'vue';
import type { IconSet, IconProps } from 'vuetify';

import accuracy from './svg/accuracy.vue';
import achievement_1 from './svg/achievement_1.vue';
import achievement_2 from './svg/achievement_2.vue';
import achievement_3 from './svg/achievement_3.vue';
import achievement_4 from './svg/monist.vue';
import activate from './svg/activate.vue';
import activation_full from './svg/activation_full.vue';
import activation_quick from './svg/activation_quick.vue';
import ammo from './svg/ammo.vue';
import balance from './svg/balance.vue';
import barrage from './svg/barrage.vue';
import blast from './svg/blast.vue';
import burn from './svg/burn.vue';
import burning from './svg/burning.vue';
import burst from './svg/burst.vue';
import campaign from './svg/campaign.vue';
import compendium from './svg/compendium.vue';
import status_downandout from './svg/status_downandout.vue';
import condition_jammed from './svg/condition_jammed.vue';
import condition_lockon from './svg/condition_lockon.vue';
import condition_shredded from './svg/condition_shredded.vue';
import condition_slow from './svg/condition_slow.vue';
import condition_stunned from './svg/condition_stunned.vue';
import condition_immobilized from './svg/condition_immobilized.vue';
import condition_impaired from './svg/difficulty.vue';
import cone from './svg/cone.vue';
import content_manager from './svg/content_manager.vue';
import corebonus from './svg/corebonus.vue';
import cosmopolitan from './svg/cosmopolitan.vue';
import deactivate from './svg/deactivate.vue';
import deployable from './svg/deployable.vue';
import diasporan from './svg/diasporan.vue';
import difficulty from './svg/difficulty.vue';
import downtime from './svg/downtime.vue';
import drone from './svg/drone.vue';
import e_def from './svg/e_def.vue';
import eclipse from './svg/eclipse.vue';
import encounter from './svg/encounter.vue';
import energy from './svg/energy.vue';
import evasion from './svg/evasion.vue';
import explosive from './svg/explosive.vue';
import frame from './svg/frame.vue';
import mech from './svg/frame.vue';
import free_action from './svg/free_action.vue';
import free from './svg/free_action.vue';
import generic_item from './svg/generic_item.vue';
import grenade from './svg/grenade.vue';
import heat from './svg/heat.vue';
import honor from './svg/honor.vue';
import kinetic from './svg/kinetic.vue';
import lancer from './svg/lancer.vue';
import large_beam from './svg/large-beam.vue';
import license from './svg/license.vue';
import line from './svg/line.vue';
import manufacturer from './svg/manufacturer.vue';
import marker from './svg/marker.vue';
import melee from './svg/melee.vue';
import mine from './svg/mine.vue';
import monist from './svg/monist.vue';
import nested_hexagons from './svg/nested-hexagons.vue';
import nhp from './svg/nhp.vue';
import npc_class from './svg/npc_class.vue';
import npc_feature from './svg/npc_feature.vue';
import npc_template from './svg/npc_template.vue';
import npc_tier_1 from './svg/npc_tier_1.vue';
import npc_tier_2 from './svg/npc_tier_2.vue';
import npc_tier_3 from './svg/npc_tier_3.vue';
import npc_tier_custom from './svg/npc_tier_custom.vue';
import orbit from './svg/orbit.vue';
import orbital from './svg/orbital.vue';
import overcharge from './svg/overcharge.vue';
import pilot from './svg/pilot.vue';
import protocol from './svg/protocol.vue';
import range from './svg/range.vue';
import rank_1 from './svg/rank-1.vue';
import rank_2 from './svg/rank-2.vue';
import rank_3 from './svg/rank-3.vue';
import reaction from './svg/reaction.vue';
import reactor from './svg/reactor.vue';
import repair from './svg/repair.vue';
import reserve_mech from './svg/reserve_mech.vue';
import reserve_tactical from './svg/reserve_tactical.vue';
import reserve_resource from './svg/orbital.vue';
import reticle from './svg/reticle.vue';
import role_artillery from './svg/role-artillery.vue';
import role_controller from './svg/role-controller.vue';
import role_defender from './svg/role-defender.vue';
import role_striker from './svg/role-striker.vue';
import role_support from './svg/role-support.vue';
import role_tank from './svg/role-tank.vue';
import save from './svg/save.vue';
import sensor from './svg/sensor.vue';
import ship from './svg/ship.vue';
import size_1 from './svg/size-1.vue';
import size_2 from './svg/size-2.vue';
import size_3 from './svg/size-3.vue';
import size_4 from './svg/size-4.vue';
import size_half from './svg/size-half.vue';
import skill from './svg/skill.vue';
import spikes from './svg/spikes.vue';
import squad from './svg/squad.vue';
import status_dangerzone from './svg/status_dangerzone.vue';
import status_engaged from './svg/status_engaged.vue';
import status_exposed from './svg/status_exposed.vue';
import status_hidden from './svg/status_hidden.vue';
import status_invisible from './svg/status_invisible.vue';
import status_intangible from './svg/status_intangible.vue';
import status_prone from './svg/status_prone.vue';
import status_shutdown from './svg/status_shutdown.vue';
import structure from './svg/structure.vue';
import sword_array from './svg/sword-array.vue';
import system_point from './svg/system_point.vue';
import system from './svg/system.vue';
import talent from './svg/talent.vue';
import full_tech from './svg/tech_full.vue';
import invade from './svg/tech_full.vue';
import quick_tech from './svg/tech_quick.vue';
import thanks from './svg/thanks.vue';
import threat from './svg/threat.vue';
import thrown from './svg/thrown.vue';
import trait from './svg/trait.vue';
import variable from './svg/variable.vue';
import vehicle from './svg/vehicle.vue';
import weapon_profile from './svg/weapon_profile.vue';
import weapon from './svg/weapon.vue';
import weaponmod from './svg/weaponmod.vue';
import gms from './svg/gms.vue';
import ha from './svg/ha.vue';
import ipsn from './svg/ipsn.vue';
import ssc from './svg/ssc.vue';
import horus from './svg/horus.vue';

const svgs: any = {
  accuracy,
  achievement_1,
  achievement_2,
  achievement_3,
  achievement_4,
  activate,
  activation_full,
  activation_quick,
  ammo,
  balance,
  barrage,
  blast,
  burn,
  burning,
  burst,
  campaign,
  compendium,
  status_downandout,
  condition_jammed,
  condition_lockon,
  condition_shredded,
  condition_slow,
  condition_stunned,
  condition_immobilized,
  cone,
  content_manager,
  corebonus,
  deactivate,
  deployable,
  difficulty,
  downtime,
  drone,
  e_def,
  eclipse,
  encounter,
  energy,
  evasion,
  explosive,
  frame,
  mech,
  free_action,
  free,
  generic_item,
  grenade,
  heat,
  kinetic,
  large_beam,
  license,
  line,
  manufacturer,
  marker,
  melee,
  mine,
  nested_hexagons,
  npc_class,
  npc_feature,
  npc_template,
  npc_tier_1,
  npc_tier_2,
  npc_tier_3,
  npc_tier_custom,
  orbit,
  orbital,
  overcharge,
  pilot,
  protocol,
  range,
  rank_1,
  rank_2,
  rank_3,
  reaction,
  reactor,
  repair,
  reserve_mech,
  reserve_tactical,
  reserve_resource,
  reticle,
  role_artillery,
  role_controller,
  role_defender,
  role_striker,
  role_support,
  role_tank,
  save,
  sensor,
  ship,
  size_1,
  size_2,
  size_3,
  size_4,
  size_half,
  skill,
  spikes,
  squad,
  status_dangerzone,
  status_engaged,
  status_exposed,
  status_hidden,
  status_invisible,
  status_intangible,
  status_prone,
  status_shutdown,
  structure,
  sword_array,
  system_point,
  system,
  talent,
  full_tech,
  invade,
  quick_tech,
  threat,
  thrown,
  trait,
  variable,
  vehicle,
  weapon_profile,
  weapon,
  weaponmod,
  gms,
  ha,
  ipsn,
  ssc,
  horus,
  condition_impaired,
  cosmopolitan,
  diasporan,
  honor,
  lancer,
  monist,
  nhp,
  thanks,
};

const ccIcons: IconSet = {
  component: (props: IconProps) =>
    h(props.tag, [
      h(svgs[props.icon as string], {
        class: 'v-icon__svg',
      }),
    ]),
};

export { ccIcons };
