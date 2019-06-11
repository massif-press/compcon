<template>
  <v-hover class="clickable" style="background-color: rgba(0,0,0,0)">
    <v-card
      slot-scope="{ hover }"
      :class="`inactive elevation-${hover ? 12 : 0}`"
      @click="addMenu = true"
    >
      <v-layout row>
        <v-flex class="ma-0 pb-0 pt-0 text-xs-center">
          <div
            :style="
              `height: ${cardHeight}px; display:table; width:100%; cursor: pointer;`
            "
          >
            <span class="pilot-letter white--text">
              <v-icon dark size="20vw">cc-pilot</v-icon>
            </span>
          </div>
        </v-flex>
      </v-layout>
      <v-layout row fill-height>
        <v-flex>
          <v-card color="transparent" flat>
            <v-card-text class="text-xs-center white--text">
              <span class="font-weight-light center-align add-letter">
                Add New Pilot
              </span>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
      <add-pilot-menu :dialogModel="addMenu" @close="addMenu = false" />
    </v-card>
  </v-hover>
</template>

<script lang="ts">
import Vue from 'vue'
import AddPilotMenu from './AddPilotMenu.vue'

export default Vue.extend({
  name: 'add-pilot-card',
  components: { AddPilotMenu },
  props: {
    cardHeight: Number,
  },
  data: () => ({
    addMenu: false,
  }),
})
</script>

<style scoped>
.pilot-letter {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
  font-size: 20vw;
  line-height: 0;
}

.add-letter {
  letter-spacing: 3px;
  font-size: 35px;
}

.inactive {
  background: linear-gradient(#424242, #616161 80%);
  background-color: #424242;
}

.inactive:hover {
  background: linear-gradient(#424242, #757575 80%);
  border: 0px;
}
</style>
