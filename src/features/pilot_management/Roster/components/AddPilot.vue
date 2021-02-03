<template>
  <v-row>
    <v-btn x-large block color="accent" class="my-2" @click="$refs.dialog.show()">
      <v-icon left large>cci-accuracy</v-icon>
      Add New Pilot
    </v-btn>
    <cc-solo-dialog ref="dialog" icon="cci-pilot" no-confirm large title="Register Pilot">
      <v-container>
        <cc-major-btn icon="cci-pilot" name="Create New Pilot" @clicked="$router.push('new')" />
        <v-divider />
        <v-row>
          <file-import @done="$refs.dialog.hide()" />
          <cloud-import :disabled="!currentAuthedUser" @done="$refs.dialog.hide()" />
          <cloud-import-old @done="$refs.dialog.hide()" />
        </v-row>
        <v-alert prominent dense icon="mdi-alert" colored-border color="panel">
          <div class="heading h3"><b>Cloud Service Update</b></div>
          <div class="body-text">
            Vault Import allows for seamless, automatic syncing of remote pilots and is only
            available for users with COMP/CON accounts. Cloud Importing/Exporting pilots can still
            be done the old, manual, way via Cloud Download. Both systems are compatible, but
            <b class="accent--text">
              public cloud data made prior to v. 2.2.6 must be re-synced
            </b>
            <br />
            <br />
            Cloud Download will be deprecated and, eventually, removed after COMP/CON account
            creation exits the Patreon-only phase and Vault Import becomes available to everyone.
          </div>
        </v-alert>
      </v-container>
    </cc-solo-dialog>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import FileImport from './add_panels/FileImport.vue'
import CloudImport from './add_panels/CloudImport.vue'
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
