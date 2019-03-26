<template>
  <div>
    <v-toolbar dense style="z-index:10" fixed>
      <v-toolbar-title class="font-weight-regular">C O M P / C O N&emsp;<span class="grey--text" style="font-size:16px">v{{ ver || '0.3.5' }}</span></v-toolbar-title>
      <v-spacer />
      <v-toolbar-items>
        <v-btn flat :to="'/compendium'">Compendium</v-btn>

        <v-btn @click="aboutModal = true" flat>About</v-btn>
        <v-dialog v-model="aboutModal" width="80vw">
          <v-card>
            <v-card-title class="title">About COMP/CON</v-card-title>
            <v-card-text>
              <h2>COMP/CON</h2>
              <p>A digital toolkit for 
                <a flat color="primary" class="ma-0 pa-1" @click="open('https://massif-press.itch.io/lancer-core-book')">Massif Press' LANCER Tabletop RPG.</a>
              </p>
              <p>More information about LANCER can be found at The official 
                <a flat color="primary" class="ma-0 pa-1" @click="open('https://twitter.com/Lancer_RPG')">LANCER Twitter</a>, 
                the <a flat color="primary" class="ma-0 pa-1" @click="open('https://www.reddit.com/r/LancerRPG/')">LANCER subreddit</a>, 
                and the <a flat color="primary" class="ma-0 pa-1" @click="open('https://discord.gg/hQyBzmK')">LANCER Discord Server</a>.
              <br>
              <p>This is a piece of open source software under the GNU Public License — feel free to contribute via the GitHub repository or yell at me directly on Twitter at <a flat color="primary" class="ma-0 pa-1" @click="open('https://twitter.com/jarena2')">@jarena2</a>. COMP/CON is now and will always be free, but if you want to support development of this software monetarily, please consider paying (what you want) for it.</p>
              <br>
              <p class="text-xs-center"><v-btn flat outline color="primary" @click="open('https://twitter.com/jarena2')">Project Roadmap</v-btn> &emsp;&mdash;&emsp;
              <v-btn flat color="primary" outline @click="open('https://twitter.com/jarena2')">Contributor's Guide</v-btn> &emsp;&mdash;&emsp;
              <v-btn flat color="primary" outline @click="open('https://beeftime.itch.io/compcon')">itch.io page</v-btn>
              </p>
              <br>
              <h2>Thanks</h2>
              <p><a flat color="primary" class="ma-0 pa-1" @click="open('https://twitter.com/hellwife0')">Ari</a> for contributing the time and code to help track down bugs and bad compendium data<br>
              As well as everyone who helped by submitting a bug report or alerting me of an issue on the Discord.</p>
              <h2>Attributions</h2>

              <p>The frame name generator contains many names lifted from the <a flat color="primary" class="ma-0 pa-1" @click="open('https://twitter.com/cultureshipname')">Culture Ship Name Twitter account</a><br>

              <p>This project was generated with <a flat color="primary" class="ma-0 pa-1" @click="open('https://github.com/SimulatedGREG/electron-vue')">electron-vue</a>using vue-cli.</p>
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" flat @click="aboutModal = false"> Close </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>       

        <!-- <v-btn flat disabled>Options</v-btn> -->
        <v-btn @click="helpModal = true" flat >Help</v-btn>
        <v-dialog v-model="helpModal" width="85vw">
          <v-card>
            <v-card-title class="title">Help</v-card-title>
            <v-card-text>
              <h1>Overview</h1>
              <p>
                The COMP/CON Pilot Roster is a repository for LANCER Player Characters ("Pilots") and their mechs.<br>
                Their mechs -- the combination of Frame and weapon/system loadout is referred to, in COMP/CON as a "Configuration".
              </p><p>
                <v-card class="elevation-3"><v-card-text>
                The sidebar lists all saved pilots. Clicking anywhere on the sidebar will expand it. 
                <br> 
                Clicking on a Pilot will load the Pilot Sheet, and expand the list of saved Configurations.
                <br> To add a new Configuration, click the <v-btn small depressed color="grey lighten-3" :ripple="false"><v-icon small color="black">add</v-icon>Add New Configuration</v-btn> button to be taken to the New Configuration Wizard.
                </v-card-text></v-card>
              </p><p>              
                You can add a new Pilot by clicking the <v-btn small depressed color="grey lighten-3" :ripple="false"><v-icon small color="black">add</v-icon>Add Pilot</v-btn> button, which will open the Add New Pilot wizard.
              </p>
              <hr class="ma-3"/>
              <h1>Pilots</h1>
              <p>
                COMP/CON allows you to create, edit, save, export, and import Pilots for LANCER games.
                <br>
                This section details the Pilot Sheet, accessible by clicking the Pilot's Callsign or Avatar from the sidebar. Details on Pilot-specific game mechanics, or more information about how Pilot skills and attributes are referenced during gameplay, can be found in the <a flat color="primary" class="ma-0 pa-1" @click="open('https://massif-press.itch.io/lancer-core-book')">LANCER Core Book</a>
              </p>
              <h2>Pilot Sheet</h2>
                <v-expansion-panel class="ma-3">
                  <v-expansion-panel-content>
                    <template v-slot:header><h4>Identity and Stats</h4></template>
                    <v-card class="pa-2 pl-4">
                      <p>
                        The first section of the Pilot Sheet contains the Pilot's Callsign and Name, both of which can be edited by clicking the <v-icon small>edit</v-icon> button next to the field.
                        <br>
                        The right side of this section shows the Pilot's License Level. Clicking the <v-btn color="primary" icon small dark><v-icon class="pl-4">arrow_upwards</v-icon></v-btn> button will open the Pilot Level Wizard, which will walk you through the level-up process and automatically determine which bonuses the Pilot is eligible for. 
                        <br>
                        Clicking the <v-icon small>build</v-icon> icon below will open up the Level Edit tool, allowing you to set the Pilot's level anywhere from the current level to the maximum level (12). This tool shouldn't necessarily be used for Pilots currently being played in a LANCER game, but is very useful for build experimentation. Be aware that the Level Edit tool cannot be used to subtract Pilot levels. 
                      </p><p>
                        Below the Callsign is a row containing the current Pilot's combat-relevant stats: Health Points, Armor, Electronic Defense, Evasion and Speed. COMP/CON automatically calculates these values based on Pilot level and currently selected Gear Loadout       
                      </p>
                    </v-card>
                  </v-expansion-panel-content>
                  <v-expansion-panel-content>
                    <template v-slot:header><h4>Biography and Appearance</h4></template>
                    <v-card class="pa-2 pl-4">
                      <p>
                        The left side of this section contains the Pilot's Background (which can be changed by clicking on the <v-icon small>edit</v-icon> button). The background does not contribute any mechanical effects to the Pilot but is narritively important. Below that is a list of the Pilot's current Invocations. Per the rules, Pilots should have 4 Invocations (two Accuracies and two Difficulties), but you may enter more (or fewer) per GM discretion.
                      </p><p>
                        Below the Invocations is the Pilot History. This is not a required field, but is useful for keeping notes regarding your Pilot's origin and backstory.
                      </p><p>
                        Below the Pilot History is the Contacts section (Friends & Foes on the official LANCER Character Sheet). Contacts do not provide any direct mechanical effects, but is useful for character backstory and should be added to as your LANCER campaign progresses.
                      </p><p>
                        To the right side of this section is the Pilot portrait image, which can be changed by clicking on the <v-icon small>edit</v-icon> button in the section header. This will bring up an image selection modal. The first tab ("Pilot Portrait") is the image displayed on the Pilot Sheet, and works best with images around 1:1.5 or 1:2 width:height. The second tab ("Pilot Avatar") image is used as the Pilot's avatar icon in the left-hand sidebar.
                        <br>
                        Below the pilot image is an Appearance section which can be used to detail your Pilot's physical appearance instead of, or in addition to, the portrait image.
                      </p>
                      <h4>Grit, Skill Triggers, Licenses, Talents, and Mech Skills</h4>
                      <p>
                        GRIT is a calculated value and will advance as your Pilot levels up. It's automatically included in Pilot stat and Mech stat calculations.
                      </p>
                      <p>
                        Skill Triggers, Licenses, Talents, and Mech Skills can each be edited by clicking the <v-icon small>edit</v-icon> button in the respective section header. For Skill Triggers, Licenses, and Talents, you must click the "Save" button on the left panel to commit your changes to the Pilot Sheet. Mech Skills are updated automatically.
                      </p>
                    </v-card>
                  </v-expansion-panel-content>
                  <v-expansion-panel-content>
                    <template v-slot:header><h4>CORE Bonuses</h4></template>
                    <v-card class="pa-2 pl-4">
                      <p>
                        Pilots gain a CORE Bonus every 3 levels, and aside from GMS Bonuses, a Pilot must have at least 3 levels in a Manufacturer's license to unlock their CORE Bonuses. Please note that to take another Manufacturer-specific CORE Bonus, a Pilot must have an additional 3 levels (eg. taking two SSC CORE Bonuses would require 6 ranks of SSC Licenses, spread amongst any number of SSC Frames)
                      </p>             
                    </v-card>
                  </v-expansion-panel-content>
                  <v-expansion-panel-content>
                    <template v-slot:header><h4>Pilot Gear</h4></template>
                    <v-card class="pa-2 pl-4">
                      <p>
                        COMP/CON allows for the creation of Pilot and Mech "Loadouts": saved collections of equipment that can be swapped on the fly, ideal for saving favorite item combinations for various mission profiles.
                        </p><p>
                        To add an initial Pilot Gear Loadout, click the <v-btn color="primary" small dark><v-icon>add</v-icon> Add New Loadout</v-btn> button. Additional loadouts can be added by clicking the <v-icon small color="black">add</v-icon> icon on the loadout selection tab bar.
                        </p><p>
                        Each gear entry is composed of two parts: the left-side mount button (gear type, for Pilots), and the equipped item data. Clicking the mount button (either "Equip Armor/Weapon/Gear" or "Armor/Weapon/Gear" for an equipped slot) opens up the item table. For any table item, clicking on the item name will expand a card with additional information, and clicking the <v-btn color="primary" small dark>Equip</v-btn> button will assign that item to the selected slot.
                        </p><p>
                        Clicking the item name on the Pilot Sheet loadout will expand a card with additional item information. Clicking again will collapse it.
                      </p>
                    </v-card>
                  </v-expansion-panel-content>
                  <v-expansion-panel-content>
                    <template v-slot:header><h4>Notes</h4></template>
                    <v-card class="pa-2 pl-4">
                      <p>The notes field is useful for recording campaign notes, build strategies, and gameplay ideas -- especially when exporting and sharing pilots</p>
                    </v-card>
                  </v-expansion-panel-content>
                  <v-expansion-panel-content>
                    <template v-slot:header><h4>Print / Export / Clone / Delete</h4></template>
                    <v-card class="pa-2 pl-4">
                      <b>Print</b>
                      <p>Prints a print-formatted copy of the Pilot Sheet, suitable for tabletop play</p>
                      <b>Export</b>
                      <p>Currently, COMP/CON provides two kinds of Pilot export: to a JSON file and directly to the clipboard. Both transmit the same data, and both can be imported from the Add Pilot > Import from ... option on the Add Pilot modal</p>
                      <b>Clone</b>
                      <p>Duplicates the Pilot and copies all asssociated Configurations</p>
                      <b>Delete</b>
                      <p>Deletes the pilot <b><u>and all associated Configurations</u></b>. Cannot be undone. Export backups and proceed with caution!</p>
                    </v-card>
                  </v-expansion-panel-content>                  
              </v-expansion-panel>
              <h2>Add New Pilot</h2>
              <p>Expanding the sidebar and clicking the <v-btn small depressed color="grey lighten-3" :ripple="false"><v-icon small color="black">add</v-icon>Add Pilot</v-btn> button will open the New Pilot Wizard.
              </p><p>
              To create a new pilot from scratch, click the <v-btn small depressed color="primary" dark :ripple="false">Create New Pilot</v-btn> button.
              <br>
              To import a saved pilot from a COMP/CON produced JSON file, click the <v-btn small depressed flat color="primary" :ripple="false">Import From File</v-btn>. To import from the clipboard, click the <v-btn small depressed flat color="primary" dark :ripple="false">Import from Clipboard</v-btn> button.
              <br>
              Imported pilots do not need to progress through the New Pilot Wizard
              </p>
              <h3>New Pilot Wizard</h3>
              <p>
              This wizard will guide you through LANCER pilot creation, handling the calculation and organization for you. The steps don't need to be completed in order (and can be re-done any time throughout the process) but COMP/CON will not let you save a new pilot until every step has been completed.
              </p>
                <v-expansion-panel class="ma-3">
                  <v-expansion-panel-content>
                    <template v-slot:header><h4>1 - Identification</h4></template>
                    <v-card class="pa-2 pl-4">
                      <p>
                        Your Pilot's Callsign and proper name are the only two required fields on this step. Clicking the <v-icon small>shuffle</v-icon> icon next to either will provide you with a randomly-generated name.
                        <br>
                        History, Appearance, and Pilot Images can be set here, but aren't required. Any of these fields can be changed from the Pilot Sheet at any time.
                      </p>
                    </v-card>
                </v-expansion-panel-content>
                  <v-expansion-panel-content>
                    <template v-slot:header><h4>2 - Background</h4></template>
                    <v-card class="pa-2 pl-4">
                      <p>
                        Select your Pilot's background by clicking the large round <v-icon small>add</v-icon> button on the right side of the panels. The background does not provide a mechanical effect, but is narritively important. It, too, can be changed at any time.
                      </p>
                    </v-card>
                </v-expansion-panel-content>
                  <v-expansion-panel-content>
                    <template v-slot:header><h4>3 - Pilot Skill Triggers</h4></template>
                    <v-card class="pa-2 pl-4">
                      <p>
                        Select exactly 4 triggers. These can be expanded and upgraded as the Pilot levels up, but a single trigger cannot be upgraded past +2 at character creation. 
                        <br>
                        The currently-selected skills are displayed on the panel at the top-left. Clicking the <v-btn small depressed outline color="black" dark :ripple="false">reset</v-btn> button will clear all skill selections. When skill selection is complete, continue by clicking the <v-btn small depressed color="primary" dark :ripple="false">continue</v-btn> at the bottom-right of the page.                        
                      </p>
                    </v-card>
                </v-expansion-panel-content>
                  <v-expansion-panel-content>
                    <template v-slot:header><h4>4 - Pilot Talents</h4></template>
                    <v-card class="pa-2 pl-4">
                      <p>
                        Select 3 starting Pilot talents. Like skill triggers, only the first rank of these skills can be taken at character creation, but can be upgraded and expanded as the Pilot levels.
                        <br>
                        The currently-selected talents are displayed on the panel at the top-left. Clicking the <v-btn small depressed outline color="black" dark :ripple="false">reset</v-btn> button will clear all talent selections. When talent selection is complete, continue by clicking the <v-btn small depressed color="primary" dark :ripple="false">continue</v-btn> at the bottom-right of the page. 
                      </p>
                    </v-card>
                </v-expansion-panel-content>
                <v-expansion-panel-content>
                  <template v-slot:header><h4>5 - Mech Skills</h4></template>
                  <v-card class="pa-2 pl-4">
                    <p>
                      New pilots can put 2 points into any of the 4 HASE skills. These skills directly improve the combat effectiveness of any mech you pilot. When mech skills selection is complete, continue by clicking the <v-btn small depressed color="primary" dark :ripple="false">continue</v-btn> at the bottom-right of the page.
                    </p>
                  </v-card>
                </v-expansion-panel-content>
                <v-expansion-panel-content>
                  <template v-slot:header><h4>6 - Confirm</h4></template>
                  <v-card class="pa-2 pl-4">
                    <p>
                      When you are satisfied with your selections, you can save your new Pilot by clicking the <v-btn small depressed color="success" dark :ripple="false">confirm</v-btn> at the bottom-right of the page. Otherwise, you can use the back button or the tabs at the top of the page to return to a section to make changes.
                    </p>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <h2>Level Up</h2>
              <p>
                The upper-right side of the Pilot Sheet shows the Pilot's License Level. Clicking the <v-btn color="primary" icon small dark><v-icon class="pl-4">arrow_upwards</v-icon></v-btn> button will open the Pilot Level Wizard, which will walk you through the level-up process and automatically determine which bonuses the Pilot is eligible for. 
                <br>
                Clicking the <v-icon small>build</v-icon> icon below will open up the Level Edit tool, allowing you to set the Pilot's level anywhere from the current level to the maximum level (12). This tool shouldn't necessarily be used for Pilots currently being played in a LANCER game, but is very useful for build experimentation. Be aware that the Level Edit tool cannot be used to subtract Pilot levels. 
              </p>
              <h3>Pilot Level Wizard</h3>
              <p>
              This wizard will guide you through leveling up your LANCER Pilot, and will automatically determine what level bonuses your Pilot is eligible for.
              <br>
              Please note that added levels cannot be removed. If you're uncertain, make a backup of your Pilot, or clone them for theorycrafting and experimentation.
              </p>
                <v-expansion-panel class="ma-3">
                  <v-expansion-panel-content>
                    <template v-slot:header><h4>1 - Overview</h4></template>
                    <v-card class="pa-2 pl-4">
                      <p>
                        The Overview panel shows what bonuses your pilot automatically gains and what improvements they are eligibe for at this level-up.
                      </p>
                    </v-card>
                </v-expansion-panel-content>
                  <v-expansion-panel-content>
                    <template v-slot:header><h4>2 - Assign Skill Points</h4></template>
                    <v-card class="pa-2 pl-4">
                      <p>
                        Pilots get an additional Skill Trigger point every level, and can use it to upgrade an existing trigger (to a maximum of +6), or to unlock a new trigger.
                        <br>
                        You can also use this screen like the Pilot Sheet Skill Trigger Editor to clear and reassign all of your Pilot's Skill Triggers. Per the Core Rulebook, this is typically gameplay-legal only during level up, or, at the GM's discretion.
                        <br>
                        When skill selection is complete, continue by clicking the <v-btn small depressed color="primary" dark :ripple="false">continue</v-btn> at the bottom-right of the page.
                      </p>
                    </v-card>
                </v-expansion-panel-content>
                  <v-expansion-panel-content>
                    <template v-slot:header><h4>3 - Assign Talent Points</h4></template>
                    <v-card class="pa-2 pl-4">
                      <p>
                        Pilots get an additional Talent point every level, and can use it to upgrade an existing talent (to a maximum of Rank III), or to unlock a new talent.
                        <br>
                        You can also use this screen like the Pilot Sheet Talent Editor to clear and reassign all of your Pilot's Talents. Per the Core Rulebook, this is typically gameplay-legal only during level up, or, at the GM's discretion.
                        <br>
                        When talent selection is complete, continue by clicking the <v-btn small depressed color="primary" dark :ripple="false">continue</v-btn> at the bottom-right of the page.                     
                      </p>
                    </v-card>
                </v-expansion-panel-content>
                  <v-expansion-panel-content>
                    <template v-slot:header><h4>4 - Assign Mech Skill Points</h4></template>
                    <v-card class="pa-2 pl-4">
                      <p>
                        Pilots get an additional Mech Skill point every level, and can use it to upgrade an existing mech skill (to a maximum of +6)
                        <br>
                        You can also use this screen like the Pilot Sheet Mech Skill Editor to clear and reassign all of your Pilot's Mech Skills. Per the Core Rulebook, this is typically gameplay-legal only during level up, or, at the GM's discretion.
                        <br>
                        When mech skill selection is complete, continue by clicking the <v-btn small depressed color="primary" dark :ripple="false">continue</v-btn> at the bottom-right of the page.
                      </p>
                    </v-card>
                </v-expansion-panel-content>
                <v-expansion-panel-content>
                  <template v-slot:header><h4>5 - Select New License</h4></template>
                  <v-card class="pa-2 pl-4">
                    <p>
                      Every level, Pilots can unlock a new License, providing access to mech weapons, systems, and Frames. It's important to keep in mind that Frames are unlocked at the <b>second</b> rank of any license.
                      <br>
                      You can also use this screen like the Pilot Sheet License Editor to clear and reassign all of your Pilot's Licenses. Per the Core Rulebook, this is typically gameplay-legal only during level up, or, at the GM's discretion.
                      <br>
                      When license selection is complete, continue by clicking the <v-btn small depressed color="primary" dark :ripple="false">continue</v-btn> at the bottom-right of the page.
                    </p>
                  </v-card>
                </v-expansion-panel-content>
                <v-expansion-panel-content>
                  <template v-slot:header><h4>Special - Select New CORE Bonus</h4></template>
                  <v-card class="pa-2 pl-4">
                    <p>
                      Every 3 levels (3, 6, 9, and 12) Pilots unlock a CORE Bonus -- a permanent, powerful enhancement that applies to every mech the Pilot operates.
                      <br>
                      GMS Core Bonuses are always available, but manufacturer-specific bonuses require 3 license levels (spread amongst any of that manufacturer's licenses) to unlock. For example: A player who wants to unlock SSC's Ghostweave CORE Bonus could take three license levels in the SSC BLACK WITCH, or two in the SSC DEATH'S HEAD and one in the SSC DUSK WING, or one license level in the SSC METALMARK, SSC MONARCH, and the SSC MOURNING CLOAK. To unlock <i>two</i> SSC CORE Bonuses, that pilot would need to have a total <b>6</b> levels in SSC licenses.
                      <br>
                      You can also use this screen like the Pilot Sheet CORE Bonus Editor to clear and reassign all of your Pilot's CORE Bonuses. Per the Core Rulebook, this is typically gameplay-legal only during level up, or, at the GM's discretion.
                      <br>
                      When CORE Bonus selection is complete, continue by clicking the <v-btn small depressed color="primary" dark :ripple="false">continue</v-btn> at the bottom-right of the page.                     
                    </p>
                  </v-card>
                </v-expansion-panel-content>
                <v-expansion-panel-content>
                  <template v-slot:header><h4>6 - Confirm</h4></template>
                  <v-card class="pa-2 pl-4">
                    <p>
                      When you are satisfied with your selections, you can apply your changes to the Pilot by clicking the <v-btn small depressed color="success" dark :ripple="false">confirm</v-btn> at the bottom-right of the page. Otherwise, you can use the back button to return to a section to make changes.
                    </p>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <hr class="ma-3"/>
              <h1>Configurations (Mechs)</h1>
              <p>WIP</p>
              <hr class="ma-3"/>
              <h1>Compendium</h1>
              <p>WIP</p>
              <hr class="ma-3"/>
              <h1>Misc.</h1>
              <p>WIP</p>
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" flat @click="helpModal = false"> Close </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>        

        <v-btn @click="goBack" flat>Back</v-btn>
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>

<script>
  export default {
    name: 'topbar',
    data: () => ({
      aboutModal: false,
      helpModal: false,
      ver: 0
    }),
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      goBack: function () {
        this.$router.push('/roster')
      }
    },
    created: function () {
      this.ver = process.env.npm_package_version
    }
  }
</script>

<style scoped>
  p {
    margin-left: 8px;
  }
</style>

