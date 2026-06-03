<template>
  <div style="container: size">
    <div class="heading" style="font-size: calc(25px + 2.5cqw); padding-left: 2.5vw">
      {{ title }}
    </div>
  </div>
  <v-container :style="mobile ? 'padding:0' : 'padding: 0 12vw 0 12vw'" class="pb-12">
    <fieldset class="mx-1">
      <legend class="text-cc-overline pa-1">CONTENTS</legend>
      <v-card-text class="pa-0 my-2">
        <v-row justify="space-around">
          <v-col v-for="n in Math.ceil(content.length / 3)" :key="`col-${n}`">
            <div v-for="(item, itemIdx) in content.slice(3 * (n - 1), 3 * n)" :key="`toc-item-${itemIdx}`">
              <div
                class="heading h3 my-2 text-link"
                style="cursor: pointer"
                @click="scrollTo(item)"
                v-text="getLangItem(item, 'title')" />
              <div v-for="(child, childIdx) in (item as any).children" :key="`toc-child-${childIdx}`">
                <div
                  color="accent"
                  class="heading h4 ml-4 my-1 text-link"
                  @click="scrollTo(child)"
                  v-text="getLangItem(child, 'title')" />
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </fieldset>
    <v-container :class="mobile ? 'px-4' : 'px-12 pb-12'">
      <div v-for="(item, itemIdx) in content" :key="`content-${itemIdx}`" :id="`e_${(item as any).title.en.replace(/\W/g, '')}`">
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
        <div v-for="(child, childIdx) in (item as any).children" :key="`child-${childIdx}`" :id="`e_${child.title.en.replace(/\W/g, '')}`">
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
  </v-container>
  <v-footer border app class="py-0 bg-primary">
    <v-tabs density="compact" center-active grow>
      <v-tab v-for="(item, itemIdx) in content" :key="`tab-${itemIdx}`" v-text="getLangItem(item, 'title')" @click="scrollTo(item)" />
    </v-tabs>
  </v-footer>
  <v-btn
    size="x-small"
    icon
    color="primary"
    variant="plain"
    style="position: fixed; bottom: 35px; right: 0; margin: 8px; z-index: 999"
    @click="scrollTo(content[0])">
    <v-icon size="30">mdi-arrow-up</v-icon>
  </v-btn>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'
import { useSrdView } from './useSrdView'

defineOptions({ name: 'using-compcon', inheritAttrs: false })

const props = withDefaults(defineProps<{
  title?: string
  content?: any[]
  preScroll?: string
}>(), {
  content: () => [],
  preScroll: '',
})

const { smAndDown: mobile, xs: portrait } = useDisplay()
const { lang, getLangItem, scrollTo } = useSrdView(props)
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
  cursor: pointer;
  color: rgb(var(--v-theme-accent));
  transition: color 0.2s ease;
}

.text-link:hover {
  color: rgb(var(--v-theme-secondary));
}
</style>
