<template>
  <v-layout>
    <v-navigation-drawer style="position: fixed" width="320">
      <v-list density="compact" slim color="primary" class="my-6 text-link">
        <div v-for="(item, index) in content" :key="`section-${index}`" :value="index" class="my-3">
          <v-list-item @click="scrollTo(item)" class="py-0">
            <span class="heading h3">{{ getLangItem(item, 'title') }}</span>
          </v-list-item>
          <v-list-item
            v-if="(item as any).children"
            v-for="(child, childIdx) in (item as any).children"
            :key="`child-nav-${childIdx}`"
            class="pl-8 my-n2"
            @click="scrollTo(child)"
            :title="getLangItem(child, 'title')" />
        </div>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container class="px-12 pb-12">
        <div
          class="heading h1 text-center"
          style="font-size: 4vw; line-height: 6vh; letter-spacing: 1.6vw">
          {{ title }}
        </div>
        <div
          v-for="(item, index) in content"
          :key="`content-${index}`"
          :id="`e_${(item as any).title.en.replace(/\W/g, '')}`"
          class="px-12">
          <cc-title
            v-if="mobile"
            small
            color="primary"
            class="mb-3 mt-6"
            style="padding-left: 50px !important; margin-left: -60px !important; max-width: 100%">
            {{ getLangItem(item, 'title') }}
          </cc-title>
          <cc-title
            v-else
            small
            color="primary"
            class="mb-3 mt-6"
            style="padding-left: 300px !important; margin-left: -350px !important">
            {{ getLangItem(item, 'title') }}
          </cc-title>
          <div v-html-safe="getLangItem(item, 'content')" class="content" />
          <div
            v-for="(child, childIdx) in (item as any).children"
            :key="`child-${childIdx}`"
            :id="`e_${child.title.en.replace(/\W/g, '')}`">
            <h3
              class="text-accent mt-4"
              :class="mobile ? 'ml-n2' : 'ml-n5'"
              v-text="getLangItem(child, 'title')" />
            <div v-html-safe="getLangItem(child, 'content')" class="content" />
            <div
              v-for="(subchild, subIdx) in (child as any).children"
              :key="`subchild-${subIdx}`"
              :id="`e_${subchild.title.en.replace(/\W/g, '')}`">
              <b class="text-accent ml-n2" v-text="getLangItem(subchild, 'title')" />
              <div v-html-safe="getLangItem(subchild, 'content')" class="content" />
            </div>
          </div>
        </div>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script lang="ts">
import { useMobile } from '@/composables/useMobile';
import { srdViewMixin } from './_srdViewMixin';

export default {
  name: 'using-compcon',
  mixins: [useMobile, srdViewMixin],
  data: () => ({
    open: [],
  }),
};
</script>

<style scoped>
.content :deep(p) {
  padding-bottom: 12px;
}

fieldset {
  padding: 0 12px;
  border-radius: 5px;
}

legend {
  border: 1px solid;
  border-radius: 5px;
}

.text-link {
  transition: color 0.2s ease;
}

.text-link:hover {
  color: rgb(var(--v-theme-accent));
}
</style>
