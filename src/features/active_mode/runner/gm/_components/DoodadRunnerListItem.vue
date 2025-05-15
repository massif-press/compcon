<template>
  <v-hover>
    <template #default="{ props, isHovering }">
      <v-card
        v-bind="props"
        class="pa-1 border-fade"
        flat
        tile
        variant="outlined"
        @click.stop="$emit('select', item)"
        :style="`border-color: ${isHovering ? 'rgb(var(--v-theme-accent))' : 'rgb(var(--v-theme-panel))'};`">
        <v-row justify="space-between" dense>
          <v-col v-if="!collapsed" cols="auto">
            <div class="bg-neutral" style="width: 4px; height: 100%" />
          </v-col>
          <v-col cols="auto" style="position: relative">
            <v-icon
              icon="mdi-drag"
              size="20"
              class="handle bg-panel"
              style="
                position: absolute;
                top: 0;
                left: 0;
                cursor: move;
                z-index: 2;
                border-radius: 4px;
              " />
            <v-avatar flat tile :size="collapsed ? 45 : 60" class="bg-panel">
              <v-icon icon="mdi-cube" :size="collapsed ? 45 : 60" />
            </v-avatar>
          </v-col>
          <v-col v-if="!collapsed" class="mx-1">
            <div>
              <span class="heading h4">{{ item.name }}</span>
              <span class="text-caption text-disabled">
                <cc-slashes />
                Doodad
              </span>
            </div>
            <v-row dense justify="space-between" style="font-size: 16px">
              <v-col cols="auto" v-for="(stat, index) in item.stats" :key="index">
                <v-icon size="small" class="mr-1" :icon="getIcon(index)" />
                <b class="text-accent">{{ stat.current }}</b>
                <span class="text-disabled text-caption">/{{ stat.max }}</span>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <div v-if="collapsed" class="bg-neutral" style="height: 4px" />
      </v-card>
    </template>
  </v-hover>
</template>

<script>
export default {
  name: 'DoodadRunnerListItem',
  props: {
    item: {
      type: Object,
      required: true,
    },
    collapsed: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    getIcon(stat) {
      const icons = {
        structure: 'cc:structure',
        armor: 'mdi-shield-outline',
        hp: 'mdi-heart-outline',
        reactor: 'cc:reactor',
        heat: 'cc:heat',
        repair: 'cc:repair',
      };
      return icons[stat];
    },
  },
};
</script>

<style scoped>
.border-fade {
  transition: all 0.2s ease-in-out;
}
</style>
