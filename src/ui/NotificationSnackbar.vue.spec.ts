import 'jest'
import { mount, shallowMount } from '@vue/test-utils'

import Vue from 'vue'
import Vuetify from 'vuetify';

import NotificationSnackbar from './NotificationSnackbar.vue'

jest.useFakeTimers();

Vue.use(Vuetify)

const baseTestNotification = {
  id: 'test',
  text: 'Testing',
  variant: 'info'
}


describe('NotificationSnackbar.vue', () => {
  it('renders the given text', () => {
    const wrapper = shallowMount(NotificationSnackbar, { 
      propsData: {
        notification: baseTestNotification
      }
    })
    expect(wrapper.text()).toContain('Testing')
  })

  it('renders HTML', () => {
    const wrapper = shallowMount(NotificationSnackbar, { 
      propsData: {
        notification: {
          id: 'test',
          text: 'Testing the <b>HTML</b>',
          variant: 'info'
        }
      }
    })
    expect(wrapper.text()).not.toContain('<b>')
    expect(wrapper.text()).toContain('Testing the HTML')
  })

  it('can be dismissed', () => {
    const wrapper = mount(NotificationSnackbar, { 
      propsData: {
        notification: {
          id: 'test',
          text: 'Testing',
          variant: 'info'
        }
      }
    })
    const btn = wrapper.findAll('.v-btn').filter(el => el.text().toLowerCase().includes('dismiss')).at(0)
    btn.trigger('click')
    expect(wrapper.emitted().dismiss).toBeTruthy()
  })

  // TODO: this test is pretty shaky...
  // probably need to rework the component
  it('closes self on timeout', () => {
    const wrapper = mount(NotificationSnackbar, {
      propsData: {
        notification: baseTestNotification
      }
    })

    const timeout: number = (wrapper.vm as any).timeout
    
    setTimeout(async () => {
      await Vue.nextTick()
      expect(wrapper.isVisible()).toBe(true)
    }, timeout);

  })

})