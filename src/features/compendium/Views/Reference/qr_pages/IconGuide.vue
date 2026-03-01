<template>
  <v-container class="pb-12">
    <h1 class="heading">Icon Guide</h1>

    <div
      v-for="category in Object.keys(content)"
      :key="category"
      class="mt-2 mb-6"
    >
      <h2
        :id="String(category)"
        class="heading h3 text-accent"
      >
        {{ category }}
      </h2>
      <v-divider class="mt-1 mb-4" />
      <v-row dense>
        <v-col
          v-for="item in content[category]"
          :key="item.name"
          cols="12"
          sm="6"
          xl="4"
        >
          <div class="d-flex align-center">
            <v-avatar
              size="55"
              color="background"
            >
              <v-icon
                size="40"
                :icon="item.icon"
                :color="item.color || ''"
              />
            </v-avatar>
            <div class="ml-4">
              <div class="heading">{{ item.name }}</div>
              <div
                v-if="item.text"
                class="text-disabled text-caption"
              >
                {{ item.text }}
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
  </v-container>

  <v-footer
    v-if="!isModal"
    border
    app
    class="py-0 bg-primary"
  >
    <v-tabs
      density="compact"
      center-active
      grow
    >
      <v-tab
        v-for="item in Object.keys(content)"
        :key="'footer_' + item"
        @click="scrollTo(item)"
        v-text="item"
      />
    </v-tabs>
  </v-footer>
  <v-btn
    size="x-small"
    icon
    color="primary"
    variant="plain"
    style="position: fixed; bottom: 35px; right: 0; margin: 8px; z-index: 999"
    @click="scrollTo(content[0])"
  >
    <v-icon size="30">mdi-arrow-up</v-icon>
  </v-btn>
</template>

