<template>
  <cc-dialog :color="available ? displayColor : 'panel'"
    :icon="displayIcon"
    :title="action.Name"
    :close-on-click="false"
    :min-width="minWidth"
    max-width="80vw">
    <template #activator="{ open }">
      <v-btn block
        flat
        tile
        :size="mobile ? 'x-small' : 'small'"
        height="28"
        :color="available ? displayColor : 'panel'"
        @click="open">
        <span class="ml-1">
          <v-icon :icon="displayIcon"
            :color="available ? '' : 'error'"
            start />
          <v-tooltip v-if="!available"
            location="top">
            <template #activator="{ props }">
              <v-icon v-bind="props"
                icon="mdi-exclamation-thick"
                color="error"
                class="ml-n2" />
            </template>
            <div class="text-center text-cc-overline">Cannot activate</div>
            <v-divider class="my-1" />
            <div v-if="!canActivate">
              <div v-if="!canUse">This action has already been used this turn.</div>
              <div v-else>
                Insufficient
                <v-chip :color="displayColor"
                  size="small"
                  variant="elevated"
                  :prepend-icon="displayIcon || ''">
                  {{ action.Activation }}
                </v-chip>
                actions remaining this turn.
              </div>
            </div>
            <div v-else-if="!canUse">This action has already been used this turn.</div>
          </v-tooltip>
        </span>
        <v-tooltip location="top"
          width="300">
          <template #activator="{ props }">
            <span v-bind="props">
              {{ action.Name }}
            </span>
          </template>
          <div class="d-flex">
            <div class="heading h4 d-flex">{{ action.Name }}</div>
            <v-spacer />
            <v-chip size="x-small"
              :color="displayColor"
              :prepend-icon="displayIcon"
              variant="elevated"
              elevation="0">
              {{ action.Activation }} Action
            </v-chip>
          </div>
          <v-divider class="my-1" />
          {{ action.Terse }}
        </v-tooltip>
      </v-btn>
    </template>
    <template #default="{ close }">
      <slot :close="close" />
    </template>
  </cc-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  action: object
  owner: object
  encounter: object
  presetWeapon?: object
  mobile?: boolean
  actionColor?: string
  actionIcon?: string
  minWidth?: string
}>(), {
  presetWeapon: undefined,
  mobile: false,
  actionColor: null,
  actionIcon: null,
  minWidth: '70vw'
})

const displayColor = computed(() => {
      return props.actionColor ?? props.action.Color;
    })
const displayIcon = computed(() => {
      return props.actionIcon ?? props.action.Icon;
    })
const controller = computed(() => {
      return props.owner.actor.CombatController.ActiveActor.CombatController;
    })
const canActivate = computed(() => {
      return controller.value.CanActivate(props.action.Activation);
    })
const canUse = computed(() => {
      if (props.presetWeapon) {
        return !controller.value.IsActionUsed(props.presetWeapon.InstanceID);
      }
      return !controller.value.IsActionUsed(props.action.ID);
    })
const available = computed(() => {
      return canActivate.value && canUse.value;
    })
</script>
