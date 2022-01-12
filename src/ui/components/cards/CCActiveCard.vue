<template>
  <v-col :cols="cols" class="pa-1">
    <v-card
      tile
      color="panel clipped"
      :height="collapsed ? '' : '100%'"
      style="transition: all 0.2s"
    >
      <v-card-title class="pa-0 pl-2 pr-2" :class="color">
        <v-icon v-if="collapsible" left dark class="fadeSelect" @click="collapsed = !collapsed">
          {{ collapsed ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
        </v-icon>
        <span
          :class="
            ` ${
              $vuetify.breakpoint.smAndDown
                ? 'body-text font-weight-bold'
                : $vuetify.breakpoint.lgAndUp
                  ? 'heading h3'
                  : 'heading h2'
            } white--text`
          "
        >
          {{ header }}
        </span>
        <v-divider
          v-if="content && prominent && $vuetify.breakpoint.lgAndUp"
          class="mx-3 subtle"
          style="opacity: 0.5"
        />
        <v-spacer v-else />
        <span class="overline white--text mr-2">{{ subheader }}</span>
        <span
          v-if="content && prominent"
          :class="`heading ${$vuetify.breakpoint.lgAndup ? 'h1' : 'h2'} pt-1 pb-3 pr-3 white--text`"
        >
          {{ content }}
        </span>
      </v-card-title>
      <v-scroll-y-transition leave-absolute>
        <v-card-text v-if="!collapsed && !prominent" class="pa-1 pl-2 ma-0 text--text body-text">
          <div v-if="content && !prominent">
            {{ content }}
          </div>
          <slot v-else />
        </v-card-text>
      </v-scroll-y-transition>
    </v-card>
  </v-col>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component({ name: 'cc-active-card' })
export default class CCActiveCard extends Vue {
  @Prop({ type: String, required: false, default: 'primary' })
  readonly color: string
  @Prop({ type: String, required: true })
  readonly header: string
  @Prop({ type: String, required: false, default: '' })
  readonly subheader: string
  @Prop({ type: [String, Number], required: false, default: '' })
  readonly content: string | number
  @Prop({ type: [String, Number], required: false, default: '' })
  readonly cols: string | number
  @Prop({ type: Boolean })
  readonly collapsible: boolean
  @Prop({ type: Boolean })
  readonly startClosed: boolean
  @Prop({ type: Boolean })
  readonly prominent: boolean

  collapsed = false

  created(): void {
    this.collapsed = this.startClosed
  }
}
</script>