<script lang="ts">
  import { Status } from '@/classes/Status'
  import { CompendiumStore } from '@/stores'
  import scrollTo from '@/util/scrollTo'

  export default {
    name: 'IconGuide',
    props: {
      isModal: {
        type: Boolean,
      },
    },
    computed: {
      content(): any {
        return {
          'Damage Types': [
            {
              name: 'Kinetic Damage',
              icon: 'cc:kinetic',
              color: 'damage--kinetic',
            },
            {
              name: 'Energy Damage',
              icon: 'cc:energy',
              color: 'damage--energy',
            },
            {
              name: 'Explosive Damage',
              icon: 'cc:explosive',
              color: 'damage--explosive',
            },
            {
              name: 'Heat',
              icon: 'cc:heat',
              color: 'damage--heat',
            },
            {
              name: 'Burn',
              icon: 'cc:burn',
              color: 'damage--burn',
            },
            {
              name: 'Variable/Other',
              icon: 'cc:variable',
              color: 'damage--variable',
              text: 'User selected damage type or damage type not specified',
            },
          ],
          'Range / Attack Types': [
            {
              name: 'Melee Attack',
              icon: 'cc:melee',
            },
            {
              name: 'Ranged Attack',
              icon: 'cc:range',
            },
            {
              name: 'Thrown',
              icon: 'cc:thrown',
            },
            {
              name: 'Threat',
              icon: 'cc:threat',
              text: 'Weapon Threat Range',
            },
            {
              name: 'Burst',
              icon: 'cc:burst',
              text: '"Burst" Area of Effect',
            },
            {
              name: 'Blast',
              icon: 'cc:blast',
              text: '"Blast" Area of Effect',
            },
            {
              name: 'Line',
              icon: 'cc:line',
              text: '"Line" Area of Effect',
            },
            {
              name: 'Cone',
              icon: 'cc:cone',
              text: '"Cone" Area of Effect',
            },
          ],
          'Tracked Stats': [
            {
              name: 'HP',
              icon: 'mdi-heart',
              text: 'Hit Points',
              color: 'hp',
            },
            {
              name: 'Armor',
              icon: 'mdi-shield',
              color: 'armor',
            },
            {
              name: 'Structure',
              icon: 'cc:structure',
              color: 'structure',
            },
            {
              name: 'Overshield',
              icon: 'mdi-hexagon-multiple-outline',
              color: 'overshield',
            },
            {
              name: 'Heat',
              icon: 'cc:heat',
              color: 'damage--heat',
            },
            {
              name: 'Reactor Stress',
              icon: 'cc:reactor',
              color: 'stress',
            },
            {
              name: 'Repair Capacity',
              icon: 'cc:repair',
              color: 'system',
            },
            {
              name: 'Speed',
              icon: 'mdi-arrow-right-bold-hexagon-outline',
              color: 'action--move',
            },
          ],
          Stats: [
            {
              name: 'Evasion',
              icon: 'cc:evasion',
            },
            {
              name: 'Tech Attack',
              icon: 'cc:quick_tech',
            },
            {
              name: 'E-Defense',
              icon: 'cc:e_def',
            },
            {
              name: 'Sensor Range',
              icon: 'cc:sensor',
            },
            {
              name: 'Save Roll',
              icon: 'cc:save',
            },
            {
              name: 'System Point',
              icon: 'cc:system_point',
            },
          ],
          Actions: [
            {
              name: 'Protocol',
              icon: 'cc:protocol',
              color: 'action--protocol',
            },
            {
              name: 'Full Action',
              icon: 'mdi-hexagon-slice-6',
              color: 'action--full',
            },
            {
              name: 'Full Tech',
              icon: 'cc:full_tech',
              color: 'action--full',
            },
            {
              name: 'Quick Action',
              icon: 'mdi-hexagon-slice-3',
              color: 'action--quick',
            },
            {
              name: 'Quick Tech',
              icon: 'cc:quick_tech',
              color: 'action--quick',
            },
            {
              name: 'Overcharge',
              icon: 'cc:overcharge',
              color: 'action--overcharge',
            },
            {
              name: 'Move',
              icon: 'mdi-arrow-right-bold-hexagon-outline',
              color: 'action--move',
            },
            {
              name: 'Reaction',
              icon: 'cc:reaction',
              color: 'action--reaction',
            },
            {
              name: 'Free Action',
              icon: 'cc:free_action',
              color: 'action--free',
            },
          ],
          'Item Types': [
            {
              name: 'Weapon',
              icon: 'cc:weapon',
            },
            {
              name: 'System',
              icon: 'cc:system',
            },
            {
              name: 'Weapon Mod',
              icon: 'cc:weaponmod',
            },
            {
              name: 'Trait',
              icon: 'cc:trait',
            },
            {
              name: 'Core Bonus',
              icon: 'cc:corebonus',
            },
            {
              name: 'Talent',
              icon: 'cc:talent',
            },
            {
              name: 'Skill Trigger',
              icon: 'cc:skill',
            },
            {
              name: 'Reserve (Tactical)',
              icon: 'cc:reserve_tactical',
            },
            {
              name: 'Reserve (Mech)',
              icon: 'cc:reserve_mech',
            },
            {
              name: 'Reserve (Resource)',
              icon: 'cc:reserve_resource',
            },
            {
              name: 'Pilot',
              icon: 'cc:pilot',
            },
            {
              name: 'Mech',
              icon: 'cc:frame',
            },
            {
              name: 'Vehicle',
              icon: 'cc:vehicle',
            },
            {
              name: 'Ship',
              icon: 'cc:ship',
            },
            {
              name: 'Biological',
              icon: 'mdi-heart-multiple-outline',
            },
            {
              name: 'Squad',
              icon: 'cc:squad',
            },
            {
              name: 'Deployable',
              icon: 'cc:drone',
            },
            {
              name: 'Mine',
              icon: 'cc:mine',
            },
          ],
          'NPC Classes': [
            {
              name: 'Artillery',
              icon: 'cc:role_artillery',
            },
            {
              name: 'Biological',
              icon: 'mdi-heart-outline',
            },
            {
              name: 'Controller',
              icon: 'cc:role_controller',
            },
            {
              name: 'Defender',
              icon: 'cc:role_defender',
            },
            {
              name: 'Striker',
              icon: 'cc:role_striker',
            },
            {
              name: 'Support',
              icon: 'cc:role_support',
            },
          ],
          'Statuses and Conditions': CompendiumStore().Statuses.map((s: Status) => ({
            name: s.Name,
            icon: s.Icon,
            text: s.Terse,
          })),
          Other: [
            {
              name: 'Accuracy',
              icon: 'cc:accuracy',
            },
            {
              name: 'Difficulty',
              icon: 'cc:difficulty',
            },
            {
              name: 'Content Pack',
              icon: 'cc:compendium',
              text: 'Denotes content added by a Lancer Content Pack (.lcp) file',
            },
          ],
        }
      },
    },
    methods: {
      scrollTo(item: any): void {
        const el = document.getElementById(`${item}`)
        if (el) scrollTo(el, this.isModal)
      },
    },
  }
</script>
