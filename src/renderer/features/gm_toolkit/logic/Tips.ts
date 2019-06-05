import _ from 'lodash';
import NPC from './NPC';

export type Tip = { id: string; text: string; satisfied: boolean };

export const NPCTips = (npc: NPC): Tip[] => {
  const output: Tip[] = [];

  const { systems } = npc;
  const templates = npc._templates;

  const optionalModuleCategories = [npc.npcClass.name, 'generic'].concat(
    _.intersection(['mercenary', 'pirate', 'spacer'], npc._templates),
  );

  let optionalString;

  let minOptionalModules = 0;
  let maxOptionalModules = 2;

  if (templates.includes('elite')) {
    optionalString = 'As an Elite, the ';
    minOptionalModules += 1;
    maxOptionalModules += 1;
  } else if (templates.includes('ultra')) {
    optionalString = 'As an Ultra, the ';
    minOptionalModules += 2;
    maxOptionalModules += 2;
  } else optionalString = 'The ';

  optionalString += `NPC should have between <b>${minOptionalModules}</b> and <b>${maxOptionalModules}</b> modules <i>total</i> from the following categories: `;

  optionalString +=
    '<br />' +
    optionalModuleCategories
      .map(_.capitalize)
      .map(s => `<b>${s}</b>`)
      .join(', ');

  const classOrGenericSystemsCount = systems.filter(
    sys => optionalModuleCategories.includes(sys.class) && !sys.base,
  ).length;

  output.push({
    id: 'optional',
    text: optionalString + `<br />It has <b>${classOrGenericSystemsCount}</b>.`,
    satisfied:
      classOrGenericSystemsCount >= minOptionalModules &&
      classOrGenericSystemsCount <= maxOptionalModules,
  });

  if (templates.includes('exotic')) {
    const exoticSystemsCount = systems.filter(sys => sys.class === 'exotic')
      .length;
    output.push({
      id: 'exotic',
      text: `The NPC should have <b>one or two</b> exotic modules.<br/>It has ${exoticSystemsCount}.`,
      satisfied: exoticSystemsCount >= 1 && exoticSystemsCount <= 2,
    });
  }

  if (templates.includes('commander')) {
    const commanderTraitCount = systems.filter(sys => sys.class === 'commander')
      .length;
    output.push({
      id: 'commander',
      text: `The NPC should have <b>one</b> commander trait. It has <b>${commanderTraitCount}</b>.`,
      satisfied: commanderTraitCount === 1,
    });
  }

  if (templates.includes('veteran')) {
    const veteranTraitMax = npc.tier + 1;
    const veteranTraitCount = systems.filter(sys => sys.class === 'veteran')
      .length;
    output.push({
      id: 'veteran',
      text: `The Veteran should have at most <b>${veteranTraitMax}</b> Veteran traits. It has <b>${veteranTraitCount}</b>.`,
      satisfied: veteranTraitCount <= veteranTraitMax,
    });
  }

  if (templates.includes('ultra')) {
    const ultraSystemsCount = systems.filter(
      sys => sys.class === 'ultra' && !sys.base,
    ).length;
    output.push({
      id: 'ultra',
      text: `The Ultra should have <b>1-3</b> Ultra traits or modules.</br>It has ${ultraSystemsCount}.`,
      satisfied: ultraSystemsCount >= 1 && ultraSystemsCount <= 3,
    });
  }

  return output;
};
