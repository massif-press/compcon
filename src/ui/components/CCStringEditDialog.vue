<template>
  <v-dialog v-model="dialog" width="35vw">
    <v-card tile>
      <v-text-field
        v-model="newString"
        :label="label"
        :placeholder="placeholder"
        :type="number ? 'number' : 'text'"
        outlined
        hide-details
        autofocus
        class="pa-4"
        @focus="$event.target.select()"
        @keyup.enter="confirm()"
      />
      <v-divider />
      <v-card-actions>
        <v-btn small text @click="cn_dialog = false">Cancel</v-btn>
        <v-spacer />
        <v-btn v-if="!number" small text color="primary" @click="reset()">Reset</v-btn>
        <v-btn small text color="success darken-1" @click="confirm()">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import EditButton from './subcomponents/_EditButton.vue'

@Component({
  name: 'cc-string-edit',
  components: { EditButton },
})
export default class CCStringEdit extends Vue {
  @Prop({ type: String, required: false, default: '' })
  readonly label: string

  @Prop({ type: Boolean, required: false })
  readonly number: boolean

  @Prop({ type: String, required: false, default: '' })
  readonly placeholder: string

  newString = ''

  dialog = false

  confirm(): void {
    this.save()
    this.hide()
  }
  reset(): void {
    this.$emit('reset')
    this.hide()
  }
  show(): void {
    this.dialog = true
  }
  hide(): void {
    this.dialog = false
  }

  save(): void {
    if (this.number && this.newString) this.$emit('save', parseInt(this.newString))
    else if (this.newString) this.$emit('save', this.newString)
    this.newString = ''
  }
}
</script>
