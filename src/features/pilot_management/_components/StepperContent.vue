<template>
  <slot />
  <v-footer
    density="compact"
    :height="mobile ? 20 : 26"
    class="border-t-sm"
    style="position: fixed; bottom: 0; left: 0; right: 0; z-index: 901">
    <cc-button :size="mobile ? 'x-small' : 'small'" variant="text" :to="exit">EXIT</cc-button>
    <v-spacer />
    <cc-button
      color="primary"
      :disabled="!back"
      :size="mobile ? 'x-small' : 'small'"
      class="ml-auto mr-2"
      @click="$emit('back')">
      BACK
    </cc-button>
    <v-spacer />
    <slot name="other" />
    <cc-button
      v-if="!noConfirm"
      :color="complete || mandatory ? 'success' : ''"
      :size="mobile ? 'x-small' : 'small'"
      :disabled="mandatory && !complete"
      :variant="!(complete || mandatory) ? 'text' : 'elevated'"
      :tile="complete || mandatory"
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
