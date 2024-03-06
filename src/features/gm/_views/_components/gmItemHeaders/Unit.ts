export default [
  { text: '', value: 'ItemType', align: 'right' },
  {
    title: 'Name',
    align: 'start',
    value: 'Name',
    groupable: false,
  },
  {
    title: 'Class',
    align: 'start',
    value: 'NpcClassController.Class.Name',
    groupable: true,
  },
  {
    title: 'Tier',
    align: 'start',
    value: 'NpcClassController.Tier',
    groupable: true,
  },
  {
    title: 'Tag',
    align: 'start',
    value: 'Tag',
    groupable: true,
  },
  {
    title: 'Templates',
    key: 'Templates',
    align: 'start',
    value: 'NpcTemplateController.Templates',
    groupable: true,
  },
];
