import Main from './index.vue'

import Home from './landing.vue'

import Campaigns from './campaigns/index.vue'
import NPCs from './npcs/index.vue'
import Encounters from './encounters/index.vue'
import Characters from './characters/index.vue'
import CharacterEditor from './characters/editor.vue'
import Locations from './locations/index.vue'
import LocationsEditor from './locations/editor.vue'
import Factions from './factions/index.vue'
import FactionsEditor from './factions/editor.vue'
import Runner from './runner/index.vue'

import { RouteConfig } from 'vue-router'

const routes: RouteConfig[] = [
  {
    path: '',
    component: Main,
    children: [
      {
        path: '',
        name: 'gm-toolkit-home',
        component: Home,
      },
      {
        path: 'campaigns',
        name: 'gm-campaigns',
        component: Campaigns
      },
      {
        path: 'npcs',
        name: 'gm-npcs',
        component: NPCs
      },
      {
        path: 'encounters',
        name: 'gm-encounters',
        component: Encounters
      },
      {
        path: 'characters',
        name: 'gm-characters',
        component: Characters
      },
      {
        path: 'characters/edit/:id',
        name: 'gm-character-edit',
        component: CharacterEditor,
        props: true,
      },
      {
        path: 'locations',
        name: 'gm-locations',
        component: Locations
      },
      {
        path: 'locations/edit/:id',
        name: 'gm-location-edit',
        component: LocationsEditor,
        props: true,
      },
      {
        path: 'factions',
        name: 'gm-faction',
        component: Factions
      },
      {
        path: 'factions/edit/:id',
        name: 'gm-factions-edit',
        component: FactionsEditor,
        props: true,
      },
      {
        path: 'runner',
        name: 'gm-runner',
        component: Runner
      },
    ],
  },
]

export default routes
