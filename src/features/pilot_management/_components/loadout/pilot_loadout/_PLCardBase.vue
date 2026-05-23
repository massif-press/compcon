<template>
  <v-col cols="12"
    md="4">
    <v-card flat
      tile
      class="clipped-large panel"
      :style="!mobile && 'height: 100%'"
      @click="$emit('propagate-click')">
      <v-toolbar density="compact"
        color="primary"
        class="heading h3"
        height="42">
        <v-row dense
          align="center">
          <v-col v-if="item"
            cols="auto">
            <v-menu>
              <template #activator="{ props }">
                <v-btn v-if="!readonly"
                  size="x-small"
                  icon
                  variant="plain"
                  v-bind="props">
                  <v-icon size="x-large"
                    icon="mdi-cog" />
                </v-btn>
              </template>
              <v-list density="compact"
                slim
                border
                tile
                class="pa-0">
                <v-list-item prepend-icon="mdi-swap-vertical-variant"
                  title="Change Item"
                  @click.stop="selectorDialog = true" />
                <v-divider />
                <v-list-item v-if="item.CanSetDamage"
                  prepend-icon="cc:variable"
                  title="Select Damage"
                  @click.stop="($refs as any).damageTypeDialog.show()">
                  Type
                </v-list-item>
                <v-list-item prepend-icon="mdi-circle-edit-outline"
                  title="Set Custom Name"
                  @click.stop="($refs as any).cName.show()" />
                <v-list-item prepend-icon="mdi-circle-edit-outline"
                  title="Set Custom Description"
                  @click.stop="($refs as any).cDesc.show()" />
                <v-divider />
                <v-list-item prepend-icon="mdi-delete"
                  color="error"
                  title="Remove Item"
                  @click.stop="$emit('remove', item)" />
              </v-list>
            </v-menu>
          </v-col>
          <v-col v-else
            cols="auto"
            class="pl-3" />
          <v-col cols="auto">
            {{ title }}
            <cc-tooltip v-if="extended"
              simple
              inline
              content="Extended Harness">
              <v-icon dark
                right>mdi-alpha-e-box-outline</v-icon>
            </cc-tooltip>
          </v-col>
          <v-spacer />
          <v-col cols="auto">
            <cc-broken-reference v-if="item"
              :item="item" />
          </v-col>
          <v-col cols="auto">
            <div v-if="!readonly"
              class="text-right">
              <v-btn v-if="item"
                size="x-small"
                icon
                variant="plain"
                @click.stop="$emit('remove', item)">
                <v-icon size="x-large"
                  icon="mdi-delete" />
              </v-btn>
              <v-btn icon
                variant="plain"
                size="x-small"
                @click.stop="selectorDialog = true">
                <v-icon size="x-large"
                  :icon="item ? 'mdi-swap-vertical-variant' : 'mdi-plus'" />
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-toolbar>

      <v-toolbar v-if="item && item.IsDeprecated"
        color="error"
        class="text-center heading"
        dense>
        This item is deprecated and can be removed.
      </v-toolbar>

      <div class="px-2 pb-1"
        style="height: 100%"
        @click.stop="item ? detailDialog = true : selectorDialog = true">
        <div style="cursor: pointer">
          <v-row v-if="item">
            <v-col class="h3 heading pb-0">
              {{ item.Name }}
              <cc-tooltip v-if="item.Note"
                simple
                inline
                :content="item.Note">
                <v-icon size="x-small"
                  color="active">mdi-note</v-icon>
              </cc-tooltip>
            </v-col>
            <v-col cols="auto">
              <slot name="title-items" />
            </v-col>
          </v-row>

          <v-card v-if="item && item.FlavorDescription"
            color="panel"
            flat
            tile
            style="position: relative;"
            class="mx-1 px-2 py-1 mt-3 mb-2">
            <p v-if="item.FlavorDescription.length < 600"
              v-html-safe="item.FlavorDescription"
              class="text-cc-overline" />
            <div v-else>
              <div :style="`max-height: ${showAllFlavor ? '' : '60px'}`">
                <p v-html-safe="item.FlavorDescription"
                  style="white-space: pre-wrap" />
              </div>
              <div style="position: absolute; bottom: 0;  right: 0">
                <v-btn icon
                  color="accent"
                  flat
                  tile
                  class="fade-select"
                  size="x-small"
                  @click.stop="showAllFlavor = !showAllFlavor">
                  <v-icon size="30"
                    :icon="showAllFlavor ? 'mdi-chevron-double-up' : 'mdi-chevron-double-down'" />
                </v-btn>
              </div>
            </div>
          </v-card>
        </div>


        <div v-if="item"
          class="text-center">
          <slot />
          <div v-if="item.Actions.length">
            <v-row no-gutters
              justify="center">
              <v-col v-for="(a, i) in item.Actions"
                :key="`dprof_${i}`"
                cols="auto">
                <cc-action :action="a"
                  class="ma-2" />
              </v-col>
            </v-row>
          </div>
          <div v-if="item.Deployables.length">
            <v-row v-if="item.Deployables"
              dense
              justify="center"
              class="my-1">
              <v-col v-for="(d, index) in item.Deployables"
                :key="`deployable-${index}`"
                cols="auto">
                <cc-deployable-info :deployable="d"
                  :name-override="item.Name"
                  class="mx-2" />
              </v-col>
            </v-row>
          </div>
          <div v-if="item.Tags && item.Tags.length"
            class="text-left mt-1">
            <cc-tags :size="mobile ? 'x-small' : 'small'"
              :tags="item.Tags"
              color="secondary" />
          </div>
        </div>

        <div v-else
          class="text-center fade-select"
          style="height: 60px; position: relative; cursor: pointer">
          <div class="heading h2 text-disabled"
            style="position: absolute; transform: translateY(40%); left: 0; right: 0">
            <cc-slashes />
            EMPTY
            <cc-slashes />
          </div>
        </div>
      </div>
    </v-card>

    <cc-solo-modal v-model="selectorDialog"
      :title="`Equip ${title}`"
      clip>
      <slot name="selector" />
    </cc-solo-modal>

    <cc-solo-modal v-model="detailDialog"
      no-confirm
      :title="itemTitle"
      large>
      <div class="py-2 px-4">
        <cc-item-card :item="item" />
        <slot name="detail" />
        <div v-if="item">
          <v-textarea v-model="item.Note"
            variant="outlined"
            auto-grow
            rows="2"
            filled
            density="compact"
            hide-details
            prepend-icon="mdi-note"
            label="Equipment Notes"
            class="mt-2" />
        </div>
      </div>
    </cc-solo-modal>

    <cc-string-edit-dialog v-if="item"
      ref="cName"
      :placeholder="item.Name"
      label="Custom Item Name"
      @save="save('Name', $event)"
      @reset="save('Name', '')" />
    <cc-string-edit-dialog v-if="item"
      ref="cDesc"
      multiline
      auto-grow
      :placeholder="item.FlavorDescription || item.Description"
      label="Custom Item Description"
      @save="save('FlavorDescription', $event)"
      @reset="save('FlavorDescription', '')" />
    <cc-damage-type-picker v-if="item"
      ref="damageTypeDialog"
      :allowed-types="['Explosive', 'Energy', 'Kinetic']"
      @select="save('DamageTypeOverride', $event)" />
  </v-col>
</template>

<script lang="ts">
import { AchievementEventSystem } from '@/user/achievements/AchievementEvent';
import { useMobile } from '@/composables/useMobile';


export default {
  name: 'PlPilotCardBase',
  mixins: [useMobile],
  props: {
    title: {
      type: String,
      required: true,
    },
    item: {
      type: Object,
      required: false,
      default: null,
    },
    extended: {
      type: Boolean,
    },
    readonly: {
      type: Boolean,
    },
  },
  emits: ['propagate-click', 'remove', 'save'],
  data: () => ({
    showAllFlavor: false,
    selectorDialog: false,
    detailDialog: false,
  }),
  computed: {
    itemTitle() {
      if (!this.item) return '';
      if (this.item.Name !== this.item.TrueName) return `${this.item.Name} (${this.item.TrueName})`;
      return this.item.TrueName;
    },
  },
  methods: {
    closeSelector() {
      this.selectorDialog = false;
    },
    openDetail() {
      this.detailDialog = true;
    },
    save(prop, newName) {
      this.item[prop] = newName;
      AchievementEventSystem.emit('add_gear_description');

      this.$emit('save');
    },
  },
};
</script>
