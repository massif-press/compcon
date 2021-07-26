<template>
  <v-card flat tile color="transparent">
    <fieldset>
      <legend :style="`color: ${color}`" class="heading h3">Systems</legend>
      <v-row dense :class="$vuetify.breakpoint.mdAndUp ? 'mx-2' : 'my-2'">
        <active-system-card
          v-for="(s, i) in mech.ActiveLoadout.IntegratedSystems"
          :key="`${s.ID}-${i}-intg`"
          :mech="mech"
          :item="s"
          :color="color"
          :rest="rest"
          readonly
        />

        <v-col v-for="(w, i) in moddedWeapons" :key="`${w.ID}-${i}-mod`" cols="12" lg="6">
          <mod-equipped-card
            :mech="mech"
            :mod="w.Mod"
            :weapon="w"
            :color="color"
            readonly
            :rest="rest"
            @remove="w.Mod = null"
          />
        </v-col>

        <active-system-card
          v-for="(s, i) in mech.ActiveLoadout.Systems"
          :key="`${s.ID}-${i}`"
          :mech="mech"
          :item="s"
          :color="color"
          :index="i"
          :rest="rest"
          :readonly="readonly"
        />
      </v-row>
    </fieldset>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import ActiveSystemCard from './_ActiveSystemCard.vue'
import ModEquippedCard from '../mech_loadout/components/system/_ModEquippedCard.vue'

export default Vue.extend({
  name: 'systems-block',
  components: { ActiveSystemCard, ModEquippedCard },
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
    rest: {
      type: Boolean,
    },
  },
  computed: {
    moddedWeapons() {
      return this.mech.ActiveLoadout.Weapons.filter(x => x.Mod)
    },
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
