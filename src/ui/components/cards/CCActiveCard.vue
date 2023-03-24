<template>
  <v-col :cols="cols" class="pa-1">
    <v-card
      tile
      color="panel clipped"
      :height="collapsed ? '' : '100%'"
      style="transition: all 0.2s"
    >
      <v-card-title class="pa-0 pl-2 pr-2" :class="color">
        <v-icon
          v-if="collapsible"
          left
          dark
          class="fadeSelect"
          @click="collapsed = !collapsed"
        >
          {{ collapsed ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
        </v-icon>
        <span
          :class="` ${
            $vuetify.display.smAndDown
              ? 'body-text font-weight-bold'
              : $vuetify.display.lgAndUp
              ? 'heading h3'
              : 'heading h2'
          } white--text`"
        >
          {{ header }}
        </span>
        <v-divider
          v-if="content && prominent && $vuetify.display.lgAndUp"
          class="mx-3 subtle"
          style="opacity: 0.5"
        />
        <v-spacer v-else />
        <span class="overline white--text mr-2">{{ subheader }}</span>
        <span
          v-if="content && prominent"
          :class="`heading ${
            $vuetify.display.lgAndup ? 'h1' : 'h2'
          } pt-1 pb-3 pr-3 white--text`"
        >
          {{ content }}
        </span>
      </v-card-title>
      <v-scroll-y-transition leave-absolute>
        <v-card-text
          v-if="!collapsed && !prominent"
          class="pa-1 pl-2 ma-0 text--text body-text"
        >
          <div v-if="content && !prominent">
            {{ content }}
          </div>
          <slot v-else />
        </v-card-text>
      </v-scroll-y-transition>
    </v-card>
  </v-col>
</template>

<script lang="ts">
export default {
  name: 'CCActiveCard',
  props: {
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
    header: {
      type: String,
      required: true,
    },
    subheader: {
      type: String,
      required: false,
      default: '',
    },
    content: {
      type: [String, Number],
      required: false,
      default: '',
    },
    cols: {
      type: [String, Number],
      required: false,
      default: '',
    },
    collapsible: {
      type: Boolean,
      required: false,
      default: false,
    },
    startClosed: {
      type: Boolean,
      required: false,
      default: false,
    },
    prominent: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      collapsed: false,
    };
  },
  created(): void {
    this.collapsed = this.startClosed;
  },
};
</script>
