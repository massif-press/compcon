<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.mdAndDown"
    :style="$vuetify.breakpoint.mdAndDown ? `x-overflow: hidden` : ''"
    width="90vw"
    @click:outside="hide"
  >
    <v-card tile class="background">
      <cc-titlebar v-if="overwatch" large color="action--reaction">
        <v-icon x-large>cci-reaction</v-icon>
        Overwatch
        <v-btn slot="items" dark icon @click="hide">
          <v-icon large left>close</v-icon>
        </v-btn>
      </cc-titlebar>
      <cc-titlebar v-else-if="returnFire" large color="action--reaction">
        <v-icon x-large>cci-reaction</v-icon>
        Return Fire
        <v-btn slot="items" dark icon @click="hide">
          <v-icon large left>close</v-icon>
        </v-btn>
      </cc-titlebar>
      <cc-titlebar v-else large color="action--quick">
        <v-icon x-large color="white">mdi-hexagon-slice-3</v-icon>
        Skirmish
        <v-btn slot="items" dark icon @click="hide">
          <v-icon large left>close</v-icon>
        </v-btn>
      </cc-titlebar>

      <v-spacer v-if="$vuetify.breakpoint.mdAndDown" class="titlebar-margin" />

      <v-card-text v-if="item && mount" class="mb-0 pb-2">
        <weapon-attack v-if="overwatch || returnFire"
          ref="main"
          :item="item"
          :mech="mech"
          :mount="mount"
          reaction
          @confirm="confirmAttack($event)"
        >
          <div class="heading h2 mt-3 mb-n3">
            <v-icon x-large class="mt-n2 mr-n1">cci-mech-weapon</v-icon>
            {{ item.Name }}
          </div>
        </weapon-attack>
        <weapon-attack v-else
          ref="main"
          :item="item"
          :mech="mech"
          :mount="mount"
          @confirm="confirmAttack($event)"
        >
          <div class="heading h2 mt-3 mb-n3">
            <v-icon x-large class="mt-n2 mr-n1">cci-mech-weapon</v-icon>
            {{ item.Name }}
          </div>
        </weapon-attack>
        <v-container>
          <div v-if="hasAux(mount, item)" class="my-3">
            <div class="body-text text-center font-weight-bold">
              You may make an additional attack with the following mounted Auxiliary weapon:
              <div class="text-center overline my-n2">This weapon cannot deal bonus damage.</div>
            </div>
            <v-alert dense outlined class="my-1" colored-border color="primary">
              <weapon-attack
                ref="aux"
                :item="hasAux(mount, item)"
                :mech="mech"
                :mount="mount"
                aux
                class="mt-n3"
              >
                <div class="heading h3 mt-3 mb-n3">
                  <v-icon large class="mt-n2 mr-n1">cci-mech-weapon</v-icon>
                  {{ hasAux(mount, item).Name }}
                </div>
              </weapon-attack>
            </v-alert>
          </div>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { WeaponSize } from '@/class'
import Vue from 'vue'
import WeaponAttack from '../../components/_WeaponAttack.vue'

export default Vue.extend({
  name: 'skirmish-dialog',
  components: { WeaponAttack },
  props: {
    item: {
      type: Object,
      required: false,
      default: null,
    },
    mech: {
      type: Object,
      required: true,
    },
    mount: {
      type: Object,
      required: false,
      default: null,
    },
    overwatch: {
      type: Boolean,
    },
    returnFire: {
      type: Boolean,
    },
  },
  data: () => ({
    dialog: false,
    confirmedFree: false,
  }),
  methods: {
    hasAux(mount, primary) {
      const auxes = mount.Weapons.filter(x => x.Size === WeaponSize.Aux && x.Loaded)
      if (!auxes.length) return false
      const unusedAux = auxes.filter(x => x !== primary)
      if (!unusedAux.length) return false
      const candidate = unusedAux[0]
      if (this.item === candidate) return false
      return !this.returnFire && (candidate || false)
    },
    confirmAttack(free) {
      this.confirmedFree = free
      this.$emit('confirm', free)
    },
    reset() {
      this.$refs.main.reset()
      if (this.hasAux && this.$refs.aux) this.$refs.aux.reset()
    },
    init() {
      this.$refs.main.init()
    },
    confirm(): void {
      if (this.confirmedFree) this.reset()
      this.confirmedFree = false
      this.dialog = false
      this.$emit('close')
      this.$refs.main.init()
    },
    show(): void {
      this.dialog = true
    },
    hide(): void {
      if (this.confirmedFree) this.reset()
      this.confirmedFree = false
      this.dialog = false
      this.$emit('close')
      this.$refs.main.init()
    },
  },
})
</script>
