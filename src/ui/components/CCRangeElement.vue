<template>
  <div>
    <div
      v-for="(r, i) in range"
      :key="`rng_${i}`"
      class="text-center px-2"
      style="display: inline-block"
    >
      <cc-tooltip :title="r.Text" :content="Help(r.Type)">
        <span v-if="small">
          <v-icon color="text">{{ r.Icon }}</v-icon>
          <v-icon v-if="r.Override">mdi-information-outline</v-icon>
          <span v-else>
            {{ `${added ? '+' : ''}${r.Value}` }}
          </span>
          <!-- <cc-slashes v-if="i + 1 < range.length" /> -->
        </span>
        <div v-else>
          <v-icon x-large color="text" class="mt-n4 mr-n3">
            {{ r.Icon }}
          </v-icon>
          <span class="heading text--text" style="font-size: 24pt;">
            {{ `${added ? '+' : ''}${r.Value}` }}
          </span>
        </div>
      </cc-tooltip>
      <span v-if="!small">
        <div class="overline mt-n2">
          <b>{{ r.Type }}</b>
        </div>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Range } from '@/class'
import { glossary } from 'lancer-data'

@Component({ name: 'cc-range-element' })
export default class CCRangeElement extends Vue {
  @Prop({ type: Array, required: true })
  readonly range!: Range[]

  @Prop({ type: Boolean, required: false })
  readonly small?: boolean

  @Prop({ type: Boolean, required: false })
  readonly added?: boolean

  Help(name: string): string {
    return `<div class="overline subtle--text mb-n2 mt-n2">${name}:</div><div>${
      glossary.find(x => x.name.toLowerCase() === name.toLowerCase()).description
    }</div>`
  }
}
</script>
