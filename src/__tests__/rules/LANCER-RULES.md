# Lancer Rules Implemented in Active Mode

**Generated from `lancer-rules.json` by `scripts/gen-rules-table.mjs`. Do not edit.**
Run `yarn rules:table` after adding or changing a rule; CI fails if this file is out of date.

136 rules and 15 interaction rules, covered by 294 tests in `src/__tests__/rules/`.

| File | Holds |
|---|---|
| `CombatController.ts` | the actor-facing surface; most rules are a function here |
| `ActionPoolController.ts` | the action pool, activations, reactions, uses, overcharge |
| `DamageController.ts` | damage calculation and application |
| `StatusRules.ts` | statuses and conditions |
| `StructureCheck.ts` | rollable tables |
| `AttackRules.ts` | bonus damage, area attacks, auxiliary attacks, object statistics |
| `Flow.ts, ActivationFlow.ts, WeaponAttackFlow.ts` | step sequencing |
| `Duration.ts, Expiration.ts` | how long an effect lasts |

---

## Turn structure (6)

| Rule | Statement | Class | Spec |
|---|---|---|---|
| `T-TURN-activations-01` | one turn per activation per round | AUTO | `actions` (4) |
| `T-TURN-endofnextturn-01` | "end of next turn" means the next turn in the order, not the current one | AUTO | `statuses` (3) |
| `T-TURN-endofturn-01` | end-of-turn effects resolve after all actions, in the player's chosen order | ASSIST | `actions` (1) |
| `T-TURN-order-01` | players act first, sides alternate | ASSIST | `actions` (1) |
| `T-TURN-order-02` | turn order carries across the round boundary | ASSIST | `actions` (1) |
| `T-TURN-resolution-01` | other characters' effects resolve first | ASSIST | `actions` (1) |

## Actions and the action pool (42)

