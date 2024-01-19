<template>
  <v-col style="min-width: 10vw">
    <v-card variant="tonal" class="text-center">
      <div class="heading pt-1">
        {{ stat.title }}
        <v-btn
          v-if="deletable"
          icon
          size="xs"
          class="fade-select ml-1 mt-n1"
          @click="$emit('remove', stat.key)"
          ><v-icon icon="mdi-delete" size="x-small" color="error"
        /></v-btn>
      </div>
      <v-card-text class="px-3 pb-1 pt-0">
        <v-text-field
          v-if="stat.type === 'number'"
          v-model="model"
          variant="outlined"
          density="compact"
          hide-details
          autofocus
          type="number"
          @input="$emit('set', { value: Number(model), tier: 0 })"
          @blur="editMode = false"
          @keyup.enter="editMode = false"
          @focus="$event.target.select()" />
        <div v-else-if="'size'">
          <v-select
            v-model="model"
            :items="stat.sizes"
            dense
            outlined
            hide-details
            @input="$emit('set', { value: model, tier: model })"
            @blur="editMode = false"
            @keyup.enter="editMode = false"
            @focus="$event.target.select()" />
        </div>
        <div v-else-if="'sizes'">sizes</div>
        <div v-else>Unknown Stat type: {{ stat.type }}</div>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script lang="ts">
export default {
  name: 'editable-attribute',
  props: {
    stat: {
      type: Object,
      required: true,
    },
    val: {
      type: Number,
      required: false,
      default: '',
    },
    cols: {
      type: [String, Number],
      required: false,
      default: '',
    },
    deletable: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['set', 'remove'],
  data: () => ({
    model: 0,
    editMode: false,
  }),
  watch: {
    stat: {
      immediate: true,
      handler() {
        this.model = this.val;
      },
    },
  },
  mounted() {
    this.model = this.val;
  },
};
</script>
