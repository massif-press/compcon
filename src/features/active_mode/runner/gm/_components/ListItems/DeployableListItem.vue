<template>
  <div class="mt-2">
    <v-hover>
      <template #default="{ props, isHovering }">
        <v-card v-bind="props"
          class="border-fade"
          :class="selected ? 'bg-panel' : ''"
          flat
          tile
          variant="outlined"
          :style="`border-color: ${selected ? 'rgb(var(--v-theme-accent))' : isHovering ? 'rgb(var(--v-theme-primary))' : 'rgb(var(--v-theme-panel))'};`"
          @click.stop="$emit('click', $event)">
          <v-row :justify="collapsed ? 'center' : 'space-between'"
            dense
            :style="collapsed && !activations ? 'opacity: 0.4' : ''">
            <v-col cols="auto"
              style="position: relative">
              <v-avatar flat
                tile
                :size="collapsed ? 30 : 40"
                style="height: 100%"
                :style="destroyed ? 'opacity: 0.6' : ''"
                class="bg-panel">
                <v-icon :icon="icon || 'mdi-cube'"
                  :size="collapsed ? 30 : 40" />
              </v-avatar>
              <div v-if="destroyed"
                style="
                  position: absolute;
                  top: 15%;
                  right: 15%;
                  left: 15%;
                  bottom: 15%;
                  z-index: 1;
                ">
                <v-icon icon="cc:destroyed_outline"
                  size="100%" />
              </div>
            </v-col>
            <v-col v-if="!collapsed"
              class="mx-1">
              <div>
                <span class="font-weight-bold text-uppercase"
                  style="font-size: 14px">
                  {{ deployable.Name }}
                </span>
              </div>

              <div v-if="!destroyed"
                style="font-size: 16px">
                <v-row dense
                  justify="space-between"
                  align="center"
                  class="pl-2 pr-6">
                  <v-col v-for="stat in deployable.StatController.GetStatCollection([
                    'hp',
                    'stress',
                    'heatcap',
                    'structure',
                    'repairCapacity',
                  ])"
                    :key="stat.key"
                    cols="auto">
                    <v-tooltip :text="stat.title"
                      location="top"
                      open-delay="400">
                      <template #activator="{ props }">
                        <v-icon v-bind="props"
                          size="18"
                          class="mx-1 mt-n1"
                          :icon="stat.icon" />
                        <b class="text-accent">
                          {{ deployable.StatController.CurrentStats[stat.key] }}
                        </b>
                        <span class="text-disabled text-caption">
                          /{{ deployable.StatController.MaxStats[stat.key] }}
                        </span>
                      </template>
                    </v-tooltip>
                  </v-col>
                </v-row>
                <v-divider class="my-1" />
                <v-row dense
                  justify="space-between"
                  align="center"
                  class="pl-2 pr-6">
                  <v-col v-for="stat in deployable.StatController.GetStatCollection([
                    'armor',
                    'evasion',
                    'edef',
                    'saveTarget',
                  ])"
                    :key="stat.key"
                    cols="auto">
                    <v-tooltip :text="stat.title"
                      location="top"
                      open-delay="400">
                      <template #activator="{ props }">
                        <v-icon v-bind="props"
                          size="18"
                          class="mx-1 mt-n1"
                          :icon="stat.icon" />
                        <b class="text-secondary">
                          {{ deployable.StatController.CurrentStats[stat.key] }}
                        </b>
                      </template>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </div>

              <v-row v-if="deployable.CombatController.Resistances.length > 0"
                style="line-height: 0"
                no-gutters
                justify="center"
                class="text-center my-1">
                <v-tooltip v-for="damage in deployable.CombatController.Resistances"
                  :key="`${damage.type}-${damage.condition}`"
                  location="top">
                  <template #activator="{ props }">
                    <v-icon v-bind="props"
                      class="mr-4"
                      :icon="`cc:${damage.type.toLowerCase()}`"
                      style="border-bottom-right-radius: 5px"
                      :class="damageClass(damage)" />
                  </template>
                  <span class="text-cc-overline">
                    {{ damage.condition }} to {{ damage.type }} damage
                  </span>
                </v-tooltip>
              </v-row>

              <v-card v-if="destroyed"
                height="16"
                flat
                tile
                class="bg-stripes text-cc-overline text-center mt-1">
                <v-chip style="height: 16px"
                  flat
                  tile
                  variant="elevated"
                  class="px-1">
                  <div class="text-red"
                    style="margin-top: 2px">
                    <v-icon icon="cc:destroyed" />
                    DESTROYED
                  </div>
                </v-chip>
              </v-card>

              <v-card v-else-if="deployable.CombatController.IsInDangerZone"
                height="16"
                flat
                tile
                class="bg-stripes-dangerzone text-cc-overline text-center mt-1">
                <v-chip style="height: 16px"
                  flat
                  tile
                  variant="elevated"
                  class="px-1">
                  <div class="text-red"
                    style="margin-top: 2px">
                    <v-icon icon="cc:heat" />
                    Danger Zone
                  </div>
                </v-chip>
              </v-card>

              <div v-for="(status, index) in customStatuses"
                :key="`custom-${index}`">
                <v-progress-linear model-value="100"
                  height="16"
                  color="orange"
                  striped>
                  <v-chip class="text-cc-overline bg-deep-orange-darken-3"
                    flat
                    tile>
                    <cc-slashes />
                    {{ status.Attribute }}
                    <cc-slashes />
                  </v-chip>
                </v-progress-linear>
              </div>

              <div v-for="status in deployable.CombatController.Statuses"
                :key="status.status.ID"
                class="mb-1">
                <v-progress-linear model-value="100"
                  height="16"
                  color="red-darken-3">
                  <v-chip class="text-cc-overline"
                    flat
                    tile>
                    <cc-slashes />
                    <v-icon :icon="status.status.Icon"
                      class="mx-2" />
                    <span class="pr-2">{{ status.status.Name }}</span>
                    <cc-slashes />
                  </v-chip>
                </v-progress-linear>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </template>
    </v-hover>
  </div>
</template>

<script lang="ts">
export default {
  name: 'DeployableListItem',
  props: {
    selected: {
      type: Boolean,
      default: false,
    },
    collapsed: {
      type: Boolean,
      default: false,
    },
    deployable: {
      type: Object,
      required: true,
    },
    parent: {
      type: Object,
      required: true,
    },

    statuses: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['click'],
  computed: {
    activations() {
      return this.deployable.StatController.CurrentStats['activations'] || 0;
    },
    destroyed() {
      return this.deployable.CombatController.IsDestroyed;
    },
    customStatuses() {
      return this.deployable.CombatController.CustomStatuses || [];
    },
    icon() {
      return this.deployable.Base.Icon;
    },
  },
  methods: {
    damageClass(damage) {
      if (damage.condition === 'immune') {
        return 'bg-exotic';
      } else if (damage.condition === 'resistant') {
        return `bg-success`;
      } else if (damage.condition === 'vulnerable') {
        return 'bg-error';
      }
      return '';
    },
  },
};
</script>

<style scoped>
@import './runner-list-item.css';
</style>
