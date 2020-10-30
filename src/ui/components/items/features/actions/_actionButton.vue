<template>
  <div class="text-center">
    <v-btn :color="action.Color" block tile left @click="$refs.dialog.show()">
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
          <v-divider v-if="action.Detail" />
          <v-card-text
            v-if="action.Detail"
            class="body-text text--text mt-0 pt-1"
            v-html="action.Detail"
          />
        </v-card>
      </v-menu>
    </v-btn>
    <cc-combat-dialog ref="dialog" :action="action" :mech="pilot.ActiveMech" />
  </div>
</template>

<script lang="ts">
import activePilot from '@/features/pilot_management/mixins/activePilot'
import vueMixins from '@/util/vueMixins'
import ActionBase from './_actionBase.vue'

export default vueMixins(activePilot).extend({
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
