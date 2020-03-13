<template>
  <v-dialog width="50vw" :value="value" @input="$emit('input', $event)">
    <v-card
      id="panel"
      tile
      color="black"
      style="border: 6px double var(--v-panel-border-base) !important; border-radius: 2px !important;"
    >
      <v-row>
        <v-col cols="7" class="ml-auto mr-auto">
          <slot />
        </v-col>
      </v-row>

      <v-card-text class="subtle--text stat-text" style="min-height:50vh">
        <span ref="preambleLog"></span>
        <span ref="infoLog"></span>
      </v-card-text>

      <v-divider dark />
      <v-card-actions v-if="error">
        <span class="error--text flavor-text">ERROR IMPORTING PILOT: {{ error }}</span>
        <v-spacer />
        <v-btn small color="white" text @click="$emit('cancel')">Dismiss</v-btn>
      </v-card-actions>
      <v-card-actions v-else-if="pilot">
        <span class="white--text flavor-text">
          Import
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
import { sampleSize } from 'lodash'

import uuid from 'uuid/v4'
import { Pilot } from '@/class'

const jumps = [
  'un_omni-18364.andes.aconcagua.node:9 7ns',
  'un_omni-18364.andes.cerrobonete.node:9 11ns',
  'un_omni-18364.andes.galan.node:9 14ns',
  'un_omni-00391.rockymountain.elbert.node:4 36ns',
  'un_omni-00391.rockymountain.lincoln.node:7 41ns',
  'un_omni-00391.rockymountain.castle.node:1 44ns',
  'un_omni-17354.krunlun.kongurtagh.node:6 76ns',
  'un_omni-17354.krunlun.karakoram.node:11 64ns',
  'un_omni-17354.krunlun.mayakovsky.node:12 81ns',
  'un_omni-95846.ural.manaraga.node:9 91ns',
  'un_omni-95846.ural.iremel.node:5 94ns',
  'un_omni-95846.ural.elbrus.node:8 101ns',
  'un_omni-16455.himalaya.everest.node:9 145ns',
  'un_omni-16455.himalaya.kanchenjunga.node:1 139ns',
  'un_omni-16455.himalaya.annapurna.node:3 116ns',
  'un_omni-76543.altai.belukha.node:5 183ns',
  'un_omni-76543.altai.nairamdal.node:7 202ns',
  'un_omni-76543.altai.kharkhiraa.node:9 199ns',
  'un_omni-17297.carpathian.gerlachovsky.node:2 245ns',
  'un_omni-17297.carpathian.ladovy.node:4 228ns',
  'un_omni-17297.carpathian.moldoveanu.node:6 230ns',
  'un_omni-88273.cascade.rainier.node:7 315ns',
  'un_omni-88273.cascade.adams.node:8 331ns',
  'un_omni-88273.cascade.hood.node:10 309ns',
  'un_omni-47361.atlas.toubkal.node:1 414ns',
  'un_omni-47361.atlas.ouanoukrim.node:3 418ns',
  'un_omni-47361.atlas.mgoun.node:5 398ns',
  'un_omni-73421.vindhya.kalumar.node:14 506ns',
  'un_omni-73421.vindhya.dhupgarh.node:17 511ns',
  'un_omni-73421.vindhya.mahendragiri.node:2 515ns',
  'un_omni-87253.sierramadre.mohinora.node:6 754ns',
  'un_omni-87253.sierramadre.peak.node:11 771ns',
  'un_omni-87253.sierramadre.bridger.node:18 719ns',
  'un_omni-04281.annamite.phoubia.node:21 1487ns',
  'un_omni-04281.annamite.phuxailaileng.node:4 1599ns',
  'un_omni-04281.annamite.ngoclinh.node:3 1601ns',
  'ipsn-secure-a.78F 17ns',
  'ipsn-secure-a.22A 32ns',
  'HA::PRINCIPLED:λ_argent 126ns',
  'HA::MASTER:α_verdant 79ns',
  'HA::DOMINANT:φ_crucible 22ns',
  'ssc/subscribers-primary-015/vm/226 18ns',
  'ssc/tier-one-998/vm/165 19ns',
  "INC OVERRIDE>>> welcome 2 dogfriend_68's pound. ty for the data, bud ᕕ( ᐛ )ᕗ",
  '<span class="horus--subtle">UNKNOWN UNKNOWN UNKNOWN UNKNOWN ERR NEG INT</span>',
]

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
      ...sampleSize(jumps, Math.floor(Math.random() * 4) + 2),
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
