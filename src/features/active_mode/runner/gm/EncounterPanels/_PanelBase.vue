<template>
  <slot name="header" />
  <v-card flat tile class="pa-2">
    <v-row class="pr-4">
      <v-col cols="auto">
        <cc-img width="155px" height="100%" color="panel" cover :src="item.Portrait" />
      </v-col>
      <v-col>
        <v-row no-gutters>
          <v-col cols="auto" align-self="center" class="ml-n2 mr-2">
            <v-icon :icon="item.SizeIcon" size="60" />
          </v-col>
          <v-col cols="auto">
            <slot name="name-block" />
          </v-col>
          <v-col cols="auto" class="mx-auto" align-self="center">
            <v-btn-toggle v-model="cover" flat tile color="primary">
              <v-btn size="x-small" height="20px" value="no">No Cover</v-btn>
              <v-btn size="x-small" height="20px" value="soft">Soft Cover</v-btn>
              <v-btn size="x-small" height="20px" value="hard">Hard Cover</v-btn>
            </v-btn-toggle>
          </v-col>
          <v-col cols="auto" class="pt-3 pr-1">
            <cc-button
              icon="cc:activate"
              size="x-large"
              variant="outlined"
              :color="item.activations === 0 ? 'green' : 'grey'"
              @click="
                item.activations === 0 ? (item.activations = 1) : (item.activations = 0)
              "></cc-button>
          </v-col>
        </v-row>
        <v-row class="mt-n1">
          <v-col v-if="item.frame" cols="auto">
            <v-tooltip location="top" text="Pilot Grit">
              <template #activator="{ props }">
                <span v-bind="props">
                  <v-icon icon="mdi-star-four-points-outline" size="x-large" class="mt-n2 mr-1" />
                  <span class="heading h2 text-accent">2</span>
                </span>
              </template>
            </v-tooltip>
          </v-col>
          <v-col
            cols="auto"
            v-for="(stat, index) in item.StatController.GetStatCollection([
              'hull',
              'agi',
              'sys',
              'eng',
            ])">
            <v-tooltip :text="stat.title" location="top" open-delay="400">
              <template #activator="{ props }">
                <v-icon v-bind="props" size="x-large" class="mt-n2 mr-1" :icon="stat.icon" />
                <span class="heading h2 text-accent">
                  {{ item.StatController.CurrentStats[stat.key] }}
                </span>
              </template>
            </v-tooltip>
          </v-col>
          <v-col cols="1" />
          <v-col
            cols="auto"
            v-for="(stat, index) in item.StatController.GetStatCollection([
              'evasion',
              'edef',
              'sensorRange',
              'saveTarget',
            ])">
            <v-tooltip :text="stat.title" location="top" open-delay="400">
              <template #activator="{ props }">
                <v-icon v-bind="props" size="x-large" class="mt-n2 mr-1" :icon="stat.icon" />
                <span class="heading h2 text-accent">
                  {{ item.StatController.CurrentStats[stat.key] }}
                </span>
              </template>
            </v-tooltip>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <cc-tickbar
              v-model="item.StatController.CurrentStats['hp']"
              v-model:secondary="item.StatController.CurrentStats['structure']"
              v-model:tertiary="overshield"
              primary-label="Hit Points"
              secondary-label="Structure"
              tertiary-label="Overshield"
              color="hp"
              secondary-color="structure"
              tertiary-color="overshield"
              icon="mdi-heart-outline"
              secondary-icon="cc:structure"
              tertiary-icon="mdi-hexagon-multiple-outline"
              :ticks="item.StatController.MaxStats['hp']"
              :secondary-ticks="item.StatController.MaxStats['structure']" />
          </v-col>
          <v-col cols="auto">
            <stat-mini-panel
              title="armor"
              icon="mdi-shield-outline"
              color="armor"
              v-model="item.StatController.CurrentStats['armor']" />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <cc-tickbar
              v-model="item.StatController.CurrentStats['heat']"
              v-model:secondary="item.StatController.CurrentStats['stress']"
              v-model:tertiary="item.StatController.CurrentStats['overcharge']"
              secondary-label=" "
              tertiary-label=" "
              color="heat"
              secondary-color="stress"
              tertiary-color="overcharge"
              icon="cc:heat"
              secondary-icon="cc:reactor"
              tertiary-icon="mdi-decagram-outline"
              :ticks="item.StatController.MaxStats['heat']"
              :secondary-ticks="item.StatController.MaxStats['stress']"
              :tertiary-ticks="3" />
          </v-col>
          <v-col cols="auto">
            <stat-mini-panel title="burn" icon="cc:burn" color="damage--burn" v-model="burn" />
          </v-col>
        </v-row>
        <v-row class="mb-3">
          <v-col>
            <cc-tickbar
              v-model="item.StatController.CurrentStats['speed']"
              color="primary"
              min-width="150px"
              space
              icon="mdi-arrow-right-bold-hexagon-outline"
              class="mb-1"
              :ticks="item.StatController.MaxStats['speed']" />
            <cc-tickbar
              v-if="item.StatController.MaxStats['repCap']"
              v-model="item.StatController.CurrentStats['repCap']"
              color="success"
              icon="cc:repair"
              min-width="150px"
              space
              reverse
              :ticks="item.StatController.MaxStats['repCap']" />
          </v-col>
          <v-col cols="auto" v-if="item.type === 'pilot'">
            <stat-mini-panel
              v-model="corepower"
              title="core"
              icon="mdi-battery-high"
              color="core"
              boolean />
          </v-col>
        </v-row>

        <div class="text-cc-overline text-disabled mt-4">Actions</div>
        <v-row dense>
          <v-col>
            <v-card
              :color="actionStatus('protocol') ? 'grey' : 'action--protocol'"
              flat
              tile
              class="text-center py-1 px-2"
              @click="setAction('protocol')">
              <v-icon size="large" icon="cc:protocol" />
            </v-card>
          </v-col>
          <v-col>
            <v-card
              :color="actionStatus('full') ? 'grey' : 'action--full'"
              flat
              tile
              class="text-center py-1 px-2"
              @click="setAction('full')">
              <v-icon size="large" icon="mdi-hexagon-slice-6" />
            </v-card>
          </v-col>
          <v-col cols="auto">
            <v-card flat tile class="text-center py-1 px-2">
              <v-icon size="large" class="text-disabled">mdi-swap-horizontal</v-icon>
            </v-card>
          </v-col>
          <v-col>
            <v-card
              :color="actionStatus('quick') ? 'grey' : 'action--quick'"
              flat
              tile
              class="text-center py-1 px-2"
              @click="setAction('quick')">
              <v-icon size="large" icon="mdi-hexagon-slice-3" />
            </v-card>
          </v-col>
          <v-col>
            <v-card
              :color="actionStatus('quick') ? 'grey' : 'action--quick'"
              flat
              tile
              class="text-center py-1 px-2"
              @click="setAction('quick')">
              <v-icon size="large" icon="mdi-hexagon-slice-3" />
            </v-card>
          </v-col>
          <v-col>
            <v-card
              :color="actionStatus('move') ? 'grey' : 'action--move'"
              flat
              tile
              class="text-center py-1 px-2"
              @click="setAction('move')">
              <v-icon size="large" icon="mdi-arrow-right-bold-hexagon-outline" />
            </v-card>
          </v-col>
          <v-col>
            <v-card
              :color="actionStatus('overcharge') ? 'grey' : 'overcharge'"
              flat
              tile
              class="text-center py-1 px-2"
              @click="setAction('overcharge')">
              <v-icon size="large" icon="cc:overcharge" />
            </v-card>
          </v-col>
          <v-col>
            <v-card
              :color="actionStatus('reaction') ? 'grey' : 'action--reaction'"
              flat
              tile
              class="text-center py-1 px-2"
              @click="setAction('reaction')">
              <v-icon size="large" icon="cc:reaction" />
            </v-card>
          </v-col>
        </v-row>

        <v-row dense class="mt-4">
          <v-col cols="4">
            <div class="text-cc-overline text-disabled">RESIST / IMMUNE / VULNERABLE</div>
            <v-row dense justify="center">
              <v-col v-for="resist in resistances" cols="4">
                <v-tooltip :open-delay="400" location="top" max-width="300">
                  <template #activator="{ props }">
                    <v-card
                      v-bind="props"
                      style="position: relative; padding-top: 2px; padding-bottom: 2px"
                      flat
                      tile
                      :color="hasResistance(resist) ? resist.color : 'panel'"
                      :style="`border: 2px solid ${hasImmunity(resist) ? 'rgb(var(--v-theme-primary))' : hasVulnerability(resist) ? 'rgba(249, 219, 78, 0.5)' : 'rgb(var(--v-theme-panel))'}`"
                      class="px-2 text-center"
                      :class="hasVulnerability(resist) ? 'bg-stripes' : ''"
                      @click="addResistance(resist)">
                      <v-icon
                        v-if="immunities.some((r) => r === resist.Name)"
                        icon="mdi-cancel"
                        color="accent"
                        size="45"
                        style="
                          position: absolute;
                          top: 0;
                          bottom: 0;
                          left: 0;
                          right: 0;
                          width: 100%;
                          height: 100%;
                        " />
                      <v-icon :icon="resist.icon" size="35" />
                    </v-card>
                  </template>
                  <div
                    v-if="hasResistance(resist) || hasImmunity(resist) || hasVulnerability(resist)"
                    class="heading h3"
                    :class="
                      hasImmunity(resist)
                        ? 'text-exotic'
                        : hasVulnerability(resist)
                          ? 'text-error'
                          : 'text-accent'
                    ">
                    {{ resist.Name }}
                    {{
                      hasImmunity(resist)
                        ? 'Immunity'
                        : hasVulnerability(resist)
                          ? 'Vulnerability'
                          : 'Resistance'
                    }}
                  </div>
                  {{
                    hasImmunity(resist)
                      ? 'No damage'
                      : hasResistance(resist)
                        ? 'Half damage'
                        : hasVulnerability(resist)
                          ? 'Double damage'
                          : 'Full Damage'
                  }}
                  from {{ resist.Name }} attacks.
                </v-tooltip>
              </v-col>
            </v-row>

            <div>
              <v-btn
                v-bind="props"
                size="x-small"
                color="accent"
                class="mt-1"
                flat
                tile
                block
                variant="text"
                prepend-icon="mdi-plus">
                Add Custom
              </v-btn>
            </div>
          </v-col>
          <v-col cols="auto" style="min-width: 20px" />

          <v-col class="mx-auto">
            <div class="text-cc-overline text-disabled">Statuses / Conditions</div>
            <v-row dense>
              <v-col
                v-for="status in statuses.filter((x) => x.StatusType === 'Status')"
                :key="status.ID">
                <v-tooltip :open-delay="400" location="top" max-width="300">
                  <template #activator="{ props }">
                    <v-card
                      v-bind="props"
                      :color="statuses.some((s) => s.ID === status.ID) ? 'primary' : 'panel'"
                      class="px-2 py-1 text-center"
                      flat
                      tile
                      @click="addStatus(status)">
                      <v-icon :icon="status.Icon" size="35" />
                    </v-card>
                  </template>
                  <div class="heading h3">{{ status.Name }}</div>
                  {{ status.Terse || status.Effects }}
                </v-tooltip>
              </v-col>
            </v-row>

            <v-row dense>
              <v-col
                v-for="status in statuses.filter((x) => x.StatusType === 'Condition')"
                :key="status.ID">
                <v-tooltip :open-delay="400" location="top" max-width="300">
                  <template #activator="{ props }">
                    <v-card
                      v-bind="props"
                      :color="statuses.some((s) => s.ID === status.ID) ? 'primary' : 'panel'"
                      class="px-2 py-1 text-center"
                      flat
                      tile
                      @click="addStatus(status)">
                      <v-icon :icon="status.Icon" size="35" />
                    </v-card>
                  </template>
                  <div class="heading h3">{{ status.Name }}</div>
                  {{ status.Terse || status.Effects }}
                </v-tooltip>
              </v-col>
            </v-row>

            <div class="text-right">
              <v-menu>
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    size="x-small"
                    color="accent"
                    class="mt-1"
                    flat
                    tile
                    block
                    variant="text"
                    prepend-icon="mdi-plus">
                    Add Special Status
                  </v-btn>
                </template>
                <v-list density="compact" slim>
                  <v-list-item
                    v-for="status in specialStatuses"
                    :active="special.includes(status.Name)"
                    active-color="accent"
                    :key="status.ID"
                    @click="addSpecialStatus(status)">
                    <v-list-item-title>{{ status.Name }}</v-list-item-title>
                  </v-list-item>
                  <v-divider />
                  <v-list-item title="Add Custom" @click="" />
                </v-list>
              </v-menu>
            </div>
          </v-col>
        </v-row>

        <v-dialog max-width="900px">
          <template #activator="{ props }">
            <cc-button
              block
              size="small"
              color="primary"
              class="mt-2"
              prepend-icon="cc:eclipse"
              @click="props.onClick($event)">
              Take damage
            </cc-button>
          </template>
          <template #default="{ isActive }">
            <v-card>
              <v-toolbar height="40" color="primary" class="text-center">
                <div class="heading h3 mt-1">
                  <v-icon icon="cc:eclipse" class="mt-n1 ml-2" start />
                  Take Damage
                </div>
                <v-spacer />
                <v-btn icon @click="isActive.value = false">
                  <v-icon icon="mdi-close" />
                </v-btn>
              </v-toolbar>
              <v-card-text>
                <v-row>
                  <v-col>
                    <div class="text-cc-overline text-disabled">Incoming Damage Value</div>
                    <v-divider />
                    <v-text-field
                      type="number"
                      min="0"
                      max="100"
                      class="mt-2 heading h3"
                      variant="outlined"
                      tile />
                    <v-btn size="x-small" class="mt-1" block flat tile color="primary" @click="">
                      Half Damage
                    </v-btn>
                    <v-btn size="x-small" class="mt-1" block flat tile color="primary" @click="">
                      Armor Piercing
                    </v-btn>
                    <v-btn size="x-small" class="mt-1" block flat tile color="primary" @click="">
                      Irreducible
                    </v-btn>
                  </v-col>
                  <v-col>
                    <div class="text-cc-overline text-disabled">Damage Type</div>
                    <v-divider />
                    <v-row dense class="mt-1">
                      <v-col v-for="r in resistances" :key="r.ID" cols="4">
                        <v-tooltip :open-delay="400" location="top" max-width="300">
                          <template #activator="{ props }">
                            <v-card
                              v-bind="props"
                              :color="hasResistance(r) ? r.color : 'panel'"
                              class="px-2 py-1 text-center"
                              flat
                              tile
                              @click="">
                              <v-icon :icon="r.icon" size="35" />
                            </v-card>
                          </template>
                          <div class="heading h3">{{ r.Name }}</div>
                          {{ r.Terse || r.Effects }}
                        </v-tooltip>
                      </v-col>
                    </v-row>

                    <div class="text-cc-overline text-disabled mt-2">Add Effect</div>
                    <v-divider />
                    <v-row dense class="mt-1">
                      <v-col v-for="s in applicableStatuses" :key="s.ID">
                        <v-tooltip :open-delay="400" location="top" max-width="300">
                          <template #activator="{ props }">
                            <v-card
                              v-bind="props"
                              color="panel"
                              class="px-2 py-1 text-center"
                              flat
                              tile
                              @click="">
                              <v-icon :icon="s.Icon" size="35" />
                            </v-card>
                          </template>
                          <div class="heading h3">{{ s.Name }}</div>
                          {{ s.Terse || s.Effects }}
                        </v-tooltip>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col>
                    <cc-button
                      size="small"
                      prepend-icon="mdi-calculator-variant-outline"
                      block
                      disabled
                      color="primary">
                      Calculate Total
                    </cc-button>
                    <v-card flat tile height="208px" color="background" class="my-2" />
                    <cc-button disabled size="small" prepend-icon="mdi-check" block color="primary">
                      Apply and Close
                    </cc-button>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </template>
        </v-dialog>
      </v-col>
    </v-row>

    <v-scroll-y-reverse-transition>
      <div v-if="special.length" class="text-cc-overline mt-2">
        <v-progress-linear
          v-for="status in special"
          :key="status"
          model-value="100"
          height="24"
          color="orange"
          striped>
          <v-chip size="x-large" class="heading h3 bg-deep-orange-darken-3" flat tile>
            <cc-slashes />
            &emsp;{{ status }}&emsp;
            <cc-slashes />
          </v-chip>
        </v-progress-linear>
      </div>
    </v-scroll-y-reverse-transition>

    <div class="text-cc-overline mt-4 text-disabled">COUNTERS</div>
    <cc-panel color="primary" width="200px" class="heading h3 text-center">
      <v-icon icon="mdi-plus" size="x-large" />
      <br />
      ADD COUNTER
    </cc-panel>

    <v-divider class="my-4" />
    <slot />
  </v-card>
