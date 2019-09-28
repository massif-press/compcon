<template>
  <v-col ml-0 class="primary--text">
    <v-fade-transition leave-absolute>
      <v-btn
        style="color: currentColor !important"
        class="text--darken-1"
        icon
        small
        @click="startInputting"
        v-if="!inputting"
      >
        <v-icon>mdi-keyboard</v-icon>
      </v-btn>
      <div v-else>
        <input
          type="text"
          class="pipinput"
          ref="pipinput"
          :value="myInput"
          @input="onInputChange"
          @keyup.enter="sendInput"
          @blur="cancelInput"
          @keyup.escape="cancelInput"
        />
      </div>
    </v-fade-transition>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({})
</script>
