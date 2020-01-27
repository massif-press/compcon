<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on }">
      <v-icon small class="fadeSelect" v-on="on">mdi-circle-edit-outline</v-icon>
    </template>
    <v-list dense>
      <v-list-item v-for="(item, i) in items" :key="`mi_${i}`" @click="$emit('set', item.value)">
        <v-list-item-title>{{ item.text }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({ name: 'cc-simple-select', })
export default class CCSimpleSelect extends Vue {

  @Prop({ type: Array, required: true, validator: (item) => item.text && item.text.toString })
  readonly items!: { 
    text: string | number | object
    value: string | number | object
  }[]

}
</script>
