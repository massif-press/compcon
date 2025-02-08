<template>
  <v-window-item>
    <cc-heading size="large">chips</cc-heading>

    <div>
      <cc-chip size="x-large" title="Title" label="value" color="primary" class="ma-2" />
      <cc-chip>
        test
        <template #tooltip>
          <div>test</div>
        </template>
      </cc-chip>

      <cc-chip icon="cc:pilot" color="secondary" class="ma-2">test 2</cc-chip>
      <cc-chip icon="mdi-alert" color="success" variant="outlined" bg-color="exotic" class="ma-2">
        hello
      </cc-chip>
      <cc-boolean icon="mdi-alert" v-model="bool">test</cc-boolean>
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
