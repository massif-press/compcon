<template>
  <div>
    <v-btn x-large block color="accent" class="my-2" left @click="$refs.dialog.show()">
      <v-icon left large>cci-accuracy</v-icon>
      Add New Pilot
    </v-btn>
    <cc-solo-dialog ref="dialog" icon="cci-pilot" no-confirm large title="Register Pilot">
      <v-container>
        <v-row dense>
          <v-col cols="12">
            <v-btn x-large tile block color="accent" @click="$router.push('new')">
              <v-icon x-large left class="pr-2">cci-pilot</v-icon>
              <b>Create New Pilot</b>
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <file-import @done="$refs.dialog.hide()" />
        </v-row>
      </v-container>
    </cc-solo-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import FileImport from './add_panels/FileImport.vue'
import { Auth } from 'aws-amplify'

export default Vue.extend({
  name: 'add-pilot',
  components: { FileImport },
  data: () => ({
    currentAuthedUser: null,
  }),
  async mounted() {
    await Auth.currentAuthenticatedUser().then(res => {
      this.currentAuthedUser = res.username
    })
  },
})
</script>
