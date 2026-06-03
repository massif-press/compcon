<template>
  <slot-card-base ref="base"
    :item="item"
    :mech="mech"
    :color="color"
    :empty="!item"
    :weapon="true"
    :extended="mobile">
    <template #header>
      <v-row v-if="item"
        align="center"
        no-gutters
        style="line-height: 18px;">
        <v-col cols="auto"
          class="mr-2">
          <equipment-options v-if="!readonly"
            :item="item"
            @update="save()" />
          <cc-broken-reference v-if="item"
            :item="item" />
        </v-col>
        <v-col>
          {{ item.Name }}
          <div v-if="!mobile"
            class="text-cc-overline text-disabled ">
            {{ item.WeaponType }}
            {{ item.Size }}
            {{ item.WeaponTypes.join('/') }}
          </div>
        </v-col>
      </v-row>
      <div v-else
        class="px-2">
        {{ weaponSlot.Size }} Weapon
      </div>
    </template>

    <template v-if="!mobile && item"
      #header-items>
      <weapon-slot-toolbar-items :item="item"
        :range="getRange"
        :damage="getDamage"
        :readonly="readonly"
        @remove="remove()"
        @swap="($refs as any).base.selectorDialog = true" />
    </template>

    <template v-else-if="item"
      #extension>
      <weapon-slot-toolbar-items :item="item"
        :range="getRange"
        :damage="getDamage"
        :readonly="readonly"
        @remove="remove()"
        @swap="($refs as any).base.selectorDialog = true" />
    </template>

    <div v-if="item"
      class="pt-1">
      <equipment-header :item="item"
        :readonly="readonly"
        :color="color"
        :use-bonus="mech.LimitedBonus">
        <template #left>
          <div v-if="!readonly && !intWeapon && !mod && !item.NoMods">
            <cc-button variant="outlined"
              size="x-small"
              color="accent"
              prepend-icon="cc:weaponmod"
              @click.stop="modDialog = true">
              NO MOD INSTALLED
            </cc-button>
          </div>
        </template>
      </equipment-header>
      <div>
        <div v-if="isEngineerWeapon"
          class="mb-1">
          <eng-weapon-settings :item="item"
            :mech="mech"
            :readonly="readonly" />
        </div>

        <div v-if="item.Profiles && item.Profiles.length > 1">
          <v-chip-group v-model="item.ProfileIndex"
            mandatory
            column>
            <v-chip v-for="(p, i) in item.Profiles"
              :key="`pprof_${p.Name}`"
              :value="i"
              size="small"
              filter>
              {{ p.Name }}
            </v-chip>
          </v-chip-group>
          <div>
            <div v-if="item.Profiles[item.ProfileIndex].Effect"
              class="panel clipped pa-2">
              <v-row dense
                align="end">
                <v-col cols="auto">
                  <v-icon size="large"
                    icon="cc:weapon" />
                </v-col>
                <v-col>
                  <div class="heading">{{ item.Profiles[item.ProfileIndex].Name }}</div>
                </v-col>
              </v-row>
              <p v-html-safe="item.Profiles[item.ProfileIndex].Effect"
                class="px-2" />
            </div>
          </div>

          <div v-if="item.Profiles[item.ProfileIndex].Actions.length">
            <div class="text-cc-overline text-disabled">//PROFILE ACTIONS</div>
            <v-row no-gutters
              justify="center">
              <v-col v-for="(a, i) in item.Profiles[item.ProfileIndex].Actions"
                :key="`dprof_${i}`"
                cols="auto">
                <cc-action :action="a"
                  :panel="$vuetify.display.lgAndUp"
                  class="ma-2" />
              </v-col>
            </v-row>
          </div>

          <div v-if="item.Profiles[item.ProfileIndex].Deployables.length">
            <div class="text-cc-overline text-disabled">//PROFILE DEPLOYABLES</div>
            <v-row no-gutters
              justify="center">
              <v-col v-for="(d, i) in item.Profiles[item.ProfileIndex].Deployables"
                :key="`ddep_${i}`"
                cols="auto">
                <cc-deployable-info :deployable="d"
                  :panel="$vuetify.display.lgAndUp"
                  :owner="mech"
                  :name-override="item.Name"
                  class="ma-2" />
              </v-col>
            </v-row>
          </div>
          <div v-if="item.Profiles[item.ProfileIndex].Tags.length">
            <div class="text-cc-overline mb-n1 text-disabled">//PROFILE TAGS</div>
            <cc-tags :tags="item.Profiles[item.ProfileIndex].Tags"
              extended />
          </div>
          <on-element v-for="action in ['hit', 'crit', 'attack']"
            :key="`on_${item.ProfileIndex}_${action}`"
            :profile="item.Profiles[item.ProfileIndex]"
            :action="action" />
        </div>
        <div v-else>
          <on-element v-for="action in ['hit', 'crit', 'attack']"
            :key="`on_${action}`"
            :profile="item.Profiles[0]"
            :action="action" />
        </div>
      </div>
      <div v-if="mod">
        <mod-inset :mod="mod"
          :mech="mech"
          :color="color"
          @remove-mod="uninstall()" />
      </div>
    </div>
    <template #selector>
      <weapon-selector :weapon-slot="weaponSlot"
        :mech="mech"
        @equip="equip($event)" />
    </template>
  </slot-card-base>
  <sh-lock-dialog v-model="lockDialog"
    :mount="mount"
    :mech="mech"
    @select="finalizeSuperheavy($event)" />

  <cc-modal v-if="item"
    v-model="modDialog"
    :title="`${mod ? 'Modify' : 'Install'} ${item.Name} Modification`"
    clip
    icon="cc:weaponmod">
    <mod-selector :weapon="item"
      :mech="mech"
      @equip="install($event)" />
  </cc-modal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import SlotCardBase from '../../_SlotCardBase.vue'
