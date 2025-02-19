<template>
  <cc-dialog :title="`${action.Name}${exclusive}`" :icon="action.Icon" :color="action.Color">
    <template #activator="{ open }">
      <component
        :is="component"
        :title="action.Name"
        :icon="action.Icon"
        :title-color="action.Color"
        clickable
        @click="open">
        <p v-if="clickable" v-html-safe="action.Terse" />
        <div v-else>
          <p v-html-safe="action.Detail" />
          <div v-if="action.SubActions && action.SubActions.length">
            <div class="text-overline text-disabled">OPTIONS</div>
            <v-row no-gutters justify="center">
              <v-col v-for="a in action.SubActions" cols="auto">
                <cc-action :action="a" :panel="false" class="ma-2" />
              </v-col>
            </v-row>
          </div>
        </div>
      </component>
    </template>
    <v-card-text class="pa-2">
      <p v-html-safe="action.Detail" />
      <div v-if="action.SubActions && action.SubActions.length">
        <div class="text-overline text-disabled">OPTIONS</div>
        <v-row no-gutters justify="center">
          <v-col v-for="a in action.SubActions" cols="auto">
            <cc-action :action="a" :panel="false" class="ma-2" />
          </v-col>
        </v-row>
      </div>
    </v-card-text>
  </cc-dialog>
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
    clickable: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    component() {
      return this.clickable ? 'cc-clickable-panel' : 'cc-panel';
    },
    exclusive() {
      if (this.action.IsPilotAction && !this.action.IsMechAction) return ' (Pilot Only)';
      return '';
    },
  },
};
</script>
