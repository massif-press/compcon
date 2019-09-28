these are working notes, I'll make a good contributor guide eventually I swear:

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
