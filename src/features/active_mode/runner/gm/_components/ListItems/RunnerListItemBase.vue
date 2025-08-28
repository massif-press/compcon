<template>
  <div>
    <v-hover>
      <template #default="{ props, isHovering }">
        <v-card
          v-bind="props"
          class="pa-1 border-fade"
          :class="selected ? 'bg-panel' : ''"
          flat
          tile
          variant="outlined"
          @click.stop="$emit('click')"
          :style="`border-color: ${selected ? 'rgb(var(--v-theme-accent))' : isHovering ? 'rgb(var(--v-theme-primary))' : 'rgb(var(--v-theme-panel))'};`">
          <v-row
            justify="space-between"
            dense
            :style="collapsed && !activations ? 'opacity: 0.4' : ''">
            <v-col v-if="!collapsed" cols="auto">
              <div :class="`bg-${side}`" style="width: 4px; height: 100%" />
            </v-col>
            <v-col cols="auto" style="position: relative">
              <v-icon
                v-if="!collapsed && !noDrag"
                icon="mdi-drag"
                size="20"
                :style="isHovering ? 'opacity: 1' : 'opacity: 0.4'"
                class="handle"
                style="
                  position: absolute;
                  top: 2px;
                  left: -6px;
                  cursor: move;
                  z-index: 2;
                  border-radius: 4px;
                " />
              <v-img
                v-if="portrait"
                height="100%"
                width="60px"
                cover
                :src="portrait"
                :style="destroyed ? 'opacity: 0.6' : ''" />
              <v-avatar
                v-else
                flat
                tile
                :size="collapsed ? 45 : 60"
                style="height: 100%"
                :style="destroyed ? 'opacity: 0.6' : ''"
                class="bg-panel">
                <v-icon :icon="icon || 'mdi-cube'" :size="collapsed ? 45 : 60" />
              </v-avatar>
              <div
                v-if="destroyed"
                style="
                  position: absolute;
                  top: 15%;
                  right: 15%;
                  left: 15%;
                  bottom: 15%;
                  z-index: 1;
                ">
                <v-icon icon="cc:destroyed_outline" size="100%" />
              </div>
            </v-col>
            <v-col v-if="!collapsed" class="mx-1">
              <slot />

              <div style="font-size: 16px" v-if="!destroyed && !reinforcementTurn">
                <v-row dense justify="space-between" align="center" class="pl-2 pr-6">
                  <v-col
                    cols="auto"
                    v-for="stat in actor.StatController.GetStatCollection([
                      'hp',
                      'stress',
                      'heatcap',
                      'structure',
                      'repairCapacity',
                    ])">
                    <v-tooltip :text="stat.title" location="top" open-delay="400">
                      <template #activator="{ props }">
                        <v-icon v-bind="props" size="18" class="mx-1 mt-n1" :icon="stat.icon" />
                        <b class="text-accent">{{ actor.StatController.CurrentStats[stat.key] }}</b>
                        <span class="text-disabled text-caption">
                          /{{ actor.StatController.MaxStats[stat.key] }}
                        </span>
                      </template>
                    </v-tooltip>
                  </v-col>
                </v-row>
                <v-divider class="my-1" />
                <v-row dense justify="space-between" align="center" class="pl-2 pr-6">
                  <v-col
                    cols="auto"
                    v-for="stat in actor.StatController.GetStatCollection([
                      'armor',
                      'evasion',
                      'edef',
                      'saveTarget',
                    ])">
                    <v-tooltip :text="stat.title" location="top" open-delay="400">
                      <template #activator="{ props }">
                        <v-icon v-bind="props" size="18" class="mx-1 mt-n1" :icon="stat.icon" />
                        <b class="text-secondary">
                          {{ actor.StatController.CurrentStats[stat.key] }}
                        </b>
                      </template>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </div>

              <div v-else-if="!destroyed && reinforcementTurn">
                <v-card flat tile class="text-center text-cc-overline mt-1">
                  <span v-if="timeToDeploy > 1" class="fade-select">
                    Deploys on Turn {{ reinforcementTurn }}
                  </span>
                  <div
                    v-else-if="timeToDeploy === 1"
                    class="bg-background pa-1 font-weight-bold text-accent">
                    Deploys Next Turn
                  </div>
                </v-card>
                <div class="d-flex justify-end">
                  <cc-button
                    v-if="timeToDeploy < 1"
                    block
                    color="success"
                    size="x-small"
                    class="success-pulse mb-1"
                    prepend-icon="mdi-arrow-right-bold-box-outline"
                    @click="$emit('activate', combatant)">
                    Ready to Deploy
                  </cc-button>
                </div>
              </div>

              <v-row
                v-if="actor.CombatController.DamageStatuses.length > 0"
                style="line-height: 0"
                no-gutters
                justify="center"
                class="text-center my-1">
                <v-tooltip v-for="damage in actor.CombatController.DamageStatuses" location="top">
                  <template #activator="{ props }">
                    <v-icon
                      v-bind="props"
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

              <v-card
                v-if="destroyed"
                height="16"
                flat
                tile
                class="bg-stripes text-cc-overline text-center mt-1">
                <v-chip style="height: 16px" flat tile variant="elevated" class="px-1">
                  <div class="text-red" style="margin-top: 2px">
                    <v-icon icon="cc:destroyed" />
                    DESTROYED
                  </div>
                </v-chip>
              </v-card>

              <v-card
                v-else-if="actor.CombatController.IsInDangerZone"
                height="16"
                flat
                tile
                class="bg-stripes-dangerzone text-cc-overline text-center mt-1">
                <v-chip style="height: 16px" flat tile variant="elevated" class="px-1">
                  <div class="text-red" style="margin-top: 2px">
                    <v-icon icon="cc:heat" />
                    Danger Zone
                  </div>
                </v-chip>
              </v-card>

              <v-row
                v-if="actor.CombatController.CustomDamageStatuses.length > 0"
                style="line-height: 0"
                no-gutters
                justify="center"
                class="text-center my-1">
                <v-card
                  v-for="damage in actor.CombatController.CustomDamageStatuses"
                  flat
                  tile
                  style="border-bottom-right-radius: 5px !important"
                  class="px-2 ma-1"
                  :class="damageClass(damage)">
                  <span class="text-cc-overline">{{ damage.condition }} to {{ damage.type }}</span>
                </v-card>
              </v-row>

              <v-row no-gutters class="text-center">
                <v-col v-if="actor.CombatController.Braced">
                  <v-card flat tile class="px-2 ma-1">
                    <span class="text-cc-overline">BRACED</span>
                  </v-card>
                </v-col>

                <v-col v-if="actor.CombatController.Overwatch">
                  <v-card flat tile class="px-2 ma-1">
                    <span class="text-cc-overline">Overwatch</span>
                  </v-card>
                </v-col>

                <v-col v-if="actor.CombatController.Prepared">
                  <v-card flat tile class="px-2 ma-1">
                    <span class="text-cc-overline">Prepared</span>
                  </v-card>
                </v-col>
              </v-row>

              <div v-for="status in specialStatuses">
                <v-progress-linear model-value="100" height="16" color="orange" striped>
                  <v-chip class="text-cc-overline bg-deep-orange-darken-3" flat tile>
                    <cc-slashes />
                    {{ status }}
                    <cc-slashes />
                  </v-chip>
                </v-progress-linear>
              </div>

              <div v-for="status in actor.CombatController.Statuses" class="mb-1">
                <v-progress-linear model-value="100" height="16" color="red-darken-3">
                  <v-chip class="text-cc-overline" flat tile>
                    <cc-slashes />
                    <v-icon :icon="status.status.Icon" class="mx-2" />
                    <span class="pr-2">{{ status.status.Name }}</span>
                    <cc-slashes />
                  </v-chip>
                </v-progress-linear>
              </div>
            </v-col>
            <v-col
              v-if="!collapsed && !reinforcementTurn"
              class="d-flex align-center"
              style="padding-left: 2px; padding-right: 2px"
              :class="
                destroyed ? 'bg-background' : activations > 0 ? 'bg-success-darken-2' : 'bg-grey'
              "
              cols="auto">
              <div>
                <v-tooltip location="bottom" open-delay="400">
                  <template #activator="{ props }">
                    <v-icon v-if="destroyed" icon="mdi-cancel" size="20" />
                    <v-icon v-else-if="!activations" icon="cc:activate" size="20" />
                    <v-icon
                      v-else
                      v-bind="props"
                      v-for="n in activations"
                      icon="cc:activate"
                      size="20"
                      class="d-block" />
                  </template>
                  <span class="text-cc-overline">
                    {{ activations }} Activations remaining this round
                  </span>
                </v-tooltip>
              </div>
            </v-col>
          </v-row>
          <deployable-list-item
            v-for="d in deployed"
            :deployable="d"
            :parent="actor"
            :collapsed="collapsed"
            :key="d.ID"
            @click.stop="$emit('deployable-click', d)">
            {{ d.Name }}
          </deployable-list-item>
          <div v-if="collapsed" :class="`bg-${side}`" style="height: 4px" />
        </v-card>
      </template>
    </v-hover>
  </div>
