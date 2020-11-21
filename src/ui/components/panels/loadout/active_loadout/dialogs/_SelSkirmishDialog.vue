<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.mdAndDown"
    :style="$vuetify.breakpoint.mdAndDown ? `x-overflow: hidden` : ''"
    width="90vw"
  >
    <v-card tile class="background">
      <cc-titlebar large color="action--quick">
        <v-icon x-large>mdi-hexagon-slice-3</v-icon>
        Skirmish
        <v-btn slot="items" dark icon @click="hide">
          <v-icon large left>close</v-icon>
        </v-btn>
      </cc-titlebar>

      <v-spacer v-if="$vuetify.breakpoint.mdAndDown" class="titlebar-margin" />

      <v-card-text v-if="item && mount" class="mb-0 pb-2">
        <weapon-attack
          ref="main"
          :item="item"
          :mech="mech"
          :mount="mount"
          @confirm="$emit('confirm')"
        >
          <div class="heading h2 mt-3 mb-n3">
            <v-icon x-large class="mt-n2 mr-n1">cci-mech-weapon</v-icon>
            {{ item.Name }}
          </div>
        </weapon-attack>
        <v-container>
          <div v-if="extraAux" class="my-3">
            <div class="body-text text-center font-weight-bold">
              You may make an additional attack with the following mounted Auxiliary weapon:
              <div class="text-center overline my-n2">
                This weapon cannot deal bonus damage.
              </div>
            </div>
            <v-alert dense outlined class="my-1" colored-border color="primary">
              <weapon-attack
                ref="aux"
                :item="extraAux"
                :mech="mech"
                :mount="mount"
                aux
                class="mt-n3"
              >
                <div class="heading h3 mt-3 mb-n3">
                  <v-icon large class="mt-n2 mr-n1">cci-mech-weapon</v-icon>
                  {{ extraAux.Name }}
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
import Vue from 'vue'
import WeaponAttack from '../components/_WeaponAttack.vue'

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
  },
  data: () => ({
    dialog: false,
  }),
  computed: {
    extraAux() {
      if (this.mount.Weapons.length === 1) return null
      else {
        const extra = this.mount.Weapons.find(x => x !== this.item)
        return extra || null
      }
    },
  },
  methods: {
    reset() {
      this.$refs.main.reset()
      if (this.extraAux) this.$refs.aux.reset()
    },
    init() {
      this.$refs.main.init()
    },
    confirm(): void {
      this.dialog = false
      this.$emit('close')
    },
    show(): void {
      this.dialog = true
    },
    hide(): void {
      this.dialog = false
      this.$emit('close')
    },
  },
})
</script>
