<template>
  <combat-action-button
    :action="action"
    :owner="owner"
    :encounter="encounter"
    :preset-weapon="presetWeapon"
    :mobile="mobile">
    <template #default="{ close }">

      <cc-synergy-display location="attack"
        :mech="controller.Parent"
        alert />

      <div v-for="(selectedWeapon, idx) in selectedWeapons"
        :key="selectedWeapon ? selectedWeapon.InstanceID : `empty-${idx}`">
        <div v-if="!selectedWeapon"
          class="text-cc-overline text-disabled pl-3 py-2">
          select barrage weapon
        </div>
        <v-row dense
          align="center"
          class="bg-panel heading h3 pb-1 px-3">
          <v-divider v-if="presetWeapon"
            class="my-1 " />
          <v-col v-if="!presetWeapon || idx > 0">
            <cc-select v-model="selectedWeapons[idx]"
              :items="barrageWeapons"
              bg-color="background"
              color="primary"
              return-object
              item-title="Name"
              @update:model-value="setSelected(idx, $event)" />

          </v-col>
          <v-col v-else-if="selectedWeapon">
            <v-icon icon="cc:weapon"
              class="ml-4 mt-n1" />
            {{ selectedWeapon.Name }}
          </v-col>
          <v-col v-if="selectedWeapon"
            cols="auto">
            <cc-tags :tags="selectedWeapon.Tags" />
          </v-col>
          <v-col v-if="selectedWeapon?.Mod"
            cols="auto">
            <cc-tags :tags="selectedWeapon.Mod!.AddedTags"
              color="mod" />
          </v-col>
          <v-col v-if="selectedWeapon"
            cols="auto">
            <v-menu open-on-hover
              max-width="600px">
              <template #activator="{ props }">
                <v-icon icon="mdi-information-outline"
                  v-bind="props" />
              </template>
              <v-card class="pt-2 pb-4 px-4">
                <cc-item-card :item="selectedWeapon" />
              </v-card>
            </v-menu>
          </v-col>
        </v-row>

        <mech-mount-bonus-card v-for="b in selectedMount(selectedWeapon).Bonuses"
          v-if="selectedMount(selectedWeapon)"
          :key="b.ID"
          expanded
          :bonus="b"
          :owner="owner"
          :mech="owner.actor.CombatController.Parent"
          :encounter="encounter" />

        <div class="px-6">

          <cc-synergy-display v-if="selectedWeapon"
            :item="selectedWeapon"
            location="weapon"
            :mech="controller.Parent"
            alert />

          <mech-weapon-attack v-if="selectedWeapon && events[idx]?.weaponEvent"
            :event="<WeaponAttackEvent>events[idx].weaponEvent"
            :owner="owner"
            :encounter="encounter"
            :profile="<WeaponProfile>events[idx].weaponEvent.Weapon" />

          <div
            v-if="selectedMount(selectedWeapon) && events[idx]?.auxEvents && events[idx]?.auxEvents.length"
            class="mt-4">
            <v-divider class="my-4" />
            <div class="text-cc-overline text-disabled mb-1">
              additional {{ selectedMount(selectedWeapon).Name }} aux weapons
            </div>
            <div v-for="(aux, aidx) in events[idx]?.auxEvents"
              :key="`aux-${aidx}`">
              <v-row dense
                align="center"
                class="bg-panel mb-1 heading">
                <v-col cols="auto">
                  <v-icon icon="cc:weapon"
                    class="ml-4"
                    start />
                </v-col>
                <v-col>
                  {{ aux.Weapon.Name }}
                </v-col>
                <v-col cols="auto">
                  <cc-tags :tags="aux.Weapon.Tags" />
                </v-col>
                <v-col v-if="(aux.Weapon as WeaponProfile).Parent.Mod"
                  cols="auto">
                  <cc-tags :tags="(aux.Weapon as WeaponProfile).Parent.Mod!.AddedTags"
                    color="mod" />
                </v-col>
                <v-col cols="auto">
                  <cc-switch v-model="events[idx].include[aidx]"
                    bg-color="background"
                    :label="`Include`"
                    @update:model-value="setInclude(idx, selectedWeapon as MechWeapon)" />
                </v-col>
              </v-row>
              <v-slide-y-reverse-transition>
                <div v-if="aux && events[idx]?.include[aidx]">
                  <cc-synergy-display :key="aux.Weapon.ID"
                    :item="(aux.Weapon as WeaponProfile).Parent"
                    location="weapon"
                    :mech="controller.Parent"
                    alert />

                  <mech-weapon-attack v-if="selectedWeapon"
                    :event="<WeaponAttackEvent>aux"
                    :owner="owner"
                    :encounter="encounter"
                    :profile="<WeaponProfile>aux.Weapon" />

                </div>
              </v-slide-y-reverse-transition>
            </div>
          </div>

        </div>
      </div>

      <v-slide-y-transition>
        <staged-panel v-if="allEventsStaged"
          :events=eventArray />
      </v-slide-y-transition>

      <v-divider />
      <div class="pa-4">

        <apply-button v-if="events.some(e => e?.weaponEvent)"
          :event="<ActiveEffectEvent[]>events.filter(e => e?.weaponEvent).map(e => e.weaponEvent.BaseEvent)"
          :weapon-event="<WeaponAttackEvent[]>events.filter(e => e?.weaponEvent).map(e => e.weaponEvent)"
          :encounter="encounter"
          :owner="owner"
          :close="close"
          :action="action"
          :action-id="selectedWeapons.filter(Boolean).map(w => w.InstanceID)"
          activation-override="full"
          @reset="reset($event)"
          @apply="apply" />
      </div>

    </template>
  </combat-action-button>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useDisplay } from 'vuetify'
