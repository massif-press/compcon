import NPCTemplate from './interfaces/NPCTemplate';

const templates: NPCTemplate[] = [
  {
    name: 'ultra',
    description:
      'In Lancer, Ultra-type enemies are typically the most dangerous individual enemies a party can face. Ultra-type enemies are high-tier enemies that do not have to fill command roles. Ultras are champions, favored warriors, major domos: they might command a few units in a retinue or lead armies from the front, but they do not typically engage in grand strategy.<br>An Ultra can serve as a ‘boss’ NPC, capable of taking on multiple mechs at the same time. Since an Ultra has additional structure, it uses structure damage tables like the players, and becomes many times more resilient. Since keeping track of an Ultra is more difficult than a regular NPC, and Ultras are many times more powerful than a regular NPC, it’s recommended you only use one in any given combat encounter.',
    features: [
      {
        name: 'Bonus activations',
        description:
          'The Ultra can be activated again (take another turn) each round. If the Ultra is facing more than 4 hostile player characters or NPCs at the start of a combat scene, it gets another activation (for a total of 3). It regains spent reactions each time it takes a turn.',
      },
      {
        name: 'Deadly',
        description:
          'The Ultra can Critical Hit, dealing an extra +1d6 bonus damage on Critical Hits.',
      },
    ],
    traits: [
      {
        name: 'Juggernaut',
        effect:
          'At the start of its turn, the Ultra ends one condition affecting it.',
      },
      {
        name: 'Legendary',
        effect:
          'The Ultra rolls all overheating and structure damage rolls twice and chooses either result.',
      },
      {
        name: 'Reflex',
        effect:
          'The Ultra has unlimited overwatch reactions (it can still only take 1 reaction per turn).',
      },
    ],
    statTransform(stats) {
      return {
        ...stats,
        structure: 4,
        stress: 4,
        hp: stats.hp + 5,
      };
    },
    incompatibleTemplates: ['elite', 'grunt'],
  },
  {
    name: 'elite',
    description:
      'Elite-type enemies create tougher, more powerful enemies that are a step down from Ultras. Elites get a bonus activation and additional structure, allowing them to make structure checks like players and effectively doubling their HP. Unlike Ultras, Elites don’t enter the CRITICAL state and are destroyed normally when reaching 0 HP.',
    features: [
      {
        name: 'Bonus Activation',
        description: 'The Elite can be activated twice a round',
      },
    ],
    traits: [],
    statTransform(stats) {
      return {
        ...stats,
        structure: 2,
        stress: 2,
      };
    },
    incompatibleTemplates: ['ultra', 'grunt'],
  },
  {
    name: 'grunt',
    description:
      'Grunt-type enemies in Lancer are the most common enemies faced en-mass by players. Grunts are a step above cannon fodder, typically using mass-produced or stock mechs: cheap and trained to be disciplined fighters before deadly ones. Alone, a grunt-type enemy may not be a threat, but in a group, they can present an overwhelming mass of bodies and fire that threatens even the most powerful individual.',
    features: [
      {
        name: 'Chaff',
        description:
          'The grunt has 1 HP and cannot gain more. Grunts don’t take damage if they pass a successful save (such as on certain area of effect attacks) but otherwise take damage normally.',
      },
      {
        name: 'Weak',
        description:
          'Weak: The grunt only has 1 structure and stress maximum. If it takes any heat, it shuts down.',
      },
    ],
    traits: [],
    statCaps: {
      hp: 1,
      heatcap: 0,
      structure: 1,
      stress: 1,
    },
    incompatibleTemplates: ['ultra', 'grunt', 'veteran', 'elite', 'squad'],
  },
  {
    name: 'veteran',
    description:
      'Veteran-type enemies are hardened, experienced fighters that have survived direct engagement with their foes. Their encounter with your players is not their first rodeo: their ability to withstand morale shocks is far higher than an untested greenhorn. Use the Veteran template if you want to make a more memorable character.',
    features: [
      {
        name: 'Veterancy',
        description:
          'Veterancy: The Veteran gains +1 accuracy on all checks and saves of one statistic: Hull, Agility, Systems, Engineering (choose on creation)',
      },
    ],
    traits: [],
    statTransform: stats => ({
      ...stats,
      structure: stats.structure! + 1,
      stress: stats.stress! + 1,
    }),
    incompatibleTemplates: [],
  },
  {
    name: 'exotic',
    description:
      'Exotic-type enemies are, even for a galaxy of wonders, strange and dangerous enemies. Some feature unique technologies not yet available to the wider galaxy, others wield primitive weapon styles updated to the modern day, and others carry equipment or adopt tactics that are alien to Union doctrine.',
    features: [
      {
        name: 'Xenotech',
        description: 'Scans reveal no information about exotic modules',
      },
      {
        name: 'Hardened Target',
        description:
          'Tech attacks take +1 difficulty against this character, and it makes all systems saves with +1 accuracy',
      },
      {
        name: 'Exotic Systems',
        description:
          'Any NPC with the exotic tag can choose one or two optional exotic modules',
      },
    ],
    traits: [],
    incompatibleTemplates: [],
  },

  {
    name: 'drone',
    description:
      'Drone-type enemies are mechs or subaltern frames that are autonomous extensions of companion/concierge units or combat NHPs.',
    features: [
      {
        name: 'No Pilot',
        description:
          'The Drone permanently suffers from the Impaired condition. It cannot make complex decisions or moral judgements. However, it is also immune to all systems and actions that would affect the pilot (it doesn’t have any).',
      },
      {
        name: 'Vulnerable to Tech',
        description:
          'All hostile tech actions against the Drone can be made with +1 Accuracy.',
      },
    ],
    traits: [],
    statTransform(stats) {
      return {
        ...stats,
        hp: stats.hp + 5,
      };
    },
    incompatibleTemplates: [],
  },

  {
    name: 'mercenary',
    description:
      'Mercenary-type enemies are foes that offer their services to the highest bidder. They may have attachments to a faith or flag, but when it comes to doing their business, they’re loyal only to gold.',
    features: [
      {
        name: 'Opportunist',
        description:
          'The Mercenary gets +1 accuracy on any attack when there’s an allied target in engagement to the target of its attack',
      },
      {
        name: 'Mercenary systems',
        description:
          'A mercenary can choose from the list of mercenary systems and traits when choosing optional systems and modules',
      },
    ],
    traits: [],
    incompatibleTemplates: [],
  },

  {
    name: 'commander',
    description:
      'Commander-type enemies operate on a grand scale, controlling fleets and armies across worlds and in interstellar space. They might not be the best individual combatant, but they can bring out the best in the best of their forces.',
    features: [],
    traits: [
      {
        name: 'Command',
        effect:
          'Once per round, the Commander can cause an allied character it can see to re-roll any single attack roll or check as a reaction. The commander can’t use this reaction if it is Jammed.',
      },
    ],
    statTransform: stats => ({
      ...stats,
      structure: stats.structure! + 1,
      stress: stats.stress! + 1,
    }),
    incompatibleTemplates: [],
  },
  {
    name: 'pirate',
    description:
      'Pirate-type enemies live on the boundaries, in the forgotten bolt-holes of occupied space. They are far-ranging, operating around blink gates, interstellar shipping lanes, and near flagged but not-yet colonized worlds.<br>Pirate-type groups are usually small, with their base of operations hidden a short-to-medium distance from the area that they are first encountered. Usually they are motivated by profit and materiel goods, not ideology or religion -- a good thing for a savvy negotiator.<br>Pirate-type enemies commonly operate in mixed groups of fast, deadly subline ships, fighter/bombers, and clutches of marines and  chassis. They prefer hit-and-run style overwhelming ambush attacks, aim to capture rather than kill, and don’t like to engage in pitched battles.<br>Pirate-type enemies can be found across the galaxy wherever the law is spread thin, resources travel, and people are desperate.',
    features: [
      {
        name: 'Pirate modules',
        description:
          'A pirate can choose from the list of pirate modules when choosing optional systems and modules',
      },
    ],
    traits: [
      {
        name: 'Deadly',
        effect:
          'The pirate can Critical Hit, dealing +2/3/4 bonus damage on ranged or melee critical hits.',
      },
    ],
    incompatibleTemplates: [],
  },

  {
    name: 'spacer',
    description:
      'Spacer-type enemies are born and bred in the hard vacuum of deep space. They are adept at maneuvering in and around the difficult, kinetic, low-gravity environments found only in space: blink stations, space stations, among asteroid fields, in low orbit over worlds, and between ships in military and commercial fleets.',
    features: [
      {
        name: 'Optional modules',
        description:
          'A spacer can choose from the list of spacer modules when choosing optional systems and modules',
      },
    ],
    traits: [
      {
        name: 'Maneuverable',
        effect:
          'The Spacer does not suffer the impaired condition for operating in space, underwater, or in zero-g environments and always counts as having an EVA module in those environments.',
      },
    ],
    incompatibleTemplates: [],
  },
  {
    name: 'vehicle',
    description:
      'Vehicle-type enemies are in-atmosphere military or civilian vehicles found throughout the galaxy.<br>You can use any of the mech classes and apply this template to convert that mech into a vehicle. They lose the mech tag and gain the vehicle tag.',
    features: [
      {
        name: 'Limited Maneuverability',
        description:
          'A vehicle must always move in a straight line (though it can move and boost in separate directions). A vehicle cannot climb or swim, and cannot right itself from prone without an adjacent allied character.',
      },
      {
        name: 'Crew',
        description:
          'A vehicle might be operated by more than one crew member (typically a minimum number of crew equal to ½ of the vehicle’s size).',
      },
      {
        name: 'No Manipulators',
        description:
          'A vehicle cannot initiate a grapple, pick up, or manipulate items',
      },
      {
        name: 'Limited Melee Attacks',
        description: 'A vehicle cannot make melee attacks other than Ram.',
      },
      {
        name: 'Type',
        description:
          'You can give a vehicle one or more of the following types: Flier: A flying vehicle can fly when it moves or boosts - Transport: A transport vehicle can hold one squad or a number of entities whose total size (added together) is less than its size - Treads or Hover: A Treaded or Hover vehicle ignores difficult terrain',
      },
    ],
    traits: [],
    incompatibleTemplates: ['ship'],
  },

  {
    name: 'ship',
    description:
      'Ship-type enemies are any military or civilian vehicles that are flight capable and operate primarily in space, outside the bounds of atmosphere (though many can operate in-atmos if need be).<br>You can use any of the mech classes and apply this template to convert that mech into a ship. They lose the mech tag and gain the vehicle tag.',
    features: [
      {
        name: 'Flier',
        description:
          'A ship always counts as having an EVA module in space. In atmosphere, it hovers (it can fly when it moves or boosts, doesn’t have to move in a straight line, and doesn’t have to move on its turn while flying). If it is immobilized, shut down, or stunned mid-air, it crashes.',
      },
      {
        name: 'Massive size',
        description:
          'A ship is typically much larger than a mech. If its size is less than 4, increase its size to 4. This template describes ships that can be engaged on a ship-tomech level. Typical ships (size 10/20+) are usually too heavily armored for mech-mounted weapons to harm them.',
      },
      {
        name: 'Crew',
        description:
          'A ship might be operated by more than one crew member (typically a minimum number of crew equal to ½ of the vehicle’s size).',
      },
      {
        name: 'No Manipulators',
        description:
          'A ship cannot initiate a grapple, pick up, or manipulate items',
      },
      {
        name: 'Limited Melee Attacks',
        description: 'A ship cannot make melee attacks other than Ram.',
      },
      {
        name: 'Transport',
        description:
          'A transport ship can hold one squad or a number of entities whose total size (added together) is less than its size.',
      },
    ],
    traits: [],
    statTransform(stats) {
      return {
        ...stats,
        hp: stats.hp + 5,
      };
    },
    incompatibleTemplates: ['vehicle'],
  },
];

export default templates;
