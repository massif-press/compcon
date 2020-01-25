<template>
  <edit-button :dark="dark" @save="save()">
    <v-text-field
      v-model="newString"
      :label="label"
      :placeholder="placeholder"
      outlined
      hide-details
      autofocus
      @focus="$event.target.select()"
    />
  </edit-button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import EditButton from './subcomponents/_EditButton.vue'

@Component({ 
  name: 'cc-string-edit',
  components: { EditButton },
})
export default class CCStringEdit extends Vue{
  
  @Prop({ type: String, required: false, default: ' ', })
  label: string

  @Prop({ type: String, required: true, })
  placeholder!: string 
    
  @Prop({ type: Boolean, required: false, })
  dark?: boolean 
  
  newString = ''

  save() {
    if (this.newString) this.$emit(this.newString)
    this.newString = ''
  }
}
</script>
