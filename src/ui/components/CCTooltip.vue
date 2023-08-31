<template>
  <v-tooltip :location="(location as any)" :open-delay="delayed ? 500 : 150" :max-width="maxWidth">
    <template #activator="{ props }">
      <div :class="{ 'd-inline': inline }" v-bind="props">
        <slot />
      </div>
    </template>
    <div>
      <div v-if="err">
        Unable to load tooltip information. This may be due to malformed data or an unloaded content
        package.
      </div>
      <div v-else>
        <div v-if="!title">
          <div v-html="content" />
        </div>
        <div v-else>
          <span class="heading h3">{{ title }}</span>
          <v-divider class="my-1" />
          <div v-html="content" />
        </div>
      </div>
    </div>
  </v-tooltip>
</template>

<script lang="ts">
export default {
  name: 'CCTooltip',
  props: {
    err: {
      type: String,
      required: false,
      default: '',
    },
    location: {
      type: String,
      required: false,
      default: 'top',
    },
    inline: {
      type: Boolean,
      required: false,
    },
    delayed: {
      type: Boolean,
      required: false,
    },
    title: {
      type: String,
      required: false,
    },
    content: {
      type: String,
      required: true,
    },
    maxWidth: {
      type: String,
      required: false,
      default: '350px',
    },
  },
};
</script>
