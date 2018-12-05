bg:     #273336
bg-a:   #314347
sbox:   #25616E
box:    #5F909C
t:      #DBEBE9
alert:  #F2B134
warn:   #F3573B
good:   #57DF9A

kinetic:  #ABB7B7
energy:   #74b9ff
heat:     #F3573B
blast:    #F2B134

core bonuses that affect stats should be applied/removed during player creation/leveling. don't re-parse core bonus info when loading mech.

ar_dmg_raw
kinetic, energy, explosive, burn, variable, heat

pilot creation:

- pick bg: +2 to 1 skill, +1 to 2 skills
- +1 to one non-bg skill, -1 to 2 skills
- all other skills are at 0
- pick 3 talents (level 1 only)
- choose starting gear (1-2 weapons, 1 armor, 0-3 gear)

level up:

- +1 hp
- +1 to 1 skill
- +1 core point
- +1 core HP
- +1 talent point
- +1 license point

every 2 levels:

- +1 targeting (max 6)

every 3 levels:

- +1 core sp
- grit +1m


APTITUDES
CQB - capacity/ability for near/melee damage or associated skills
ranged - capacity for ranged damage, long range attacks, overwatch, or ranged weapon accuracy
tech - capacity and bonuses, and extra tech attacks
support - non-repair help for allies (dropping barriers, removing statuses, providing buffs, etc)
repair - capacity for and bonuses to repair allies
control - debuffing enemies or forcing their actions (eg. movement)

for shells:
0 - no effective bonus to this
1 - some bonus
2 - good bonus
3 - the shell is specifically meant for this role 
shells should not have more than 5 aptitude points

for weapons/systems:
0 - no effective bonus to this
1 - significant bonus
2 - excellent bonus
w/s should not have more than 3 aptitude points
weapons should always have at least 1 for their damage type (melee/ranged)

(.*?): 0,+$\n

mounts and mounting:
Auxiliary mount: This mount takes up to 2 auxiliary weapons
Main mount: This mount takes 1 main weapon
Heavy: This mount takes 1 heavy weapon
Flexible mount: This mount takes up to 2 auxiliary weapons or 1 main weapon
CORE mount: 1 heavy OR 1 main OR 2 aux weapons
Spinal Mount: This mount takes up to 1 main or heavy weapon
Superheavy weapons take a heavy or spinal mount and one other mount of any size.

- Superheavy mounting to ask player to assign superheavy mount. Mount object takes superheavy override bool. Removed on superheavy removal. (mount.sh_lock = true)
- Aux mounts add 2 aux mount slots
- Flexible mounts add 1 flex slot. If aux is added, config gets anohter aux slot. If flex mount changed, remove second aux slot.
- Same with CORE mounts
- Barbarossa apoc rail mount can take a superheavy weapon alone.

config builder:
  1) choose avail shell (expandable list)
  2) set name
  3) pick image from selector
  4) pick status from selector


---

Wiki:
landing has download & bug reporting

---

prefer utility/search.js : search.where() over array.find() (it includes error handling)

insert an inline tag: `#unique#`
insert a block of tags `%unique ordnance loading%`
add a value to a tag: `#limited(6)#`
the capital X charater will be replaced in both name a description by whatever is passed within the brackets

---
11/16/18

```text
-------------------------------------------------------------------------------
Language                     files          blank        comment           code
-------------------------------------------------------------------------------
JSON                            16              1              0           9277
JavaScript                      18            320             92           2075
CSS                              7            272             11           1646
Handlebars                      27             48             32           1412
Markdown                         3            175              0            653
HTML                            11             29             11            624
-------------------------------------------------------------------------------
SUM:                            82            845            146          15687
-------------------------------------------------------------------------------
```