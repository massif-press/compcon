<template>
  <cc-modal title="Add Pilot from Roster"
    icon="mdi-account-plus">
    <template #activator="{ open }">
      <cc-button size="small"
        block
        color="primary"
        tooltip="Add a pilot from your local Pilot Roster"
        prepend-icon="mdi-account-plus"
        @click="open">
        add from roster
      </cc-button>
    </template>
    <cc-sidebar-layout ref="sidebar">
      <template #sidebar>
        <v-text-field v-model="search"
          density="compact"
          hide-details
          clearable
          flat
          tile
          placeholder="Search"
          class="my-1"
          prepend-inner-icon="mdi-magnify" />

        <v-list class="mb-n3"
          style="height: 100%; min-height: calc(100vh - 86px); overflow-y: scroll">
          <v-list-item v-for="group in Object.keys(pilotsByGroup)"
            :key="group">
            <v-list-item-subtitle>
              <v-icon icon="mdi-folder"
                start
                size="small"
                class="mt-n1" />
              {{ group || 'No Group' }}
            </v-list-item-subtitle>
            <v-divider />
            <v-list-item v-for="p in pilotsByGroup[group]"
              :key="p.ID"
              @click="selected = p">
              <div class="heading h3">{{ p.Callsign }}</div>
              <v-divider class="mb-1 mr-4" />
              <div class="text-cc-overline text-disabled">{{ p.Name }}</div>
              <div class="text-cc-overline text-disabled">LL {{ p.Level }}</div>
              <template #prepend>
                <v-avatar size="64"
                  flat
                  tile
                  class="clipped">
                  <cc-avatar v-if="p.PortraitController.Avatar"
                    :avatar="p.PortraitController.Avatar"
                    size="64" />
                  <cc-img v-else-if="p.Portrait"
                    :src="p.Portrait"
                    height="64"
                    width="64" />
                </v-avatar>
              </template>
              <template #append>
                <v-tooltip>
                  <template #activator="{ props }">
                    <cc-button v-bind="props"
                      variant="outlined"
                      :icon="!isInEncounter(p) ? 'mdi-plus' : 'mdi-check-bold'"
                      size="small"
                      :color="!isInEncounter(p) ? 'secondary' : 'success'"
                      @click.stop="addPilot(p)"></cc-button>
                  </template>
                  <span>Add to Encounter</span>
                </v-tooltip>
              </template>
            </v-list-item>
          </v-list-item>
        </v-list>
      </template>

      <div v-if="selected"
        class="pl-12 pr-3 mb-12 pb-2"
        style="position: relative">
        <v-row dense
          class="mb-2">
          <v-col cols="auto"
            style="width: 10vw"
            class="mt-2">
            <cc-img v-if="selected.Portrait"
              :src="selected.Portrait"
              height="100%"
              cover />
          </v-col>
          <v-col>
            <v-row>
              <v-col>
                <div class="heading h2">
                  {{ selected.Callsign }}
                  <span class="heading h3">
                    <cc-slashes class="px-1" />
                    {{ selected.Name }}
                  </span>
                </div>
                <div class="text-cc-overline">
                  <span class="text-disabled">Played By&nbsp;</span>
                  <span class="text-accent">{{ selected.PlayerName || 'Unknown' }}</span>
                </div>
              </v-col>
              <v-col cols="auto"
                class="text-center">
                <div class="text-cc-overline text-disabled">License Level</div>
                <div class="heading h1"
                  style="line-height: 44px">{{ selected.Level }}</div>
              </v-col>
            </v-row>

            <div class="text-cc-overline text-disabled">
              <cc-slashes />
              Pilot Combat Stats
            </div>
            <v-row dense
              class="mt-1 px-3 py-1 bg-background text-center"
              justify="space-around">
              <v-col cols="auto">
                <div class="pb-1 text-cc-overline">GRIT</div>
                <v-icon class="ml-1 mt-n1"
                  icon="mdi-star-four-points-outline" />
                {{ selected.Grit }}
              </v-col>

              <v-col cols="auto">
                <div class="pb-1 text-cc-overline">ARMOR</div>
                <v-icon class="ml-1 mt-n1"
                  icon="mdi-shield-outline" />
                {{ selected.Armor }}
              </v-col>

              <v-col cols="auto">
                <div class="pb-1 text-cc-overline">HIT POINTS</div>
                <v-icon class="ml-1 mt-n1"
                  icon="mdi-heart" />
                {{ selected.MaxHP }}
              </v-col>

              <v-col cols="auto">
                <div class="pb-1 text-cc-overline">E-DEFENSE</div>
                <v-icon class="ml-1 mt-n1"
                  icon="cc:e_def" />
                {{ selected.EDefense }}
              </v-col>

              <v-col cols="auto">
                <div class="pb-1 text-cc-overline">EVASION</div>
                <v-icon class="ml-1 mt-n1"
                  icon="cc:evasion" />
                {{ selected.Evasion }}
              </v-col>

              <v-col cols="auto">
                <div class="pb-1 text-cc-overline">SPEED</div>
                <v-icon class="ml-1 mt-n1"
                  icon="mdi-arrow-right-bold-hexagon-outline" />
                {{ selected.Speed }}
              </v-col>
            </v-row>
            <v-row dense
              class="px-3 pb-1 pt-3 bg-background text-center"
              justify="space-around">
              <v-col cols="auto">
                <div class="pb-1 text-cc-overline">HULL</div>
                <v-icon class="ml-1 mt-n1"
                  icon="mdi-alpha-h-box-outline" />
                {{ selected.MechSkillsController.MechSkills.Hull }}
              </v-col>
              <v-col cols="auto">
                <div class="pb-1 text-cc-overline">AGILITY</div>
                <v-icon class="ml-1 mt-n1"
                  icon="mdi-alpha-a-box-outline" />
                {{ selected.MechSkillsController.MechSkills.Agi }}
              </v-col>
              <v-col cols="auto">
                <div class="pb-1 text-cc-overline">SYSTEMS</div>
                <v-icon class="ml-1 mt-n1"
                  icon="mdi-alpha-s-box-outline" />
                {{ selected.MechSkillsController.MechSkills.Sys }}
              </v-col>
              <v-col cols="auto">
                <div class="pb-1 text-cc-overline">ENGINEERING</div>
                <v-icon class="ml-1 mt-n1"
                  icon="mdi-alpha-e-box-outline" />
                {{ selected.MechSkillsController.MechSkills.Eng }}
              </v-col>
            </v-row>

            <div class="text-cc-overline text-disabled mt-4">
              <cc-slashes />
              Pilot Loadout
            </div>
            <div class="bg-background pa-2 text-center">
              <cc-item-chip v-for="item in selected.PilotLoadoutController.ActiveLoadout.Items"
                :key="item.ID"
                :item="item"
                class="" />
            </div>

            <div class="text-cc-overline text-disabled mt-4">
              <cc-slashes />
              Pilot Talents
            </div>
            <v-row dense
              class="bg-background pa-1"
              justify="space-around">
              <v-col cols="auto"
                v-for="(talent, i) in selected.TalentsController.Talents"
                :key="i"
                class="px-2">
                <cc-talent :talent="talent.Talent"
                  :rank="talent.Rank"
                  micro
                  hide-locked
                  hide-change />
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <div class="text-cc-overline text-disabled">
          <cc-slashes />
          ACTIVE MECH
          <cc-tooltip>
            The active mech will be instantiated for use in this encounter. Once the encounter is
            started, the active mech cannot be changed without resetting the mech's stats
          </cc-tooltip>
          <v-menu v-if="selected.Mechs.length"
            :close-on-content-click="true"
            transition="slide-y-transition">
            <template #activator="{ props, isActive }">
              <v-list-item v-bind="props"
                class="border-sm"
                @click="props.onClick($event)">
                <div class="heading h2 text-accent">{{ selected.ActiveMech.Name }}</div>
                <div class="text-cc-overline text-disabled">
                  {{ selected.ActiveMech.Callsign }}
                  {{ selected.ActiveMech.Frame.Source }}
                  {{ selected.ActiveMech.Frame.Name }}
                </div>
                <template #append>
                  <v-icon size="35"
                    :icon="isActive ? 'mdi-chevron-double-up' : 'mdi-chevron-double-down'" />
                </template>
              </v-list-item>
            </template>
            <v-card flat
              tile>
              <v-list density="compact"
                flat
                tile
                class="pa-0">
                <v-list-item v-for="mech in selected.Mechs"
                  :key="mech.ID"
                  class="border-sm"
                  :disabled="mech.ID === selected.ActiveMech.ID"
                  @click="selected.ActiveMech = mech">
                  <div class="heading h2 text-accent">{{ mech.Name }}</div>
                  <div class="text-cc-overline text-disabled">
                    {{ mech.Callsign }}
                    {{ mech.Frame.Source }}
                    {{ mech.Frame.Name }}
                  </div>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
          <cc-alert v-if="!selected.Mechs.length"
            class="mt-2"
            title="No Mech Data Found"
            icon="mdi-alert">
            <i>Pilot will be instanced without a mech</i>
          </cc-alert>
        </div>
        <div v-if="selected && selected.Mechs.length"
          :key="selected?.ActiveMech?.ID"
          class="border-s-sm border-e-sm border-b-sm pa-2">
          <v-row dense>
            <v-col cols="auto"
              style="width: 10vw">
              <cc-img v-if="selected.ActiveMech.Portrait"
                :src="selected.ActiveMech.Portrait"
                height="100%"
                cover />
            </v-col>
            <v-col>
              <p v-if="selected.ActiveMech.Notes"
                v-html-safe="selected.ActiveMech.Notes"
                class="ma-1 pa-1 border-sm" />

              <div class="text-cc-overline text-disabled">
                <cc-slashes />
                Mech Stats
              </div>
              <mech-statblock :mech="selected.ActiveMech"
                :pilot="selected" />

              <div>
                <div class="text-cc-overline text-disabled mt-3">
                  <cc-slashes />
                  Frame Traits
                </div>
                <masonry-wall :items="selected.ActiveMech.Frame.Traits"
                  :column-width="500"
                  :gap="16"
                  :min-columns="1"
                  :max-columns="2">
                  <template #default="{ item, index }">
                    <cc-trait-item :trait="item"
                      class="mb-2" />
                  </template>
                </masonry-wall>

                <div v-if="selected.CoreBonusController.CoreBonuses.length">
                  <div class="text-cc-overline text-disabled mt-3">
                    <cc-slashes />
                    Core Bonuses
                  </div>
                  <masonry-wall :items="selected.CoreBonusController.CoreBonuses"
                    :column-width="500"
                    :gap="16"
                    :min-columns="1"
                    :max-columns="2">
                    <template #default="{ item, index }">
                      <cc-core-bonus-item :key="item.ID"
                        terse
                        :bonus="item" />
                    </template>
                  </masonry-wall>
                </div>

                <div class="text-cc-overline text-disabled mt-3">
                  <cc-slashes />
                  Core System
                </div>
                <cc-core-system-panel :frame="selected.ActiveMech.Frame"
                  small />

                <div class="text-cc-overline text-disabled mt-3">
                  <cc-slashes />
                  Active Loadout &mdash;
                  {{ selected.ActiveMech.MechLoadoutController.ActiveLoadout.Name }}
                </div>
                <div class="bg-background pa-2">
                  <cc-item-chip v-for="item in selected.ActiveMech.MechLoadoutController.ActiveLoadout
                    .Equipment"
                    :key="item.ID"
                    :item="item" />
                </div>
              </div>
            </v-col>
          </v-row>
          <div style="height: 10px" />
        </div>
        <div v-if="selected"
          style="
            position: fixed;
            bottom: 8px;
            right: 18px;
            left: 18px;
            padding: 12px;
          "
          :style="`left: ${$refs.sidebar.showNav ? 380 : 20}px`">
          <cc-button :color="isInEncounter(selected) ? 'error' : 'success'"
            size="small"
            class="border-lg"
            block
            :prepend-icon="isInEncounter(selected) ? 'mdi-minus' : 'mdi-plus'"
            @click="addPilot(selected)">
            {{ isInEncounter(selected) ? 'Remove from Encounter' : 'Add to Encounter' }}
          </cc-button>
        </div>
      </div>
      <div v-else>
        <v-row justify="center"
          align="center"
          style="height: calc(100vh - 60px)">
          <v-col cols="auto"><i class="text-disabled">Select a Pilot</i></v-col>
        </v-row>
      </div>
    </cc-sidebar-layout>
  </cc-modal>
