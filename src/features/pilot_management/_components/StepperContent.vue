<template>
  <div>
    <slot />
    <v-divider class="ma-3" />
    <v-row density="compact" class="mx-3">
      <v-col cols="auto">
        <router-link :to="exit">
          <v-btn large variant="text">EXIT</v-btn>
        </router-link>
      </v-col>
      <v-col cols="auto" class="ml-auto">
        <v-btn
          color="primary"
          :disabled="!back"
          large
          variant="text"
          class="ml-auto mr-2"
          @click="$emit('back')">
          BACK
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <slot name="other" />
      </v-col>
      <v-col cols="auto" class="ml-auto">
        <v-btn
          v-if="!noConfirm"
          :color="complete || mandatory ? 'success' : ''"
          large
          :disabled="mandatory && !complete"
          :variant="!(complete || mandatory) ? 'text' : 'elevated'"
          :tile="complete || mandatory"
          @click="$emit('complete')">
          {{ complete || mandatory ? 'CONTINUE' : 'SKIP STEP' }}
        </v-btn>
      </v-col>
    </v-row>
  </div>
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
};
</script>
