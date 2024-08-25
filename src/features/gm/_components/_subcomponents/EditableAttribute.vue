<template>
  <v-card :color="cardColor" variant="tonal" class="text-center" style="height: 100%">
    <v-toolbar density="compact" height="40">
      <v-toolbar-title class="heading text-uppercase" style="font-size: 16px">
        {{ stat.title }}
        <v-icon v-if="overwriteVal" icon="mdi-lock" color="secondary" size="x-small" />
        <v-btn
          v-if="!readonly && deletable"
          icon
          size="xs"
          class="fade-select ml-1 mt-n1"
          @click="$emit('remove', stat.key)">
          <v-icon icon="mdi-delete" size="x-small" color="error" />
        </v-btn>
      </v-toolbar-title>
    </v-toolbar>
    <v-card-text class="px-2 pb-1 pt-0" style="position: relative">
      <div v-if="overwriteVal">
        <div class="heading h3 text-center my-2">{{ overwriteVal }}</div>
      </div>
      <div v-else-if="readonly">
        <v-divider />
        <div class="heading h2 text-center py-1">{{ totalWithBonus }}</div>
      </div>
      <div v-else-if="stat.key === 'size'">
        <v-combobox
          v-model="model"
          :items="selections"
          density="compact"
          variant="outlined"
          hide-details
          center-affix
          type="number"
          @input="$emit('set', { value: model, tier: model })"
          @blur="editMode = false"
          @keyup.enter="editMode = false"
          @focus="$event.target.select()" />
      </div>
      <div v-else>
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
      </div>
      <div v-if="bonuses.length" v-for="bonus in bonuses" class="text-right">
        <v-menu open-on-hover>
          <template v-slot:activator="{ props }">
            <v-icon
              v-if="readonly"
              v-bind="props"
              :icon="bonus.Icon"
              color="exotic"
              style="position: absolute; right: 2px; bottom: 0" />
            <v-chip
              v-else
              dense
              variant="elevated"
              elevation="0"
              size="x-small"
              class="mt-1"
              color="exotic"
              v-bind="props">
              <b class="pr-2">{{ bonus.Symbol }}{{ bonus.Value }}</b>
              {{ stat.title }}
            </v-chip>
          </template>
          <v-card>
            <v-toolbar density="compact" color="exotic">
              <v-toolbar-title>
                <v-icon start :icon="bonus.Icon" />
                {{ bonus.Title }}
              </v-toolbar-title>
            </v-toolbar>
            <v-card-text class="pt-1 pb-3">
              <div>
                {{ bonus.Detail }}
              </div>
              <div class="text-right">
                <i>From {{ bonus.Source }}</i>
              </div>
            </v-card-text>
          </v-card>
        </v-menu>
      </div>
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
  computed: {
    overwriteVal() {
      const overwrite = this.bonuses.find((x) => x.Overwrite);
      if (overwrite) return overwrite.Value;
      return '';
    },
    totalWithBonus() {
      return this.val + this.bonuses.reduce((acc, x) => acc + x.Value, 0);
    },
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
