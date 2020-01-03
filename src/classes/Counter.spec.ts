import 'jest'
import { Counter } from './Counter'
import { ICounterData } from './Counter'


const testCounterData: ICounterData = {
  name: 'Test counter',
  defaultValue: 1,
  min: 1,
  max: 6
}


describe('Counter', () => {

  it('starts at its default value', () => {

    const counter = new Counter(testCounterData)

    expect(counter.Value).toBe(testCounterData.defaultValue)

  })

  it('does not increment past its max value', () => {
    const counter = new Counter(testCounterData)

    for (let i = 0; i < 5; i++) {
      counter.Increment()
    }

    expect(counter.Value).toBe(6)

    counter.Increment()
    
    expect(counter.Value).toBe(6)
  });

  it('does not decrement past its min value', () => {
    const counter = new Counter(testCounterData)

    expect(counter.Value).toBe(1)

    counter.Decrement()

    expect(counter.Value).toBe(1)
  });

  it('resets properly', () => {
    const counter = new Counter(testCounterData)

    counter.Increment()
    counter.Increment()
    counter.Increment()

    counter.Reset()

    expect(counter.Value).toBe(testCounterData.defaultValue)

  });

  it('throws when given invalid data', () => {
    expect(() => {
      new Counter({
        name: 'Bad counter',
        defaultValue: 0,
        min: 1
      })
    }).toThrow()

    expect(() => {
      new Counter({
        name: 'Bad counter',
        defaultValue: 2,
        max: 1
      })
    }).toThrow()
  });

  it('works without min or max values', () => {

    const testCounter = new Counter({
      name: 'Test counter'
    })

    expect(testCounter.Max).toBeUndefined()
    expect(testCounter.Min).toBeUndefined()

    

  });
  
})