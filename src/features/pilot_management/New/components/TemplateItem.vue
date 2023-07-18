<template>
  <v-row
    dense
    align="start"
    class="rounded-lg mb-2"
    style="border: 1px solid rgb(var(--v-theme-primary))"
  >
    <v-col cols="auto" class="mr-2 text-center">
      <v-img :src="frameImage" width="152px" max-height="206px" />
    </v-col>
    <v-col cols="12" md="">
      <v-row dense :class="`px-2 ${isSelected ? 'selected-gradient' : 'gradient'}`">
        <v-col class="text-white">
          <div v-show="$vuetify.display.mdAndUp" class="text-overline mt-n1">
            {{ template.code }}
          </div>
          <div :class="$vuetify.display.mdAndUp ? 'heading h1 mt-n6 mb-0 pb-0' : 'heading h2'">
            {{ template.name }}
          </div>
        </v-col>
        <v-col cols="auto">
          <v-btn :color="isSelected ? 'secondary' : 'accent'" class="mt-1" @click="$emit('select')">
            <v-icon :icon="isSelected ? 'mdi-check' : 'mdi-chevron-triple-right'" class="mr-1" />
            <span v-if="!isSelected">SELECT {{ template.name }} TEMPLATE</span>
            <span v-else>{{ template.name }} TEMPLATE SELECTED</span>
          </v-btn>
        </v-col>
      </v-row>
      <div v-html-safe="template.description" class="pa-2" />
      <div class="sidebar-box ml-2" :style="`max-height:${expanded ? '100%' : '80px;'}`">
        <div class="panel clipped px-2">
          <div class="caption text-accent mt-1"><b>TACTICS</b></div>
          <p v-html-safe="template.tactics" />
        </div>
        <div class="panel clipped py-1 px-2 my-2">
          <v-row>
            <v-col>
              <div class="caption text-accent">
                PILOT<cc-slashes />
                <b>SKILLS</b>
              </div>
              <v-row dense justify="center" class="px-2 text-center">
                <v-col v-for="s in template.build.skills">
                  <cc-tooltip
                    delayed
                    :title="`${item('Skills', s).Name} (+2)`"
                    :content="item('Skills', s).Detail"
                  >
                    <v-chip variant="outlined" color="info" label>{{
                      item('Skills', s).Name
                    }}</v-chip>
                  </cc-tooltip>
                </v-col>
              </v-row>
            </v-col>
            <v-col>
              <div class="caption text-accent">
                PILOT<cc-slashes />
                <b>TALENTS</b>
              </div>
              <v-row dense justify="center" class="px-2 text-center">
                <v-col v-for="t in template.build.talents" cols="12" md="auto" class="mx-1">
                  <cc-tooltip
                    delayed
                    :title="`${item('Talents', t).Name} I: ${item('Talents', t).Rank(1).Name}`"
                    :content="item('Talents', t).Rank(1).Description"
                  >
                    <v-chip variant="outlined" color="accent" label>
                      <v-icon start>cc:rank_1</v-icon>
                      {{ item('Talents', t).Name }}
                    </v-chip>
                  </cc-tooltip>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </div>
        <div class="panel clipped py-1 px-2 my-2">
          <div class="caption text-accent mt-1">
            GMS EVEREST<cc-slashes />
            <b>LOADOUT</b>
          </div>
          <v-row dense justify="center" class="px-2 text-center">
            <v-col v-for="m in template.build.mech.mounts">
              <div class="flavor-text text-stark text-center">{{ m.mount_type }} Mount</div>
              <v-row dense>
                <v-col v-for="w in m.slots" class="text-center">
                  <cc-item-modal class="mx-1" :item="item('MechWeapons', w)" />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <div class="flavor-text text-stark text-center mt-1">Systems</div>
          <v-row dense justify="center" class="px-2 text-center">
            <v-col v-for="s in template.build.mech.systems" class="text-center mx-2" cols="auto">
              <cc-item-modal :item="item('MechSystems', s)" />
            </v-col>
          </v-row>
        </div>
        <p class="read-more">
          <v-btn
            icon
            class="mb-n3"
            style="background-color: rgb(var(--v-theme-stark-panel))"
            @click="expanded = !expanded"
          >
            <v-icon large color="accent">mdi-chevron-double-{{ expanded ? 'up' : 'down' }}</v-icon>
          </v-btn>
        </p>
        <div v-if="expanded" style="min-height: 40px" />
      </div>

      <div class="text-center"></div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';

export default {
  name: 'template-item',
  props: {
    template: { type: Object, required: true },
    isSelected: { type: Boolean },
  },
  data: () => ({
    expanded: false,
  }),
  computed: {
    frameImage() {
      return this.template.image;
    },
  },
  methods: {
    item(type: string, id: string) {
      const compendium = CompendiumStore();
      return compendium.referenceByID(type, id);
    },
  },
};
</script>

<style scoped>
.gradient {
  max-height: 70px;
  background: -webkit-linear-gradient(
    left,
    rgb(var(--v-theme-primary)) 0%,
    rgb(var(--v-theme-primary)) 10%,
    transparent 100%
  );
  background: linear-gradient(
    to right,
    rgb(var(--v-theme-primary)) 0%,
    rgb(var(--v-theme-primary)) 10%,
    transparent 100%
  );
}

.selected-gradient {
  max-height: 70px;
  background: -webkit-linear-gradient(
    left,
    rgb(var(--v-theme-info)) 0%,
    rgb(var(--v-theme-info)) 33%,
    transparent 100%
  );
  background: linear-gradient(
    to right,
    rgb(var(--v-theme-info)) 0%,
    rgb(var(--v-theme-info)) 33%,
    transparent 100%
  );
}

.sidebar-box {
  position: relative;
  overflow: hidden;
  transition: max-height cubic-bezier(0.075, 0.82, 0.165, 1) 0.2s;
}
.sidebar-box .read-more {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  text-align: center;
  margin: 0;
  padding: 20px 0;

  background-image: linear-gradient(to bottom, transparent, rgb(var(--v-theme-background)));
}
</style>
