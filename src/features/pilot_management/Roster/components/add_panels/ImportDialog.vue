<template>
  <v-dialog width="70vw" :value="value" @input="$emit('input', $event)">
    <v-card
      id="panel"
      tile
      color="black"
      style="border: 6px double var(--v-panel-border-base) !important; border-radius: 2px !important;"
    >
      <v-card-text class="subtle--text stat-text mt-2" style="min-height:50vh">
        <span ref="preambleLog"></span>
        <span ref="infoLog"></span>
      </v-card-text>

      <v-card-text>
        <slot />
      </v-card-text>

      <v-divider dark />
      <v-card-actions v-if="error">
        <span class="error--text flavor-text">ERROR IMPORTING PILOT: {{ error }}</span>
        <v-spacer />
        <v-btn small color="white" text @click="$emit('cancel')">Dismiss</v-btn>
      </v-card-actions>
      <v-card-actions v-else-if="pilot">
        <span class="white--text flavor-text">
          Import pilot
          <b>{{ pilot.Callsign.toUpperCase() }}</b>
          //
          <b>{{ pilot.Name }}</b>
          ?
        </span>
        <v-spacer />
        <cc-btn class="mx-2" small color="error" @click="$emit('cancel')">Cancel</cc-btn>
        <cc-btn class="mx-2" small color="success" @click="$emit('confirm')">Confirm</cc-btn>
      </v-card-actions>
      <v-card-actions v-else-if="loading">
        <span class="flavor-text">Loading...</span>
        <v-spacer />
        <v-btn small color="white" text @click="$emit('cancel')">Dismiss</v-btn>
      </v-card-actions>
      <v-card-actions v-else>
        <v-spacer />
        <v-btn small color="grey" text @click="$emit('cancel')">Dismiss</v-btn>
      </v-card-actions>
      <v-progress-linear :style="{ visibility: loading ? 'visible' : 'hidden' }" indeterminate />
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop, Ref, Watch } from 'vue-property-decorator'
import TypeIt from 'typeit'
import { tracert } from '@/io/Generators'

import uuid from 'uuid/v4'
import { Pilot } from '@/class'

@Component
export default class ImportDialog extends Vue {
  @Prop(Boolean) readonly value!: boolean

  @Prop(Pilot) readonly pilot?: Pilot
  @Prop(String) readonly error?: string
  @Prop({ default: false }) loading!: boolean

  @Ref() readonly preambleLog!: HTMLSpanElement
  @Ref() readonly infoLog!: HTMLSpanElement

  @Prop(Object) readonly data: { pilot?: Pilot; error?: string }

  @Watch('pilot')
  onPilotChange(): void {
    this.doType()
  }
  @Watch('error')
  onErrorChange(): void {
    this.doType()
  }

  @Watch('value')
  async onDialogChange(opened) {
    if (opened) {
      await Vue.nextTick()
      this.typeInitial()
    } else {
      this.preambleLog.innerHTML = ''
      this.infoLog.innerHTML = ''
    }
  }

  private initialTypePromise: Promise<void>
  typeInitial() {
    const jumpStrings = [
      '<br>0  CC/LOCALNET 0ns',
      ...tracert(Math.floor(Math.random() * 4) + 2),
      'un_omni-26483-xv99.cradle.primary.MASTER_NODE 21ns',
    ]

    this.initialTypePromise = new Promise(resolve => {
      new TypeIt(this.preambleLog, {
        speed: 1,
        nextStringDelay: 10,
        // cursor breaks spans in the typed text; waiting for fix @ https://github.com/alexmacarthur/typeit/issues/175
        // cursorChar: '_',
        startDelete: true,
        cursor: false,
        lifeLike: false,
        waitUntilVisible: true,
        afterComplete: () => resolve(),
      })
        .type(
          '//[<span class="white--text">COMP/CON</span>: Understood, Pilot. Contacting UNI-COM Directory Service.]'
        )
        .break()
        .type('Establishing Omninet connection, please stand by...')
        .pause(100)
        .type(jumpStrings.join('<br>'))
        .break()
        .type(
          '>//[<span class="white--text">COMP/CON</span>: <span class="success--text">Omninet connection secure.</span> Please enter target IDENT UID.]'
        )
        .type(`<br>$ `)
        .break()
        .options({
          speed: 1,
          lifeLike: false,
        })
        .go()
    })
  }

  private infoTyper: TypeIt
  async doType() {
    const { pilot, error } = this

    if (!pilot && !error) {
      this.infoLog.innerHTML = '<br>$&nbsp;'
      return
    }

    await this.initialTypePromise

    if (this.infoTyper) this.infoTyper.destroy()

    this.preambleLog.innerHTML = this.preambleLog.innerHTML.replace(/<br>\$ <br>/, '')
    this.infoLog.innerHTML = ''

    this.infoTyper = new TypeIt(this.infoLog, {
      speed: 0,
      nextStringDelay: 0,
      startDelete: true,
      cursor: false,
      lifeLike: false,
      waitUntilVisible: true,
    })
      .type('<br>$ ')
      .options({ speed: 32, lifeLike: true, nextStringDelay: 10 })
      .type(uuid())
      .options({ speed: 1, lifeLike: false })
      .break()
      .type('Validating...')
      .break()

    if (error) {
      this.infoTyper
        .type(
          `// <span class="error--text">ERROR ERROR</span>=[[<span class="error--text font-style-italic">${error
            .toUpperCase()
            .replace(/ /gi, '/')}</span>]]`
        )
        .break()
        .type(`// <span class="error--text">IDENT INVALID</span>`)
        .break()
        .type('// PLEASE CHECK PROVIDED DATA.')
    } else if (pilot) {
      this.infoTyper
        .options({
          speed: 1,
          lifeLike: false,
        })
        .type(`<span class="success--text">IDENT VALID!</span>`)
        .break()
        .type(
          `
        //IDENT <span class="white--text">${pilot.ID}</span>//
        SIGN[<span class="teal--text text--lighten-2">${pilot.Callsign.toUpperCase()}</span>]//
        LL=${pilot.Level}`
        )
        .break()

      const licenseCount = pilot.Licenses.reduce((counter, pilotLicense) => {
        counter[pilotLicense.License.Source] =
          (counter[pilotLicense.License.Source] || 0) + pilotLicense.Rank
        return counter
      }, {})
      const horusCount = licenseCount['HORUS'] || 0

      const licenseStrings = ['GMS'].concat(
        Object.entries(licenseCount)
          .filter(([name]) => name !== 'HORUS')
          .map(([name, count]: [string, number]) => `${name.toUpperCase()} [${count}]`)
      )
      if (horusCount > 0)
        licenseStrings.push(
          `UNKNOWN UNKNOWN UNKN<span class="horus--subtle">░▒▇▀▒▏█: [(${horusCount})]▒ ࿘঩㍣᠃㻥¹福▉ ▉ ▉ ;-)</span>`
        )

      const licenseString = licenseStrings.join(', ')

      this.infoTyper
        .type(`//LICENSE RECORDS:: ${licenseString}`)
        .break()
        .type('//// PLEASE CHECK AND CONFIRM THIS DATA.')
    }
    this.infoTyper.go()
  }
}
</script>
