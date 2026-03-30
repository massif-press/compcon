<template>
  <v-card flat
    tile
    :color="cardColor"
    variant="tonal"
    class="text-center"
    style="height: 100%">
    <v-toolbar density="compact"
      height="38"
      color="primary">
      <div class="heading h4 text-center"
        style="font-size: 18px; width: 100%">
        {{ stat.title }}
        <v-icon v-if="overwriteVal"
          icon="mdi-lock"
          class="pb-1"
          size="x-small" />
        <v-btn v-if="!readonly && deletable"
          icon
          size="xs"
          class="fade-select ml-1 mt-n1"
          @click="$emit('remove', stat.key)">
          <v-icon icon="mdi-delete"
            size="x-small"
            color="error" />
        </v-btn>
      </div>
    </v-toolbar>
    <v-card-text class="px-2 pb-1 pt-0"
      style="position: relative">
      <v-row dense
        align="center"
        justify="center"
        class="heading h4">
        <v-col cols="auto">
          <v-icon :icon="stat.icon"
            size="x-large"
            class="text-disabled" />
        </v-col>
        <v-col v-if="overwriteVal"
          cols="auto">
          <div class="heading h3 text-center my-2">{{ overwriteVal }}</div>
        </v-col>
        <v-col v-else-if="readonly"
          cols="auto">
          <div class="heading h2 text-center py-1">{{ totalWithBonus }}</div>
        </v-col>
        <v-col v-else-if="stat.key === 'size'">
          <v-select v-model="model"
            :items="sizeOptions"
            density="compact"
            variant="outlined"
            hide-details
            center-affix
            type="number"
            @update:model-value="$emit('set', { value: model, tier: model })" />
        </v-col>
        <v-col v-else>
          <v-select v-if="selections.length"
            v-model="model"
            :items="selections"
            density="compact"
            variant="outlined"
            hide-details
            @input="$emit('set', { value: model, tier: model })"
            @blur="editMode = false"
            @keyup.enter="editMode = false"
            @focus="$event.target.select()" />
          <v-text-field v-else
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
        </v-col>
      </v-row>

      <cc-bonus-tooltip v-if="bonuses.length"
        :bonuses="bonuses"
        :stat-title="stat.title"
        :readonly="readonly" />

    </v-card-text>
  </v-card>
</template>

<script lang="ts">
export default {
  name: 'EditableAttribute',
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
    bonuses: {
      type: Object,
      required: false,
      default: () => [],
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
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['set', 'remove'],
  data: () => ({
    model: 0,
    editMode: false,
    cardColor: '',
    sizeOptions: [0.5, 1, 2, 3, 4],
  }),
  computed: {
    overwriteVal() {
      const overwrite = this.bonuses.find((x) => x.Overwrite);
      if (overwrite) return overwrite.Value;
      return '';
    },
    totalWithBonus() {
      return this.val + this.bonuses.filter(x => !x.PerPc).reduce((acc, x) => acc + x.Value || 0, 0);
    },
  },
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
  created() {
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
.v-text-field:deep(input) {
  text-align: center;
  margin-right: -12px;
}

.v-card {
  transition: all 0.3s;
}
</style>
