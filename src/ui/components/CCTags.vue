<template>
  <v-row v-if="extended" no-gutters>
    <v-col v-for="(t, i) in tags" :key="`${t.ID}_${i}`" cols="12">
      <cc-extended-tag :tag="t" />
    </v-col>
  </v-row>
  <div v-else>
    <cc-tag
      v-for="(t, i) in tags"
      :key="`${t.ID}_${i}`"
      :tag="t"
      :small="small"
      :color="color"
      :pilot="pilot"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Pilot, Tag } from '@/class'

@Component({ name: 'cc-tags', })
export default class CCTags extends Vue {
  @Prop({ type: Boolean, required: false, })
  small?: boolean
  @Prop({ type: Boolean, required: false, })
  extended?: boolean
  @Prop({ type: String, required: false, default: 'primary', })
  color: string

  @Prop({ type: Array, required: true, validator: (item) => item instanceof Tag })
  tags!: Tag[]

  @Prop({ type: Object, required: false, default: null, })
  pilot?: Pilot 
}
</script>
