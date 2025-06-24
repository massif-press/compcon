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
                v-if="!collapsed"
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
              <v-img v-if="portrait" height="100%" width="60px" cover :src="portrait" />
              <v-avatar
                v-else
                flat
                tile
                :size="collapsed ? 45 : 60"
                style="height: 100%"
                class="bg-panel">
                <v-icon :icon="icon || 'mdi-cube'" :size="collapsed ? 45 : 60" />
              </v-avatar>
            </v-col>
            <v-col v-if="!collapsed" class="mx-1">
              <slot />

              <div style="font-size: 16px">
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
              v-if="!collapsed"
              class="d-flex align-center"
              style="padding-left: 2px; padding-right: 2px"
              :class="activations > 0 ? 'bg-success-darken-2' : 'bg-grey'"
              cols="auto">
              <div>
                <v-tooltip location="bottom" open-delay="400">
                  <template #activator="{ props }">
                    <v-icon v-if="!activations" icon="cc:activate" size="20" />
                    <v-icon
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
          <div v-if="collapsed" :class="`bg-${side}`" style="height: 4px" />
        </v-card>
      </template>
    </v-hover>
  </div>
</template>

<script>
export default {
  name: 'RunnerListItemBase',
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
    specialStatuses: {
      type: Array,
      default: () => [],
    },
    actor: {
      type: Object,
      required: true,
    },
  },
  emits: ['click'],
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
</style>
