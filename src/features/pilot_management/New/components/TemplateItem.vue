<template>
  <v-row
    no-gutters
    align="start"
    class="rounded-s-xl mb-2"
    style="position: relative; border: 1px solid rgb(var(--v-theme-primary))">
    <v-slide-x-reverse-transition>
      <v-col
        v-if="!mobile || (mobile && !expanded)"
        cols="auto"
        class="mr-2 pa-2text-center border-e-sm"
        style="border-color: rgb(var(--v-theme-primary))">
        <v-img :src="frameImage" width="152px" max-height="206px" />
      </v-col>
    </v-slide-x-reverse-transition>

    <v-col class="pt-1 ml-n1">
      <v-row dense :class="`px-2 ${isSelected ? 'selected-gradient' : 'gradient'}`">
        <v-col class="text-white">
          <div v-show="!$vuetify.display.mdAndDown" class="text-overline mt-n1">
            {{ template.code }}
          </div>
          <div :class="!$vuetify.display.mdAndDown ? 'heading h1 mt-n6 mb-0 pb-0' : 'heading h2'">
            {{ template.name }}
          </div>
        </v-col>
        <div
          :style="mobile ? 'margin-top: -6px' : 'position: absolute; right: 0; top: 0'"
          class="ml-3">
          <cc-button
            :size="portrait ? 'x-small' : 'small'"
            :color="isSelected ? 'success' : 'accent'"
            :prepend-icon="isSelected ? 'mdi-check' : 'mdi-chevron-triple-right'"
            @click="$emit('select')">
            <span v-if="!isSelected">{{ $t('pm.new.selectTemplate', { name: template.name }) }}</span>
            <span v-else>{{ $t('pm.new.templateSelected', { name: template.name }) }}</span>
          </cc-button>
        </div>
      </v-row>
      <div v-html-safe="template.description" class="pa-2" />
      <div class="sidebar-box ml-2" :style="`max-height:${expanded ? '100%' : '80px;'}`">
        <div class="panel clipped px-2">
          <div class="caption text-accent mt-1"><b>{{ $t('ui.titles.tactics') }}</b></div>
          <p v-html-safe="template.tactics" />
        </div>
        <div class="panel clipped py-1 px-2 my-2">
          <v-row>
            <v-col>
              <div class="caption text-accent">
                {{ $t('pm.new.pilot') }}
                <cc-slashes class="pr-1" />
                <b>{{ $t('pm.new.skills') }}</b>
              </div>
              <v-row dense justify="center" class="px-2 text-center">
                <v-col v-for="s in template.build.skills" :key="s">
                  <v-tooltip location="top" max-width="600px" :open-on-click="mobile">
                    <template #activator="{ props }">
                      <cc-chip v-bind="props" bg-color="info">
                        {{ item('Skills', s).Name }}
                      </cc-chip>
                    </template>
                    <div class="heading h3">{{ item('Skills', s).Name }}</div>
                    <v-divider />
                    <div v-html-safe="item('Skills', s).Detail" />
                  </v-tooltip>
                </v-col>
              </v-row>
            </v-col>
            <v-col>
              <div class="caption text-accent">
                {{ $t('pm.new.pilot') }}
                <cc-slashes class="pr-1" />
                <b>{{ $t('common.talents') }}</b>
              </div>
              <v-row dense justify="center" class="px-2 text-center">
                <v-col v-for="t in template.build.talents" :key="t" cols="12" md="auto" class="mx-1">
                  <v-tooltip location="top" max-width="600px" :open-on-click="mobile">
                    <template #activator="{ props }">
                      <cc-chip v-bind="props" bg-color="accent">
                        <v-icon start>cc:rank_1</v-icon>
                        {{ item('Talents', t).Name }}
                      </cc-chip>
                    </template>
                    <div class="heading h3">
                      {{ item('Talents', t).Name }} {{ $t('pm.new.i') }}: {{ item('Talents', t).Rank(1).Name }}
                    </div>
                    <v-divider />
                    <div v-html-safe="item('Talents', t).Rank(1).Description" />
                  </v-tooltip>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </div>
        <div class="panel clipped py-1 px-2 my-2">
          <div class="caption text-accent mt-1">
            {{ $t('pm.new.gmsEVEREST') }}
            <cc-slashes class="pr-1" />
            <b>{{ $t('common.loadout') }}</b>
          </div>
          <v-row dense justify="center" class="px-2 text-center">
            <v-col v-for="(m, index) in template.build.mech.mounts" :key="`mount-${index}`">
              <div class="flavor-text text-stark text-center">{{ m.mount_type }} {{ $t('common.mount') }}</div>
              <v-row dense>
                <v-col v-for="(w, index) in m.slots" :key="`slot-${index}`" class="text-center">
                  <cc-item-modal class="mx-1" :item="item('MechWeapons', w)" />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <div class="flavor-text text-stark text-center mt-1">{{ $t('stats.systems') }}</div>
          <v-row dense justify="center" class="px-2 text-center">
            <v-col v-for="s in template.build.mech.systems" :key="s" class="text-center mx-2" cols="auto">
              <cc-item-modal :item="item('MechSystems', s)" />
            </v-col>
          </v-row>
        </div>
        <p class="read-more">
          <v-btn
            size="x-small"
            icon
            border
            class="mb-n3"
            style="background-color: rgb(var(--v-theme-stark-panel))"
            @click="expanded = !expanded">
            <v-icon size="30" color="accent">
              mdi-chevron-double-{{ expanded ? $t('pm.new.up') : $t('pm.new.down') }}
            </v-icon>
          </v-btn>
        </p>
        <div v-if="expanded" style="min-height: 40px" />
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { CompendiumStore } from '@/stores';
import { useDisplay } from 'vuetify';

defineOptions({ name: 'template-item' })

const { smAndDown: mobile, xs: portrait } = useDisplay()

const props = defineProps<{
  template: object
  isSelected?: boolean
}>()

const expanded = ref(false)

const frameImage = computed(() => {
      return props.template.image;
    })

function item(type: string, id: string) {
      return CompendiumStore().referenceByID(type, id) as any;
    }
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
  transition: all 0.2s ease;
}

.sidebar-box .read-more {
  position: absolute;
  bottom: 0px;
  left: 0;
  width: 100%;
  text-align: center;
  margin: 0;
  padding: 20px 0;

  background-image: linear-gradient(to bottom, transparent, rgb(var(--v-theme-background)));
}
</style>
