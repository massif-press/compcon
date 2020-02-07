<template>
  <div>
    <div
      v-for="(r, i) in range"
      :key="`rng_${i}`"
      class="text-center ml-auto mr-auto"
      style="display: inline-block"
    >
      <cc-tooltip :title="r.Type" :content="r.Text">
        <span v-if="small">
          <v-icon color="text">{{ r.Icon }}</v-icon>
          <v-icon v-if="r.Override">mdi-information-outline</v-icon>
          <span v-else>{{ r.Value }}</span>
          <cc-slashes v-if="i + 1 < range.length" />
        </span>
        <div v-else class="clip-icon">
          <v-icon x-large color="text">
            {{ r.Icon }}
          </v-icon>
        </div>
      </cc-tooltip>
      <span v-if="!small">
        &nbsp;{{ r.Value }}
        <br />
        <div class="overline mt-n1">
          <b>{{ r.Type }}</b>
        </div>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Range } from '@/class'

@Component({ name: 'cc-range-element' })
export default class CCRangeElement extends Vue{
  @Prop({ type: Array, required: true, })
  readonly range!: Range[]

  @Prop({ type: Boolean, required: false, })
  readonly small?: boolean
}
</script>