| Rule | Statement | Class | Spec |
|---|---|---|---|
| `T-ACTION-activate-01` | ACTIVATE | AUTO | `actions` (4) |
| `T-ACTION-barrage-01` | BARRAGE attacks with two weapons or one superheavy | AUTO | `actions`, `tags` (2) |
| `T-ACTION-barrage-02` | a barrage grants a bonus auxiliary attack per mount fired | ASSIST | `actions` (2) |
| `T-ACTION-boost-01` | BOOST | ASSIST | `actions` (1) |
| `T-ACTION-bootup-01` | BOOT UP | AUTO | `actions` (1) |
| `T-ACTION-brace-01` | BRACE | AUTO | `actions` (4) |
| `T-ACTION-corepower-01` | CORE POWER is one use between full repairs | AUTO | `actions` (2) |
| `T-ACTION-defaultreactions-01` | every mech has BRACE and OVERWATCH | AUTO | `actions`, `actors` (3) |
| `T-ACTION-disengage-01` | DISENGAGE | ASSIST | `actions` (2) |
| `T-ACTION-fight-01` | FIGHT is a full action | ASSIST | `actions` (1) |
| `T-ACTION-freeaction-01` | free actions are unlimited, own-turn only, and permit duplicates | AUTO | `actions` (2) |
| `T-ACTION-fulltech-01` | FULL TECH is two quick tech options, and PCs may repeat one | AUTO | `actions` (3) |
| `T-ACTION-grapple-01` | GRAPPLE | ASSIST | `actions` (2) |
| `T-ACTION-hide-01` | HIDE | ASSIST | `actions` (2) |
| `T-ACTION-hide-02` | losing HIDDEN | ASSIST | `actions` (3) |
| `T-ACTION-improvised-01` | IMPROVISED ATTACK | ASSIST | `actions` (1) |
| `T-ACTION-invade-01` | invading a willing ally always succeeds and costs no heat | AUTO | `actions` (2) |
| `T-ACTION-jockey-01` | JOCKEY is a full action with three options | ASSIST | `actions` (1) |
| `T-ACTION-mount-01` | MOUNT, DISMOUNT, EJECT | ASSIST | `actions` (4) |
| `T-ACTION-noduplicate-01` | the same action cannot be taken twice per turn | AUTO | `actions` (4) |
| `T-ACTION-overcharge-01` | OVERCHARGE grants one quick action as a free action, once per turn | AUTO | `actions` (4) |
| `T-ACTION-overcharge-02` | the overcharge heat track | AUTO | `actions` (1) |
| `T-ACTION-overwatch-01` | OVERWATCH | ASSIST | `actions` (2) |
| `T-ACTION-pilotactions-01` | the pilot action list | AUTO | `actions` (1) |
| `T-ACTION-pilotpool-01` | pilot and mech share one action pool | AUTO | `actions` (1) |
| `T-ACTION-pilotreload-01` | pilot RELOAD is a quick action for one weapon | AUTO | `actions` (1) |
| `T-ACTION-pool-01` | one standard move plus two quick actions or one full action | AUTO | `actions` (5) |
| `T-ACTION-prepare-01` | PREPARE | ASSIST | `actions`, `statuses` (2) |
| `T-ACTION-protocol-01` | a protocol is a free action usable only at the start of a turn, once each | AUTO | `actions` (4) |
| `T-ACTION-quicktech-01` | QUICK TECH may repeat with a different option | AUTO | `actions` (1) |
| `T-ACTION-quicktech-02` | the base QUICK TECH options | ASSIST | `actions` (1) |
| `T-ACTION-ram-01` | RAM | ASSIST | `actions` (1) |
| `T-ACTION-reaction-01` | one reaction per turn, each reaction once per round, unlimited per round overall | AUTO | `actions` (6) |
| `T-ACTION-search-01` | SEARCH | ASSIST | `actions` (2) |
| `T-ACTION-selfdestruct-01` | SELF-DESTRUCT | ASSIST | `actions`, `actors` (3) |
| `T-ACTION-shutdown-01` | SHUT DOWN | AUTO | `actions` (1) |
| `T-ACTION-skillcheck-01` | SKILL CHECK is a full action | ASSIST | `actions` (6) |
| `T-ACTION-skirmish-01` | SKIRMISH attacks with one weapon | ASSIST | `actions` (2) |
| `T-ACTION-skirmish-02` | a skirmish grants a bonus auxiliary attack on the same mount | ASSIST | `actions` (1) |
| `T-ACTION-skirmish-03` | superheavy weapons cannot skirmish | AUTO | `actions` (1) |
| `T-ACTION-stabilize-01` | STABILIZE: first choice | AUTO | `actions` (3) |
| `T-ACTION-stabilize-02` | STABILIZE: second choice | ASSIST | `actions`, `actors` (5) |

## Attack rolls (1)

| Rule | Statement | Class | Spec |
|---|---|---|---|
| `T-ATTACK-accuracy-01` | accuracy and difficulty | AUTO | `damage` (2) |

## Damage (18)

| Rule | Statement | Class | Spec |
|---|---|---|---|
| `T-DMG-aoe-01` | area attacks roll separately, damage once | ASSIST | `actors` (1) |
| `T-DMG-armor-01` | armor reduces all damage from a single source, and is ignored by AP and burn | AUTO | `damage` (2) |
| `T-DMG-attack-01` | the three attack types | ASSIST | `actors` (2) |
| `T-DMG-bonus-01` | bonus damage | ASSIST | `actors` (1) |
| `T-DMG-burn-01` | burn deals damage immediately, then marks | AUTO | `damage`, `tags` (3) |
| `T-DMG-crit-01` | a critical hit rolls all damage dice twice and takes the highest half | AUTO | `damage` (3) |
| `T-DMG-destroyed-01` | 0 structure destroys | AUTO | `damage` (1) |
| `T-DMG-heat-01` | heat is not damage and converts for characters without a heat cap | AUTO | `damage` (1) |
| `T-DMG-immunity-01` | immunity is total, not a reduction | AUTO | `damage` (3) |
| `T-DMG-irreducible-01` | IRREDUCIBLE | AUTO | `damage` (1) |
| `T-DMG-meltdown-01` | reactor meltdown | ASSIST | `actors` (1) |
| `T-DMG-objects-01` | default object statistics | ASSIST | `actors` (1) |
| `T-DMG-order-01` | the damage calculation order | AUTO | `damage` (1) |
| `T-DMG-overshield-01` | OVERSHIELD | AUTO | `damage` (2) |
| `T-DMG-reliable-01` | reliable damage applies on a miss | AUTO | `damage` (1) |
| `T-DMG-resist-01` | resistance halves and does not stack | AUTO | `damage` (1) |
| `T-DMG-structure-01` | structure damage procedure | AUTO | `damage` (1) |
| `T-DMG-zero-01` | damage reduced to zero still counts as taking damage | AUTO | `damage` (3) |