</template>

<script>
import MechStatblock from '@/features/pilot_management/PilotSheet/sections/mech/sections/attributes/MechStatblock.vue';
import { PilotStore } from '@/stores';

export default {
  name: 'add-from-roster',
  components: {
    MechStatblock,
  },
  props: {
    encounter: {
      type: Object,
      required: true,
    },
    pilots: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    showNav: true,
    selected: null,
    search: '',
  }),
  computed: {
    addedPilots() {
      return this.pilots.map((p) => p.ID);
    },
    pilotsByGroup() {
      let pilots = PilotStore().Pilots.filter((p) => !p.SaveController.IsDeleted);
      if (this.search) {
        const searchLower = this.search.toLowerCase();
        pilots = pilots.filter(
          (p) =>
            p.Callsign.toLowerCase().includes(searchLower) ||
            p.Name.toLowerCase().includes(searchLower)
        );
      }

      return pilots.reduce((acc, pilot) => {
        const group = pilot.Group || 'No Group';
        if (!acc[group]) {
          acc[group] = [];
        }
        acc[group].push(pilot);
        return acc;
      }, {});
    },
  },
  methods: {
    addPilot(pilot) {
      if (this.addedPilots.includes(pilot.ID)) {
        this.pilots.splice(
          this.pilots.findIndex((p) => p.ID === pilot.ID),
          1
        );
        this.$notify({
          title: `Removed ${pilot.Callsign} from encounter`,
          text: 'Removal Success',
          data: { icon: 'mdi-delete', color: 'info' },
        });
      } else {
        this.pilots.push(pilot);
        this.$notify({
          title: `Added ${pilot.Callsign} to encounter`,
          text: 'Success',
          data: { icon: 'mdi-check', color: 'success' },
        });
      }
    },
    isInEncounter(pilot) {
      return this.addedPilots.includes(pilot.ID);
    },
  },
};
</script>
