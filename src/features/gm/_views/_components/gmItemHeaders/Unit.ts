export default [
  { text: '', value: 'ItemType', align: 'right' },
  {
    title: 'common.name',
    align: 'start',
    value: 'Name',
    groupable: false,
  },
  {
    title: 'gm.gmItemHeaders.class',
    align: 'start',
    value: 'NpcClassController.Class.Name',
    groupable: true,
  },
  {
    title: 'common.tier',
    align: 'start',
    value: 'NpcClassController.Tier',
    groupable: true,
  },
  {
    title: 'gm.gmItemHeaders.tag',
    align: 'start',
    value: 'Tag',
    groupable: true,
  },
  {
    title: 'gm.npcBuilder.templates',
    key: 'Templates',
    align: 'start',
    value: 'NpcTemplateController.Templates',
    groupable: true,
  },
]
