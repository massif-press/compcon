<template>
  <div>
    <div class="text-cc-overline text-disabled">Statuses / Conditions</div>
    <v-row dense>
      <v-col v-for="status in applicableStatuses.filter((x) => x.StatusType === 'Status')"
        :key="`${isPilot}_${status.ID}`">
        <status-condition-item :status="status"
          :active="controller.Statuses.some((s) => s.status.ID === status.ID)"
          @click="setStatus(status)" />
      </v-col>
    </v-row>

    <v-row dense>
      <v-col v-for="status in applicableStatuses.filter((x) => x.StatusType === 'Condition')"
        :key="`${isPilot}_${status.ID}`">
        <status-condition-item :status="status"
          :active="controller.Statuses.some((s) => s.status.ID === status.ID)"
          :applied-detail="appliedStatus(status)"
          @click="setStatus(status)" />
      </v-col>
    </v-row>

    <v-scroll-y-reverse-transition>
      <div v-if="special.length"
        class="my-1">
        <v-card v-for="cs in special"
          :key="cs.ID"
          flat
          tile
          border
          style="border-color: rgb(var(--v-theme-exotic))">
          <div class="heading h3 bg-exotic px-2 py-1">
            <v-icon icon="mdi-star-four-points-circle-outline" />
            {{ cs.status.Attribute }}
          </div>
          <v-row no-gutters
            align="center">
            <v-col>
              <div class="text-cc-overline pl-4 py-1">
                {{ cs.status.Detail }}
              </div>
            </v-col>
            <v-col cols="auto">
              <v-btn flat
                tile
                size="x-small"
                @click="controller.RemoveCustomStatus(cs.status.Attribute)">
                <v-icon icon="mdi-close"
                  size="22" />
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </div>
    </v-scroll-y-reverse-transition>

    <div class="top-element">
      <v-row no-gutters
        justify="end">
        <v-col cols="auto">
          <v-menu :close-on-content-click="false"
            offset-y>
            <template #activator="{ props }">
              <v-btn v-bind="props"
                size="x-small"
                color="exotic"
                class="mt-1"
                flat
                tile
                block
                prepend-icon="mdi-plus">
                Add Custom Status
              </v-btn>
            </template>

            <v-card>
              <v-card-text>
                <v-text-field v-model="customStatus"
                  label="Custom Status Name"
                  variant="outlined"
                  dense
                  hide-details />
                <v-btn flat
                  tile
                  color="primary"
                  class="mt-2"
                  @click="addCustomStatus(customStatus)">
                  Add Custom Status
                </v-btn>
              </v-card-text>
            </v-card>
          </v-menu>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import * as _ from 'lodash-es'
import { CompendiumStore } from '@/stores'
import { useMobile } from '@/composables/useMobile'
import StatusConditionItem from './StatusConditionItem.vue'

defineOptions({ name: 'StatusConditionSelector' })

const props = defineProps<{
  controller: object
  encounter: object
  owner?: object
}>()

const { mobile, portrait } = useMobile()

const customStatus = ref('')
const customInflict = ref('')
const statusesToInflict = ref<string[]>([])
const selectedTargets = ref<any[]>([])

const isPilot = computed(() => (props.controller as any).Parent.ItemType === 'Pilot')

const statuses = computed(() => _.orderBy(CompendiumStore().Statuses, 'StatusType'))

const applicableStatuses = computed(() => {
  let exclude: string[] = []
  if (isPilot.value) {
    exclude = [`dangerzone`, 'shut-down']
  } else exclude = [`dangerzone`, `downandout`]
  return statuses.value.filter((s: any) => !exclude.includes(s.ID))
})

const special = computed(() => (props.controller as any).CustomStatuses)

const targets = computed(() => {
  const target = (self as any).side === 'enemy' ? 'ally' : 'enemy'
  const owner = props.owner as any
  return [...(props.encounter as any).Combatants]
    .filter((c) =>
      !owner || c.actor.CombatController.ActiveActor.ID !== owner.CombatController.ActiveActor.ID
    )
    .sort((a, b) => {
      if (a.side === target && b.side !== target) return -1
      if (a.side !== target && b.side === target) return 1
      return a.actor.CombatController.CombatName.localeCompare(b.actor.CombatController.CombatName)
    })
})

const filteredTargets = computed(() => targets.value.filter((t) => !selectedTargets.value.includes(t)))

function setStatus(status: any) {
  ;(props.controller as any).ToggleStatus(status, undefined, true)
}

function addCustomStatus(name: string) {
  if (!name || !name.trim().length) return
  ;(props.controller as any).SetCustomStatus({ Attribute: name.trim() })
  customStatus.value = ''
}

function setInflictStatus(status: any) {
  const idx = statusesToInflict.value.indexOf(status.ID)
  if (idx >= -1) {
    statusesToInflict.value.splice(idx, 1)
  } else {
    statusesToInflict.value.push(status.ID)
  }
}

function appliedStatus(status: any) {
  const applied = (props.controller as any).Statuses.find((s: any) => s.status.ID === status.ID)
  if (!applied || applied.expires) return null
  return applied.expires?.Text || ''
}
</script>

<style scoped>
::v-deep(.short .v-field__input) {
  min-height: 28px !important;
  padding: 4px !important;
  padding-left: 8px !important;
}

::v-deep(.short .v-field) {
  height: 28px !important;
}
</style>