## Range and areas (1)

| Rule | Statement | Class | Spec |
|---|---|---|---|
| `T-RANGE-patterns-01` | LINE, CONE, BLAST, BURST | ASSIST | `actors` (1) |

## Heat and overheating (4)

| Rule | Statement | Class | Spec |
|---|---|---|---|
| `T-HEAT-cooling-01` | heat clears on stabilize, rest, or full repair | AUTO | `damage` (1) |
| `T-HEAT-dangerzone-01` | the danger zone begins at half heat cap | AUTO | `actions` (1) |
| `T-HEAT-overheat-01` | the overheating procedure | AUTO | `damage` (2) |
| `T-HEAT-reactor-01` | 0 stress means a meltdown at the end of the next turn | AUTO | `damage` (1) |

## Overheat chart (5)

| Rule | Statement | Class | Spec |
|---|---|---|---|
| `T-STRESS-destab-01` | Destabilized Power Plant (2-4) | AUTO | `structure` (1) |
| `T-STRESS-irreversible-01` | Irreversible Meltdown (two or more 1s) | AUTO | `structure` (1) |
| `T-STRESS-meltdown-01` | Meltdown (1) | ASSIST | `structure` (3) |
| `T-STRESS-roll-01` | the overheating check | AUTO | `structure` (3) |
| `T-STRESS-shunt-01` | Emergency Shunt (5-6) | AUTO | `structure` (1) |

## Structure chart (6)

| Rule | Statement | Class | Spec |
|---|---|---|---|
| `T-STRUCT-crushing-01` | Crushing Hit (two or more 1s) | AUTO | `structure` (2) |
| `T-STRUCT-directhit-01` | Direct Hit (1) | ASSIST | `structure` (2) |
| `T-STRUCT-glancing-01` | Glancing Blow (5-6) | AUTO | `structure` (1) |
| `T-STRUCT-monstrosity-01` | the monstrosity structure chart | ASSIST | `structure` (4) |
| `T-STRUCT-roll-01` | the structure damage check | AUTO | `structure` (3) |
| `T-STRUCT-trauma-01` | System Trauma (2-4) | ASSIST | `structure` (3) |

## Repair and rest (4)

| Rule | Statement | Class | Spec |
|---|---|---|---|
| `T-REPAIR-cap-01` | repair cap is the pool of repairs available before a full repair | AUTO | `actions` (1) |
| `T-REPAIR-combat-01` | in-combat repair restores all HP for 1 repair | AUTO | `actions` (1) |
| `T-REPAIR-costs-01` | repair costs | ASSIST | `actors` (2) |
| `T-REPAIR-rest-01` | resting and full repair | AUTO | `actors` (3) |

## Statuses and conditions (17)

| Rule | Statement | Class | Spec |
|---|---|---|---|
| `T-STATUS-cascade-01` | CASCADE | ASSIST | `statuses` (2) |
| `T-STATUS-dangerzone-01` | DANGER ZONE | AUTO | `damage` (1) |
| `T-STATUS-downandout-01` | DOWN AND OUT | AUTO | `statuses` (2) |
| `T-STATUS-engaged-01` | ENGAGED | ASSIST | `statuses` (2) |
| `T-STATUS-exposed-01` | EXPOSED | AUTO | `damage` (1) |
| `T-STATUS-exposed-02` | EXPOSED is cleared by cooling, stabilizing, and shutting down | AUTO | `actors` (2) |
| `T-STATUS-hidden-01` | HIDDEN | ASSIST | `statuses` (4) |
| `T-STATUS-immobilized-01` | IMMOBILIZED | ASSIST | `statuses` (1) |
| `T-STATUS-impaired-01` | IMPAIRED | AUTO | `statuses` (2) |
| `T-STATUS-invisible-01` | INVISIBLE | AUTO | `statuses` (3) |
| `T-STATUS-jammed-01` | JAMMED | AUTO | `statuses` (2) |
| `T-STATUS-lockon-01` | LOCK ON | AUTO | `actions`, `statuses` (2) |
| `T-STATUS-prone-01` | PRONE | ASSIST | `statuses` (5) |
| `T-STATUS-shredded-01` | SHREDDED | AUTO | `damage` (3) |
| `T-STATUS-shutdown-01` | SHUT DOWN | AUTO | `statuses` (2) |
| `T-STATUS-slowed-01` | SLOWED | AUTO | `actors`, `statuses` (2) |
| `T-STATUS-stunned-01` | STUNNED | AUTO | `statuses` (5) |

