<template>
  <v-row>
    <v-col class="heading h2 text-accent">{{ item.callsign }}</v-col>
    <v-col cols="auto">
      <span class="text-cc-overline pr-1">Played by</span>
      <b class="text-accent">{{ item.name }}</b>
    </v-col>
  </v-row>
  <v-card flat tile class="pa-2">
    <v-row class="pr-4">
      <v-col cols="auto">
        <v-img width="155px" height="100%" color="panel" cover :src="item.frame.DefaultImage" />
      </v-col>
      <v-col>
        <v-row no-gutters>
          <v-col cols="auto" align-self="center" class="ml-n2 mr-2">
            <v-icon :icon="item.frame.SizeIcon" size="60" />
          </v-col>
          <v-col cols="auto">
            <div class="heading h2">{{ item.mechname }}</div>
            <div class="heading h4">{{ item.frame.Source }} {{ item.frame.Name }}</div>
          </v-col>
          <v-col cols="auto" class="mx-auto">
            <v-btn-toggle v-model="cover" flat tile color="primary">
              <v-btn size="small" height="30px" value="no">No Cover</v-btn>
              <v-btn size="small" height="30px" value="soft">Soft Cover</v-btn>
              <v-btn size="small" height="30px" value="hard">Hard Cover</v-btn>
            </v-btn-toggle>
          </v-col>
          <v-col cols="auto">
            <v-btn
              icon
              :color="item.activations > 0 ? 'green' : 'grey'"
              @click="item.activations--">
              <v-icon icon="cc:activate" size="40" />
            </v-btn>
          </v-col>
        </v-row>
        <v-row class="mt-n1 mb-1">
          <v-col cols="auto">
            <v-tooltip location="top" text="Hull">
              <template #activator="{ props }">
                <span v-bind="props">
                  <v-icon icon="mdi-alpha-h-box-outline" size="x-large" class="mt-n2 mr-1" />
                  <span class="heading h2 text-accent">2</span>
                </span>
              </template>
            </v-tooltip>
          </v-col>
          <v-col cols="auto">
            <v-tooltip location="top" text="Agility">
              <template #activator="{ props }">
                <span v-bind="props">
                  <v-icon icon="mdi-alpha-a-box-outline" size="x-large" class="mt-n2 mr-1" />
                  <span class="heading h2 text-accent">2</span>
                </span>
              </template>
            </v-tooltip>
          </v-col>
          <v-col cols="auto">
            <v-tooltip location="top" text="Systems">
              <template #activator="{ props }">
                <span v-bind="props">
                  <v-icon icon="mdi-alpha-s-box-outline" size="x-large" class="mt-n2 mr-1" />
                  <span class="heading h2 text-accent">2</span>
                </span>
              </template>
            </v-tooltip>
          </v-col>
          <v-col cols="auto">
            <v-tooltip location="top" text="Engineering">
              <template #activator="{ props }">
                <span v-bind="props">
                  <v-icon icon="mdi-alpha-e-box-outline" size="x-large" class="mt-n2 mr-1" />
                  <span class="heading h2 text-accent">2</span>
                </span>
              </template>
            </v-tooltip>
          </v-col>
          <v-col cols="auto" class="ml-6">
            <v-tooltip location="top" text="Evasion">
              <template #activator="{ props }">
                <span v-bind="props">
                  <v-icon icon="cc:evasion" size="x-large" class="mt-n2 mr-1" />
                  <span class="heading h2 text-accent">{{ item.frame.Stats.evasion }}</span>
                </span>
              </template>
            </v-tooltip>
          </v-col>
          <v-col cols="auto">
            <v-tooltip location="top" text="E-Defense">
              <template #activator="{ props }">
                <span v-bind="props">
                  <v-icon icon="cc:e_def" size="x-large" class="mt-n2 mr-1" />
                  <span class="heading h2 text-accent">{{ item.frame.Stats.edef }}</span>
                </span>
              </template>
            </v-tooltip>
          </v-col>
          <v-col cols="auto">
            <v-tooltip location="top" text="Sensor Range">
              <template #activator="{ props }">
                <span v-bind="props">
                  <v-icon icon="cc:sensor" size="x-large" class="mt-n2 mr-1" />
                  <span class="heading h2 text-accent">{{ item.frame.Stats.sensor_range }}</span>
                </span>
              </template>
            </v-tooltip>
          </v-col>
          <v-col cols="auto">
            <v-tooltip location="top" text="Tech Attack Bonus">
              <template #activator="{ props }">
                <span v-bind="props">
                  <v-icon icon="cc:full_tech" size="x-large" class="mt-n2 mr-1" />
                  <span class="heading h2 text-accent">+{{ item.frame.Stats.tech_attack }}</span>
                </span>
              </template>
            </v-tooltip>
          </v-col>
          <v-col cols="auto">
            <v-tooltip location="top" text="Speed">
              <template #activator="{ props }">
                <span v-bind="props">
                  <v-icon
                    icon="mdi-arrow-right-bold-hexagon-outline"
                    size="x-large"
                    class="mt-n2 mr-1" />
                  <span class="heading h2 text-accent">{{ item.frame.Stats.speed }}</span>
                </span>
              </template>
            </v-tooltip>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="auto">
            <cc-tickbar
              v-model="item.stats.structure.current"
              label="Structure"
              color="structure"
              :ticks="item.frame.Stats.structure" />
          </v-col>
          <v-col cols="auto">
            <cc-tickbar
              v-model="item.stats.armor.current"
              color="armor"
              label="Armor"
              :ticks="item.frame.Stats.armor" />
          </v-col>
          <v-col cols="auto">
            <cc-tickbar
              v-model="item.stats.hp.current"
              label="HP"
              color="hp"
              :ticks="item.frame.Stats.hp" />
          </v-col>
          <v-col cols="auto">
            <cc-tickbar color="info" label="Overshield" :ticks="5" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="auto">
            <cc-tickbar
              v-model="item.stats.reactor.current"
              color="stress"
              label="Stress"
              :ticks="item.frame.Stats.stress" />
          </v-col>
          <v-col cols="auto">
            <cc-tickbar
              v-model="item.stats.heat.current"
              color="heat"
              label="Heat"
              :ticks="item.frame.Stats.heatcap" />
          </v-col>
          <v-col cols="auto">
            <cc-tickbar v-model="overcharge" color="overcharge" label="Overcharge (1)" :ticks="3" />
          </v-col>
          <v-col cols="auto">
            <cc-tickbar v-model="corepower" color="exotic" label="Core Power" :ticks="1" />
          </v-col>
          <v-col cols="auto">
            <cc-tickbar
              v-model="movement"
              color="primary"
              label="Movement"
              :ticks="item.frame.Stats.speed" />
          </v-col>
          <v-col cols="auto">
            <cc-tickbar
              v-model="item.stats.repair.current"
              color="success"
              label="Repair Capacity"
              :ticks="item.frame.Stats.repcap" />
          </v-col>
        </v-row>

        <div class="text-cc-overline text-disabled mt-4">Actions</div>
        <v-row dense>
          <v-col>
            <v-card color="action--protocol" flat class="text-center py-1 px-2">
              <v-icon size="large" icon="cc:protocol" />
            </v-card>
          </v-col>
          <v-col>
            <v-card color="action--full" flat class="text-center py-1 px-2">
              <v-icon size="large" icon="mdi-hexagon-slice-6" />
            </v-card>
          </v-col>
          <v-col cols="auto">
            <v-card flat tile class="text-center py-1 px-2">
              <v-icon size="large" class="text-disabled">mdi-swap-horizontal</v-icon>
            </v-card>
          </v-col>
          <v-col>
            <v-card color="action--full" flat class="text-center py-1 px-2">
              <v-icon size="large" icon="mdi-hexagon-slice-3" />
            </v-card>
          </v-col>
          <v-col>
            <v-card color="action--full" flat class="text-center py-1 px-2">
              <v-icon size="large" icon="mdi-hexagon-slice-3" />
            </v-card>
          </v-col>
          <v-col>
            <v-card color="action--move" flat class="text-center py-1 px-2">
              <v-icon size="large" icon="mdi-arrow-right-bold-hexagon-outline" />
            </v-card>
          </v-col>
          <v-col>
            <v-card color="overcharge" flat class="text-center py-1 px-2">
              <v-icon size="large" icon="cc:overcharge" />
            </v-card>
          </v-col>
          <v-col>
            <v-card color="action--free" flat class="text-center py-1 px-2">
              <v-icon size="large" icon="cc:free_action" />
            </v-card>
          </v-col>
          <v-col>
            <v-card color="action--reaction" flat class="text-center py-1 px-2">
              <v-icon size="large" icon="cc:reaction" />
            </v-card>
          </v-col>
        </v-row>

        <v-row dense class="mt-4">
          <v-col cols="auto">
            <div class="text-cc-overline text-disabled">Resistances</div>
            <v-row dense justify="center">
              <v-col v-for="resist in resistances" cols="auto">
                <v-tooltip :open-delay="400" location="top" max-width="300">
                  <template #activator="{ props }">
                    <v-card
                      v-bind="props"
                      :color="item.resistances.some((r) => r === resist.name) ? 'primary' : 'panel'"
                      class="px-2 py-1 text-center"
                      flat
                      @click="addResistance(resist)">
                      <v-icon :icon="resist.icon" size="30" />
                    </v-card>
                  </template>
                  <div class="heading h3">{{ resist.Name }}</div>
                  {{ resist.description }}
                </v-tooltip>
              </v-col>
            </v-row>
            <div class="text-right">
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
                Add Custom Resistance
              </v-btn>
            </div>
          </v-col>
          <v-col cols="auto" style="min-width: 20px" />

          <v-col>
            <div class="text-cc-overline text-disabled">Statuses / Conditions</div>
            <v-row dense justify="center">
              <v-col v-for="status in statuses" :key="status.ID" cols="auto">
                <v-tooltip :open-delay="400" location="top" max-width="300">
                  <template #activator="{ props }">
                    <v-card
                      v-bind="props"
                      :color="item.statuses.some((s) => s.ID === status.ID) ? 'primary' : 'panel'"
                      class="px-2 py-1 text-center"
                      flat
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
                    :active="item.special.includes(status.Name)"
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

          <v-col cols="auto" style="min-width: 20px" />

          <v-col cols="auto">
            <div class="text-cc-overline text-disabled">Burn</div>
            <cc-number-field
              v-model.number="burn"
              type="number"
              :max="12"
              :min="0"
              color="damage--burn"
              icon="cc:burn"
              class="my-1 d-inline-flex" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-scroll-y-reverse-transition>
      <div v-if="item.special.length" class="text-cc-overline mt-2">
        <v-progress-linear
          v-for="status in item.special"
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

    <div class="text-cc-overline mt-4">COUNTERS</div>
    <cc-panel color="primary" width="200px" class="heading h3 text-center">
      <v-icon icon="mdi-plus" size="x-large" />
      <br />
      ADD COUNTER
    </cc-panel>

    <v-divider class="my-4" />

    talents
    <br />
    core power
    <br />

    frame traits
    <br />

    loadout
    <br />

    <!-- <v-scroll-y-reverse-transition>
      <div v-if="item.statuses.length" class="text-cc-overline mt-2">
        <cc-alert
          v-for="status in item.statuses"
          :title="status.Name"
          :icon="status.Icon"
          prominent
          class="mt-1">
          <p v-html="status.Effects" />
        </cc-alert>
      </div>
    </v-scroll-y-reverse-transition> -->

    <v-divider class="my-4" />

    <div class="text-cc-overline mt-4">
      PILOT
      <cc-slashes />
    </div>
    <v-row>
      <v-col cols="auto">
        <v-img width="75px" src="https://placebear.com/100/100" />
      </v-col>
      <v-col>
        pilot stats
        <br />
        pilot info expandable
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import _, { over } from 'lodash';
import { CompendiumStore } from '@/stores';

