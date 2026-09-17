# Lancer Rules Implemented in Active Mode

**Generated from `lancer-rules.json` by `scripts/gen-rules-table.mjs`. Do not edit.**
Run `yarn rules:table` after adding or changing a rule. CI fails if this file is out of date.

135 rules and 15 interaction rules, covered by 301 tests in `src/__tests__/rules/`.

| File | Holds |
|---|---|
| `CombatController.ts` | the actor-bound combat engine. Most rules are represented by a function here |
| `ActionPoolController.ts` | the action pool, activations, reactions, uses, overcharge |
| `DamageController.ts` | damage calculation and application |
| `StatusRules.ts` | statuses and conditions |
| `StructureCheck.ts` | rollable tables |
| `AttackRules.ts` | bonus damage, area attacks, auxiliary attacks, object statistics |
| `Flow.ts, ActivationFlow.ts, WeaponAttackFlow.ts` | step sequencing |
| `Duration.ts, Expiration.ts` | how long an effect lasts |

---

## Turn structure (6)

| Rule | Title | Statement | Class | Spec |
|---|---|---|---|---|
| `T-TURN-activations-01` | one turn per activation per round | Each character takes at least one turn per round, and must take as many turns as it has activations per round. A round ends when all characters have taken one turn per available activation. | AUTO | `actions` (4) |
| `T-TURN-endofnextturn-01` | "end of next turn" means the next turn in the order, not the current one | An effect lasting until the end of a character's next turn persists to the *next* turn that character has in the order,never the turn on which it was received. | AUTO | `statuses` (3) |
| `T-TURN-endofturn-01` | end-of-turn effects resolve after all actions, in the player's chosen order | End-of-turn effects resolve after all moves and actions, including free actions and overcharge, and before the next character's turn. | ASSIST | `actions` (1) |
| `T-TURN-order-01` | players act first, sides alternate | Turn order alternates sides, and a player (or allied NPC) always takes the first turn of a combat. | ASSIST | `actions` (1) |
| `T-TURN-order-02` | turn order carries across the round boundary | Turn order carries across the round boundary. | ASSIST | `actions` (1) |
| `T-TURN-resolution-01` | other characters' effects resolve first | Effects caused by other characters resolve first on a character's turn; the character chooses the order of their own. | ASSIST | `actions` (1) |

## Actions and the action pool (42)

