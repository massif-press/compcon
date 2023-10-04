<template>
  <span v-if="item">
    <v-menu offset-y top @click.stop>
      <template #activator="{ props }">
        <v-btn size="x-small" variant="plain" icon v-bind="props" @click.stop>
          <v-icon size="20" icon="mdi-cog" />
        </v-btn>
      </template>
      <v-list density="compact">
        <v-list-item
          v-if="!item.IsIntegrated"
          prepend-icon="mdi-swap-vertical-variant"
          title="Change Item"
          @click="$emit('swap')"
        />
        <v-divider />
        <v-list-item
          v-if="item.CanSetDamage"
          title="Select Damage Type"
          prepend-icon="cc:variable"
          @click="($refs as any).damageTypeDialog.show()"
        >
        </v-list-item>
        <v-list-item
          v-if="item.CanSetUses"
          title="Set Max Uses"
          prepend-icon="mdi-dice-6"
          @click="($refs as any).maxUseDialog.show()"
        >
        </v-list-item>
        <v-divider />
        <v-list-item
          title="Set Custom Name"
          prepend-icon="mdi-circle-edit-outline"
          @click="($refs as any).cName.show()"
        >
        </v-list-item>
        <v-list-item
          title="Set Custom Description"
          prepend-icon="mdi-circle-edit-outline"
          @click="($refs as any).cDesc.show()"
        >
        </v-list-item>
        <div v-if="!item.IsIntegrated">
          <v-divider />
          <v-list-item title="Remove Item" prepend-icon="mdi-delete" @click="$emit('remove')">
          </v-list-item>
        </div>
      </v-list>
    </v-menu>
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
      @select="item.DamageTypeOverride = $event"
    />
    <cc-string-edit-dialog
      v-if="item"
      ref="maxUseDialog"
      number
      :placeholder="(item.MaxUseOverride || item.MaxUses).toString()"
      label="Set Maximum Uses"
      @save="item.MaxUseOverride = Number($event)"
    />
  </span>
</template>

<script lang="ts">
export default {
  name: 'equipment-options-menu',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  methods: {
    save(prop, newName) {
      this.item[prop] = newName;
    },
  },
};
</script>
