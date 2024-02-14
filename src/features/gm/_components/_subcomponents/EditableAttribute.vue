<template>
  <v-card :color="cardColor" variant="tonal" class="text-center">
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
      <v-select
        v-if="selections.length"
        v-model="model"
        :items="selections"
        density="compact"
        variant="outlined"
        hide-details
        @input="$emit('set', { value: model, tier: model })"
        @blur="editMode = false"
        @keyup.enter="editMode = false"
        @focus="$event.target.select()" />
      <v-text-field
        v-else
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
    </v-card-text>
  </v-card>
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
    selections: {
      type: Array,
      required: false,
      default: () => [],
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
    cardColor: '',
  }),
  watch: {
    val: {
      immediate: true,
      deep: true,
      handler(oldval, newval) {
        this.model = this.val;
        if (oldval !== newval) this.flashBackground();
      },
    },
  },
  mounted() {
    this.model = this.val;
  },
  methods: {
    flashBackground() {
      this.cardColor = 'accent-darken-1';
      setTimeout(() => {
        this.cardColor = 'accent-lighten-1';
      }, 50);
      setTimeout(() => {
        this.cardColor = 'accent';
      }, 50);
      setTimeout(() => {
        this.cardColor = '';
      }, 800);
    },
  },
};
</script>

<style scoped>
.v-text-field >>> input {
  text-align: center;
  margin-right: -12px;
}

.v-card {
  transition: all 0.3s;
}
</style>