import MenuInput from '@/ui/components/chips/_activeeffect/_ae_menu_input.vue'
import MechMountBonusCard from '../_mechMountBonusCard.vue'
import { MechWeapon } from '@/classes/mech/components/equipment/MechWeapon'
import { CombatantData } from '@/classes/encounter/Encounter'
import { WeaponAttackEvent } from '@/classes/components/feature/active_effects/WeaponAttackEvent'
import { WeaponProfile } from '@/classes/mech/components/equipment/MechWeapon'
import MechWeaponAttack from './_mechWeaponAttack.vue'
import ApplyButton from '@/ui/components/chips/_activeeffect/ApplyButton.vue'
import StagedPanel from './_stagedPanel.vue'
import CombatActionButton from './CombatActionButton.vue'

defineOptions({ name: 'MechBarrageButton' })

const props = defineProps<{
  action: object
  owner: object
  encounter: object
  presetWeapon?: MechWeapon
}>()

const { mdAndDown: mobile } = useDisplay()

const events = ref<{
  weaponEvent: WeaponAttackEvent
  auxes: MechWeapon[]
  auxEvents: WeaponAttackEvent[]
  include: boolean[]
}[]>([])

const selectedWeapons = ref<MechWeapon[]>([])

const controller = computed(() =>
  (props.owner as any).actor.CombatController.ActiveActor.CombatController
)

const barrageWeapons = computed(() => {
  const mech = controller.value.ActiveActor
  if (!mech || !mech.MechLoadoutController) return []
  let arr = mech.MechLoadoutController.ActiveLoadout.Weapons.filter((x: any) => x.Barrage)
  arr = arr.filter((w: any) => !selectedWeapons.value.filter(Boolean).map((x: any) => x.InstanceID).some((y: any) => y === w.InstanceID))
  return arr
})

const eventArray = computed(() => {
  let out: any[] = []
  for (let i = 0; i < selectedWeapons.value.length; i++) {
    const ev = events.value[i]
    if (ev && ev.weaponEvent) {
      out.push(ev.weaponEvent)
      const enabledAuxes = ev.auxEvents.filter((x, idx) => ev.include[idx])
      out = out.concat(enabledAuxes)
    }
  }
  return out
})