export default {
  name: 'PcPanel',
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
    movement: 3,
    cover: 'no',
    specialStatuses: [
      { ID: 1, Name: 'Ejected' },
      { ID: 2, Name: 'Cascade' },
      { ID: 3, Name: 'Meltdown Imminent' },
      { ID: 4, Name: 'Pilot Incapacitated' },
    ],
    resistances: [
      { ID: 1, Name: 'Kinetic', icon: 'cc:kinetic' },
      { ID: 2, Name: 'Energy', icon: 'cc:energy' },
      { ID: 3, Name: 'Explosive', icon: 'cc:explosive' },
      { ID: 4, Name: 'Heat', icon: 'cc:heat' },
      { ID: 5, Name: 'Burn', icon: 'cc:burn' },
      { ID: 5, Name: 'AoE', icon: 'cc:blast' },
    ],
  }),
  computed: {
    statuses() {
      return _.orderBy(CompendiumStore().Statuses, 'StatusType');
    },
  },
  methods: {
    addStatus(status) {
      if (this.item.statuses.includes(status)) {
        const index = this.item.statuses.indexOf(status);
        this.item.statuses.splice(index, 1);
      } else {
        this.item.statuses.push(status);
      }
    },
    addSpecialStatus(status) {
      if (this.item.special.includes(status.Name)) {
        const index = this.item.special.indexOf(status.Name);
        this.item.special.splice(index, 1);
        return;
      }
      this.item.special.push(status.Name);
    },
  },
};
</script>
