<template>
  <div class="text-center">
    <v-dialog max-width="1400px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn :color="action.Color" block tile left v-bind="attrs" v-on="on">
          <v-icon dark left>{{ action.Icon }}</v-icon>
          {{ action.Name }}
          <v-menu offset-y max-width="700px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn style="position:absolute; right: 0" icon v-bind="attrs" v-on="on">
                <v-icon class="fadeSelect">
                  mdi-information-outline
                </v-icon>
              </v-btn>
            </template>
            <v-card>
              <div class="heading h3 ma-1 pl-3">
                {{ action.Name.toUpperCase() }} &mdash; {{ action.Activation.toUpperCase() }} ACTION
              </div>
              <v-divider />
              <v-card-text class="body-text text--text mt-0 pt-1" v-html="action.Detail" />
            </v-card>
          </v-menu>
        </v-btn>
      </template>
      <v-card>
        <action-base :action="action" class="mt-n4" />
      </v-card>
    </v-dialog>
  </div>

  <!-- <cc-dialog no-dismiss  large>
    <span slot="button" class="white--text" style="width: 100%">
      
    </span>

    <span slot="title">
      <v-icon left large dark>{{ action.Icon }}</v-icon>
      {{ action.Name }}
    </span>
    <v-chip slot="title-items" color="white" class="stat-text mt-4 mr-6" outlined label>
      {{ action.Frequency.ToString() }}
    </v-chip>

    <action-base :action="action" />
  </cc-dialog> -->
</template>

<script lang="ts">
import Vue from 'vue'
import ActionBase from './_actionBase.vue'

export default Vue.extend({
  name: 'action-button',
  components: { ActionBase },
  props: {
    action: {
      type: Object,
      required: true,
    },
  },
})
</script>
