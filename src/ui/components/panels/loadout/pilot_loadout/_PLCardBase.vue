<template>
  <v-col cols="12" md="4">
    <v-card
      flat
      tile
      class="clipped-large panel"
      :style="!mobile && 'height: 100%'"
      @click="$emit('propagate-click')">
      <v-toolbar density="compact" color="primary" class="heading h3" height="42">
        <v-row dense align="center">
          <v-col v-if="item" cols="auto">
            <v-menu>
              <template #activator="{ props }">
                <v-btn v-if="!readonly" size="x-small" icon variant="plain" v-bind="props">
                  <v-icon size="x-large" icon="mdi-cog" />
                </v-btn>
              </template>
              <v-list density="compact" slim border tile class="pa-0">
                <v-list-item
                  @click.stop="selectorDialog = true"
                  prepend-icon="mdi-swap-vertical-variant"
                  title="Change Item" />
                <v-divider />
                <v-list-item
                  v-if="item.CanSetDamage"
                  @click.stop="($refs as any).damageTypeDialog.show()"
                  prepend-icon="cc:variable"
                  title="Select Damage">
                  Type
                </v-list-item>
                <v-list-item
                  @click.stop="($refs as any).cName.show()"
                  prepend-icon="mdi-circle-edit-outline"
                  title="Set Custom Name" />
                <v-list-item
                  @click.stop="($refs as any).cDesc.show()"
                  prepend-icon="mdi-circle-edit-outline"
                  title="Set Custom Description" />
                <v-divider />
                <v-list-item
                  @click.stop="$emit('remove', item)"
                  prepend-icon="mdi-delete"
                  color="error"
                  title="Remove Item" />
              </v-list>
            </v-menu>
          </v-col>
          <v-col v-else cols="auto" class="pl-3" />
          <v-col cols="auto">
            {{ title }}
            <cc-tooltip v-if="extended" simple inline content="Extended Harness">
              <v-icon dark right>mdi-alpha-e-box-outline</v-icon>
            </cc-tooltip>
          </v-col>
          <v-spacer />
          <v-col cols="auto">
            <div v-if="!readonly" class="text-right">
              <v-btn
                v-if="item"
                size="x-small"
                icon
                variant="plain"
                @click.stop="$emit('remove', item)">
                <v-icon size="x-large" icon="mdi-delete" />
              </v-btn>
              <v-btn icon variant="plain" size="x-small" @click.stop="selectorDialog = true">
                <v-icon size="x-large" :icon="item ? 'mdi-swap-vertical-variant' : 'mdi-plus'" />
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-toolbar>

      <div class="px-2 pb-1" style="height: 100%" @click.stop="detailDialog = true">
        <div style="cursor: pointer">
          <v-row v-if="item">
            <v-col class="h2 heading pb-0">
              {{ item.Name }}
              <cc-tooltip v-if="item.Note" simple inline :content="item.Note">
                <v-icon size="x-small" color="active">mdi-note</v-icon>
              </cc-tooltip>
            </v-col>
            <v-col cols="auto">
              <slot name="title-items" />
            </v-col>
          </v-row>

          <v-card v-if="item && item.FlavorDescription" variant="tonal" class="mx-1 py-1">
            <p v-if="item.FlavorDescription.length < 600" v-html-safe="item.FlavorDescription" />
            <div v-else>
              <div :style="`max-height: ${showAllFlavor ? '' : '60px'}`">
                <p v-html-safe="item.FlavorDescription" style="white-space: pre-wrap" />
              </div>
              <div class="text-right">
                <v-btn
                  @click.stop="showAllFlavor = !showAllFlavor"
                  icon
                  color="accent"
                  class="fade-select"
                  size="x-small">
                  <v-icon
                    size="30"
                    :icon="showAllFlavor ? 'mdi-chevron-double-up' : 'mdi-chevron-double-down'" />
                </v-btn>
              </div>
            </div>
          </v-card>
        </div>

        <div v-if="item" class="text-center">
          <slot />
          <div v-if="item.Deployables.length">
            <v-row v-if="item.Deployables" dense justify="center" class="my-1">
              <v-col v-for="d in item.Deployables" cols="auto">
                <cc-deployable-info :deployable="d" hover :name-override="item.Name" class="mx-2" />
              </v-col>
            </v-row>
          </div>
          <div v-if="item.Tags && item.Tags.length" class="text-left mt-1">
            <cc-tags :size="mobile ? 'x-small' : 'small'" :tags="item.Tags" color="secondary" />
          </div>
        </div>

        <div
          v-else
          class="text-center fade-select"
          style="height: 100%; position: relative; cursor: pointer"
          @click.stop="selectorDialog = true">
          <div
            class="heading h2 text-disabled"
            style="position: absolute; top: 50%; transform: translateY(100%); left: 0; right: 0">
            <cc-slashes />
            EMPTY
            <cc-slashes />
          </div>
        </div>
      </div>
    </v-card>

    <cc-solo-modal
      v-model="selectorDialog"
      no-actions
      density="compact"
      :title="`Equip ${title}`"
      fullscreen>
      <slot name="selector" />
    </cc-solo-modal>

    <cc-solo-modal v-model="detailDialog" no-confirm :title="itemTitle" large>
      <div class="py-2 px-4">
        <cc-item-card :item="item" />
        <slot name="detail" />
        <div v-if="item">
          <v-textarea
            v-model="item.Note"
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

    <cc-string-edit-dialog
      v-if="item"
      ref="cName"
      :placeholder="item.Name"
      label="Custom Item Name"
      @save="save('Name', $event)"
      @reset="save('Name', '')" />
    <cc-string-edit-dialog
      v-if="item"
      ref="cDesc"
      multiline
      auto-grow
      :placeholder="item.FlavorDescription || item.Description"
      label="Custom Item Description"
      @save="save('FlavorDescription', $event)"
      @reset="save('FlavorDescription', '')" />
    <cc-damage-type-picker
      v-if="item"
      ref="damageTypeDialog"
      :allowed-types="['Explosive', 'Energy', 'Kinetic']"
      @select="save('DamageTypeOverride', $event)" />
  </v-col>
</template>

<script lang="ts">
export default {
  name: 'pl-pilot-card-base',
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
  data: () => ({
    showAllFlavor: false,
    selectorDialog: false,
    detailDialog: false,
  }),
  emits: ['propagate-click', 'remove', 'save'],
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
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
      this.$emit('save');
    },
  },
};
</script>
