<template>
  <card>
    <div class="caption text-center mt-n1" style="letter-spacing: 4px; font-size: 10px">
      {{ header }} // <b>ACTION</b>
    </div>
    <v-row dense align="center">
      <v-col cols="auto" class="text-center heading caption my-1">
        {{ action.Name }}
      </v-col>
      <v-col><v-divider /></v-col>
      <v-col cols="auto" class="text-center heading caption" :class="`text-${action.Color}`">
        {{ action.Activation }}
      </v-col>
    </v-row>
    <div class="caption">
      <v-card
        v-if="action.Init"
        class="pa-1 text-center mb-1"
        color="grey-darken-3"
        variant="outlined"
      >
        <span v-html-safe="action.Init" class="caption" />
      </v-card>
      <v-card v-if="action.Trigger" class="pa-1 mb-1" color="grey-lighten-2">
        <span cols="auto" class="caption font-weight-bold">Trigger:&nbsp;</span>
        <span v-html-safe="action.Trigger" class="caption" />
      </v-card>
      <div v-if="action.Detail">
        <span v-if="action.Trigger" cols="auto" class="caption font-weight-bold"
          >Effect:&nbsp;</span
        >
        <span v-html-safe="action.Detail" class="caption" />
      </div>
    </div>
    <div style="position: absolute; bottom: 1px; right: 1px">
      <v-icon
        v-if="action.IsPilotAction"
        icon="cc:pilot"
        color="grey"
        size="30"
        class="mr-n2 mb-n2"
      />
      <v-icon :icon="action.Icon" :color="action.Color" size="40" />
    </div>
  </card>
</template>

<script lang="ts">
import Card from './PrintCard.vue';

export default {
  name: 'print-action',
  components: {
    Card,
  },
  props: {
    action: {
      type: Object,
      required: true,
    },
    header: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.caption {
  font-size: 11px;
}
</style>
