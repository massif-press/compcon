these are working notes, I'll make a good contributor guide eventually I swear:

- please adhere to eslint whenever possible. prefer leaving warnings to adding ignores.

chores left:
integrate vue-class-component
testing

static -
should just contain data, keep logic out (to the extent possible)
img file should be the onboard/stock images we want to copy over into appdata (see data io startup)

structure notes:
folder structure should reflect vue-router to the extent reasonable
ui should contain all reusable components
everything starting with `CC` will be made available globally as `cc-component-name`
global component subcomponents (that don't themselves need to be avaialable globally) should be prefixed by a \_
try to structure folders like:
topic/group - component type/set - components
\_subcomponent.vue
CCMyComponentThatUsesSubcomponent.vue
aim for DRY with components for stylistic consistency's sake (good refactor opportunities)
prefer two components with common subcomponents instead of bimodal components (eg. skillitem and skillselectitem)

style notes:
LANCER book style before anything else. adhere as close to the book as possible
fluff/flavor is important for the pilot management tools, no flavor (for now) for gm/encounter/campaign
compendium may get flavor later

io:
should contain any and all logic that touches the os -- file loading, checking appdata, etc

view:
split views into collections of components wherever possible for easy reordering

classes:
maintain types to the extent possible
provide data interface when necessary (avoid any, in-function definitions)
provide static Serialize and Deserialize fns if something needs to be saved
each class must be declared in its own file
import all classes into @/class, get classes from there instead of traversing the dir tree

class structure:
Pilot
Mech
CompendiumItem
LicensedItem

interfaces:
keep interface in class file when convienient
declare interface when useful (so, available globally)
to do: look into TS import() fn in dec file to keep definitions with class, but make all interface available globally
import nonglobal interfaces in @/interface
