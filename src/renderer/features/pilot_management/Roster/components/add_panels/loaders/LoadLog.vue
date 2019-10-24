<template>
  <v-card-text id="clipboard_log" class="grey--text stat-text" style="min-height:50vh" />
</template>

<script lang="ts">
import Vue from 'vue'
import typeit from 'typeit'
import uuid from 'uuid/v1'

export default Vue.extend({
  name: 'clipboard-log',
  data: () => ({
    typer: {},
    dialog: false,
    jumps: [
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
      'UNKNOWN UNKNOWN UNKNOWN UNKNOWN ERR NEG INT',
    ],
  }),
  methods: {
    type(err: boolean) {
      var vm = this as any
      vm.dialog = true
      let strs = ['<br>0  CC/LOCALNET 0ns']
      strs = strs.concat(this.$_.sampleSize(this.jumps, Math.floor(Math.random() * 4) + 2))
      strs.push('un_omni-26483-xv99.cradle.primary.MASTER_NODE 21ns')

      let typer = new typeit('#clipboard_log', {
        speed: 62,
        nextStringDelay: 80,
        cursorChar: '_',
        startDelete: false,
        lifeLike: true,
      })

      typer
        .type('$ <span class="success--text">unicom dirutil ls /PILOTS -v /ACTIVE</span>↵')
        .options({
          speed: 12,
          nextStringDelay: 24,
          lifeLike: false,
        })
        .pause(300)
        .type(
          '<br>>//[COMP/CON: <span class="white--text">Understood, Lancer. Contacting UNI-COM Directory Service.</span>]'
        )
        .type('<br>Establishing Omninet connection, please stand by...')
        .pause(100)
        .type(strs.join('<br>'))
        .type(
          '<br>>//[COMP/CON: <span class="white--text">Omninet connection secure. Please enter target IDENT UID.</span>]'
        )
        .options({
          speed: 88,
          nextStringDelay: 80,
          lifeLike: true,
        })
        .type(`<br>$ <span class="success--text">l:id::${uuid()}</span>↵`)
        .options({
          speed: 12,
          nextStringDelay: 24,
          lifeLike: false,
        })
        .pause(500)

      if (err) {
        console.error(err)
        typer.type(
          '<br><b class="error--text">ERROR: PILOT RECORDS MISSING OR CORRUPED. ABORTING.</b>'
        )
        typer
          .pause(500)
          .type('<br>.')
          .type('<br>Omninet connection terminated.')
        vm.notify({
          text: err,
          multiline: true,
        })
      } else {
        typer.type('<br><b class="success--text">Valid pilot records found. Downloading...</b>')
        typer
          .pause(500)
          .type('<br>.')
          .type('<br>Data transfer complete. Closing Omninet connection.')
      }

      typer.go()
    },
  },
})
</script>