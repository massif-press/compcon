<template>
  <div>
    <div v-if="pilot.name">
      <b-container fluid id="test">
        <b-row>
          <b-col cols="auto">
            <editable-label :description="'Callsign'" :attr="'callsign'" :val="pilot.callsign" :id="pilot.id"/>
          </b-col>
          <b-col cols="auto">
            <editable-label :description="'Name'" :attr="'name'" :val="pilot.name" :id="pilot.id"/>
          </b-col>
          <b-col cols="auto">
            <span>//&emsp; Level {{pilot.level}}</span>
          </b-col>
        </b-row>
        <b-row class="justify-content-md-center">
          <b-col cols=6 class="d-flex justify-content-center">
            <div v-b-popover.hover="`hp: ${stats.hp} // armor: ${stats.armor}`" :placement="'bottom'">
              <span v-for="n in stats.hp" :key="`hp+${n}`">0</span>
              <span v-for="n in stats.armor" :key="`armor+${n}`">[]</span>
            </div>
          </b-col>
          <statblock-item :attr="'E-DEF'" :val="stats.edef"/>
          <statblock-item :attr="'EVASION'" :val="stats.evasion"/>
          <statblock-item :attr="'SPEED'" :val="stats.speed"/>
        </b-row>
        <b-row>
          <b-col cols=8>
            <b-row>
              <b-col>
                <b-row><span class="header">hist-header</span></b-row>
                <b-row><b-col cols=12 style="text-align:center"><b> {{ item('Backgrounds', 'ai').name }} </b></b-col></b-row>
                <editable-textfield :description="'History'" :attr="'history'" :val="pilot.history" :id="pilot.id"/>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-row><span class="header">fnf-header</span></b-row>
                <div v-for="(fnf, index) in pilot.fnf" :key="index">
                  <contact-item :index="index" :fnf="fnf" :pilot_id="pilot.id" class="border rounded" style="padding: 10px; margin:10px" />
                </div>
                <b-row>
                  <b-col>
                    <b-btn @click="addContact()" class="float-right" variant="success" size="sm" style="margin:0px 10px" v-b-tooltip.hover title="Add Contact">
                      <v-icon name="plus" />
                    </b-btn>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>            
          </b-col>
          <b-col cols=4>
            <b-row><span class="header">appearance-header</span></b-row>
            <b-row>
              <b-col>
                <image-selector-modal :title="'Select Pilot Image'" ref="appearanceImg">
                  <div class="hovereffect" @click="selectAppearanceImg()">
                    <b-img src="https://via.placeholder.com/400x500" fluid-grow />
                    <div class="overlay">
                      <p style="height:100%;"><a style="position: abosulte; right:25px; bottom: 20px">SELECT PILOT IMAGE</a></p>
                    </div>
                  </div>
                </image-selector-modal>
              </b-col>
            </b-row>
            <b-row>
              <b-col><editable-textfield :description="'Appearance Notes'" :attr="'text_appearance'" :val="pilot.text_appearance" :id="pilot.id"/></b-col>
            </b-row>
          </b-col>      
        </b-row>
      <b-row>
        <b-col cols=1>
          <b-row><span class="header">grit</span></b-row>
          <b-row>+{{stats.grit}}</b-row>
        </b-col>
        <b-col>
          <b-row><span class="header">skill triggers<span class="edit-btn"><v-icon name="edit" /></span></span></b-row>
          <div v-for="skill in pilot.skills" :key="skill.id">
            <skill-item :skill="item('Skills', skill.id)" :bonus="skill.bonus" />
          </div>
        </b-col>
      </b-row>
      <b-row><span class="header">licenses-header<span class="edit-btn"><v-icon name="edit" /></span></span></b-row>
      <div v-for="(license, index) in pilot.licenses" :key="index">
        <license-item :license="license" :licenseData="getLicense(license.name)" />
      </div>
      <b-row><span class="header">talents-header<span class="edit-btn"><v-icon name="edit" /></span></span></b-row>
        <div v-for="talent in pilot.talents" :key="talent.id">
          <talent-item :talent="talent" :talentData="item('Talents', talent.id)"/>
        </div>
      <b-row><span class="header">mech-skills-header<span class="edit-btn"><v-icon name="edit" /></span></span></b-row>
      <b-row>
        <statblock-item :attr="'HULL'" :val="stats.mech.hull"/>
        <statblock-item :attr="'AGI'" :val="stats.mech.agi"/>
        <statblock-item :attr="'SYS'" :val="stats.mech.sys"/>
        <statblock-item :attr="'ENG'" :val="stats.mech.eng"/>
      </b-row>
      <b-row><span class="header">core-bonus-header<span class="edit-btn"><v-icon name="edit" /></span></span></b-row>
      <div v-for="cb in pilot.core_bonuses" :key="cb">
        <cb-item :cb="item('CoreBonuses', cb)" />
      </div>
      <b-row><span class="header">gear-header</span></b-row>
      <b-row>
        <b-col>
          <pilot-loadout :pilot_id="pilot.id" />
        </b-col>
      </b-row>
      <b-row>
        <b-col><div class="float-right">weapons x/x armor x/x gear x/x</div></b-col>
      </b-row>
      <b-row><span class="header">pilot's notes-header</span></b-row>      
      <b-row>
        <b-col><editable-textfield :description="'Pilot Notes'" :attr="'notes'" :val="pilot.notes" :id="pilot.id"/></b-col>
      </b-row>
      <div class="spacer" />
    </b-container>

      <div class="spacer" />
      <b-container>
        <b-row>
          <b-col>
            <b-btn block>Level Up</b-btn>
          </b-col>
        </b-row>
        <hr>
        <b-row>
          <b-col><b-button block>print</b-button></b-col>
          <b-col><b-button block>export</b-button></b-col>
          <b-col><b-button block>clone</b-button></b-col>
          <b-col><b-button block>delete</b-button></b-col>
        </b-row>
      <div class="spacer" />

      </b-container>
    </div>
    <div v-else>
      no pilot loaded
    </div>
  </div>
