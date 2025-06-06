<template>
  <cc-button
    :size="mobile ? 'x-small' : 'small'"
    :prepend-icon="`cc:rank_${pilotLicense.Rank}`"
    color="panel"
    class="text-center"
    readonly
    block>
    <span class="pr-2">
      {{ pilotLicense.Stub.Source }}
      {{ pilotLicense.Stub.Name }}
      {{ 'I'.repeat(pilotLicense.Rank) }}
    </span>
    <template #info>
      <cc-broken-reference force :item="pilotLicense.Stub" />
    </template>
  </cc-button>
</template>

<script lang="ts">
export default {
  name: 'cc-pilot-license-stub',
  props: {
    pilotLicense: {
      type: Object,
      required: true,
    },
    readonly: {
      type: Boolean,
    },
  },
  data: () => ({
    dialog: false,
    color: 'primary',
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
  },
  methods: {
    remove() {
      this.$emit('remove');
    },
  },
};
</script>