import WeaponSelector from './_WeaponSelector.vue'
import ModSelector from './_ModSelector.vue'
import ModInset from './_ModInset.vue'
import EquipmentOptions from '../../_EquipmentOptions.vue'
import EquipmentHeader from '../../_EquipmentHeader.vue'
import ShLockDialog from '../_ShLockDialog.vue'
import OnElement from '@/ui/components/cards/items/_components/OnElement.vue'
import WeaponSlotToolbarItems from './_WeaponSlotToolbarItems.vue'
import { MechWeapon } from '@/classes/mech/components/equipment/MechWeapon'
import { WeaponMod } from '@/classes/mech/components/equipment/WeaponMod'
import { WeaponSize } from '@/classes/enums'
import EquippableMount from '@/classes/mech/components/mount/EquippableMount'
import WeaponSlot from '@/classes/mech/components/mount/WeaponSlot'
import { Range } from '@/classes/Range'
import { Damage } from '@/classes/Damage'
import { Mech } from '@/classes/mech/Mech'
import EngWeaponSettings from './_EngWeaponSettings.vue'
import { useDisplay } from 'vuetify'

const { smAndDown: mobile, xs: portrait } = useDisplay()

const props = defineProps<{
  weaponSlot: WeaponSlot
  mech: Mech
  mount: object
  readonly?: boolean
  intWeapon?: boolean
}>()

const base = ref<any>(null)

const stagedSH = ref(null as MechWeapon | null)
const modDialog = ref(false)
const lockDialog = ref(false)

const isEngineerWeapon = computed(() => {
      return item.value && item.value.ID.includes('mw_prototype_')
    })
const item = computed(() => {
      return props.weaponSlot.Weapon
    })
const mod = computed(() => {
      return item.value.Mod
    })
const color = computed(() => {
      return props.mech.Frame.ManufacturerColor;
    })
const getRange = computed(() => {
      if (!item.value) return []
      return Range.CalculateRange(item.value, props.mech as Mech)
    })
const getDamage = computed(() => {
      if (!item.value) return []
      return Damage.CalculateDamage(item.value, props.mech as Mech)
    })

function equip(item: MechWeapon) {
      ; (base.value as any).selectorDialog = false
      if (item.Size === WeaponSize.Superheavy) {
        equipSuperheavy(item)
      } else {
        if (item.value && item.value.Size === WeaponSize.Superheavy)
          props.mech.MechLoadoutController.ActiveLoadout.UnequipSuperheavy()
        props.weaponSlot.EquipWeapon(item, props.mech.Pilot)
      }
    }
function equipSuperheavy(item: MechWeapon) {
      stagedSH.value = item
      lockDialog.value = true
    }
function finalizeSuperheavy(lockTarget: EquippableMount) {
      if (item.value && item.value.Size === WeaponSize.Superheavy)
        props.mech.MechLoadoutController.ActiveLoadout.UnequipSuperheavy()
      lockTarget.Lock(props.mount as EquippableMount)
      props.weaponSlot.EquipWeapon(stagedSH.value, props.mech.Pilot)
      lockDialog.value = false
      stagedSH.value = null
    }
function install(mod: WeaponMod) {
      item.value.Mod = mod
      modDialog.value = false
      props.mech.Pilot.SaveController.save()
    }
function uninstall() {
      item.value.Mod = null
    }
function remove() {
      if (item.value.Size === WeaponSize.Superheavy) {
        props.mech.MechLoadoutController.ActiveLoadout.UnequipSuperheavy()
      }
      props.weaponSlot.UnequipWeapon()
    }
function save() {
      props.mech.Parent.SaveController.save();
    }
</script>
