<template>
  <v-col :cols="cols">
    <v-hover v-slot:default="{ hover }">
      <v-card
        id="underline-parent"
        :class="`clipped-x-large ${hover ? 'on-hover' : ''}`"
        :height="small ? '8em' : '10em'"
        :color="color"
        tile
        outlined
        @click="$emit('clicked')"
      >
        <v-icon
          v-if="icon"
          :size="small ? 56 : 100"
          :class="`pa-0 ma-0 ${small ? 'mb-2 ml-2' : ''}`"
          style="position: absolute; bottom: -5px; left: 0"
          dark
        >
          {{ icon }}
        </v-icon>
        <div v-else style="position: absolute; bottom: -5px; left: 0">
          <slot name="content" />
        </div>
        <v-card-actions
          id="card-actions"
          class="text-right"
          :style="`display: inline-block; position: absolute; width: 100%; top: 0; left: 0;`"
        >
          <span
            style="position:absolute; top: 0; right: 0; display: contents; font-size: 22pt"
            class="underline-slide px-4 heading h2"
          >
            {{ name }}
          </span>
        </v-card-actions>
      </v-card>
    </v-hover>
    <slot />
  </v-col>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({ name: 'cc-major-btn' })
export default class CCMajorButton extends Vue {
  @Prop({ type: String, required: true })
  readonly name!: string

  @Prop({ type: String, required: false, default: '' })
  readonly icon: string

  @Prop({ type: Boolean, required: false })
  readonly small?: boolean

  @Prop({ type: String, required: false, default: '' })
  readonly cols?: string

  @Prop({ type: String, required: false, default: 'primary' })
  readonly color: string
}
</script>

<style scoped>
.v-card {
  filter: brightness(120%);
  transition: all 0.3s ease-in-out;
}

.v-card > .v-icon {
  opacity: 0.7;
  transition: opacity 0.3s ease-in-out;
}

.v-card:hover > .v-icon {
  opacity: 1;
}

.v-card:not(.on-hover) {
  filter: brightness(100%);
}

.underline-slide {
  color: var(--v-stark-text-base);
}

.underline-slide::before {
  content: '';
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  height: 5px;
  z-index: 100;
  background-color: var(--v-stark-text-base);
  transform-origin: bottom left;
  transform: scaleX(0);
  transition: transform 0.45s ease;
}

#card-actions {
  background-color: var(--v-background-base);
}

#underline-parent:hover > #card-actions > .underline-slide::before {
  transform-origin: bottom right;
  transform: scaleX(1);
}
</style>
