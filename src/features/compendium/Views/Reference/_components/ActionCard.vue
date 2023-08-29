<template>
  <v-col lg="4" md="6" xs="12">
    <cc-titled-panel
      clickable
      :title="`${action.Name}${exclusive}`"
      :icon="action.Icon"
      :color="action.Color"
      style="height: 100%"
      @click="($refs.dialog as any).show()"
    >
      <p v-html-safe="action.Terse" class="body-text mb-2 pa-2" />
    </cc-titled-panel>
    <cc-solo-dialog
      ref="dialog"
      :title="`${action.Name}${exclusive}`"
      :icon="action.Icon"
      :color="action.Color"
      no-actions
      width="80vw"
    >
      <v-container>
        <p v-html-safe="action.Detail" class="body-text text-text mt-n3" />
        <div v-if="action.SubActions && action.SubActions.length">
          <div class="text-overline text-subtle">OPTIONS</div>
          <v-row no-gutters justify="center">
            <v-col v-for="a in action.SubActions" cols="auto">
              <cc-action :action="a" :panel="false" class="ma-2" />
            </v-col>
          </v-row>
        </div>
      </v-container>
    </cc-solo-dialog>
  </v-col>
</template>

<script lang="ts">
export default {
  name: 'action-card',
  props: {
    action: {
      type: Object,
      required: true,
    },
    downtime: {
      type: Boolean,
      required: false,
    },
  },
  computed: {
    exclusive() {
      if (this.action.IsPilotAction && !this.action.IsMechAction) return ' (Pilot Only)';
      return '';
    },
  },
};
</script>
