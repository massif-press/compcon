<template>
  <v-container>
    <v-divider />
    <cc-title class="mb-2">dice menu</cc-title>
    <cc-dice-menu />
    <cc-dice-menu preset="2d6+1" title="preset 1" autoroll />
    <cc-dice-menu preset="2d6+1d20+3d8-9" :preset-accuracy="-2" title="preset 2" />

    <v-divider />
    <cc-title class="mb-2">new talent ui</cc-title>

    <v-row density="compact">
      <cc-talent :talent="exampleTalents[0]" micro rank="2" selectable />
      <cc-talent :talent="exampleTalents[1]" micro rank="1" />
      <cc-talent :talent="exampleTalents[2]" micro />
    </v-row>
    <v-row density="compact">
      <cc-talent :talent="exampleTalents[0]" small rank="2" selectable />
      <cc-talent :talent="exampleTalents[1]" small rank="1" hide-locked />
      <cc-talent :talent="exampleTalents[2]" small />
    </v-row>
    <cc-talent :talent="exampleTalents[0]" terse rank="1" selectable />
    <cc-talent :talent="exampleTalents[1]" terse rank="3" />
    <cc-talent :talent="exampleTalents[2]" terse />
    <cc-talent :talent="exampleTalents[3]" rank="2" selectable />
    <cc-talent :talent="exampleTalents[0]" rank="1" />
    <cc-talent :talent="exampleTalents[1]" />
    <v-divider />
    <cc-title>typography</cc-title>
    <v-row class="mx-5">
      <v-col>
        <h1 class="heading">Heading 1</h1>
        <h2 class="heading">Heading 2</h2>
        <h3 class="heading">Heading 3</h3>
        <p class="heading table">Table Heading</p>
        <p class="heading mech">Mech Heading</p>
        <p class="heading sub">Subheading</p>
      </v-col>
      <v-col>
        <p class="body-text">Body Text</p>
        <ol class="body-text">
          <li>Ordered List Text</li>
        </ol>
        <br />
        <ul class="body-text">
          <li>Unordered List Text</li>
        </ul>
        <br />
        <p class="effect-text">Effect Text</p>
        <p class="fluff-text">Fluff Text</p>
        <p class="flavor-text">Flavor Text</p>
        <p class="stat-text">Stat Text</p>
        <p class="caption">Caption</p>
        <p class="text-overline">Overline</p>
      </v-col>
      <v-col>
        <p class="ra-quiet">RA Subtle Text</p>
        <p>
          <code>Code Text</code>
        </p>
        <p>
          <code class="horus">RA Text</code>
        </p>
      </v-col>
    </v-row>
    <v-divider class="ma-4" />
    <cc-title>glyphs</cc-title>
    <v-container grid-list-xs>
      <v-row density="compact">
        <v-col v-for="i in allIcons()" density="compact" style="min-width: 200px">
          <v-card outlined>
            <v-card-text class="text-center">
              <v-icon size="70px">cc:{{ i }}</v-icon>
              <br />
              <span class="caption">{{ i }}</span>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-divider class="ma-4" />
    <cc-title>titles</cc-title>
    <v-container>
      <cc-title small>cc-title element - small</cc-title>
      <br />
      <cc-title>cc-title element</cc-title>
      <br />
      <cc-title large>cc-title element - large</cc-title>
    </v-container>
    <v-divider class="ma-4" />
    <cc-title>buttons</cc-title>
    <v-container class="text-center">
      <v-row class="my-2">
        <v-col>
          <cc-btn small color="primary">small button</cc-btn>
        </v-col>
        <v-col>
          <cc-btn color="secondary">regular button</cc-btn>
        </v-col>
        <v-col>
          <cc-btn large color="info">large button</cc-btn>
        </v-col>
        <v-col>
          <cc-btn size="x-large" color="success">x-large button</cc-btn>
        </v-col>
      </v-row>
      <v-row class="my-2">
        <v-col>
          <v-btn block color="primary" tile>block button</v-btn>
        </v-col>
        <v-col>
          <v-btn block color="primary" tile variant="outlined">outlined block button</v-btn>
        </v-col>
        <v-col>
          <v-btn block color="primary" variant="text">text block button</v-btn>
        </v-col>
      </v-row>
    </v-container>
    <br />
    <cc-title>dialogs</cc-title>
    <v-container class="text-center">
      <v-row class="my-2">
        <v-col>
          <cc-dialog small @confirm="dialog1Confirm()">
            <template #button>small dialog</template>
            <template #title>Small Dialog Box (#title)</template>
            Dialog contents
          </cc-dialog>
        </v-col>
        <v-col>
          <cc-dialog @confirm="dialog1Confirm()">
            <template #button>dialog</template>
            <template #title>Dialog Box (#title)</template>
            Dialog contents
          </cc-dialog>
        </v-col>
        <v-col>
          <cc-dialog large @confirm="dialog1Confirm()">
            <template #button>large dialog</template>
            <template #title>Large Dialog Box (#title)</template>
            Dialog contents
          </cc-dialog>
        </v-col>
      </v-row>
      <v-row class="my-2">
        <v-col>
          <!-- <cc-popup small @confirm="dialog1Confirm()">
            <template #button>popup</template>
            <template #title>CC-Popup</template>
            popup content
          </cc-popup> -->
        </v-col>
      </v-row>
    </v-container>

    <!-- Global Notifier -->
    <br />
    <cc-title>Global Notifier</cc-title>
    <v-container>
      <v-row>
        <v-col cols="3">
          <v-text-field v-model="notificationText" class="pt-0 mt-0" />
        </v-col>
        <v-col cols="3">
          <v-select v-model="notificationType" class="pt-0 mt-0" :items="notificationTypes" />
        </v-col>
        <v-col cols="2">
          <v-btn :disabled="!notificationText" @click="doNotify">Notify</v-btn>
        </v-col>
      </v-row>
    </v-container>
    <router-link to="/">
      <v-btn variant="text" x-large>back</v-btn>
    </router-link>
  </v-container>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';