## Tags (12)

| Rule | Statement | Class | Spec |
|---|---|---|---|
| `T-TAG-ai-01` | AI mechs act autonomously as a protocol | AUTO | `actions`, `actors` (4) |
| `T-TAG-heatself-01` | a heat self weapon charges its user heat on use | AUTO | `damage` (2) |
| `T-TAG-loading-01` | a loading weapon must be reloaded before reuse | AUTO | `tags` (3) |
| `T-TAG-mod-01` | a weapon mod is not a valid system trauma target | AUTO | `tags` (1) |
| `T-TAG-npctags-01` | the NPC-only tags | AUTO | `actors` (1) |
| `T-TAG-ordnance-01` | ordnance may only be fired before any movement or other action on a turn | AUTO | `actions` (3) |
| `T-TAG-overkill-01` | overkill rerolls ones and deals 1 heat each | AUTO | `tags` (2) |
| `T-TAG-recharge-01` | recharge is a d6 at the start of the NPC's turn | AUTO | `actors` (4) |
| `T-TAG-sidearm-01` | SIDEARM | AUTO | `actions` (1) |
| `T-TAG-smart-01` | smart changes only the targeted stat | AUTO | `actors` (1) |
| `T-TAG-system-01` | only System-tagged NPC features are destroyable by structure damage | AUTO | `actors` (1) |
| `T-TAG-trait-01` | traits cannot be destroyed | AUTO | `actors` (1) |

## Statistics (4)

| Rule | Statement | Class | Spec |
|---|---|---|---|
| `T-STAT-grit-01` | what GRIT applies to | AUTO | `actors` (1) |
| `T-STAT-npctier-01` | tier scaling | AUTO | `actors` (2) |
| `T-STAT-pilot-01` | pilot statistics in mech combat | AUTO | `actors` (1) |
| `T-STAT-pilotattack-01` | unmounted characters use GRIT instead of triggers | AUTO | `actors` (1) |

## Actors (3)

| Rule | Statement | Class | Spec |
|---|---|---|---|
| `T-ACTOR-cockpit-01` | a pilot inside an intact mech cannot be targeted | AUTO | `actors` (2) |
| `T-ACTOR-unlicensed-01` | piloting an unlicensed mech makes it IMPAIRED and SLOWED | ASSIST | `actions`, `actors` (2) |
| `T-ACTOR-unmounted-01` | unmounted characters are BIOLOGICAL and tech-immune | AUTO | `actors`, `statuses` (2) |

## NPCs (12)

| Rule | Statement | Class | Spec |
|---|---|---|---|
| `T-NPC-actions-01` | NPCs take one turn per round with the standard pool | AUTO | `actors` (3) |
| `T-NPC-actions-02` | NPCs cannot overcharge or brace | AUTO | `actors` (5) |
| `T-NPC-actions-03` | the NPC action list | AUTO | `actors` (1) |
| `T-NPC-damage-01` | NPCs deal fixed damage and cannot crit | AUTO | `actors` (1) |
| `T-NPC-fulltech-01` | NPC full tech allows two *different* quick tech options | AUTO | `actors` (1) |
| `T-NPC-grappleram-01` | NPC grapple and ram use a tiered bonus | AUTO | `actors` (2) |
| `T-NPC-grunt-01` | a Grunt is destroyed by any external heat | AUTO | `actors` (2) |
| `T-NPC-invade-01` | the NPC invade differs from the PC one | ASSIST | `actors` (1) |
| `T-NPC-overwatch-01` | an NPC may overwatch once between turns | ASSIST | `actors` (1) |
| `T-NPC-stabilize-01` | NPC stabilize is one combined effect | AUTO | `actors` (1) |
| `T-NPC-stress-01` | NPCs have 1 stress and become EXPOSED instead of checking | AUTO | `actors` (2) |
| `T-NPC-structure-01` | NPCs have 1 structure and are destroyed at 0 HP without a check | AUTO | `actors` (2) |

