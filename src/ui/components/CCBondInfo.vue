<template>
  <cc-panel density="compact"
    color="surface">
    <template #toolbar>
      <cc-toolbar v-if="!hideTitle"
        :title="bond.Name"
        hide-close>
        <template #toolbar-items>
          <cc-lcp-info :item="bond"
            color="stark" />
        </template>
      </cc-toolbar>
    </template>
    <slot name="button" />
    <div class="px-4">
      <v-row>
        <v-col cols="auto">
          <v-img :src="bond.Image"
            :width="imageError ? 0 : '376px'"
            :height="imageError ? 0 : '600px'"
            class="rounded-lg"
            @error="imageError = true"
            @load="imageError = false" />
        </v-col>
        <v-col class="text-text">
          <div class="heading h4 font-weight-bold">MAJOR IDEALS</div>
          <ul class="ml-6 mb-3">
            <li v-for="(s, index) in bond.MajorIdeals"
              :key="`major-${index}`"
              v-text="s" />
          </ul>
          <div class="heading h4 font-weight-bold">MINOR IDEALS</div>
          <ul class="ml-6 mb-3">
            <li v-for="(s, index) in bond.MinorIdeals"
              :key="`minor-${index}`"
              v-text="s" />
          </ul>
          <div v-for="(q, index) in bond.Questions"
            :key="`question-${index}`">
            <div class="heading h4 font-weight-bold"
              v-text="q.question" />
            <ul class="ml-6 mb-3">
              <li v-for="(o, index) in q.options"
                :key="`option-${index}`"
                v-text="o" />
            </ul>
          </div>
        </v-col>
      </v-row>
      <cc-heading line><span class="heading h3">Bond Powers</span></cc-heading>
      <cc-masonry-grid :items="bond.Powers">
        <template #default="{ item }">
          <cc-bond-power-card :power="item" />
        </template>
      </cc-masonry-grid>
    </div>
  </cc-panel>
</template>

<script lang="ts">
export default {
  name: 'CcBondInfo',
  props: { bond: { type: Object, required: true }, hideTitle: { type: Boolean } },
  data: () => ({
    imageError: false,
  }),
};
</script>