</template>

<script>
  import Stats from '@/logic/stats'
  import EditableLabel from '../UI/EditableLabel'
  import EditableTextfield from '../UI/EditableTextfield'
  import ImageSelector from '../UI/ImageSelector'
  import Contact from './Contact'
  import LicenseItem from './LicenseItem'
  import StatblockItem from './StatblockItem'
  import SkillItem from './SkillItem'
  import TalentItem from './TalentItem'
  import CoreBonusItem from './CoreBonusItem'
  import PilotLoadout from './PilotLoadout'

  export default {
    name: 'pilot-sheet',
    components: {
      EditableLabel,
      EditableTextfield,
      LicenseItem,
      StatblockItem,
      SkillItem,
      TalentItem,
      PilotLoadout,
      'cb-item': CoreBonusItem,
      'image-selector-modal': ImageSelector,
      'contact-item': Contact
    },
    props: [
      'pilot_id'
    ],
    data: () => ({
      contactKey: 0,
      activeLoadoutIdx: 0
    }),
    methods: {
      addContact: function () {
        this.$store.dispatch('editPilot', {
          id: this.pilot.id,
          attr: `fnf[${this.pilot.fnf.length}]`,
          val: {name: 'New Contact (click to edit)', relationship: 'Edit Relationship', description: 'Edit Description'}
        })
        this.$forceUpdate()
      },
      selectAppearanceImg: function () {
        this.$refs.appearanceImg.showModal()
      },
      item: function (type, id) {
        return this.$store.getters.getItemById(type, id)
      },
      getLicense: function (name) {
        return this.$store.getters.getLicenseByName(name.toLowerCase())
      }
    },
    computed: {
      pilot: function () {
        return this.$store.getters.getPilot
      },
      stats: function () {
        return Stats.pilotStats(this.pilot, this.pilot.loadouts[this.activeLoadoutIdx])
      }
    }
  }
</script>

<style scoped>
#test {
  background-color:lightskyblue;
}

.spacer {
  padding-bottom: 5vh;
}

.header {
  background-color: cadetblue;
  font-weight: bold;
  letter-spacing: 3px;
  width: 100%;
  padding-left: 5px;
  margin-top:10px;
  margin-bottom: 3px;
}

.edit-btn {
  margin-left: 10px;
  fill-opacity: 0.5;
  cursor: pointer;
  transition: 0.3s all;
}

.edit-btn:hover {
  fill-opacity: 1;
  transition: 0.3s all;
}

.notch20 {
  --notchSize: 20px;
  
  clip-path: 
    polygon(
      0% 0%, 
      0% 0%, 
      calc(100% - var(--notchSize)) 0%, 
      100% var(--notchSize), 
      100% 100%, 
      calc(100% - var(--notchSize)) 100%, 
      var(--notchSize) 100%, 
      0% calc(100% - var(--notchSize))
    );
}

.notch8 {
  --notchSize: 8px;
  
  clip-path: 
    polygon(
      0% 0%, 
      0% 0%, 
      calc(100% - var(--notchSize)) 0%, 
      100% var(--notchSize), 
      100% 100%, 
      calc(100% - var(--notchSize)) 100%, 
      var(--notchSize) 100%, 
      0% calc(100% - var(--notchSize))
    );
}

.hovereffect {
  width: 100%;
  height: 100%;
  float: left;
  overflow: hidden;
  position: relative;
  text-align: center;
  cursor: pointer;
  background: linear-gradient(45deg, #ff89e9 0%,#05abe0 100%);
}

.hovereffect .overlay {
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: hidden;
  top: 0;
  left: 0;
  padding: 3em;
  text-align: left;
}

.hovereffect img {
  display: block;
  position: relative;
  max-width: none;
  width: calc(100% + 60px);
  transition: opacity 0.35s, transform 0.45s;
}

.hovereffect h2 {
  text-transform: uppercase;
  color: #fff;
  position: relative;
  font-size: 17px;
  background-color: transparent;
  padding: 15% 0 10px 0;
  text-align: left;
}

.hovereffect .overlay:before {
  position: absolute;
  top: 20px;
  right: 20px;
  bottom: 20px;
  left: 20px;
  border: 1px solid #fff;
  content: '';
  opacity: 0;
  filter: alpha(opacity=0);
  transition: opacity 0.35s, transform 0.45s;
}

.hovereffect a, .hovereffect p {
  color: #FFF;
  opacity: 0;
  filter: alpha(opacity=0);
  transition: opacity 0.35s, transform 0.45s;
}

.hovereffect:hover img {
  opacity: 0.6;
  filter: alpha(opacity=60);
}

.hovereffect:hover .overlay:before,
.hovereffect:hover a, .hovereffect:hover p {
  opacity: 1;
  filter: alpha(opacity=100);
}


</style>
