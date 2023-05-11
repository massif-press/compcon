<template>
  <v-container>
    <fieldset>
      <legend class="text-overline px-4">CONTENTS</legend>
      <v-card-text>
        <v-row justify="space-around">
          <v-col v-for="n in Math.ceil(content.length / 3)">
            <div v-for="item in content.slice(3 * (n - 1), 3 * n)">
              <v-btn
                variant="text"
                color="primary"
                class="heading h3"
                @click="scrollTo(item)"
                v-text="getLangItem(item, 'title')"
              />
              <div v-for="child in (item as any).children">
                <v-btn
                  variant="text"
                  color="primary"
                  class="heading h4 ml-4"
                  @click="scrollTo(child)"
                  v-text="getLangItem(child, 'title')"
                />
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </fieldset>
    <v-container class="px-12 pb-12">
      <div v-for="item in content" :id="`e_${(item as any).title.en.replace(/\W/g, '')}`">
        <cc-title
          small
          color="primary"
          class="mb-3 mt-4"
          style="padding-left: 300px !important; margin-left: -350px !important"
        >
          {{ getLangItem(item, 'title') }}</cc-title
        >
        <div v-html="getLangItem(item, 'content')" class="content" />
        <div v-for="child in (item as any).children" :id="`e_${child.title.en.replace(/\W/g, '')}`">
          <h3 class="text-primary ml-n5" v-text="getLangItem(child, 'title')" />
          <div v-html="getLangItem(child, 'content')" class="content" />
          <div
            v-for="subchild in (child as any).children"
            :id="`e_${subchild.title.en.replace(/\W/g, '')}`"
          >
            <b class="text-primary ml-n2" v-text="getLangItem(subchild, 'title')" />
            <div v-html="getLangItem(subchild, 'content')" class="content" />
          </div>
        </div>
      </div>
    </v-container>
  </v-container>
  <v-footer border app class="py-0 bg-primary">
    <v-tabs density="compact" center-active grow>
      <v-tab v-for="item in content" v-text="getLangItem(item, 'title')" @click="scrollTo(item)" />
    </v-tabs>
  </v-footer>
  <v-btn
    size="x-small"
    variant="tonal"
    icon
    color="primary"
    class="fade-select"
    style="position: fixed; bottom: 35px; right: 0; margin: 8px; z-index: 999"
    @click="scrollTo(content[0])"
  >
    <v-icon size="30">mdi-arrow-up</v-icon>
  </v-btn>
</template>

<script lang="ts">
export default {
  name: 'using-compcon',
  inheritAttrs: false,
  props: {
    lang: {
      type: String,
      default: 'en',
    },
    content: {
      type: Array,
      default: () => [],
    },
    preScroll: {
      type: String,
      default: '',
    },
  },
  mounted() {
    if (this.preScroll) {
      this.scrollTo(this.preScroll);
    } else window.scrollTo({ top: 0 });
  },
  methods: {
    getLangItem(item: any, type: string) {
      if (typeof item === 'string') return item;
      return item[type][this.lang];
    },
    scrollTo(item: any): void {
      const title = this.getLangItem(item, 'title');
      const el = document.getElementById(`e_${title.replace(/\W/g, '')}`);
      if (el) {
        console.log(el);
        const yOffset = -60;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    },
  },
};
</script>

<style scoped>
.content >>> p {
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
</style>