const icons = [
  'npc_template',
  'license',
  'npc_feature',
  'npc_class',
  'squad',
  'status_downandout',
  'condition_immobilized',
  'condition_slow',
  'manufacturer',
  'condition_stunned',
  'condition_shredded',
  'condition_lockon',
  'condition_jammed',
  'status_shutdown',
  'status_prone',
  'status_invisible',
  'status_hidden',
  'status_exposed',
  'status_engaged',
  'status_dangerzone',
  'activation_full',
  'activation_quick',
  'full_tech',
  'quick_tech',
  'quick_tech',
  'invade',
  'e_def',
  'downtime',
  'evasion',
  'npc_tier_custom',
  'npc_tier_3',
  'npc_tier_2',
  'npc_tier_1',
  'free_action',
  'reaction',
  'reserve_tactical',
  'reserve_mech',
  'reserve_resource',
  'system_point',
  'generic_item',
  'save',
  'sensor',
  'weapon_profile',
  'protocol',
  'drone',
  'skill',
  'talent',
  'grenade',
  'deployable',
  'content_manager',
  'campaign',
  'encounter',
  'compendium',
  'mine',
  'ship',
  'vehicle',
  'accuracy',
  'activate',
  'range',
  'burst',
  'cone',
  'line',
  'corebonus',
  'burn',
  'energy',
  'explosive',
  'heat',
  'kinetic',
  'variable',
  'deactivate',
  'condition_impaired',
  'difficulty',
  'frame',
  'melee',
  'overcharge',
  'pilot',
  'thrown',
  'reactor',
  'repair',
  'role_artillery',
  'role_controller',
  'role_striker',
  'role_support',
  'role_tank',
  'role_defender',
  'size_1',
  'size_2',
  'size_3',
  'size_4',
  'size_half',
  'structure',
  'system',
  'threat',
  'weaponmod',
  'trait',
  'weapon',
  'blast',
  'rank_1',
  'rank_2',
  'rank_3',
  'nested_hexagons',
  'orbit',
  'orbital',
  'large_beam',
  'ammo',
  'burning',
  'balance',
  'reticule',
  'spikes',
  'eclipse',
  'sword_array',
  'marker',
  'barrage',
];
export default {
  name: 'ui-test',
  data: () => ({
    notificationText: 'test',
    notificationTypes: ['success', 'warning', 'error', 'info'],
    notificationType: 'success',
    exampleTalents: [] as any[],
    chargeExample: null as unknown as any,
    deployExample: null as unknown as any,
    droneExample: null as unknown as any,
    multipleExample: null as unknown as any,
    aiExample: null as unknown as any,
    techExample: null as unknown as any,
    reactionExample: null as unknown as any,
    genericExample: null as unknown as any,
    profileExample: null as unknown as any,
    onAttackExample: null as unknown as any,
    onHitExample: null as unknown as any,
    onCritExample: null as unknown as any,
    asDroneExample: null as unknown as any,
  }),
  computed: {
    process() {
      return process;
    },
    env() {
      return import.meta.env;
    },
  },
  created() {
    const s = CompendiumStore();
    this.genericExample = s.MechSystems.find((x) => x.ID === 'ms_eva_module');
    this.chargeExample = s.MechSystems.find((x) => x.ID === 'ms_pattern_a_smoke_charges');
    this.deployExample = s.MechSystems.find(
      (x) => x.ID === 'ms_pattern_a_jericho_deployable_cover'
    );
    this.droneExample = s.MechSystems.find((x) => x.ID === 'ms_turret_drones');
    this.multipleExample = s.MechSystems.find((x) => x.ID === 'ms_reinforced_cabling');
    this.aiExample = s.MechSystems.find((x) => x.ID === 'ms_sekhmet_class_nhp');
    this.techExample = s.MechSystems.find((x) => x.ID === 'ms_neurospike');
    this.reactionExample = s.MechSystems.find((x) => x.ID === 'ms_singularity_motivator');
    this.profileExample = s.MechWeapons.find((x) => x.ID === 'mw_siege_cannon');
    this.onAttackExample = s.MechWeapons.find((x) => x.ID === 'mw_plasma_thrower');
    this.onHitExample = s.MechWeapons.find((x) => x.ID === 'mw_annihilator');
    this.onCritExample = s.MechWeapons.find((x) => x.ID === 'mw_chain_axe');
    this.asDroneExample = s.MechWeapons.find((x) => x.ID === 'mw_ghast_nexus');
    this.exampleTalents = s.Talents.sort(() => 0.5 - Math.random()).slice(0, 4);
  },
  methods: {
    allIcons() {
      return icons;
    },
    allColors(theme) {
      const t = this.$vuetify.theme.themes[theme];
      const output = [] as any[];
      Object.keys(t).forEach((e) => {
        output.push({ name: e, color: t[e] });
      });
      return output;
    },
    dialog1Confirm() {
      console.log('dialog 1 confirmed');
    },
    doNotify() {
      (this as any).$notify({
        title: 'test',
        text: this.notificationText,
        data: { type: this.notificationType, icon: 'cc:status_engaged' },
      });
    },
  },
};
</script>
