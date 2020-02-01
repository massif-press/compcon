import 'jest'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import GetColorMixin from "@/mixins/getColor"
import { Vue, Mixins } from 'vue-property-decorator'
import Vuetify from 'vuetify'

Vue.use(Vuetify)

class Tester extends Mixins(GetColorMixin) {
  render(h) {
    return h('button', {
      'color': 'getColor()'
    },[
      h('p', 'test')
    ])
  }
}

describe('getColor', () => {
  it('can be used as a mixin', () => {
    beforeEach(()=>{
      const localVue = createLocalVue()
      localVue.use(Vuetify)
    })
    expect(shallowMount(Tester).isVueInstance()).toBe(true)
  })
})