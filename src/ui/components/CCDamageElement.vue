<template>
  <div>
    <div
      v-for="(d, i) in damage"
      :key="`dmg_${i}`"
      :class="`text-center ml-auto mr-auto ${i > 0 && !small ? 'pl-4' : ''}`"
      style="display: inline-block"
    >
      <cc-tooltip :title="d.Type || ''" :content="d.Text || ''">
        <span v-if="small">
          <v-icon :color="d.Color">{{ d.Icon }}</v-icon>
          <v-icon v-if="d.Override">mdi-information-outline</v-icon>
          <span v-else>{{ d.Value }}</span>
        </span>
        <div v-else class="clip-icon">
          <v-icon x-large :color="d.Color">{{ d.Icon }}</v-icon>
        </div>
      </cc-tooltip>
      <span v-if="!small">
        <b>{{ d.Value }}</b>
        <br />
        <div class="overline mt-n1">
          <b>{{ d.Type }}</b>
          Damage
        </div>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'


@Component({ name: 'cc-damage-element' })
export default class CCDamageElement extends Vue {
  
  @Prop({ type: Array, required: true, }) 
  damage

  @Prop({ type: Boolean, required: false, })
  small
  
}
</script>