| Rule | Title | Statement | Class | Spec |
|---|---|---|---|---|
| `T-ACTION-activate-01` | ACTIVATE | ACTIVATE may be taken any number of times per turn, but the same system may not be activated twice unless as a free action. | AUTO | `actions` (4) |
| `T-ACTION-barrage-01` | BARRAGE attacks with two weapons or one superheavy | BARRAGE attacks with two different weapons, or one superheavy. The same weapon may not be chosen twice; two copies of the same weapon in different mounts may both be used. | AUTO | `actions`, `tags` (2) |
| `T-ACTION-barrage-02` | a barrage grants a bonus auxiliary attack per mount fired | A barrage grants an additional auxiliary attack on each mount fired, provided that auxiliary has not already fired this action. Those attacks deal no bonus damage. | ASSIST | `actions` (2) |
| `T-ACTION-boost-01` | BOOST | BOOST is a quick action granting a second standard move. A SLOWED or IMMOBILIZED character cannot take it. | ASSIST | `actions` (2) |
| `T-ACTION-bootup-01` | BOOT UP | BOOT UP is a full action that clears SHUT DOWN. | AUTO | `actions` (1) |
| `T-ACTION-brace-01` | BRACE | BRACE is a 1/round reaction triggered by being hit after damage is rolled. The bracing character counts as having RESISTANCE to all damage from the triggering attack, and until the end of its next turn every other attack against it is made at +1 difficulty. In exchange it may take no reactions until the end of its next turn, and on that turn may take only one quick action — no overcharge, no normal movement, no full actions, no free actions. | AUTO | `actions` (4) |
| `T-ACTION-corepower-01` | CORE POWER is one use between full repairs | CORE POWER is a single use that cannot be saved up and replenishes on a FULL REPAIR. Only activating a core system spends it. | AUTO | `actions` (2) |
| `T-ACTION-defaultreactions-01` | every mech has BRACE and OVERWATCH | Every mech has BRACE and OVERWATCH available as reactions, each once per round. | AUTO | `actions`, `actors` (3) |
| `T-ACTION-disengage-01` | DISENGAGE | DISENGAGE is a full action: the character's movement ignores engagement and reactions for the rest of the turn, and they cease to be ENGAGED. | ASSIST | `actions` (2) |
| `T-ACTION-fight-01` | FIGHT is a full action | FIGHT is a full action attacking with one pilot weapon within RANGE or THREAT and line of sight. Ranged attacks are affected by cover and take +1 difficulty while engaged. | ASSIST | `actions` (1) |
| `T-ACTION-freeaction-01` | free actions are unlimited, own-turn only, and permit duplicates | Free actions are unlimited in number, may be taken only on the character's own turn, do not consume quick or full actions, and may duplicate an action already taken. | AUTO | `actions` (2) |
| `T-ACTION-fulltech-01` | FULL TECH is two quick tech options, and PCs may repeat one | FULL TECH takes either one full tech option or two quick tech options. A PC may choose the same quick tech option twice; an NPC must choose two different ones. | AUTO | `actions` (3) |
| `T-ACTION-grapple-01` | GRAPPLE | On a successful GRAPPLE both characters become ENGAGED, neither may BOOST or take reactions for its duration, and the smaller becomes IMMOBILIZED. At equal size the initiator has control until a contested HULL check at the start of the target's turn says otherwise. The grapple ends on broken adjacency, on the attacker's free action, or on the defender's successful contested HULL check as a quick action. | ASSIST | `actions` (3) |
| `T-ACTION-hide-01` | HIDE | HIDE is a quick action taken with cover, concealment, or outside an enemy's line of sight. A HIDDEN character cannot be directly targeted, and stops being HIDDEN once it attacks. | ASSIST | `actions` (2) |
| `T-ACTION-hide-02` | losing HIDDEN | A HIDDEN character loses HIDDEN on making any attack, on taking any hostile action including LOCK ON, on using BOOST, on taking a reaction, on losing its cover or line-of-sight protection, and on ceasing to be INVISIBLE while uncovered. | ASSIST | `actions` (3) |
| `T-ACTION-improvised-01` | IMPROVISED ATTACK | An IMPROVISED ATTACK is a melee attack against an adjacent target dealing 1d6 kinetic on a hit. | ASSIST | `actions` (1) |
| `T-ACTION-invade-01` | invading a willing ally always succeeds and costs no heat | Invading a willing allied character always succeeds, does not count as an attack, and deals the target no heat. | AUTO | `actions` (2) |
| `T-ACTION-jockey-01` | JOCKEY is a full action with three options | JOCKEY is a full action: a contested skill check using GRIT against the mech's HULL. On success the pilot rides the mech and chooses DISTRACT (IMPAIRED and SLOWED until the end of the mech's next turn), SHRED (2 heat), or DAMAGE (4 kinetic), repeatable as a full action on later turns. The mech may shake the pilot off with another contested check as a full action. | ASSIST | `actions` (1) |
| `T-ACTION-mount-01` | MOUNT, DISMOUNT, EJECT | MOUNT and DISMOUNT are full actions requiring adjacency; a dismount with no free adjacent space is impossible. EJECT is a quick action, single-use, that leaves the mech IMPAIRED until its next FULL REPAIR. | ASSIST | `actions` (4) |
| `T-ACTION-noduplicate-01` | the same action cannot be taken twice per turn | The same action may not be taken more than once per turn, except as a free action or a reaction. | AUTO | `actions` (4) |
| `T-ACTION-overcharge-01` | OVERCHARGE grants one quick action as a free action, once per turn | OVERCHARGE may be taken once per turn and lets the character take any quick action as a free action, including one already taken. Taking the heat and performing that quick action are a single step — the granted action cannot be deferred. | AUTO | `actions` (4) |
| `T-ACTION-overcharge-02` | the overcharge heat track | The overcharge heat cost escalates 1, 1d3, 1d6, then 1d6+4 for every subsequent use. The counter resets only on a FULL REPAIR. | AUTO | `actions` (1) |
| `T-ACTION-overwatch-01` | OVERWATCH | OVERWATCH is a 1/round reaction: the character immediately skirmishes with the triggering weapon against a hostile that starts a movement inside that weapon's THREAT, resolving before the movement. Ordnance weapons may never be used for it. | ASSIST | `actions` (2) |
| `T-ACTION-pilotactions-01` | the pilot action list | Pilots take BOOST, HIDE, SEARCH, ACTIVATE, SKILL CHECK, DISENGAGE, PREPARE, and MOUNT by the mech rules; may OVERWATCH using FIGHT; and additionally take FIGHT, JOCKEY, and RELOAD. | AUTO | `actions` (1) |
| `T-ACTION-pilotpool-01` | pilot and mech share one action pool | A pilot and their mech draw from one action pool, and the player may split actions between them freely. | AUTO | `actions` (1) |
| `T-ACTION-pilotreload-01` | pilot RELOAD is a quick action for one weapon | Pilot RELOAD is a quick action reloading one LOADING pilot weapon. | AUTO | `actions` (1) |
| `T-ACTION-pool-01` | one standard move plus two quick actions or one full action | On its turn a character may make one standard move and take either two quick actions or one full action. | AUTO | `actions` (5) |
| `T-ACTION-prepare-01` | PREPARE | PREPARE is a quick action that readies another quick action against a stated trigger, usable as a reaction until the start of the character's next turn. Preparing counts as taking the action and inherits all its restrictions. While holding a prepared action the character may not move or take any other action or reaction; the prepared action may be dropped, and is lost if its trigger never fires. | ASSIST | `actions`, `statuses` (2) |
| `T-ACTION-protocol-01` | a protocol is a free action usable only at the start of a turn, once each | A protocol is a free action available only at the start of a turn, once each per turn. Every path that spends an action must close the protocol window. | AUTO | `actions` (4) |
| `T-ACTION-quicktech-01` | QUICK TECH may repeat with a different option | QUICK TECH may be taken more than once per turn, but a different option must be chosen each time unless granted as a free action. | AUTO | `actions` (1) |
| `T-ACTION-quicktech-02` | the base QUICK TECH options | The base QUICK TECH options are BOLSTER, SCAN, LOCK ON, and INVADE. BOLSTER grants +2 accuracy on the target's next check or save until the end of their next turn and does not stack. INVADE deals 2 heat on a hit and applies one invasion option; FRAGMENT SIGNAL applies IMPAIRED and SLOWED until the end of the target's next turn. | ASSIST | `actions` (1) |
| `T-ACTION-ram-01` | RAM | RAM is a melee attack against an adjacent character of equal or smaller size. On a hit the target is knocked PRONE, and the attacker may also knock it back one space. | ASSIST | `actions` (2) |
| `T-ACTION-reaction-01` | one reaction per turn, each reaction once per round, unlimited per round overall | one reaction per turn, each specific reaction once per round, and uses refresh at the start of the character's own turn rather than at the round boundary. | AUTO | `actions` (6) |
| `T-ACTION-search-01` | SEARCH | SEARCH makes a contested SYSTEMS check against a suspected HIDDEN character's AGILITY within SENSORS; on foot it is a contested skill check within RANGE 5. A found character immediately loses HIDDEN. | ASSIST | `actions` (2) |
| `T-ACTION-selfdestruct-01` | SELF-DESTRUCT | SELF-DESTRUCT is a quick action initiating a reactor meltdown. It detonates at the end of the character's next turn, or at the end of any of its turns within the following two rounds — the pilot's choice. | ASSIST | `actions`, `actors` (3) |
| `T-ACTION-shutdown-01` | SHUT DOWN | SHUT DOWN is a quick action applying the SHUT DOWN status. | AUTO | `actions` (1) |
| `T-ACTION-skillcheck-01` | SKILL CHECK is a full action | A SKILL CHECK is a full action. Its parameters and outcome are the GM's to set. | ASSIST | `actions` (6) |
| `T-ACTION-skirmish-01` | SKIRMISH attacks with one weapon | SKIRMISH attacks with a single weapon. | ASSIST | `actions` (2) |
| `T-ACTION-skirmish-02` | a skirmish grants a bonus auxiliary attack on the same mount | A skirmish grants an additional attack with a *different* auxiliary weapon on the same mount. That attack deals no bonus damage, regardless of the order the two are resolved in. | ASSIST | `actions` (1) |
| `T-ACTION-skirmish-03` | superheavy weapons cannot skirmish | Superheavy weapons cannot skirmish. For NPCs, the skirmish list is weapons only — not systems, traits, or reactions. | AUTO | `actions` (1) |
| `T-ACTION-stabilize-01` | STABILIZE: first choice | STABILIZE's first choice is either cooling — clearing all heat and EXPOSED — or marking 1 REPAIR to restore all HP. | AUTO | `actions` (3) |
| `T-ACTION-stabilize-02` | STABILIZE: second choice | STABILIZE's second choice is one of: reload all LOADING weapons; clear marked burn; clear one condition on self; or clear one condition on an adjacent ally. A condition caused by the character's own systems or talents may not be cleared this way. | ASSIST | `actions`, `actors` (5) |

