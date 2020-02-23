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
export default class CCStringEdit extends Vue {
  @Prop({ type: String, required: false, default: ' ' })
  readonly label: string

  @Prop({ type: String, required: true })
  readonly placeholder!: string

  @Prop({ type: Boolean, required: false })
  readonly dark?: boolean

  newString = ''

  save(): void {
    if (this.newString) this.$emit(this.newString)
    this.newString = ''
  }
}
</script>
