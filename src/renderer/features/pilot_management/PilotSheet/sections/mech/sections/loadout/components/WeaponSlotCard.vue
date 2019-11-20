<template>
  <v-col>
    <div style="height: 100%">
      <v-card flat tile class="clipped-large grey lighten-3" style="height: 100%">
        <v-card-title class="pilot white--text py-0 heading h3" style="height: 28px">
          <span v-if="weaponSlot.Weapon">
            <equipment-options :item="weaponSlot.Weapon" />
            <span v-if="!weaponSlot.Weapon.IsDestroyed" class="ml-n2">
              {{ weaponSlot.Weapon.Size }} {{ weaponSlot.Weapon.Type }}
            </span>
            <span v-else class="py-1 error" style="letter-spacing: 3px">
              &emsp;/ / EQUIPMENT DESTROYED / /&emsp;
            </span>
          </span>
          <span v-else>{{ weaponSlot.Size }} Weapon</span>
          <v-spacer />
          <div class="text-right">
            <v-btn v-if="item" icon dark @click="remove()">
              <v-icon class="fadeSelect">delete</v-icon>
            </v-btn>
            <v-btn icon dark @click="$refs.selectorDialog.show()">
              <v-icon class="fadeSelect" v-html="item ? 'mdi-swap-vertical-variant' : 'add'" />
            </v-btn>
          </div>
        </v-card-title>
        <v-card-text
          :id="item ? 'underline-parent' : ''"
          class="`px-2 py-1 text-center`"
          style="height: calc(100% - 28px)"
        >
          <div class="underline-slide" style="height: 100%">
            <div
              v-if="item"
              class="text-left"
              style="cursor: pointer!important"
              @click="$refs.detailDialog.show()"
            >
              <v-row no-gutters align="center">
                <v-col cols="auto">
                  <span class="h2 heading text--text" style="line-height: 35px">
                    <span v-if="!item.IsDestroyed">{{ item.Name }}</span>
                    <span v-else class="error--text" style="text-decoration: line-through;">
                      {{ item.Name }}
                    </span>
                    <cc-tooltip v-if="item.BaseSP" simple inline :content="`${item.BaseSP} SP`">
                      <v-icon
                        v-for="n in item.BaseSP"
                        :key="`sp_${item.ID}-${n}`"
                        :color="color"
                        size="16"
                        class="ml-n1"
                      >
                        mdi-flash
                      </v-icon>
                    </cc-tooltip>
                    <cc-tooltip
                      v-if="item.Note"
                      :key="item.Note.length"
                      simple
                      inline
                      :content="item.Note"
                    >
                      <v-icon small color="active">mdi-note</v-icon>
                    </cc-tooltip>
                  </span>
                </v-col>
                <v-col cols="auto" class="ml-auto">
                  <v-btn
                    outlined
                    small
                    :color="item.Mod ? color : 'grey darken-2'"
                    @click.stop="$refs.modDialog.show()"
                  >
                    <v-icon :color="item.Mod ? color : ''" :left="!item.Mod">cci-weaponmod</v-icon>
                    <span v-if="!item.Mod">NO MOD INSTALLED</span>
                  </v-btn>
                </v-col>
              </v-row>
              <v-row v-if="item.Effect">
                <p class="flavor-text px-2 mx-2 py-0 mb-0" v-html="item.Effect" />
              </v-row>
              <v-row v-if="item.Mod">
                <mod-inset :mod="item.Mod" @remove-mod="item.Mod = null" />
              </v-row>
              <v-row no-gutters align="center" class="ml-2 mr-6">
                <v-col cols="auto">
                  <v-row>
                    <cc-range-element small :range="item.Range" />
                    <v-divider vertical class="ml-2" />
                    <cc-damage-element small :damage="item.Damage" />
                  </v-row>
                </v-col>
                <v-col cols="auto" class="ml-auto">&nbsp;</v-col>
                <v-col cols="auto">
                  <cc-tags small :tags="item.Tags" :color="color" />
                </v-col>
                <v-col v-if="item.Mod" cols="auto" class="ml-6">
                  <cc-tags small :tags="item.Mod.AddedTags" color="mod" />
                </v-col>
              </v-row>
              <v-row v-if="item.notes">
                <v-col v-for="(n, i) in item.notes" :key="`${item.Name}_n${i}`">
                  <cc-tooltip simple inline :content="n">
                    <v-icon small color="active">mdi-note</v-icon>
                  </cc-tooltip>
                </v-col>
              </v-row>
            </div>
            <div
              v-else
              class="py-3 text-center fadeSelect"
              style="cursor: pointer; height: 100%"
              @click="$refs.selectorDialog.show()"
            >
              <v-row style="height: 100%">
                <span class="heading h2 grey--text my-auto" style="width: 100%; ">// EMPTY //</span>
              </v-row>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>
    <cc-solo-dialog
      ref="selectorDialog"
      no-confirm
      :title="`${item ? 'Modify' : 'Equip'} ${weaponSlot.Size} Weapon Mount`"
      fullscreen
      no-pad
    >
      <weapon-selector :weapon-slot="weaponSlot" :mech="mech" @equip="equip($event)" />
    </cc-solo-dialog>
    <cc-solo-dialog
      v-if="item"
      ref="modDialog"
      no-confirm
      :title="`${item.Mod ? 'Modify' : 'Install'} ${item.Name} Modification`"
      fullscreen
      no-pad
    >
      <mod-selector :weapon="item" :mech="mech" @install="install($event)" />
    </cc-solo-dialog>
    <cc-solo-dialog ref="detailDialog" no-confirm :title="item ? item.Name : ''" large>
      <cc-item-card :item="item" />
      <slot name="detail" />
      <div v-if="item">
        <v-textarea
          v-model="item.Note"
          outlined
          auto-grow
          rows="2"
          filled
          prepend-icon="mdi-note"
          label="Equipment Notes"
        />
      </div>
    </cc-solo-dialog>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'
import WeaponSelector from './WeaponSelector.vue'
import ModSelector from './ModSelector.vue'
import ModInset from './ModInset.vue'
import EquipmentOptions from './EquipmentOptions.vue'
import { MechWeapon, WeaponMod } from '@/class'

export default Vue.extend({
  name: 'weapon-slot-card',
  components: { WeaponSelector, ModSelector, ModInset, EquipmentOptions },
  props: {
    weaponSlot: {
      type: Object,
      required: true,
    },
    mech: {
      type: Object,
      required: true,
    },
  },
  computed: {
    item() {
      return this.weaponSlot.Weapon
    },
    color() {
      return this.mech.Frame.Manufacturer.Color
    },
  },
  methods: {
    equip(item: MechWeapon) {
      this.weaponSlot.EquipWeapon(item, this.mech.Pilot)
      this.$refs.selectorDialog.hide()
    },
    install(mod: WeaponMod) {
      this.weaponSlot.Weapon.Mod = mod
      this.$refs.modDialog.hide()
    },
    uninstall() {
      this.weaponSlot.Weapon.Mod = null
    },
    remove() {
      this.weaponSlot.UnequipWeapon()
    },
  },
})
</script>

<style scoped>
#underline-parent {
  background-color: #e0e0e0;
  transition: background-color 0.4s ease-in-out;
}

#underline-parent:hover {
  background-color: #eeeeee;
}

.underline-slide::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  z-index: 10;
  background-color: var(--v-grey-base);
  transform-origin: bottom left;
  transform: scaleX(0);
  transition: transform 0.4s ease;
}

#underline-parent:hover > .underline-slide::before {
  transform-origin: bottom left;
  transform: scaleX(1);
}
</style>
