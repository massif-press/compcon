// const state = {
//   Pilots: []
// }

// const mutations = {
//   CHANGE_NAME (state, payload) {
//     state.name = payload
//   }
// }

// const actions = {
//   loadPilots (pilotData) {
//     // state.Pilots = pilotData
//   }
// }

const getters = {
  pilot: (state, getters, rootState) => (id) => {
    // console.log(state, getters, rootState, id)
    return rootState.Pilots.find(p => p.id === id)
  }
}

export default {
  // state,
  // mutations,
  // actions,
  getters
}
