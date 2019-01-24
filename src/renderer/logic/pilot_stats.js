/**
 * desc here
 * @module pilot-stats
 */
export default {
  /**
  * export default doc examples
  * @alias module:pilot-stats
  */
  statblock (pilot) {
    return {
      hp: 9,
      armor: 9,
      ee: 9,
      speed: 9,
      grit: Math.ceil(pilot.level / 2)
    }
  },
  mechskills (pilot) {
    return {
      h: 2,
      a: 2,
      s: 2,
      e: 2
    }
  }
}
