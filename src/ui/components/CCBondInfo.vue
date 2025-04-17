<template>
  <cc-panel density="compact" color="surface">
    <template #toolbar>
      <cc-toolbar :title="bond.Name" :hideTitle="hideTitle" hide-close>
        <template #toolbar-items>
          <cc-lcp-info :item="bond" color="stark" />
        </template>
      </cc-toolbar>
    </template>
    <slot name="button" />
    <div class="px-4">
      <v-row>
        <v-col cols="auto">
          <v-img
            :src="bond.Image"
            :width="imageError ? 0 : '375px'"
            :height="imageError ? 0 : '600px'"
            @error="imageError = true"
            @load="imageError = false"
            class="rounded-lg" />
        </v-col>
        <v-col class="text-text">
          <div class="heading h4 font-weight-bold">MAJOR IDEALS</div>
          <ul class="ml-6 mb-3">
            <li v-for="s in bond.MajorIdeals" v-text="s" />
          </ul>
          <div class="heading h4 font-weight-bold">MINOR IDEALS</div>
          <ul class="ml-6 mb-3">
            <li v-for="s in bond.MinorIdeals" v-text="s" />
          </ul>
          <div v-for="q in bond.Questions">
            <div class="heading h4 font-weight-bold" v-text="q.question" />
            <ul class="ml-6 mb-3">
              <li v-for="o in q.options" v-text="o" />
            </ul>
          </div>
        </v-col>
      </v-row>
      <cc-heading line><span class="heading h3">Bond Powers</span></cc-heading>
      <masonry-wall
        :items="bond.Powers"
        :column-width="400"
        :gap="16"
        :min-columns="1"
        :max-columns="2">
        <template #default="{ item }">
          <cc-bond-power-card :power="item" />
        </template>
      </masonry-wall>
    </div>
  </cc-panel>
</template>

<script lang="ts">
export default {
  name: 'cc-bond-info',
  props: { bond: { type: Object, required: true }, hideTitle: { type: Boolean } },
  data: () => ({
    imageError: false,
  }),
};
</script>
