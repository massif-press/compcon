<template>
  <div>
    <v-btn
      v-if="flat"
      :size="smallBtn || $vuetify.display.smAndDown ? 'small' : 'default'"
      :color="color"
      :block="block"
      variant="text"
      :dark="dark"
      @click="dialog = true">
      <slot name="button" />
    </v-btn>
    <v-btn
      v-else
      tile
      flat
      :block="block"
      :size="smallBtn || $vuetify.display.smAndDown ? 'small' : 'default'"
      :color="color"
      @click="dialog = true">
      <slot name="button" />
    </v-btn>
    <v-dialog v-model="dialog" :fullscreen="fullscreen" :max-width="fullscreen ? '' : '1600px'">
      <v-card tile class="background">
        <cc-titlebar :color="color" :icon="icon">
          <template #title>
            <slot name="title" />
          </template>
          <template #title-chips>
            <slot name="title-chips" />
          </template>
          <template #title-items>
            <slot name="title-items" />
            <v-btn icon @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
        </cc-titlebar>

        <v-card-text>
          <slot />
        </v-card-text>

        <v-divider />

        <v-card-actions v-if="hasConfirm">
          <v-btn text @click="dialog = false">cancel</v-btn>
          <v-spacer />
          <cc-btn @click="confirm">confirm</cc-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
export default {
  name: 'CCDialog',
  props: {
    small: {
      type: Boolean,
      required: false,
      default: false,
    },
    fullscreen: {
      type: Boolean,
      required: false,
      default: false,
    },
    smallBtn: {
      type: Boolean,
      required: false,
      default: false,
    },
    large: {
      type: Boolean,
      required: false,
      default: false,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
    icon: {
      type: String,
      required: false,
      default: '',
    },
    flat: {
      type: Boolean,
      required: false,
      default: false,
    },
    dark: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasConfirm: {
      type: Boolean,
      required: false,
      default: false,
    },
    block: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    confirm() {
      this.dialog = false;
      this.$emit('confirm');
    },
  },
};
</script>

<style scoped>
.v-btn:focus {
  outline: rgba(0, 0, 0, 0.202) solid 5px;
}
</style>
