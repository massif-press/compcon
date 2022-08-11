<template>
  <v-card flat tile color="transparent">
    <fieldset>
      <legend :style="`color: ${color}`" class="heading h3">Systems</legend>
      <div style="position: relative">
        <div class="side-legend">
          <span
            :class="`heading h3 ${mech.FreeSP < 0 ? 'error--text' : 'subtle--text text--darken-3'}`"
          >
            <v-icon v-if="mech.FreeSP < 0" color="error" left>mdi-alert</v-icon>
            {{ mech.FreeSP }} / {{ mech.MaxSP }}
            <span class="overline">SP</span>
          </span>
        </div>
      </div>

      <system-slot-card
        v-for="(s, i) in mech.MechLoadoutController.ActiveLoadout.IntegratedSystems"
        :key="`${s.ID}-${i}-intg`"
        :mech="mech"
        :item="s"
        :color="color"
        readonly
      />

      <mod-equipped-card
        v-for="(w, i) in moddedWeapons"
        :key="`${w.ID}-${i}-mod`"
        :mech="mech"
        :mod="w.Mod"
        :weapon="w"
        :color="color"
        :readonly="readonly"
        @remove="w.Mod = null"
      />

      <draggable
        :list="systems"
        @start="drag=true"
        @end="drag=false"
        @change="moveSystem($event)"
      >
        <system-slot-card
          v-for="(s, i) in systems"
          :key="`${s.ID}-${i}`"
          :mech="mech"
          :item="s"
          :color="color"
          :index="i"
          :readonly="readonly"
        />
      </draggable>
      <system-slot-card v-if="!readonly" :mech="mech" empty />
    </fieldset>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import SystemSlotCard from './_SystemSlotCard.vue'
import ModEquippedCard from './_ModEquippedCard.vue'
import draggable from 'vuedraggable'

export default Vue.extend({
  name: 'systems-block',
  components: { SystemSlotCard, ModEquippedCard, draggable },
  props: {
    mech: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    readonly: {
      type: Boolean,
    },
  },
  computed: {
    moddedWeapons() {
      return this.mech.MechLoadoutController.ActiveLoadout.Weapons.filter(x => x.Mod)
    },
  },
  methods:{
    moveSystem(event){
      if(event.moved){
        this.mech.SaveController.save()
      }
    },
  },  
  data: () => {
    return {
      systems: null
    } 
  },
  mounted() {
      this.systems = this.mech.MechLoadoutController.ActiveLoadout.Systems
  },
})
</script>

<style scoped>
fieldset {
  border-color: var(--v-grey-darken2);
  border-radius: 5px;
  margin-bottom: 12px;
  padding: 4px;
}

legend {
  padding: 3px 12px;
}

.side-legend {
  position: absolute;
  right: 20px;
  top: -30px;
  background-color: white;
  padding: 0px 8px;
  height: 28px;
  border: 1px solid grey;
  border-radius: 5px;
}
</style>