## Attack rolls (1)

| Rule | Title | Statement | Class | Spec |
|---|---|---|---|---|
| `T-ATTACK-accuracy-01` | accuracy and difficulty | Accuracy and difficulty cancel one another pairwise. Each remaining point is one d6; a single d6 is rolled per point and the highest result is added to an accuracy roll or subtracted from a difficulty roll. | AUTO | `damage` (2) |

## Damage (18)

| Rule | Title | Statement | Class | Spec |
|---|---|---|---|---|
| `T-DMG-aoe-01` | area attacks roll separately, damage once | An area or multi-target attack rolls damage once and applies it to every target after all attack rolls are made. | ASSIST | `actors` (1) |
| `T-DMG-armor-01` | armor reduces all damage from a single source, and is ignored by AP and burn | ARMOR reduces incoming damage from a single source by its rating. AP, burn, and heat ignore ARMOR entirely. | AUTO | `damage` (2) |
| `T-DMG-attack-01` | the three attack types | A melee or ranged attack rolls 1d20 + GRIT + accuracy/difficulty against EVASION. A tech attack rolls 1d20 + TECH ATTACK + accuracy/difficulty against E-DEFENSE. Melee and tech ignore cover; ranged takes +1 difficulty from soft cover, +2 from hard, and +1 more while engaged. | ASSIST | `actors` (2) |
| `T-DMG-bonus-01` | bonus damage | Bonus damage applies only to melee and ranged attacks, is only kinetic, explosive, or energy, defaults to kinetic when unspecified, and is halved when the attack targets more than one character. | ASSIST | `actors` (1) |
| `T-DMG-burn-01` | burn deals damage immediately, then marks | Burn deals its damage immediately, ignoring ARMOR, and is then marked. At the end of the character's turn, marked burn triggers an ENGINEERING check: success clears all marked burn, failure deals damage equal to the marked total. RESISTANCE applies to the initial damage only, never to the end-of-turn tick. | AUTO | `damage`, `tags` (3) |
| `T-DMG-crit-01` | a critical hit rolls all damage dice twice and takes the highest half | A natural 20 or better on a melee or ranged attack is a critical hit: roll every damage die twice, including bonus damage, and keep the highest half **of each source of damage separately**. A hit dealing 2d6 kinetic plus 1d6 bonus rolls 4d6 keeping two, and 2d6 keeping one. Tech attacks cannot crit. | AUTO | `damage` (3) |
| `T-DMG-destroyed-01` | 0 structure destroys | A mech reduced to 0 STRUCTURE is destroyed. Player mechs have 4 STRUCTURE by default. | AUTO | `damage` (1) |
| `T-DMG-heat-01` | heat is not damage and converts for characters without a heat cap | Heat is not damage. It ignores ARMOR but is subject to RESISTANCE. A character with no HEAT CAP takes an equivalent amount of energy damage instead. | AUTO | `damage` (1) |
| `T-DMG-immunity-01` | immunity is total, not a reduction | IMMUNITY is total negation, not a reduction. An immune character never takes the damage or effect at all, and never counts as having taken it — not even as 0. | AUTO | `damage` (3) |
| `T-DMG-irreducible-01` | IRREDUCIBLE | Irreducible damage bypasses ARMOR and RESISTANCE entirely. | AUTO | `damage` (1) |
| `T-DMG-meltdown-01` | reactor meltdown | A reactor meltdown kills any pilot inside, annihilates the mech, and deals 4d6 explosive in a BURST 2; an AGILITY save halves it. A meltdown on a countdown updates that countdown at the start of the character's turn. | ASSIST | `actors` (1) |
| `T-DMG-objects-01` | default object statistics | Objects default to 5 EVASION and 10 HP per point of SIZE. A multi-section object has independently destroyable SIZE 1 sections of 10 HP each. | ASSIST | `actors` (1) |
| `T-DMG-order-01` | the damage calculation order | Damage resolves in four steps: roll and apply increases such as EXPOSED doubling; subtract ARMOR; apply RESISTANCE and other defender reductions; subtract from HP. | AUTO | `damage` (1) |
| `T-DMG-overshield-01` | OVERSHIELD | OVERSHIELD absorbs incoming damage before HP. Damage at or below the overshield is absorbed entirely; damage above it zeroes the overshield and carries the remainder through to HP. | AUTO | `damage` (2) |
| `T-DMG-reliable-01` | reliable damage applies on a miss | A weapon with RELIABLE deals its reliable value as damage when the attack misses. | AUTO | `damage` (1) |
| `T-DMG-resist-01` | resistance halves and does not stack | RESISTANCE halves incoming damage of its type, rounding up, and does not stack — a character has it once per damage type or not at all. | AUTO | `damage` (1) |
| `T-DMG-structure-01` | structure damage procedure | A character with STRUCTURE reduced to 0 HP takes 1 structure damage, makes a structure damage check, resets HP to full, and then takes any excess damage — repeating for as many structure points as the excess consumes. | AUTO | `damage` (1) |
| `T-DMG-zero-01` | damage reduced to zero still counts as taking damage | Damage reduced to 0 by armor or any other reduction still counts as damage taken. Only IMMUNITY prevents that. | AUTO | `damage` (3) |

