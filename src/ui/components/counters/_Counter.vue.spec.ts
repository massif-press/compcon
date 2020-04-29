/* eslint-disable @typescript-eslint/no-empty-function */
import 'jest'
import { mount } from '@vue/test-utils'

import Vue from 'vue'
import Vuetify from 'vuetify'

import CounterComponent from './Counter.vue'
import { ICounterData } from '@/interface'

Vue.use(Vuetify)

jest.mock('vuex-module-decorators', () => ({
  getModule: () => ({ saveData: () => {} }),
}))
jest.mock('@/store', () => ({
  PilotManagementStore: {},
}))

const testCounterData: ICounterData = {
  id: 'test',
  name: 'Test counter',
  default_value: 1,
  min: 1,
  max: 6,
}

const mockPilot = {
  CounterSaveData: [
    {
      id: 'test',
      val: 4,
    },
  ],
  saveCounter: () => null,
}

const stubProperties = {
  computed: {
    pilot() {
      return mockPilot
    },
  },
}

const valueSelector = '.counterValue input'

describe('Counter.vue', () => {
  // currently throws an error because of the watcher but test still pass. can't figure out how to stub the watcher out
  let wrapper = mount(CounterComponent, {
    propsData: { counterData: testCounterData },
    ...stubProperties,
  })

  it('renders the counter name', () => {
    expect(wrapper.text()).toContain(testCounterData.name)
  })

  it('loads the saved value', () => {
    expect((wrapper.find(valueSelector).element as HTMLInputElement).value).toBe('4')
  })

  it('increments when + clicked', async () => {
    const plusButton = wrapper.findAll('.v-btn').at(1)

    plusButton.trigger('click')
    plusButton.trigger('click')

    await Vue.nextTick()

    expect((wrapper.find(valueSelector).element as HTMLInputElement).value).toBe('6')
  })

  it('decrements when - clicked', async () => {
    const minusButton = wrapper.findAll('.v-btn').at(0)

    minusButton.trigger('click')

    await Vue.nextTick()

    expect((wrapper.find(valueSelector).element as HTMLInputElement).value).toBe('5')
  })

  it('resets to default properly', async () => {
    const resetButton = wrapper
      .findAll('.v-btn')
      .filter(wrap =>
        wrap
          .text()
          .toLowerCase()
          .includes('reset')
      )
      .at(0)

    resetButton.trigger('click')

    await Vue.nextTick()

    expect((wrapper.find(valueSelector).element as HTMLInputElement).value).toBe('1')
  })

  it('displays a delete button if custom', () => {
    wrapper = mount(CounterComponent, {
      propsData: {
        counterData: {
          id: 'custom',
          name: 'Custom',
          custom: true,
        },
      },
      ...stubProperties,
    })

    expect(wrapper.text()).toContain('delete')
  })
})