## Movement and cover (1)

| Rule | Statement | Class | Spec |
|---|---|---|---|
| `T-MOVE-cover-01` | cover | ASSIST | `actions`, `statuses` (2) |

---

## Interaction rules (15)

Cases where two rules meet, and a bug could only appear at the seam.

| Rule | Statement | Composes | Spec |
|---|---|---|---|
| `T-INT-actor-01` | Damage to a mounted pilot lands on the mech, so the pilot cannot be brought DOWN AND OUT while their mech is intact. | `T-ACTOR-cockpit-01`, `T-STATUS-downandout-01` | `interactions` (1) |
| `T-INT-actor-02` | An AI-controlled mech and its pilot draw from separate pools, so spending the mech's full action leaves the pilot's intact. | `T-TAG-ai-01`, `T-ACTION-pilotpool-01` | `interactions` (1) |
| `T-INT-duration-01` | A status applied by a chart row with an until-end-of-next-turn duration survives the turn it was applied on and expires on the next. | `T-STRUCT-glancing-01`, `T-TURN-endofnextturn-01` | `interactions` (1) |
| `T-INT-duration-02` | A scene-duration status from a chart row survives every round boundary until the encounter ends. | `T-STRUCT-monstrosity-01`, `T-TURN-endofnextturn-01` | `interactions` (1) |
| `T-INT-heat-01` | Overcharge heat passes through the full damage pipeline: it can push the mech over its heat cap and trigger an overheating check in the same step. | `T-ACTION-overcharge-02`, `T-HEAT-overheat-01` | `interactions` (1) |
| `T-INT-heat-02` | Overcharge heat against an actor with no heat cap converts to energy damage rather than accumulating. | `T-ACTION-overcharge-02`, `T-DMG-heat-01` | `interactions` (1) |
| `T-INT-reaction-01` | Bracing consumes the reaction for the turn and locks out reactions until the end of the next turn, so a second reaction cannot be taken in between. | `T-ACTION-reaction-01`, `T-ACTION-brace-01` | `interactions` (1) |
| `T-INT-reaction-02` | A reaction spent before a character's first turn stays spent for that round and refreshes at the start of its turn in the next. | `T-ACTION-reaction-01`, `T-TURN-activations-01` | `interactions` (1) |
| `T-INT-status-01` | A STUNNED mech cannot overcharge, and an overcharge already granted is lost rather than held. | `T-STATUS-stunned-01`, `T-ACTION-overcharge-01` | `interactions` (1) |
| `T-INT-status-02` | PRONE implies SLOWED, so a prone character is denied BOOST for as long as it is prone. | `T-STATUS-prone-01`, `T-STATUS-slowed-01` | `interactions` (1) |
| `T-INT-status-03` | SHREDDED removes armor and resistance from the damage order while leaving exposed doubling and vulnerability intact. | `T-STATUS-shredded-01`, `T-DMG-order-01` | `interactions` (1) |
| `T-INT-struct-01` | System Trauma never offers a weapon mod as a destruction target, and destroying a modded weapon destroys its mod with it. | `T-STRUCT-trauma-01`, `T-TAG-mod-01` | `interactions` (1) |
| `T-INT-struct-02` | A single hit crossing several structure points queues one check per point, each rolling against the running marked total. | `T-DMG-structure-01`, `T-STRUCT-roll-01` | `interactions` (1) |
| `T-INT-struct-03` | A one-structure NPC is destroyed at 0 HP without rolling, so no chart row is ever selected for it. | `T-STRUCT-crushing-01`, `T-NPC-structure-01` | `interactions` (1) |
| `T-INT-undo-01` | Every state a rule mutates is captured by the encounter snapshot, so undoing a structure check restores structure, HP, statuses, and pending checks together. | `T-DMG-structure-01`, `T-STRUCT-roll-01` | `interactions` (1) |
