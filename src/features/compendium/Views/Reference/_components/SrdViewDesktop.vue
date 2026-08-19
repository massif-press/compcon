<template>
  <v-layout>
    <v-navigation-drawer
      style="position: fixed"
      width="320"
    >
      <v-list
        density="compact"
        slim
        color="primary"
        class="my-6 text-link"
      >
        <div
          v-for="(item, index) in content"
          :key="`section-${index}`"
          :value="index"
          class="my-3"
        >
          <v-list-item
            class="py-0"
            @click="scrollTo(item)"
          >
            <span class="heading h3">{{ srd(item, 'title') }}</span>
          </v-list-item>
          <v-list-item
            v-for="(child, childIdx) in (item as any).children"
            v-if="(item as any).children"
            :key="`child-nav-${childIdx}`"
            class="pl-8 my-n2"
            :title="srd(child, 'title')"
            @click="scrollTo(child)"
          />
        </div>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container class="px-12 pb-12">
        <div
          class="heading h1 text-center"
          style="font-size: 4vw; line-height: 6vh; letter-spacing: 1.6vw"
        >
          {{ title }}
        </div>
        <div
          v-for="(item, index) in content"
          :id="`e_${(item as any).title.en.replace(/\W/g, '')}`"
          :key="`content-${index}`"
          class="px-12"
        >
          <cc-title
            v-if="mobile"
            small
            color="primary"
            class="mb-3 mt-6"
            style="padding-left: 50px !important; margin-left: -60px !important; max-width: 100%"
          >
            {{ srd(item, 'title') }}
          </cc-title>
          <cc-title
            v-else
            small
            color="primary"
            class="mb-3 mt-6"
            style="padding-left: 300px !important; margin-left: -350px !important"
          >
            {{ srd(item, 'title') }}
          </cc-title>
          <div
            v-html-safe="srd(item, 'content')"
            class="content"
          />
          <div
            v-for="(child, childIdx) in (item as any).children"
            :id="`e_${child.title.en.replace(/\W/g, '')}`"
            :key="`child-${childIdx}`"
          >
            <h3
              class="text-accent mt-4"
              :class="mobile ? 'ml-n2' : 'ml-n5'"
              v-text="srd(child, 'title')"
            />
            <div
              v-html-safe="srd(child, 'content')"
              class="content"
            />
            <div
              v-for="(subchild, subIdx) in (child as any).children"
              :id="`e_${subchild.title.en.replace(/\W/g, '')}`"
              :key="`subchild-${subIdx}`"
            >
              <b
                class="text-accent ml-n2"
                v-text="srd(subchild, 'title')"
              />
              <div
                v-html-safe="srd(subchild, 'content')"
                class="content"
              />
            </div>
          </div>
        </div>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useDisplay } from 'vuetify'
  import { useSrdView } from './useSrdView'

  defineOptions({ name: 'using-compcon', inheritAttrs: false })

  const props = withDefaults(
    defineProps<{
      title?: string
      content?: any[]
      preScroll?: string
    }>(),
    {
      content: () => [],
      preScroll: '',
    }
  )

  const { smAndDown: mobile, xs: portrait } = useDisplay()
  const { srd, scrollTo } = useSrdView(props)

  const open = ref<any[]>([])
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
