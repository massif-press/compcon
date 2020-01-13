<template>
  <div id="output-container">
    <p id="completed" ref="completed" class="flavor-text grey--text text--darken-1 py-0 my-0"></p>
    <p id="output" ref="output" class="flavor-text grey--text text--darken-1 py-0 my-0">
      <br />
      <br />
      <br />
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TypeIt from 'typeit'
import { encryption } from '@/io/Generators'

export default Vue.extend({
  name: 'cc-log',
  data: () => ({
    typer: {},
    text: [],
    lock: false,
  }),
  async mounted() {
    this.lock = true
    await Vue.nextTick()
    this.typer = new TypeIt(this.$refs.output, {
      speed: 2,
      nextStringDelay: 5,
      lifeLike: false,
      cursor: false,
      startDelete: false,
      beforeString: () => {
        this.$refs.output.scrollIntoView({ block: 'end' })
      },
      afterString: () => {
        this.$refs.output.scrollIntoView({ block: 'end' })
      },
      afterComplete: () => {
        this.lock = false
      },
    })
      .type('<br>')
      .type('COMPANION/CONCIERGE UNIT INITIALIZING')
      .break()
      .type('GMS COMP/CON Unit Mk XI Rev 11.4.1c')
      .break()
      .type('5016.8.22 General Massive Systems // Please Operate Responsibly')
      .break()
      .type('Initializing semantic manifold ')
      .pause(150)
      .type('. ')
      .pause(150)
      .type('. ')
      .pause(150)
      .type('. ')
      .pause(150)
      .type('done')
      .break()
      .type('Initializing logic gradients ')
      .pause(150)
      .type('. ')
      .pause(150)
      .type('. ')
      .pause(150)
      .type('. ')
      .pause(150)
      .type('done')
      .break()
      .type('&emsp;&emsp;1.0255EB FREE (3.6EB TOTAL)')
      .break()
      .type('KERNEL supported CPUs:')
      .break()
      .type('&emsp;&emsp;GMS MISSISSIPPI Series (MkII+)')
      .break()
      .type('&emsp;&emsp;IPS-N Carronade v9.1+')
      .break()
      .type('&emsp;&emsp;SSC Premier IV-XIV')
      .break()
      .type('&emsp;&emsp;HA DOMINANCE line/all')
      .break()
      .type('&emsp;&emsp;[WN UNKNOWN UNKNOWN UNKNOWN <span class="horus--subtle">UN</span>KNOWN UNKNOWN UNKN]')
      .break()
      .type(`Policy Zone: ${encryption()}`)
      .break()
      .type('Demand map ICRS at 3c0001000-23c0001000.')
      .break()
      .type('Heap//PSIM at 23c0002000-43c0002000.')
      .break()
      .type('Thread "Idle": pointer: 0x23c0002010, stack: 0x6440000')
      .break()
      .type('Thread "Main": pointer: 0x23c0002f70, stack: 0x6460000')
      .break()
      .type(`****** VDOMAIN for frame//integrator ******`)
      .break()
      .type('backend at /local/domain/0/backend/gms/')
      .break()
      .type('Failed to read /local/domain/0/ssc/fs_sync.')
      .break()
      .type('Failed to read /local/domain/0/gms/dummy_plug.')
      .break()
      .type('Failed to read /local/domain/0/gms/manual_controls.')
      .break()
      .type('WARNING: FRAME NOT PRESENT OR INVALID')
      .break()
      .type('******************************************')
      .break()
      .type('Initializing gms-cc-subsys v_int')
      .break()
      .type('Initializing gms-cc-subsys tests')
      .break()
      .type('Initializing gms-cc-subsys omninet_cls')
      .break()
      .type('Initializing gms-cc-subsys events')
      .break()
      .type('Hierarchical RCU implementation.')
      .break()
      .type('RCU subjective-clock acceleration is DISABLED.')
      .break()
      .type(`Establishing encrypted link (${encryption()}) `)
      .pause(200)
      .type('. ')
      .pause(200)
      .type('. ')
      .pause(200)
      .type('. ')
      .pause(300)
      .type('done')
      .break()
      .type('AM-LI in unprivileged domain disabled')
      .break()
      .type('No sensory bridge found // manual input mode enabled')
      .break()
      .type('>//[<span class="primary--text">COMP/CON</span>: <span class="stark-text--text">Welcome, Lancer. Input Command.</span>]')
      .go()
  },
  methods: {
    print(user: string, response: string) {
      if (this.lock) return
      this.lock = true

      this.typer.destroy()

      //collect written strings so TypeIt doesn't erase them
      if (this.$refs.completed.innerHTML) this.$refs.completed.innerHTML += '<br>'
      this.$refs.completed.innerHTML += this.$refs.output.innerHTML
      this.$refs.output.innerHTML = ''

      this.typer = new TypeIt(this.$refs.output, {
        speed: 32,
        lifeLike: true,
        nextStringDelay: 7,
        cursor: false,
        beforeString: () => {
          this.$refs.output.scrollIntoView({ block: 'end' })
        },
        afterString: () => {
          this.$refs.output.scrollIntoView({ block: 'end' })
        },
        afterComplete: () => {
          this.lock = false
        },
      })
        .type(`$ `)
        .type(`<span class="stark-text--text">${user}</span>↵`)
        .pause(100)
        .options({ speed: 3, lifeLike: false })
        .break()
        .type('>')
        .type(`//[<span class="primary--text">COMP/CON</span>: <span class="black--text">${response}</span>]`)
        .type(' ')
        .go()
    },
  },
})
</script>

<style scoped>
#output-container {
  position: absolute;
  height: 90vh;
  overflow-y: scroll;
  overflow-x: hidden;
  width: calc(100vw - 665px);
  top: 0;
  right: 0;
  z-index: 1;
}
</style>
