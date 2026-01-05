<template>
  <v-row dense justify="end">
    <v-col cols="auto">
      <cc-dialog icon="mdi-clipboard-text" :title="`${actor.Name} Combat Log`">
        <template #activator="{ open }">
          <v-btn size="x-small" flat tile @click="open">
            <v-icon icon="mdi-clipboard-text" start />
            View Log
          </v-btn>
        </template>
        <template #default>
          <v-card-text>
            <div v-for="(log, index) in actor.CombatController.History" :key="index">
              {{ JSON.stringify(log) }}
            </div>
          </v-card-text>
        </template>
      </cc-dialog>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'ActorLogs',
  props: {
    actor: {
      type: Object,
      required: true,
    },
  },
};
</script>