## Range and areas (1)

| Rule | Title | Statement | Class | Spec |
|---|---|---|---|---|
| `T-RANGE-patterns-01` | LINE, CONE, BLAST, BURST | An area attack makes a separate attack roll per target, rolls damage once, and halves bonus damage when more than one character is affected. All attack rolls are made before any damage is applied. | ASSIST | `actors` (1) |

## Heat and overheating (4)

| Rule | Title | Statement | Class | Spec |
|---|---|---|---|---|
| `T-HEAT-cooling-01` | heat clears on stabilize, rest, or full repair | Heat clears on STABILIZE, on rest, and on a FULL REPAIR. | AUTO | `damage` (1) |
| `T-HEAT-dangerzone-01` | the danger zone begins at half heat cap | A mech at or above half its HEAT CAP is in the DANGER ZONE. Equipment restricted to the danger zone may only be used in that state. | AUTO | `actions` (1) |
| `T-HEAT-overheat-01` | the overheating procedure | Heat *exceeding* the HEAT CAP causes overheating: take 1 STRESS, make an overheating check, clear heat, then carry the excess forward, repeating as needed. Heat exactly equal to the HEAT CAP is safe. | AUTO | `damage` (2) |
| `T-HEAT-reactor-01` | 0 stress means a meltdown at the end of the next turn | A mech reduced to 0 STRESS suffers a reactor meltdown at the end of its *next* turn — not immediately. | AUTO | `damage` (1) |

