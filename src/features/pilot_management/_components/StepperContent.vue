<template>
  <slot />
  <v-footer
    density="compact"
    :height="mobile ? 26 : 46"
    class="border-t-sm"
    style="position: fixed; bottom: 0; left: 0; right: 0; z-index: 901">
    <cc-button :size="mobile ? 'small' : 'default'" variant="text" :to="exit">EXIT</cc-button>
    <v-spacer />
    <cc-button
      color="primary"
      :disabled="!back"
      :size="mobile ? 'small' : 'default'"
      class="ml-auto mr-2"
      @click="$emit('back')">
      BACK
    </cc-button>
    <v-spacer />
    <slot name="other" />
    <cc-button
      v-if="!noConfirm"
      :color="complete || mandatory ? 'success' : ''"
      :size="mobile ? 'small' : 'default'"
      :disabled="mandatory && !complete"
      :variant="!(complete || mandatory) ? 'text' : 'elevated'"
      :class="complete && 'pulse'"
      @click="$emit('complete')">
      {{ complete || mandatory ? 'CONTINUE' : 'SKIP STEP' }}
    </cc-button>
  </v-footer>
</template>

<script lang="ts">
export default {
  name: 'stepper-content',
  props: {
    noConfirm: {
      type: Boolean,
      required: false,
    },
    back: {
      type: Boolean,
      required: false,
    },
    mandatory: {
      type: Boolean,
      required: false,
    },
    complete: {
      type: Boolean,
      required: true,
    },
    exit: {
      type: String,
      required: true,
    },
  },
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
  },
};
</script>

<style scoped>
.pulse {
  animation: talent-pulse 1.7s infinite;
  z-index: 2;
}

@keyframes talent-pulse {
  0% {
    box-shadow: 0 0 0 0px rgb(var(--v-theme-success));
  }
  100% {
    box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
  }
}
</style>
