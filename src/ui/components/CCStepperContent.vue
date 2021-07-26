<template>
  <div>
    <slot />
    <v-divider class="ma-3" />
    <v-row dense class="mx-3">
      <v-col cols="auto">
        <v-btn large text :to="exit">EXIT</v-btn>
      </v-col>
      <v-col cols="auto" class="ml-auto">
        <v-btn
          color="primary"
          :disabled="!back"
          large
          text
          class="ml-auto mr-2"
          @click="$emit('back')"
        >
          BACK
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <slot name="other" />
      </v-col>
      <v-col cols="auto" class="ml-auto">
        <v-btn
          v-if="!noConfirm"
          color="success"
          :disabled="!complete"
          large
          tile
          @click="$emit('complete')"
        >
          CONTINUE
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({ name: 'cc-stepper-content' })
export default class CCStepperContent extends Vue {
  @Prop({ type: Boolean, required: false })
  readonly noConfirm?: boolean
  @Prop({ type: Boolean, required: false })
  readonly back?: boolean

  @Prop({ type: Boolean, required: true })
  readonly complete!: boolean
  @Prop({ type: String, required: true })
  readonly exit!: string
}
</script>