## Overheat chart (5)

| Rule | Title | Statement | Class | Spec |
|---|---|---|---|---|
| `T-STRESS-destab-01` | Destabilized Power Plant (2-4) | Destabilized Power Plant (2-4) applies EXPOSED, which persists until cleared. | AUTO | `structure` (1) |
| `T-STRESS-irreversible-01` | Irreversible Meltdown (two or more 1s) | Irreversible Meltdown (two or more 1s) causes a reactor meltdown at the end of the character's next turn — not immediately. | AUTO | `structure` (1) |
| `T-STRESS-meltdown-01` | Meltdown (1) | Meltdown (1) branches on remaining STRESS: at 3 or more, EXPOSED; at exactly 2, an ENGINEERING check — success is EXPOSED, failure is a reactor meltdown after 1d6 of the character's turns, a countdown the GM rolls and which a retried ENGINEERING check can still prevent; at 1, a reactor meltdown at the end of the next turn. | ASSIST | `structure` (3) |
| `T-STRESS-roll-01` | the overheating check | An overheating check rolls 1d6 per marked stress point, including the point just taken, and uses the lowest result. Two or more 1s select the catastrophic row. Stress uses the overheating table; structure uses the structure table, or the monstrosity table for that class. | AUTO | `structure` (3) |
| `T-STRESS-shunt-01` | Emergency Shunt (5-6) | Emergency Shunt (5-6) applies IMPAIRED until the end of the character's next turn. | AUTO | `structure` (1) |

## Structure chart (6)

| Rule | Title | Statement | Class | Spec |
|---|---|---|---|---|
| `T-STRUCT-crushing-01` | Crushing Hit (two or more 1s) | Crushing Hit (two or more 1s) destroys the mech beyond repair. The pilot may still exit normally. | AUTO | `structure` (2) |
| `T-STRUCT-directhit-01` | Direct Hit (1) | Direct Hit (1) branches on remaining STRUCTURE: at 3 or more, STUNNED until the end of the next turn; at exactly 2, a HULL **check** — success is STUNNED until the end of the next turn, failure is destruction; at 1, destroyed. | ASSIST | `structure` (2) |
| `T-STRUCT-glancing-01` | Glancing Blow (5-6) | Glancing Blow (5-6) applies IMPAIRED until the end of the character's next turn. | AUTO | `structure` (1) |
| `T-STRUCT-monstrosity-01` | the monstrosity structure chart | The monstrosity structure chart: Glancing Hit (5-6) IMPAIRED until the end of its next turn; Powerful Hit (3-4) PRONE; Dismemberment (2) 1d6 kinetic damage and SLOWED for the rest of the scene; Direct Hit (1) branching on structure — 3 or more STUNNED until the end of its next turn, exactly 2 a HULL **save** or destruction, 1 destroyed; Fatal (two or more 1s) destroyed. | ASSIST | `structure` (4) |
| `T-STRUCT-roll-01` | the structure damage check | A structure damage check rolls 1d6 per marked structure point, including the point just taken, and uses the lowest result. Two or more 1s select the catastrophic row. | AUTO | `structure` (3) |
| `T-STRUCT-trauma-01` | System Trauma (2-4) | System Trauma (2-4) rolls 1d6: on 1-3 every weapon on one chosen mount is destroyed, on 4-6 one chosen system is destroyed. LIMITED items out of charges are not valid choices. With no valid choice the result becomes the other branch; with nothing destroyable at all it becomes a DIRECT HIT. | ASSIST | `structure` (3) |

## Repair and rest (3)

