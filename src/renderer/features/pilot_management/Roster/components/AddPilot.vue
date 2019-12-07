<template>
  <v-row>
    <cc-btn x-large class="ml-auto mr-auto" @click="$refs.dialog.show()">
      <v-icon left large>cci-accuracy</v-icon>
      &emsp;Add New Pilot
    </cc-btn>
    <cc-solo-dialog ref="dialog" icon="cci-pilot" no-confirm large title="Register Pilot">
      <v-container>
        <new-pilot-button />
        <v-row>
          <file-import @done="$refs.dialog.hide()" />
          <cloud-import @done="$refs.dialog.hide()" />
        </v-row>
        <v-row></v-row>
      </v-container>
    </cc-solo-dialog>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import NewPilotButton from './NewPilotButton.vue'
import FileImport from './add_panels/FileImport.vue'
import CloudImport from './add_panels/CloudImport.vue'

export default Vue.extend({
  name: 'add-pilot',
  components: { FileImport, CloudImport, NewPilotButton },
})
</script>