</template>

<script>
import DeployableListItem from './DeployableListItem.vue';

export default {
  name: 'RunnerListItemBase',
  components: {
    DeployableListItem,
  },
  props: {
    selected: {
      type: Boolean,
      default: false,
    },
    collapsed: {
      type: Boolean,
      default: false,
    },
    side: {
      type: String,
      default: 'neutral',
    },
    icon: {
      type: String,
      default: 'mdi-cube',
    },
    activations: {
      type: Number,
      default: 0,
    },
    portrait: {
      type: String,
      default: '',
    },
    statuses: {
      type: Array,
      default: () => [],
    },
    actor: {
      type: Object,
      required: true,
    },
    deployed: {
      type: Array,
      default: () => [],
    },
    reinforcementTurn: {
      type: Number,
      default: 0,
    },
    round: {
      type: Number,
      default: 1,
    },
    noDrag: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['click', 'deployable-click'],
  computed: {
    activations() {
      return this.actor.StatController.CurrentStats['activations'] || 0;
    },
    destroyed() {
      return this.actor.CombatController.IsDestroyed;
    },
    specialStatuses() {
      return this.actor.CombatController.SpecialStatuses || [];
    },
    timeToDeploy() {
      return this.reinforcementTurn - this.round;
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
.border-fade {
  transition: all 0.2s ease-in-out;
}

.bg-stripes {
  background: repeating-linear-gradient(
    -45deg,
    rgba(249, 219, 78, 0.5),
    rgba(249, 219, 78, 0.5) 10px,
    rgba(100, 100, 100, 0.5) 10px,
    rgba(100, 100, 100, 0.5) 20px
  );
}

.bg-stripes-dangerzone {
  background: repeating-linear-gradient(
    -45deg,
    rgba(255, 23, 68, 1),
    rgba(255, 23, 68, 1) 10px,
    rgba(255, 112, 67, 0.5) 10px,
    rgba(255, 112, 67, 0.5) 20px
  );
}

.success-pulse {
  animation: success-pulse 2.8s infinite;
}

@keyframes success-pulse {
  0% {
    box-shadow: 0 0 0 0px rgb(var(--v-theme-success));
    border-radius: 0px;
  }
  100% {
    box-shadow: 0 0 0 8px rgba(0, 0, 0, 0);
    border-radius: 1px;
  }
}
</style>