| Rule | Title | Statement | Class | Spec |
|---|---|---|---|---|
| `T-REPAIR-combat-01` | in-combat repair restores all HP for 1 repair | Repairing in combat via STABILIZE restores all HP at the cost of 1 REPAIR. | AUTO | `actions` (1) |
| `T-REPAIR-costs-01` | repair costs | 1 REPAIR restores full HP or repairs one destroyed weapon or system; 2 REPAIRS restore 1 STRUCTURE or 1 STRESS; 4 REPAIRS repair a destroyed mech, returning it to 1 STRUCTURE, 1 STRESS, and full HP. | ASSIST | `actors` (2) |
| `T-REPAIR-rest-01` | resting and full repair | Resting clears all heat, clears every status and condition on the mech, and restores half the pilot's HP. A FULL REPAIR restores everything, including all REPAIRS, all LIMITED uses, CORE POWER, and the overcharge counter. | AUTO | `actors` (3) |

## Statuses and conditions (17)

| Rule | Title | Statement | Class | Spec |
|---|---|---|---|---|
| `T-STATUS-cascade-01` | CASCADE | A cascading NHP takes the mech out of its pilot's control and puts it under the GM's. SHUT DOWN stabilises a cascading NHP. | ASSIST | `statuses` (2) |
| `T-STATUS-dangerzone-01` | DANGER ZONE | A character with half or more of its heat filled is in the DANGER ZONE. | AUTO | `damage` (1) |
| `T-STATUS-downandout-01` | DOWN AND OUT | A pilot reduced to 0 HP is DOWN AND OUT: unconscious and STUNNED, not dead. Any further damage kills them. They regain consciousness and half their HP on a rest. | AUTO | `statuses` (2) |
| `T-STATUS-engaged-01` | ENGAGED | Adjacent hostile characters are both ENGAGED for as long as they remain adjacent. A ranged attack made while ENGAGED takes +1 difficulty. A character that becomes ENGAGED by an equal or larger target mid-movement stops immediately and loses its remaining movement. | ASSIST | `statuses` (2) |
| `T-STATUS-exposed-01` | EXPOSED | All kinetic, explosive, and energy damage taken by an EXPOSED character is doubled, before any reduction is applied. STABILIZE clears it. | AUTO | `damage` (1) |
| `T-STATUS-exposed-02` | EXPOSED is cleared by cooling, stabilizing, and shutting down | EXPOSED is cleared by cooling on STABILIZE, by NPC STABILIZE, and by SHUT DOWN. | AUTO | `actors` (2) |
| `T-STATUS-hidden-01` | HIDDEN | A HIDDEN character cannot be targeted by hostile attacks or actions, does not cause engagement, and is known only by approximate location. Attacking, forcing a save, taking a reaction, using BOOST, and losing cover each remove HIDDEN **after** they resolve. SEARCH finds a HIDDEN character. | ASSIST | `statuses` (4) |
| `T-STATUS-immobilized-01` | IMMOBILIZED | An IMMOBILIZED character cannot make any voluntary movement. Involuntary movement is unaffected. | ASSIST | `statuses` (1) |
| `T-STATUS-impaired-01` | IMPAIRED | An IMPAIRED character receives +1 difficulty on all attacks, saves, and skill checks — including the end-of-turn burn ENGINEERING check. | AUTO | `statuses` (2) |
| `T-STATUS-invisible-01` | INVISIBLE | Every attack against an INVISIBLE character, of any type, has a flat 50% chance to miss outright before the attack roll is made; such a miss triggers everything a miss triggers, including reliable damage. An INVISIBLE character may always HIDE, even without cover. | AUTO | `statuses` (3) |
| `T-STATUS-jammed-01` | JAMMED | A JAMMED character cannot use comms, cannot take reactions, cannot take or benefit from tech actions, and cannot make any attack other than IMPROVISED ATTACK, GRAPPLE, or RAM. | AUTO | `statuses` (2) |
| `T-STATUS-lockon-01` | LOCK ON | Any attacker may consume a target's LOCK ON for +1 accuracy on that attack; the condition clears once the attack resolves. Applying LOCK ON is a hostile action and breaks HIDDEN. Some talents and systems require it. | AUTO | `actions`, `statuses` (6) |
| `T-STATUS-prone-01` | PRONE | Attacks against a PRONE character receive +1 accuracy. A PRONE character is also SLOWED and counts as moving through difficult terrain, and may stand up in place of its standard move unless IMMOBILIZED. Standing up is not movement and triggers nothing. Flying characters have IMMUNITY to PRONE. | ASSIST | `statuses` (5) |
| `T-STATUS-shredded-01` | SHREDDED | A SHREDDED character does not benefit from ARMOR, RESISTANCE, or IMMUNITY. Vulnerability is not a benefit and still applies. | AUTO | `damage` (3) |
| `T-STATUS-shutdown-01` | SHUT DOWN | A SHUT DOWN mech clears all heat and EXPOSED, returns cascading NHPs to normal, immediately ends every status and condition caused by a tech action, gains IMMUNITY to all tech actions and attacks including allied ones, and is STUNNED indefinitely. Nothing prevents the STUNNED. Only BOOT UP removes it. | AUTO | `statuses` (2) |
| `T-STATUS-slowed-01` | SLOWED | A SLOWED character's only movement is its standard move on its own turn. It cannot BOOST, and cannot use any special move granted by a talent, system, or weapon. | AUTO | `actors`, `statuses` (2) |
| `T-STATUS-stunned-01` | STUNNED | A STUNNED mech cannot OVERCHARGE, move, or take any action — free actions and reactions included. Its EVASION is capped at 5, and it automatically fails every HULL and AGILITY check and save. Its pilot may still MOUNT, DISMOUNT, or EJECT, and acts normally. | AUTO | `statuses` (5) |

