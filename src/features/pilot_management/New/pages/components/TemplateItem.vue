<template>
  <v-row no-gutters class="mb-4" :justify="$vuetify.breakpoint.mdAndUp ? 'start' : 'center'">
    <v-col cols="12" md="auto" class="mr-2 text-center">
      <v-img
        :src="frameImage"
        max-width="152px"
        max-height="206px"
        contain
        class="ml-auto mr-auto"
      />
    </v-col>
    <v-col cols="12" md="">
      <v-row dense :class="`pl-2 ${isSelected ? 'selected-gradient' : 'gradient'}`">
        <v-col cols="12" md="auto" class="white--text">
          <div v-show="$vuetify.breakpoint.mdAndUp" class="overline mt-n1">{{ template.code }}</div>
          <div :class="$vuetify.breakpoint.mdAndUp ? 'heading h1 mt-n6 mb-0 pb-0' : 'heading h2'">
            {{ template.name }}
          </div>
        </v-col>
        <v-col cols="12" md="auto" :class="$vuetify.breakpoint.mdAndUp ? 'ml-auto' : 'mt-n3'">
          <v-btn
            tile
            :outlined="$vuetify.breakpoint.mdAndUp"
            :block="$vuetify.breakpoint.mdAndUp"
            :small="$vuetify.breakpoint.mdAndUp"
            :color="isSelected ? 'accent' : 'secondary'"
            class="mt-1"
            @click="$emit('select')"
          >
            <span v-if="!isSelected">SELECT {{ template.name }} TEMPLATE</span>
            <span v-else>{{ template.name }} TEMPLATE SELECTED</span>
          </v-btn>
        </v-col>
      </v-row>
      <div v-html-safe="template.description" class="mt-1 py-1 pl-2" />
      <div class="sidebar-box ml-2" :style="`max-height:${expanded ? '100%' : '80px;'}`">
        <div class="panel clipped py-1 px-2">
          <div class="caption accent--text mt-1"><b>TACTICS</b></div>
          <p v-html-safe="template.tactics" class="pb-1 mb-0" />
        </div>
        <div class="panel clipped py-1 px-2 my-2">
          <v-row dense>
            <v-col cols="12" md="6">
              <div class="caption accent--text mt-1">
                PILOT//
                <b>SKILLS</b>
              </div>
              <v-row dense justify="center" class="px-2">
                <v-col
                  v-for="s in template.build.skills"
                  :key="template.name + s"
                  cols="auto"
                  class="mx-1"
                >
                  <cc-tooltip
                    delayed
                    :title="`${item('Skills', s).Name} (+2)`"
                    :content="item('Skills', s).Detail"
                  >
                    <v-chip outlined color="info" label>{{ item('Skills', s).Name }}</v-chip>
                  </cc-tooltip>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="6">
              <div class="caption accent--text mt-1">
                PILOT//
                <b>TALENTS</b>
              </div>
              <v-row dense justify="center" class="px-2">
                <v-col
                  v-for="t in template.build.talents"
                  :key="template.name + t"
                  cols="12"
                  md="auto"
                  class="mx-1"
                >
                  <cc-tooltip
                    delayed
                    :title="`${item('Talents', t).Name} I: ${item('Talents', t).Rank(1).Name}`"
                    :content="item('Talents', t).Rank(1).Description"
                  >
                    <v-chip outlined color="accent" label>
                      <v-icon left>cci-rank-1</v-icon>
                      {{ item('Talents', t).Name }}
                    </v-chip>
                  </cc-tooltip>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </div>
        <div class="panel clipped py-1 px-2 my-2">
          <div class="caption accent--text mt-1">
            GMS EVEREST//
            <b>LOADOUT</b>
          </div>
          <v-row dense justify="space-around">
            <v-col v-for="m in template.build.mech.mounts" :key="template.name + m.mount_type">
              <div class="flavor-text stark--text text-center">{{ m.mount_type }} Mount</div>
              <v-row dense>
                <v-col v-for="(w, i) in m.slots" :key="template.name + w + i" class="text-center">
                  <cc-item-modal class="mx-1" :item="item('MechWeapons', w)" />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <div class="flavor-text stark--text text-center mt-1">Systems</div>
          <v-row dense justify="center">
            <v-col
              v-for="s in template.build.mech.systems"
              :key="template.name + s"
              class="text-center mx-2"
              cols="auto"
            >
              <cc-item-modal :item="item('MechSystems', s)" />
            </v-col>
          </v-row>
        </div>
        <p class="read-more">
          <v-btn
            icon
            class="mb-n3"
            style="background-color: var(--v-stark-panel-base)"
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
import Vue from 'vue'
import { getImagePath, ImageTag } from '@/io/ImageManagement'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'

export default Vue.extend({
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
      return getImagePath(ImageTag.Mech, this.template.image)
    },
  },
  methods: {
    item(type: string, id: string) {
      const compendium = getModule(CompendiumStore, this.$store)
      return compendium.referenceByID(type, id)
    },
  },
})
</script>

<style scoped>
.gradient {
  max-height: 70px;
  background: -webkit-linear-gradient(
    left,
    var(--v-primary-base) 0%,
    var(--v-primary-base) 10%,
    transparent 100%
  );
  background: linear-gradient(
    to right,
    var(--v-primary-base) 0%,
    var(--v-primary-base) 10%,
    transparent 100%
  );
}

.selected-gradient {
  max-height: 70px;
  background: -webkit-linear-gradient(
    left,
    var(--v-info-base) 0%,
    var(--v-info-base) 33%,
    transparent 100%
  );
  background: linear-gradient(
    to right,
    var(--v-info-base) 0%,
    var(--v-info-base) 33%,
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

  background-image: linear-gradient(to bottom, transparent, var(--v-background-base));
}
</style>