</template>

<script>
import _ from 'lodash';
import { CompendiumStore } from '@/stores';
import StatMiniPanel from './StatMiniPanel.vue';

export default {
  name: 'EncounterPanelBase',
  components: {
    StatMiniPanel,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    corepower: 1,
    overcharge: 0,
    burn: 0,
    resistances: [],
    immunities: [],
    vulnerabilities: [],
    statuses: [],
    special: [],
    overshield: 0,
    cover: 'no',
    specialStatuses: [
      { ID: 1, Name: 'Ejected' },
      { ID: 2, Name: 'Cascade' },
      { ID: 3, Name: 'Meltdown Imminent' },
      { ID: 4, Name: 'Pilot Incapacitated' },
    ],
    resistances: [
      { ID: 1, Name: 'Kinetic', icon: 'cc:kinetic', color: 'damage--kinetic' },
      { ID: 2, Name: 'Energy', icon: 'cc:energy', color: 'damage--energy' },
      { ID: 3, Name: 'Explosive', icon: 'cc:explosive', color: 'damage--explosive' },
      { ID: 4, Name: 'Heat', icon: 'cc:heat', color: 'damage--heat' },
      { ID: 5, Name: 'Burn', icon: 'cc:burn', color: 'damage--burn' },
      { ID: 5, Name: 'AoE', icon: 'cc:blast', color: 'damage--variable' },
    ],
    usedActions: [],
  }),
  computed: {
    statuses() {
      return _.orderBy(CompendiumStore().Statuses, 'StatusType');
    },
    randomTalents() {
      return _.sampleSize(CompendiumStore().Talents, 3);
    },
    applicableStatuses() {
      const exclude = [`dangerzone`, `downandout`, `engaged`, `hidden`, `invisible`];
      return this.statuses.filter((s) => !exclude.includes(s.ID));
    },
  },
  methods: {
    getIcon(stat) {
      const icons = {
        structure: 'cc:structure',
        armor: 'mdi-shield-outline',
        hp: 'mdi-heart-outline',
        reactor: 'cc:reactor',
        heat: 'cc:heat',
        repair: 'cc:repair',
      };
      return icons[stat];
    },
    addStatus(status) {
      if (this.statuses.includes(status)) {
        const index = this.statuses.indexOf(status);
        this.statuses.splice(index, 1);
      } else {
        this.statuses.push(status);
      }
    },
    addSpecialStatus(status) {
      if (this.special.includes(status.Name)) {
        const index = this.special.indexOf(status.Name);
        this.special.splice(index, 1);
        return;
      }
      this.special.push(status.Name);
    },
    addResistance(resist) {
      if (this.vulnerabilities.includes(resist.Name)) {
        const index = this.vulnerabilities.indexOf(resist.Name);
        this.vulnerabilities.splice(index, 1);
        return;
      }
      if (this.immunities.includes(resist.Name)) {
        const index = this.immunities.indexOf(resist.Name);
        this.immunities.splice(index, 1);
        this.vulnerabilities.push(resist.Name);
        return;
      }
      if (this.resistances.includes(resist.Name)) {
        const index = this.resistances.indexOf(resist.Name);
        this.resistances.splice(index, 1);
        this.immunities.push(resist.Name);
      } else {
        this.resistances.push(resist.Name);
      }
    },
    hasResistance(resist) {
      return this.resistances.includes(resist.Name);
    },
    hasImmunity(resist) {
      return this.immunities.includes(resist.Name);
    },
    hasVulnerability(resist) {
      return this.vulnerabilities.includes(resist.Name);
    },
    actionStatus(action) {
      if (action === 'full')
        return this.usedActions.includes('full') || this.usedActions.includes('quick');
      if (action === 'quick')
        return (
          this.usedActions.includes('full') ||
          this.usedActions.filter((x) => x === 'quick').length === 2
        );
      if (action === 'protocol') return this.usedActions.length;
      if (action === 'move') return this.usedActions.includes('move') || this.movement === 0;
      return this.usedActions.includes(action);
    },
    setAction(action) {
      if (action === 'quick') {
        if (this.usedActions.filter((x) => x === 'quick').length === 2) {
          this.usedActions = this.usedActions.filter((x) => x !== 'quick');
        } else {
          this.usedActions.push('quick');
        }
      }
      if (this.usedActions.includes(action)) {
        const index = this.usedActions.indexOf(action);
        this.usedActions.splice(index, 1);
      } else {
        this.usedActions.push(action);
      }
    },
  },
};
</script>

<style scoped>
.bg-stripes {
  background: repeating-linear-gradient(
    -45deg,
    rgba(249, 219, 78, 0.5),
    rgba(249, 219, 78, 0.5) 10px,
    rgba(100, 100, 100, 0.5) 10px,
    rgba(100, 100, 100, 0.5) 20px
  );
}
</style>
