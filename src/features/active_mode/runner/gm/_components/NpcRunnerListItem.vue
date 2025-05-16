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
        <v-row
          justify="space-between"
          dense
          :style="collapsed && !item.activations ? 'opacity: 0.4' : ''">
          <v-col v-if="!collapsed" cols="auto">
            <div class="bg-enemy" style="width: 4px; height: 100%" />
          </v-col>
          <v-col cols="auto" style="position: relative">
            <v-icon
              v-if="!collapsed"
              icon="mdi-drag"
              size="20"
              :style="isHovering ? 'opacity: 1' : 'opacity: 0.4'"
              class="handle bg-panel"
              style="
                position: absolute;
                top: 0;
                left: 0;
                cursor: move;
                z-index: 2;
                border-radius: 4px;
              " />
            <v-img
              height="100%"
              width="60px"
              cover
              :src="`https://placebear.com/${randomValue}/${randomValue}`" />
            <!-- <v-avatar
              style="position: absolute; bottom: 0px; right: -4px; cursor: move; z-index: 2"
              color="primary"
              size="26">
              <v-icon :icon="`cc:role_${item.role.toLowerCase()}`" size="24" />
            </v-avatar> -->
          </v-col>
          <v-col v-if="!collapsed" class="mx-1">
            <div>
              <span class="heading h4">{{ item.name }}</span>
              <span class="text-caption text-disabled">
                <cc-slashes />
                #{{ item.number }}
              </span>
            </div>
            <div class="text-cc-overline">{{ item.class }} {{ item.template }}</div>
            <v-row dense justify="space-between" style="font-size: 16px">
              <v-col cols="auto" v-for="(stat, index) in item.stats" :key="index">
                <v-icon size="small" class="mr-1" :icon="getIcon(index)" />
                <b class="text-accent">{{ stat.current }}</b>
                <span class="text-disabled text-caption">/{{ stat.max }}</span>
              </v-col>
            </v-row>
            <div v-for="status in item.special">
              <v-progress-linear model-value="100" height="16" color="orange" striped>
                <v-chip class="text-cc-overline bg-deep-orange-darken-3" flat tile>
                  <cc-slashes />
                  {{ status }}
                  <cc-slashes />
                </v-chip>
              </v-progress-linear>
            </div>
            <div v-for="status in item.statuses">
              <v-progress-linear model-value="100" height="16" color="red-darken-3">
                <v-chip class="text-cc-overline" flat tile>
                  <cc-slashes />
                  {{ status }}
                  <cc-slashes />
                </v-chip>
              </v-progress-linear>
            </div>
          </v-col>
          <v-col
            v-if="!collapsed"
            class="d-flex align-center"
            style="padding-left: 2px; padding-right: 2px"
            :class="item.activations > 0 ? 'bg-success-darken-2' : 'bg-grey'"
            cols="auto">
            <div>
              <v-tooltip location="bottom" open-delay="400">
                <template #activator="{ props }">
                  <v-icon v-if="!item.activations" icon="cc:activate" size="20" />
                  <v-icon
                    v-bind="props"
                    v-for="n in item.activations"
                    icon="cc:activate"
                    size="20"
                    class="d-block" />
                </template>
                <span class="text-cc-overline">
                  {{ item.activations }} Activations remaining this round
                </span>
              </v-tooltip>
            </div>
          </v-col>
        </v-row>
        <div v-if="collapsed" class="bg-enemy" style="height: 4px" />
      </v-card>
    </template>
  </v-hover>
</template>

<script>
import _ from 'lodash';
import { CompendiumStore } from '@/stores';

export default {
  name: 'NpcRunnerListItem',
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
  computed: {
    randomValue() {
      return Math.floor(Math.random() * (500 - 400 + 1)) + 400;
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