const allEventsStaged = computed(() => {
  if (!eventArray.value.length) return false
  return eventArray.value.every((e: any) => e.BaseEvent.Staged)
})

function reset(clearAction = false) {
  if (clearAction) (props.owner as any).CombatController.ClearActionUsed((props.action as any).ID)
  selectedWeapons.value = new Array(2)
  events.value = new Array(2)
  if (!selectedWeapons.value[0] && props.presetWeapon) {
    setSelected(0, props.presetWeapon)
  }
}

function apply() {
  const actor = (props.owner as any).actor.CombatController.ActiveActor.CombatController
  selectedWeapons.value.forEach((w: any) => {
    actor.MarkActionUsed(w.InstanceID)
    if (w.IsLoading) w.Used = true
  })
  reset()
}

function ordnanceWarning(selectedWeapon: any) {
  if (!selectedWeapon) return false
  if (selectedWeapon.ActiveTags.find((t: any) => t.ID.toLowerCase() === 'tg_ordnance')) {
    return (props.owner as any).actor.CombatController.CanActivate('ordnance') === false
  }
  return false
}

function selectedMount(selectedWeapon: any) {
  if (!selectedWeapon) return null
  const aa = (props.owner as any).actor.CombatController.RootActor
  if (!aa.ActiveMech) return null
  return aa.ActiveMech.MechLoadoutController.ActiveLoadout.Mounts.find(
    (m: any) => m.Weapons.some((w: any) => w.InstanceID === selectedWeapon.InstanceID)
  )
}

function setSelected(index: number, weapon: MechWeapon) {
  if (!weapon) return
  const self = (props.encounter as any).Combatants.find(
    (c: CombatantData) => c.actor.CombatController.RootActor.ID === (props.owner as any).actor.CombatController.RootActor.ID
  )
  if (!self) throw new Error('Owner combatant not found in encounter')
  selectedWeapons.value[index] = weapon
  const auxes = selectedMount(weapon)?.Weapons.filter(
    (x: any) => x.InstanceID !== weapon.InstanceID && x.Size.toLowerCase() === 'auxiliary'
  ) ?? []
  const auxEvents = auxes.map((x: any) =>
    new WeaponAttackEvent(x.SelectedProfile as WeaponProfile, props.owner as CombatantData, props.encounter, 'Additional Aux Attack')
  )
  events.value[index] = {
    weaponEvent: new WeaponAttackEvent(weapon.SelectedProfile as WeaponProfile, self, props.encounter, 'Barrage'),
    auxes, auxEvents,
    include: auxEvents.map(() => true),
  }
  if (weapon.Size.toLowerCase() === 'superheavy') {
    selectedWeapons.value = [weapon]
    events.value = [events.value[index]]
  } else if (selectedWeapons.value.length === 1) {
    selectedWeapons.value.push(undefined as any)
    events.value.push(undefined as any)
  }
}

function setInclude(index: number, selectedWeapon: MechWeapon) {
  const self = (props.encounter as any).Combatants.find(
    (c: CombatantData) => c.actor.CombatController.RootActor.ID === (props.owner as any).actor.CombatController.RootActor.ID
  )
  if (!self) throw new Error('Owner combatant not found in encounter')
  const auxes = selectedMount(selectedWeapon)?.Weapons.filter(
    (x: any) => x.InstanceID !== selectedWeapon.InstanceID && x.Size.toLowerCase() === 'auxiliary'
  ) ?? []
  events.value[index].auxEvents = []
  for (let i = 0; i < events.value[index].include.length; i++) {
    events.value[index].auxEvents.push(
      new WeaponAttackEvent(auxes[i].SelectedProfile as WeaponProfile, props.owner as CombatantData, props.encounter, 'Additional Aux Attack')
    )
  }
}

reset()
</script>
