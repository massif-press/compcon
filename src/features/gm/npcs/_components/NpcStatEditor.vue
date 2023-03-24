<template>
  <div>
    <v-row dense>
      <editable-attribute
        attr="HULL"
        :val="item.StatController.Hull || 0"
        editable
        @set="item.StatController.Hull = $event"
      />
      <editable-attribute
        attr="AGI"
        :val="item.StatController.Agi || 0"
        editable
        @set="item.StatController.Agi = $event"
      />
      <editable-attribute
        attr="SYS"
        :val="item.StatController.Sys || 0"
        editable
        @set="item.StatController.Sys = $event"
      />
      <editable-attribute
        attr="ENG"
        :val="item.StatController.Eng || 0"
        editable
        @set="item.StatController.Eng = $event"
      />
    </v-row>
    <v-row dense>
      <editable-attribute
        attr="STRUCTURE"
        :val="item.StatController.MaxStructure || 0"
        editable
        @set="item.StatController.MaxStructure = $event"
      />
      <editable-attribute
        attr="ARMOR"
        :val="item.StatController.Armor || 0"
        editable
        @set="item.StatController.Armor = $event"
      />
      <editable-attribute
        attr="HP"
        :val="item.StatController.MaxHP || 0"
        editable
        @set="item.StatController.MaxHP = $event"
      />
      <editable-attribute
        attr="REACTOR"
        :val="item.StatController.MaxStress || 0"
        editable
        @set="item.StatController.MaxStress = $event"
      />
      <editable-attribute
        v-if="!item.IsBiological"
        attr="HEAT CAPACITY"
        :val="item.StatController.HeatCapacity || 0"
        editable
        @set="item.StatController.HeatCapacity = $event"
      />
    </v-row>
    <v-row dense>
      <editable-attribute
        attr="SPEED"
        :val="item.StatController.Speed || 0"
        editable
        @set="item.StatController.Speed = $event"
      />
      <editable-attribute
        attr="SAVE"
        :val="item.StatController.SaveTarget || 0"
        editable
        @set="item.StatController.SaveTarget = $event"
      />
      <editable-attribute
        attr="EVASION"
        :val="item.StatController.Evasion || 0"
        editable
        @set="item.StatController.Evasion = $event"
      />
      <editable-attribute
        attr="E-DEFENSE"
        :val="item.StatController.EDefense || 0"
        editable
        @set="item.StatController.EDefense = $event"
      />
      <editable-attribute
        attr="SENSORS"
        :val="item.StatController.SensorRange || 0"
        editable
        @set="item.StatController.SensorRange = $event"
      />
    </v-row>
    <v-row no-gutters class="mt-2">
      <editable-attribute
        attr="ACTIVATIONS PER ROUND"
        :val="item.StatController.Activations || 0"
        editable
        @set="item.StatController.Activations = $event"
      />
      <size-attribute
        :stat-controller="item.StatController"
        editable
        selectable
      />
    </v-row>
  </div>
</template>

<script lang="ts">
import EditableAttribute from './_subcomponents/EditableAttribute.vue';
import SizeAttribute from './_subcomponents/SizeAttribute.vue';

export default {
  name: 'npc-stat-editor',
  components: { EditableAttribute, SizeAttribute },
  props: {
    item: { type: Object, required: true },
  },
};
</script>
