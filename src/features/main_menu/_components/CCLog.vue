<template>
  <div id="output-container">
    <p id="completed" class="flavor-text grey--text text--darken-1 py-0 my-0"></p>
    <p id="output" class="flavor-text grey--text text--darken-1 py-0 my-0">
      <br />
      <br />
      <br />
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import typeit from 'typeit'
import { encryption } from '@/io/Generators'

function scrollIntoViewSuppressed() {
  try {
    document.getElementById('output').scrollIntoView({ block: 'end' })
  } catch (e) {
    if (e instanceof TypeError) {
    } else throw e
  }
}

export default Vue.extend({
  name: 'cc-log',
  data: () => ({
    typeit: {},
    text: [],
    lock: false,
  }),
  mounted() {
    this.typeit = new typeit('#output', {
      speed: 2,
      nextStringDelay: 5,
      cursorChar: '_',
      startDelete: false,
      beforeString: () => {
        scrollIntoViewSuppressed()
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
      .type('&emsp;&emsp;[WN UNKNOWN UNKNOWN UNKNOWN UNKNOWN UNKNOWN UNKN]')
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
      .type('>//[COMP/CON: <span class="black--text">Welcome, Lancer. Input Command.</span>]')
      .break()
      .go()
  },
  methods: {
    print(user: string, response: string) {
      if (this.lock) return
      this.lock = true
      let firstLine = ''
      this.typeit.options({ cursorChar: ' ', cursor: false })
      if (this.typeit.is('started') && !this.typeit.is('frozen') && !this.typeit.is('completed'))
        firstLine = '^C<br>// INTERRUPT: STARTUP OVERRIDE // REACTOR MUST BE PRIMED MANUALLY<br>'

      this.typeit.destroy()

      //collect written strings so typeit doesn't erase them
      // const output = document.getElementById('output')
      try {
        const completed = document.getElementById('completed')
        const contents = document.getElementsByClassName('ti-container')[0]
        completed.innerHTML += contents.innerHTML
      } catch (e) {
        if (e instanceof TypeError) {
          return
        } else throw e
      }
      // if (completed.innerHTML.length > 1) completed.innerHTML += '<br />'

      this.typeit = new typeit('#output', {
        speed: 3,
        nextStringDelay: 7,
        cursorChar: '_',
        startDelete: false,
        strings: [],
        beforeString: () => {
          scrollIntoViewSuppressed()
        },
        afterString: () => {
          scrollIntoViewSuppressed()
        },
        afterComplete: () => {
          this.lock = false
        },
      })
        .type(firstLine)
        .options({ speed: 32, lifeLike: true })
        .type(`$ `)
        .type(`<span class="success--text">${user}</span>↵`)
        .pause(100)
        .options({ speed: 3, lifeLike: false })
        .break()
        .type('>')
        .type(`//[COMP/CON: <span class="black--text">${response}</span>]`)
        .type(' ')
        .go()
    },
  },
})
</script>

<style scoped>
#output-container {
  position: absolute;
  height: 80vh;
  overflow-y: scroll;
  overflow-x: hidden;
  width: calc(100vw - 665px);
  top: 0;
  right: 0;
  z-index: 1;
}
</style>
