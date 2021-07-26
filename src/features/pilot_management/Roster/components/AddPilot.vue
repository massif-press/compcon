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
          <cloud-import :disabled="!currentAuthedUser" @done="$refs.dialog.hide()" />
        </v-row>
        <v-divider class="my-3" />
        <v-row dense align="center">
          <v-col cols="12" md="6">
            <v-alert prominent dense icon="mdi-alert" colored-border color="panel" class="mb-n2">
              <div class="heading h3"><b>Cloud Service Update</b></div>
              <div>Saved cloud data made prior to v. 2.2.6 must be re-synced</div>
            </v-alert>
          </v-col>
          <v-col class="text-center">
            <cloud-import-old @done="$refs.dialog.hide()" />
          </v-col>
        </v-row>
      </v-container>
    </cc-solo-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import FileImport from './add_panels/FileImport.vue'
import CloudImport from './add_panels/VaultImport.vue'
import CloudImportOld from './add_panels/CloudImportOld.vue'
import { Auth } from 'aws-amplify'

export default Vue.extend({
  name: 'add-pilot',
  components: { FileImport, CloudImport, CloudImportOld },
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
