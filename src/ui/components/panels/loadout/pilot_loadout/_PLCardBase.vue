<template>
  <v-col cols="4">
    <v-card rounded="0" class="clipped-large panel" style="height: 100%">
      <v-toolbar density="compact" color="primary" class="heading h3">
        <v-row dense align="center">
          <v-col v-if="item" cols="auto">
            <v-menu>
              <template #activator="{ props }">
                <v-btn size="small" icon variant="plain" v-bind="props">
                  <v-icon size="x-large" icon="mdi-cog" />
                </v-btn>
              </template>
              <v-list density="compact">
                <v-list-item
                  @click="($refs as any).selectorDialog.show()"
                  prepend-icon="mdi-swap-vertical-variant"
                  title="Change Item"
                />
                <v-divider />
                <v-list-item
                  v-if="item.CanSetDamage"
                  @click="($refs as any).damageTypeDialog.show()"
                  prepend-icon="cc:variable"
                  title="Select Damage"
                >
                  Type
                </v-list-item>
                <v-list-item
                  @click="($refs as any).cName.show()"
                  prepend-icon="mdi-circle-edit-outline"
                  title="Set Custom Name"
                />
                <v-list-item
                  @click="($refs as any).cDesc.show()"
                  prepend-icon="mdi-circle-edit-outline"
                  title="Set Custom Description"
                />
                <v-divider />
                <v-list-item
                  @click="$emit('remove', item)"
                  prepend-icon="mdi-delete"
                  color="error"
                  title="Remove Item"
                />
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
              <v-btn v-if="item" size="small" icon variant="plain" @click="$emit('remove', item)">
                <v-icon size="x-large" icon="mdi-delete" />
              </v-btn>
              <v-btn
                icon
                variant="plain"
                size="small"
                @click="($refs as any).selectorDialog.show()"
              >
                <v-icon size="x-large" :icon="item ? 'mdi-swap-vertical-variant' : 'mdi-plus'" />
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-toolbar>

      <v-row v-if="item" class="px-2" align="center">
        <v-col class="h2 heading">
          {{ item.Name }}
          <cc-tooltip v-if="item.Note" simple inline :content="item.Note">
            <v-icon size="x-small" color="active">mdi-note</v-icon>
          </cc-tooltip>
        </v-col>
        <v-col cols="auto">
          <slot name="title-items" />
        </v-col>
      </v-row>

      <v-card-text>
        <div v-if="item">
          <slot @click="($refs as any).detailDialog.show()" />
          <div v-if="item.Deployables.length">
            <div class="text-overline ml-n2 text-subtle">EQUIPMENT DEPLOYABLES</div>
            <v-row v-if="item.Deployables" no-gutters justify="center">
              <v-col v-for="d in item.Deployables" cols="auto">
                <cc-deployable-info
                  :deployable="d"
                  :panel="false"
                  :name-override="item.Name"
                  class="ma-2"
                />
              </v-col>
            </v-row>
          </div>
        </div>
        <div
          v-else
          class="py-3 text-center fade-select"
          style="cursor: pointer"
          @click="($refs as any).selectorDialog.show()"
        >
          <v-row>
            <v-col class="heading h2 text-subtle">// EMPTY //</v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>
    <cc-solo-dialog ref="selectorDialog" no-actions :title="`Equip ${title}`" fullscreen>
      <slot name="selector" />
    </cc-solo-dialog>
    <cc-solo-dialog ref="detailDialog" no-confirm :title="item ? item.Name : ''" large>
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
            class="mt-2"
          />
        </div>
      </div>
    </cc-solo-dialog>
    <cc-string-edit-dialog
      v-if="item"
      ref="cName"
      :placeholder="item.Name"
      label="Custom Item Name"
      @save="save('Name', $event)"
      @reset="save('Name', '')"
    />
    <cc-string-edit-dialog
      v-if="item"
      ref="cDesc"
      :placeholder="item.Description"
      label="Custom Item Description"
      @save="save('Description', $event)"
      @reset="save('Description', '')"
    />
    <cc-damage-type-picker
      v-if="item"
      ref="damageTypeDialog"
      :allowed-types="['Explosive', 'Energy', 'Kinetic']"
      @select="save('DamageTypeOverride', $event)"
    />
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
  methods: {
    closeSelector() {
      (this.$refs.selectorDialog as any).hide();
    },
    openDetail() {
      (this.$refs.detailDialog as any).show();
    },
    save(prop, newName) {
      this.item[prop] = newName;
      this.$emit('save');
    },
  },
};
</script>
