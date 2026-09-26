const Main = () => import('./index.vue')

const Home = () => import('./landing.vue')

const GmPrint = () => import('./npc_roster/print/index.vue')
const NarrativePrint = () => import('./narrative/print/index.vue')
const EncounterPrint = () => import('./encounters/print/index.vue')

const Campaigns = () => import('./campaigns/index.vue')
const CampaignEditor = () => import('./campaigns/editor.vue')

const NpcRoster = () => import('./npc_roster/index.vue')

const NarrativeIndex = () => import('./narrative/index.vue')
const NarrativeGraph = () => import('./narrative/graph.vue')

const Encounters = () => import('./encounters/index.vue')

const routes = [
  {
    path: '',
    component: Main,
    children: [
      {
        path: '',
        name: 'gm-toolkit-home',
        component: Home,
        searchData: {
          title: 'common.gmToolkit',
          icon: 'cc:encounter',
        },
        meta: { title: 'common.gmToolkit' },
      },
      {
        path: 'campaigns',
        name: 'gm-campaigns',
        component: Campaigns,
        searchData: {
          title: 'gm.routes.campaignEditor',
          icon: 'cc:encounter',
        },
        meta: { title: 'gm.routes.campaignEditor' },
      },
      {
        path: 'campaigns/edit/:id',
        name: 'gm-campaign-editor',
        component: CampaignEditor,
        props: true,
      },
      {
        path: 'npcs/:type?/:id?',
        name: 'gm-npcs',
        props: true,
        component: NpcRoster,
        searchData: {
          title: 'common.npcRoster',
          icon: 'cc:encounter',
        },
        meta: { title: 'common.npcRoster' },
      },
      {
        path: 'encounters/:id?',
        name: 'gm-encounters',
        component: Encounters,
        props: true,
        searchData: {
          title: 'gm.shared.encounterEditor',
          icon: 'cc:encounter',
        },
        meta: { title: 'gm.shared.encounterEditor' },
      },
      {
        path: 'narrative/:type?/:id?',
        name: 'gm-narrative',
        props: true,
        component: NarrativeIndex,
        searchData: {
          title: 'gm.routes.narrativeItemManager',
          icon: 'cc:encounter',
        },
        meta: { title: 'gm.routes.narrativeItemManager' },
      },
      {
        path: 'narrative/graph',
        name: 'gm-narrative-graph',
        component: NarrativeGraph,
      },

      {
        path: '/gm/print/npcs/:ids',
        name: 'gm-npc-print',
        component: GmPrint,
        props: true,
      },
      {
        path: '/gm/print/narrative/:ids',
        name: 'gm-narrative-print',
        component: NarrativePrint,
        props: true,
      },
      {
        path: '/gm/print/encounter/:id',
        name: 'gm-encounter-print',
        component: EncounterPrint,
        props: true,
      },
    ],
  },
]

export default routes
