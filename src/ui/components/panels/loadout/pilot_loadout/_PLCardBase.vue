<template>
  <v-col cols="12" md="">
    <div style="height: 100%">
      <v-card flat tile class="clipped-large panel" style="height: 100%">
        <v-card-title class="pilot text-white py-0 heading h3" style="height: 24px">
          <v-menu v-if="item" offset-x left>
            <template #activator="{ props }">
              <v-icon icon small dark class="fade-select mt-n1 ml-n2 mr-1" v-bind="props"
                >mdi-cog</v-icon
              >
            </template>
            <v-list density="compact">
              <v-list-item @click="$refs.selectorDialog.show()">
                <v-list-item-icon class="ma-0 mr-2 mt-2">
                  <v-icon icon="mdi-swap-vertical-variant" />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Change Item</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider />
              <v-list-item v-if="item.CanSetDamage" @click="$refs.damageTypeDialog.show()">
                <v-list-item-icon class="ma-0 mr-2 mt-2">
                  <v-icon icon="cc:variable" />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Select Damage Type</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="$refs.cName.show()">
                <v-list-item-icon class="ma-0 mr-2 mt-2">
                  <v-icon icon="mdi-circle-edit-outline" />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Set Custom Name</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="$refs.cDesc.show()">
                <v-list-item-icon class="ma-0 mr-2 mt-2">
                  <v-icon icon="mdi-circle-edit-outline" />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Set Custom Description</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider />
              <v-list-item @click="$emit('remove')">
                <v-list-item-icon class="ma-0 mr-2 mt-2">
                  <v-icon color="error">mdi-delete</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Remove Item</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
          <div class="mt-n1">
            {{ title }}
            <cc-tooltip v-if="extended" simple inline content="Extended Harness">
              <v-icon dark right small class="mt-n1">mdi-alpha-e-box-outline</v-icon>
            </cc-tooltip>
          </div>
          <v-spacer />
          <div v-if="!readonly" class="text-right mt-n2">
            <v-btn v-if="item" small icon dark @click="$emit('remove')">
              <v-icon class="fade-select">delete</v-icon>
            </v-btn>
            <v-btn icon small dark @click="$refs.selectorDialog.show()">
              <v-icon class="fade-select" v-html="item ? 'mdi-swap-vertical-variant' : 'add'" />
            </v-btn>
          </div>
        </v-card-title>
        <v-card-text
          :id="item ? 'underline-parent' : ''"
          class="`px-2 py-1 text-center`"
          style="height: calc(100% - 28px)"
        >
          <div class="underline-slide" style="height: 100%">
            <div v-if="item">
              <slot @click="$refs.detailDialog.show()" />
              <div v-if="item.Deployables.length">
                <div class="text-overline ml-n2 text-subtle">EQUIPMENT DEPLOYABLES</div>
                <v-row no-gutters justify="center">
                  <v-col v-for="(d, i) in item.Deployables" cols="auto">
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
              style="cursor: pointer; height: 100%"
              @click="$refs.selectorDialog.show()"
            >
              <v-row style="height: 100%">
                <span class="heading h2 text-subtle my-auto" style="width: 100%">// EMPTY //</span>
              </v-row>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>
    <cc-solo-dialog ref="selectorDialog" no-confirm :title="`Equip ${title}`" fullscreen no-pad>
      <slot name="selector" />
    </cc-solo-dialog>
    <cc-solo-dialog ref="detailDialog" no-confirm :title="item ? item.Name : ''" large>
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
      this.$set(this.item, prop, newName);
      this.$emit('save');
    },
  },
};
</script>

<style scoped>
#underline-parent {
  background-color: rgb(var(--v-theme-panel-darken1));
  transition: background-color 0.4s ease-in-out;
}

#underline-parent:hover {
  background-color: rgb(var(--v-theme-panel));
}

.underline-slide::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  z-index: 10;
  background-color: rgb(var(--v-theme-secondary));
  transform-origin: bottom left;
  transform: scaleX(0);
  transition: transform 0.4s ease;
}

#underline-parent:hover > .underline-slide::before {
  transform-origin: bottom left;
  transform: scaleX(1);
}
</style>
