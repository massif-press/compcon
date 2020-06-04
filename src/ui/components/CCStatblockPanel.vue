<template>
  <v-col>
    <v-card
      flat
      tile
      color="light-panel"
      class="text-center"
      height="100%"
      width="100%"
      style="min-width: 15vw"
    >
      <v-card-title class="heading h3 primary px-3 py-0 ma-0 white--text">
        <div class="text-center" style="width: 100%">
          <cc-tooltip inline :content="name">
            <v-icon large color="white">{{ icon }}</v-icon>
          </cc-tooltip>
          <span v-if="$vuetify.breakpoint.lgAndUp">{{ name }}</span>
        </div>
      </v-card-title>
      <v-card-text class="heading x-large-text text--text px-2 ma-0 mt-1 mb-0">
        <span>{{ value }}</span>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({ name: 'cc-statblock-panel' })
export default class CCStatblockPanel extends Vue {
  @Prop({ type: String, required: true })
  readonly name!: string

  @Prop({ type: String, required: true })
  readonly icon!: string

  @Prop({ type: [String, Number], required: true })
  readonly value!: string | number
}
</script>