## Tags (12)

| Rule | Title | Statement | Class | Spec |
|---|---|---|---|---|
| `T-TAG-ai-01` | AI mechs act autonomously as a protocol | A pilot may hand control of an AI-tagged mech to the AI as a protocol, and take it back as a protocol while physically inside. The AI mech receives its own complete set of actions and reactions, and gains no benefit from pilot talents. | AUTO | `actions`, `actors` (4) |
| `T-TAG-heatself-01` | a heat self weapon charges its user heat on use | A weapon tagged HEAT SELF deals its rated heat to the attacker each time the weapon is used, whether the attack hits or misses. That heat is applied, not merely displayed, and it stacks with any OVERKILL heat from the same attack. | AUTO | `damage` (2) |
| `T-TAG-loading-01` | a loading weapon must be reloaded before reuse | A LOADING weapon is expended when fired and unusable until reloaded. A loading weapon that has not been fired cannot be reloaded. | AUTO | `tags` (3) |
| `T-TAG-mod-01` | a weapon mod is not a valid system trauma target | A weapon mod is destroyed with its weapon and repaired with it for free, and is never a valid choice for System Trauma. | AUTO | `tags` (1) |
| `T-TAG-npctags-01` | the NPC-only tags | BIOLOGICAL NPCs have no HEAT CAP, are immune to every tech action except SCAN and LOCK ON including beneficial ones, and cannot take tech actions unless specified. Mech, Vehicle, Ship, and Squad are descriptive. | AUTO | `actors` (1) |
| `T-TAG-ordnance-01` | ordnance may only be fired before any movement or other action on a turn | An ORDNANCE weapon may only be fired before its user moves or takes any other action on a turn — a hard restriction, not a warning. It may be fired on another character's turn via a reaction, but never via OVERWATCH. Overcharging to skirmish with an ordnance weapon is permitted, because overcharge makes the quick action itself free rather than adding one. | AUTO | `actions` (3) |
| `T-TAG-overkill-01` | overkill rerolls ones and deals 1 heat each | A damage die that comes up 1 *in its resulting value* deals the attacker 1 heat and is rerolled, repeating. A d6 standing in for a d3 therefore triggers on both 1 and 2. | AUTO | `tags` (2) |
| `T-TAG-recharge-01` | recharge is a d6 at the start of the NPC's turn | At the start of an NPC's turn, roll one d6 if it has any recharge equipment. Every recharge item whose target number the roll meets or exceeds becomes usable again. One roll serves the whole NPC. | AUTO | `actors` (4) |
| `T-TAG-sidearm-01` | SIDEARM | A SIDEARM makes the pilot FIGHT action a quick action instead of a full action. The action pool must charge accordingly. | AUTO | `actions` (1) |
| `T-TAG-smart-01` | smart changes only the targeted stat | A SMART weapon targets E-DEFENSE instead of EVASION. It changes nothing else — the attack still rolls with GRIT, not the tech attack bonus. | AUTO | `actors` (1) |
| `T-TAG-system-01` | only System-tagged NPC features are destroyable by structure damage | Only NPC features carrying the System tag may be destroyed by structure damage. | AUTO | `actors` (1) |
| `T-TAG-trait-01` | traits cannot be destroyed | A trait is not a system and can never be disabled or destroyed by damage. | AUTO | `actors` (1) |

## Statistics (4)

| Rule | Title | Statement | Class | Spec |
|---|---|---|---|---|
| `T-STAT-grit-01` | what GRIT applies to | GRIT applies to ranged and melee attack rolls, pilot HP, mech HP, save target, system points, unmounted pilot attacks and saves, and the JOCKEY check when no trigger applies. It is never added to tech attack rolls. | AUTO | `actors` (1) |
| `T-STAT-npctier-01` | tier scaling | NPC bonuses, accuracy, damage, and effects scale by tier, written +x/y/z or x/y/z for tiers 1 through 3. | AUTO | `actors` (2) |
| `T-STAT-pilot-01` | pilot statistics in mech combat | A pilot in mech combat has HP 6 + GRIT, EVASION 10, E-DEFENSE 10, SIZE 1/2, SPEED 4, and ARMOR 0. | AUTO | `actors` (1) |
| `T-STAT-pilotattack-01` | unmounted characters use GRIT instead of triggers | An unmounted character adds GRIT to attacks and saves in place of triggers. GRIT is never added to a tech attack roll. | AUTO | `actors` (1) |

