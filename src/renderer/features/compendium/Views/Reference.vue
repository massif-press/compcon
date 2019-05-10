 <template>
  <v-container fluid px-5>
    <span class="display-1 text-uppercase font-weight-thin">COMBAT REFERENCE</span>
      <v-card class="mt-3" flat color="grey lighten-4">
        <v-card-text class="fluff-text">
          On a turn, players can perform a move, and either two quick actions or one full action, with no duplicate actions allowed. Players can overcharge their mechs to gain an extra quick action at the cost of heat, and all characters can also take any number of Free Actions on their turn, and any number of reactions per round, even outside their turn.
        </v-card-text>
      </v-card>

      <v-container fluid>
      <v-layout justify-center row>
        <v-flex shrink>
          <v-card flat color="transparent">
            <v-card-text class="ma-0 pa-0 text-xs-center">
              <span class="display-1 text-uppercase font-weight-light">ACTION ECONOMY</span><br>
              <span class="fluff-text">Per Turn</span>   
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
      <v-card color="grey lighten-5" elevation-10>
        <v-card-text>
      <v-layout justify-center row>
        <v-flex xs2 class="effect-text text-xs-center ml-2 mr-2">Move</v-flex>
        <v-flex xs4 class="effect-text text-xs-center ml-2 mr-2">One Full Action <b>or</b> Two Quick Actions</v-flex>
        <v-flex xs2 class="effect-text text-xs-center ml-2 mr-2">Overcharge</v-flex>
        <v-flex xs2 class="effect-text text-xs-center ml-2 mr-2">Reaction</v-flex>
        <v-flex xs2 class="effect-text text-xs-center ml-2 mr-2">Free Actions</v-flex>
      </v-layout>
      <v-layout justify-center row class="pt-2">
        <v-flex xs2 class="text-xs-center mr-1">
          <v-card color="red darken-3" class="pt-4 pb-4">
            <v-icon size="10em" dark>mdi-arrow-right-bold-hexagon-outline</v-icon>
          </v-card>
        </v-flex>
        <v-flex xs4 class="text-xs-center ml-1 mr-1">
          <v-layout>
            <v-flex>
              <v-card color="indigo darken-3" class="pt-4 pb-4">
                <v-icon size="10em" dark>mdi-hexagon-slice-6</v-icon>
              </v-card>
            </v-flex>
            <v-flex>
              <v-layout>
                <v-flex>
                  <v-card color="primary">
                    <v-icon size="5.1em" class="pt-2 pb-3" dark>mdi-hexagon-slice-3</v-icon>
                  </v-card>
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex>
                  <v-card color="primary">
                    <v-icon size="5.1em" class="pt-3 pb-1" dark>mdi-hexagon-slice-3</v-icon>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs2 class="text-xs-center ml-1 mr-1">
          <v-card color="orange darken-2" class="pt-4 pb-4">
            <v-icon size="10em" dark>mdi-alert-octagram</v-icon>
          </v-card>
        </v-flex>
        <v-flex xs2 class="text-xs-center ml-1 mr-1">
          <v-card color="purple darken-2" class="pt-4 pb-4">
            <v-icon size="10em" dark>mdi-redo-variant</v-icon>
          </v-card>        
        </v-flex>
        <v-flex xs2 class="text-xs-center ml-1">
          <v-card color="green darken-2" class="pt-4 pb-4">
            <v-icon size="10em" dark>mdi-axis-arrow</v-icon>
          </v-card>
        </v-flex>
      </v-layout>
        </v-card-text>
      </v-card>

      </v-container>

  <v-container grid-list-md fluid>
    <v-layout row wrap fill-height>
      <v-flex xs3 v-for="a in actions" :key="a.id">
      <v-hover >
        <div slot-scope="{ hover }" style="width: 100%; height:100%">
        <v-dialog width="50vw" style="height: 100%; width: 100%;">
          <v-card slot="activator" :class="`elevation-${hover ? 10 : 1}`" 
             style="min-height: 200px; cursor: pointer;">
            <v-toolbar card dense dark :color="getColor(a.action_type, hover)">
              <v-icon dark>{{getIcon(a.action_type)}}</v-icon>
              <v-toolbar-title>{{a.name}}</v-toolbar-title>
              <v-spacer />
            </v-toolbar>
            <v-card-text class="text-xs-left pt-2 pb-2"><p class="blockquote ma-0 pa-0" v-html="a.description" /></v-card-text>
          </v-card>

          <v-toolbar :color="getColor(a.action_type, false)" dark>
            <v-toolbar-title>{{a.name}}</v-toolbar-title>
          </v-toolbar>
          <v-card>
            <v-card-text>
              <p class="effect-text" v-html="a.detail" />
            </v-card-text>
          </v-card>
        </v-dialog>
        </div>
      </v-hover>
      </v-flex>
    </v-layout>
  </v-container>


  <v-container class="effect-text">
    <v-layout justify-center row>
      <v-flex shrink>
        <v-card flat color="transparent">
          <v-card-text class="ma-0 pa-0 text-xs-center">
            <span class="display-1 text-uppercase font-weight-light">STRUCTURE DAMAGE & OVERHEATING</span><br>
            <v-divider class="mt-2 mb-2" />
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout justify-center>
      <v-flex xs11>
         <v-toolbar color="red darken-3" dark>
        <v-toolbar-title>STRUCTURE DAMAGE</v-toolbar-title>
      </v-toolbar>
    <v-card>
      <v-card-text>
      <v-layout>
        <v-flex xs2><span class="subheading font-weight-bold text-uppercase">Roll</span></v-flex>
        <v-flex xs3><span class="subheading font-weight-bold text-uppercase">Result</span></v-flex>
        <v-flex xs7><span class="subheading font-weight-bold text-uppercase">Effect</span></v-flex>
      </v-layout>
      <v-divider class="ma-2"/>
      <v-layout>
        <v-flex xs2><v-icon large>mdi-dice-5</v-icon><v-icon large>mdi-minus</v-icon><v-icon large>mdi-dice-6</v-icon></v-flex>
        <v-flex xs3><span class="subheading font-weight-bold text-uppercase">Glancing Blow</span></v-flex>
        <v-flex xs7><span class="subheading">Emergency systems kick in and stabilize your mech. However, your mech is <b>impaired</b> until the end of your next turn.</span></v-flex>
      </v-layout>
      <v-divider class="ma-2"/>
      <v-layout>
        <v-flex xs2><v-icon large>mdi-dice-2</v-icon><v-icon large>mdi-minus</v-icon><v-icon large>mdi-dice-4</v-icon></v-flex>
        <v-flex xs3><span class="subheading font-weight-bold text-uppercase">System Trauma</span></v-flex>
        <v-flex xs7><span class="subheading">Parts of your mech are torn off by the damage. All the weapons on one mount or a system are destroyed. Roll a d6, on a 4+, you get to choose, on a 1-3, the attacker gets to choose. If a system is used up (it has the limited tag and no charges left) it’s not a valid target. If there’s nothing left to destroy, this result becomes DIRECT HIT instead.</span></v-flex>
      </v-layout>
      <v-divider class="ma-2"/>
      <v-layout>
        <v-flex xs2><v-icon large>mdi-dice-1</v-icon></v-flex>
        <v-flex xs3><span class="subheading font-weight-bold text-uppercase">Direct Hit</span></v-flex>
        <v-flex xs7><span class="subheading">This result has different outcomes depending on how much structure damage your mech has remaining.<br>
        3+ - Your mech is <b>stunned</b> until the end of your next turn.<br>
        2 - Your mech must pass a <b>hull</b> save or be <b>destroyed</b>.<br>
        1 or lower - Your mech is <b>destroyed</b>.</span></v-flex>
      </v-layout>   
      <v-divider class="ma-2"/>
      <v-layout>
        <v-flex xs2><v-icon large>mdi-dice-1</v-icon><v-icon large>mdi-dice-1</v-icon></v-flex>
        <v-flex xs3><span class="subheading font-weight-bold text-uppercase">Crushing Hit</span></v-flex>
        <v-flex xs7><span class="subheading">Your mech is damaged beyond repair and is <b>destroyed</b>. You can still exit it as normal.</span></v-flex>
      </v-layout>                  
      </v-card-text>
    </v-card>
    </v-flex>
    </v-layout>    
      <v-layout justify-center class="mt-4">
      <v-flex xs11>
         <v-toolbar color="orange darken-4" dark>
        <v-toolbar-title>OVERHEATING</v-toolbar-title>
      </v-toolbar>
    <v-card>
      <v-card-text>
      <v-layout>
        <v-flex xs2><span class="subheading font-weight-bold text-uppercase">Roll</span></v-flex>
        <v-flex xs3><span class="subheading font-weight-bold text-uppercase">Result</span></v-flex>
        <v-flex xs7><span class="subheading font-weight-bold text-uppercase">Effect</span></v-flex>
      </v-layout>
      <v-divider class="ma-2"/>
      <v-layout>
        <v-flex xs2><v-icon large>mdi-dice-5</v-icon><v-icon large>mdi-minus</v-icon><v-icon large>mdi-dice-6</v-icon></v-flex>
        <v-flex xs3><span class="subheading font-weight-bold text-uppercase">Emergency Shunt</span></v-flex>
        <v-flex xs7><span class="subheading">Cooling systems recover and manage to contain the peaking heat levels. However, your mech is <b>impaired</b> until the end of your next turn.</span></v-flex>
      </v-layout>
      <v-divider class="ma-2"/>
      <v-layout>
        <v-flex xs2><v-icon large>mdi-dice-2</v-icon><v-icon large>mdi-minus</v-icon><v-icon large>mdi-dice-4</v-icon></v-flex>
        <v-flex xs3><span class="subheading font-weight-bold text-uppercase">Power Plant Destabilize</span></v-flex>
        <v-flex xs7><span class="subheading">Your mech’s power plant becomes unstable, ejecting jets of plasma. Your mech is <b>Jammed</b> until the end of your next turn</span></v-flex>
      </v-layout>
      <v-divider class="ma-2"/>
      <v-layout>
        <v-flex xs2><v-icon large>mdi-dice-1</v-icon></v-flex>
        <v-flex xs3><span class="subheading font-weight-bold text-uppercase">Meltdown</span></v-flex>
        <v-flex xs7><span class="subheading">This result has different outcomes depending on how much reactor stress your mech has remaining.<br>
        3+ - Your mech is immediately <b>shut down</b><br>
        2 - Your mech must pass a engineering save or suffer a reactor meltdown at the end of 1d6 turns after this one (rolled by the GM). You can reverse it by taking a full action and repeating this save..<br>
        1 or lower - Your mech suffers a reactor meltdown at the end of your next turn.</span></v-flex>
      </v-layout>   
      <v-divider class="ma-2"/>
      <v-layout>
        <v-flex xs2><v-icon large>mdi-dice-1</v-icon><v-icon large>mdi-dice-1</v-icon></v-flex>
        <v-flex xs3><span class="subheading font-weight-bold text-uppercase">Irreversible Meltdown</span></v-flex>
        <v-flex xs7><span class="subheading">Your reactor goes critical. Your mech will suffer a reactor meltdown at the end of your next turn..</span></v-flex>
      </v-layout>
      <v-divider class="ma-2"/>
      <p class="ma-3"><i>When a mech suffers a reactor meltdown, any pilot inside immediately dies, the mech is immediately vaporized in a catastrophic eruption, annihilating the wreck, and any characters inside a burst 2 area centered on the mech must pass an agility save or take 4d6 explosive damage, and half on a successful save.</i></p>           
      </v-card-text>
    </v-card>
    </v-flex>
    </v-layout>
  </v-container>    


  <v-container class="effect-text">
    <v-layout justify-center row>
      <v-flex shrink>
        <v-card flat color="transparent">
          <v-card-text class="ma-0 pa-0 text-xs-center">
            <span class="display-1 text-uppercase font-weight-light">COMBAT TERMINOLOGY</span><br>
            <v-divider class="mt-2 mb-2" />
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout>
      <p><strong>Armor</strong> - The amount of damage you reduce all incoming sources of kinetic, energy, or explosive damage by. For mechs, armor cannot go higher than 4</p>
    </v-layout>
    <v-layout>
      <p><strong>Electronic Defense</strong> - The number that most electronic warfare attacks must beat to be successful</p>
    </v-layout>
    <v-layout>
      <p><strong>Evasion</strong> - The number that most melee and ranged attacks must beat in order to hit with an attack</p>
    </v-layout>
    <v-layout>
      <p><strong>Grit</strong> - 1/2 your level. Added to melee and ranged attacks, system points, and hp</p>
    </v-layout>
    <v-layout>
      <p><strong>Heat Capacity</strong> - The amount of heat your mech can take before any more heat will cause it to make an overheating check.</p>
    </v-layout>
    <v-layout>
      <p><strong>Hit Points (HP)</strong> - The amount of damage you can take as a pilot before going down and out, and the amount of damage a mech can take before it takes 1 point of structure damage.</p>
    </v-layout>
    <v-layout>
      <p><strong>Range</strong> - The range of your ranged attack, measured from yourself. Depends on weapon</p>
    </v-layout>
    <v-layout>
      <p><strong>Repair Cap</strong> - The maximum number of repairs to your mech you can make per mission</p>
    </v-layout>
    <v-layout>
      <p><strong>Resistance</strong> - Resistance to damage or a type of damage means it is reduced by half, rounded up, after armor is applied. You can only have resistance to damage once (it doesn&rsquo;t stack multiple times)</p>
    </v-layout>
    <v-layout>
      <p><strong>Structure</strong> - When a character with structure goes to 0 HP, it makes a structure check, then takes 1 structure damage. When a target runs out of structure, it either goes into the CRITICAL state (player mechs) or is destroyed outright.</p>
    </v-layout>
    <v-layout>
      <p><strong>Stress</strong> - When a character that can take stress overheats, it takes 1 stress then makes an overheating check. If a character reaches maximum stress, it goes into the CORE BREACH state. Tech attack - Electronic Warfare attacks, modified by your systems</p>
    </v-layout>
    <v-layout>
      <p><strong>Threat</strong> - The range of your melee and overwatch attacks with certain weapons, measured from yourself. Base threat for all weapons is 1, but it may be greater depending on the weapon.</p>
    </v-layout>
    <v-layout>
      <p><strong>Sensor Range</strong> - The range in which you can make electronic warfare attacks, lock on, and use some systems. If a character is in your sensor range, you know about its existence unless it is hidden.</p>
    </v-layout>
    <v-layout>
      <p><strong>Size</strong> - The area that a character controls, rounded up for determining space. For example, a size 2 mech is an area 2 spaces on each side approximately 2 spaces high. Does not necessarily represent exact physical size.</p>
    </v-layout>
    <v-layout>
      <p><strong>Speed</strong> - How far your mech moves when it moves (in spaces)</p>
    </v-layout>
  </v-container>

  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { actions } from 'lancer-data'

  export default Vue.extend({
    name:'reference',
    data: () => ({
      actions: [],
    }),
    methods: {
      getColor(action: string, hover: boolean): string {
        if (action === 'move') return hover ? 'red' : 'red darken-3'
        else if (action === 'full') return hover ? 'indigo' : 'indigo darken-3'
        else if (action === 'quick') return hover ? 'primary lighten-3' : 'primary'
        else if (action === 'overcharge') return hover ? 'orange lighten-1' : 'orange darken-2'
        else if (action === 'reaction') return hover ? 'purple lighten-1' : 'purple darken-2'
        else if (action === 'free') return hover ? 'green lighten-1' : 'green darken-2'
        else return 'grey'
      },
      getIcon(action: string): string {
        if (action === 'move') return 'mdi-arrow-right-bold-hexagon-outline'
        else if (action === 'full') return 'mdi-hexagon-slice-6'
        else if (action === 'quick') return 'mdi-hexagon-slice-3'
        else if (action === 'reaction') return 'mdi-redo-variant'
        else if (action === 'overcharge') return 'mdi-alert-octagram'
        else if (action === 'free') return 'mdi-axis-arrow'
        else return '?'
      }
    },
    created() {
      this.actions = actions
    },
  })
</script>