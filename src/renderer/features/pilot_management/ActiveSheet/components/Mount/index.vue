  <template>
  <v-flex xs12>
    <v-card class="ma-0 pa-0" flat dark>
      <span class="mount-title-dark pl-3 pr-3 text-uppercase">{{ mount.MountName }}</span>
      <v-card-text v-if="mount.IsLocked" class="bordered-dark ml-3 pt-4">
        <v-card color="grey darken-2">
          <v-card-text class="blockquote text-xs-center">
            LOCKED
            <br>
            <span class="caption">SUPERHEAVY WEAPON BRACING</span>
            <br>
          </v-card-text>
        </v-card>
      </v-card-text>
      <v-card-text v-else class="bordered-dark ml-3 pt-4">
        <v-card
          v-for="(cb, j) in mount.BonusEffects"
          :key="`mb_${j}`"
          color="grey darken-2"
          class="ma-1 pa-0"
        >
          <v-card-text class="text-xs-center pa-2">
            <b class="minor-title">{{ cb.Name }}:</b>
            <i class="effect-text">{{ cb.MountedEffect }}</i>
          </v-card-text>
        </v-card>
        <v-layout>
          <span v-if="!mount.Weapons || !mount.Weapons.length" class="minor-title grey--text">EMPTY</span>
          <mech-weapon-card
            v-for="(w, i) in mount.Weapons"
            :key="w.ID + i"
            :weapon="w"
            :width="(100/mount.Weapons.length)"
          />
        </v-layout>
      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script lang="ts">
import Vue from 'vue'
import MechWeaponCard from './MechWeaponCard.vue'

export default Vue.extend({
  name: 'mount-card',
  components: {
    MechWeaponCard,
  },
  props: { mount: Object },
})
</script>