## Actors (3)

| Rule | Title | Statement | Class | Spec |
|---|---|---|---|---|
| `T-ACTOR-cockpit-01` | a pilot inside an intact mech cannot be targeted | A pilot inside an intact mech cannot be targeted, damaged, or affected from outside it, and has no line of sight out. Destroying the mech ends that protection. | AUTO | `actors` (2) |
| `T-ACTOR-unlicensed-01` | piloting an unlicensed mech makes it IMPAIRED and SLOWED | A mech piloted without its license is IMPAIRED and SLOWED. | ASSIST | `actions`, `actors` (2) |
| `T-ACTOR-unmounted-01` | unmounted characters are BIOLOGICAL and tech-immune | An unmounted character is BIOLOGICAL: immune to every tech action except LOCK ON and SCAN even beneficial ones, taking heat as energy damage, unable to aid mechs or benefit from mech-scale bonuses, and neither causing engagement nor obstructing. | AUTO | `actors`, `statuses` (2) |

## NPCs (12)

| Rule | Title | Statement | Class | Spec |
|---|---|---|---|---|
| `T-NPC-actions-01` | NPCs take one turn per round with the standard pool | NPCs take one turn per round with the same pool as PCs: one move and two quick actions or one full action. | AUTO | `actors` (3) |
| `T-NPC-actions-02` | NPCs cannot overcharge or brace | NPCs cannot OVERCHARGE or BRACE by default, and their STABILIZE neither heals nor clears conditions. | AUTO | `actors` (5) |
| `T-NPC-actions-03` | the NPC action list | The NPC quick actions are Boost, Grapple, Hide, Prepare, Skirmish, Ram, Quick Tech, and Search; the full actions are Barrage, Disengage, Full Tech, Improvised Attack, and Stabilize. NPC Skirmish attacks with one Auxiliary, Main, or Heavy weapon; Barrage with up to two, or one Superheavy. | AUTO | `actors` (1) |
| `T-NPC-damage-01` | NPCs deal fixed damage and cannot crit | NPCs deal fixed damage rather than rolling, and cannot land critical hits unless a template grants it. | AUTO | `actors` (1) |
| `T-NPC-fulltech-01` | NPC full tech allows two *different* quick tech options | An NPC FULL TECH takes one full tech option or two *different* quick tech options. | AUTO | `actors` (1) |
| `T-NPC-grappleram-01` | NPC grapple and ram use a tiered bonus | NPC GRAPPLE, RAM, and IMPROVISED ATTACK use a tiered attack bonus of +1/2/3; improvised attacks deal 3/4/6 by tier. | AUTO | `actors` (3) |
| `T-NPC-grunt-01` | a Grunt is destroyed by any external heat | An NPC with the Grunt template is destroyed outright by heat from any external source, without a meltdown. Self-inflicted heat behaves normally. | AUTO | `actors` (2) |
| `T-NPC-invade-01` | the NPC invade differs from the PC one | The NPC INVADE is a SYSTEMS versus E-DEFENSE tech attack dealing 2 heat and IMPAIRED until the end of the target's next turn — not the PC FRAGMENT SIGNAL, which also applies SLOWED. | ASSIST | `actors` (1) |
| `T-NPC-overwatch-01` | an NPC may overwatch once between turns | An NPC takes OVERWATCH on the same terms a player character does: a 1/round reaction skirmish with the triggering weapon, never with an ordnance weapon. | ASSIST | `actors` (1) |
| `T-NPC-stabilize-01` | NPC stabilize is one combined effect | NPC STABILIZE reloads all LOADING weapons, clears all heat, and ends EXPOSED — one combined effect, not two choices. | AUTO | `actors` (1) |
| `T-NPC-stress-01` | NPCs have 1 stress and become EXPOSED instead of checking | An NPC with 1 STRESS that exceeds its HEAT CAP becomes EXPOSED and remains at 1 STRESS, making no overheating check, until it stabilizes. An NPC with more than 1 STRESS follows the standard rules. | AUTO | `actors` (2) |
| `T-NPC-structure-01` | NPCs have 1 structure and are destroyed at 0 HP without a check | An NPC with 1 STRUCTURE is destroyed at 0 HP with no structure damage check. An NPC with more than 1 STRUCTURE follows the standard rules. | AUTO | `actors` (2) |

## Movement and cover (1)

| Rule | Title | Statement | Class | Spec |
|---|---|---|---|---|
| `T-MOVE-cover-01` | cover | Once cover is declared, soft cover imposes +1 difficulty and hard cover +2 on ranged attacks. Melee and tech attacks ignore cover. | ASSIST | `actions`, `statuses` (2) |

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
