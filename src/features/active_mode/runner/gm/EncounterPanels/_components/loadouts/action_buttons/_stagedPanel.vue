<template>
  <div class="py-3 px-6">
    <div class="text-cc-overline bg-panel"><span class=text-disabled>&nbsp;// Staged</span>
    </div>
    <div class="bg-background pb-1"
      style="position: relative; max-height: 200px; overflow-y: auto;">
      <code v-for="(e, idx) in events"
        style="white-space: pre-wrap; font-size: 12px;">
          <br v-if="Number(idx) > 0">
          {{ e.Summary }}
        </code>
      <v-btn size=small
        style="position: absolute; bottom: 0; right: 0"
        icon
        flat
        tile
        variant="text"
        class="fade-select"
        @click="copyText()">
        <v-icon icon="mdi-content-copy" />
      </v-btn>
    </div>

  </div>
</template>

<script lang="ts">

export default {
  name: 'StagedPanel',
  props: {
    events: {
      type: Object,
      required: true
    }
  },
  methods: {
    copyText() {
      const text = this.events.map((e: any) => e.Summary).join('\n');
      navigator.clipboard.writeText(text);
      this.$emit('notify', 'Copied to clipboard');
    }
  }
};
</script>