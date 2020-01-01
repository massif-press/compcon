import { Plugins } from '@capacitor/core'
const { Browser } = Plugins

const directive: Vue.DirectiveOptions = {
  bind(el, binding) {

    const url: string = binding.value
    
    el.addEventListener('click', (e) => {
      e.preventDefault()
      Browser.open({ url })
    })

  }
}

export default directive