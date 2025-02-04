<template>
  <v-window-item>
    <cc-heading size="large">chips</cc-heading>

    <div>
      <cc-chip size="x-large" title="Title" label="value" color="primary" class="ma-2" />
      <cc-chip icon="cc:pilot" label="test" color="secondary" class="ma-2" />
      <cc-chip
        icon="mdi-alert"
        label="test"
        color="success"
        variant="outlined"
        bg-color="exotic"
        size="x-small"
        class="ma-2" />
      <cc-boolean icon="mdi-alert" label="boolean test" v-model="bool" />
    </div>
  </v-window-item>
</template>

<script lang="ts">
export default {
  name: 'ui-test-panels',
  data: () => ({
    bool: true,
  }),
};
</script>
