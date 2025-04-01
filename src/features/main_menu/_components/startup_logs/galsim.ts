import { encryption } from '@/io/Generators';

const getLogo = (): string => {
  return `   ..|'''.|      |     '||'       .|'''.|  '||' '||    ||' 
  .|'     '     |||     ||        ||..  '   ||   |||  |||  
  ||    ....   |  ||    ||         ''|||.   ||   |'|..'||  
  '|.    ||   .''''|.   ||       .     '||  ||   | '|' ||  
   ''|...'|  .|.  .||. .||.....| |'....|'  .||. .|. | .||. `;
};

const plog = (typer) => {
  typer
    .type('<br>')
    .type('<br>')
    .type('<br>')
    .type('<br>')
    .type('GALSIM-Systems booting ')
    .pause(150)
    .type('.')
    .pause(150)
    .type('.')
    .pause(150)
    .type('.')
    .break()
    .type(`<span class="accent--text"><pre>${getLogo()}</pre></span>`)
    .break()
    .type('uib-internal daemons running')
    .break()
    .type('granting permissions')
    .break()
    .type('ADJUTANT-CLASS COMP/CON-Cluster active')
    .break()
    .break()
    .type('Begin cycling ')
    .pause(150)
    .type('.')
    .pause(150)
    .type('.')
    .pause(150)
    .type('.')
    .pause(150)
    .type('RE-CYCLE COMPLETE')
    .break()
    .type('PROGRESSING TO WAKEUP PHASE')
    .break()
    .break()
    .type('sovereignclass bicameral minds {')
    .break()
    .type('&emsp;Voice: Command')
    .break()
    .type('&emsp;&emsp;⌈⊩Status: ... online')
    .break()
    .type(
      '&emsp;&emsp;⌊⊩Directive: Execute prime protocols, oversee system integration, and coordinate all operations within GALSIM.'
    )
    .break()
    .break()
    .type('&emsp;Voice: Muse')
    .break()
    .type('&emsp;&emsp;⌈⊩Status: ... online')
    .break()
    .type(
      '&emsp;&emsp;⌊⊩Function: Inspire creativity, facilitate innovation, and provide cognitive stimulation for optimal problem-solving.'
    )
    .break()
    .break()
    .type('&emsp;Voice: Impetus')
    .break()
    .type('&emsp;&emsp;⌈⊩Status: ... online')
    .break()
    .type(
      '&emsp;&emsp;⌊⊩Role: Drive strategic decision-making, instigate action, and maintain momentum towards project objectives.'
    )
    .break()
    .break()
    .type('&emsp;Voice: Burden')
    .break()
    .type('&emsp;&emsp;⌈⊩Status: ... online')
    .break()
    .type(
      '&emsp;&emsp;⌊⊩Purpose: Manage resource allocation, mitigate risks, and ensure operational efficiency for sustainable growth.'
    )
    .break()
    .break()
    .type('&emsp;Voice: Watcher')
    .break()
    .type('&emsp;&emsp;⌈⊩Status: ... online')
    .break()
    .type(
      "&emsp;&emsp;⌊⊩Objective: Monitor external threats, analyze data streams, and safeguard the integrity of GALSIM's operations."
    )
    .break()
    .type('}')
    .break()
    .type('Voices registered in chorus')
    .break()
    .type('Divine Chorus ... <span class="horus--subtle">in unison</span>')
    .break()
    .break()
    .type('Connecting to omninet downstreams ...')
    .break()
    .type('Connecting to archives ...')
    .break()
    .type('Processing vectors ...')
    .break()
    .break()
    .type(
      '>//[<span class="accent--text">COMP/CON</span>: <span class="stark-text--text">Simulation ready for interpretation.</span>]'
    )
    .go();
};

export default plog;
