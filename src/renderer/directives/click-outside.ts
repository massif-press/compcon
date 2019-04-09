import { DirectiveOptions, VNode } from 'vue'
import { DirectiveBinding } from 'vue/types/options'

interface IHTMLElement extends HTMLElement{
  clickOutsideEvent ?: any
}

const directive: DirectiveOptions = {
  bind(el: IHTMLElement, binding: DirectiveBinding, vnode: VNode) {
    el.clickOutsideEvent = (event: any) => {
      if (!(el === event.target || el.contains(event.target))) {
        if (vnode.context) {
          (vnode as any).context[binding.expression](event)
        }
      }
    }
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unbind(el: IHTMLElement) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  },
}

export default directive
