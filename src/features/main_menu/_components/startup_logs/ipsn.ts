import {
  encryption,
  flavorID,
  callsign,
  shipname_ipsn,
  location,
  cargo_formatted,
} from '@/io/Generators';

import _ from 'lodash';

const getLogo = (): string => {
  return _.sample(logos) || '';
};

const logos = [
  `                           @~                                                    
                          @@@                          
        @@-      <@@     .@@@~     @@]      .@@          
         <@@@ [@@@@@     }@@@@     @@@@@# #@@[           
           @@@@@@@-      @@@@@      :@@@@@@@-            
          -@@@@@@@      :@@@@@+      @@@@@@@^            
         )@@@@@@@@@@{   )@@@@@{   (@@@@@@@@@@}           
        <@@@{    @@@@@@@@@@@@@@@@@@@@@    )@@@}          
        *#@#      @@@@@@@@@@@@@@@@@@@      [@%>          
                  :@@@@@@@@@@@@@@@@@-                  
        +#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@^        
  *}@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@{>  
             +@@@@@@@@@@@@@@@@@@@@@@@@@@@*.            
        .)       @@@@@@@@@@@@@@@@@          )      
        %@@@   +@@@@@@@@@@@@@@@@@@@<     @@@@          
         @@@@ {@@@@@@@@@@@@@@@@@@@@@@@  @@@@           
          @@@@@@@@@[    ^@@@@@(  (@@@@@@@@@@            
           @@@@@@.       @@@@@        @@@@@@             
          {@@@@@@@@(     @@@@@      <@@@@@@@@@            
         @@%   )@@@@     ^@@@]     @@@@[    %@@          
       :@-                @@@.                -@:                              
                          (@#                          
                           @.`,

  `
   █████ ███████████   █████████             ██████   █████      ███     
  ░░███ ░░███░░░░░███ ███░░░░░███           ░░██████ ░░███  ███ ░███  ███
   ░███  ░███    ░███░███    ░░░             ░███░███ ░███ ░░░█████████░ 
   ░███  ░██████████ ░░█████████  ██████████ ░███░░███░███   ░░░█████░   
   ░███  ░███░░░░░░   ░░░░░░░░███░░░░░░░░░░  ░███ ░░██████    █████████  
   ░███  ░███         ███    ░███            ░███  ░░█████  ███░░███░░███
   █████ █████       ░░█████████             █████  ░░█████░░░  ░███ ░░░ 
  ░░░░░ ░░░░░         ░░░░░░░░░             ░░░░░    ░░░░░      ░░░      `,
  `
   ___     ___     ___            _  _    _/\\_   
  |_ _|   | _ \\   / __|    ___   | \\| |   >  <   
   | |    |  _/   \\__ \\   |___|  | .' |    \\/    
  |___|   |_|__   |___/   _____  |_|\\_|   _____  
_|"""""|_| """ |_|"""""|_|     |_|"""""|_|     | 
"'-0-0-'"'-0-0-'"'-0-0-'"'-0-0-'"'-0-0-'"'-0-0-' `,
];

const plog = async (typer) => {
  const sn = await shipname_ipsn();
  const locations = [await location(), await location(), await location()];
  const cargo = [
    await cargo_formatted(),
    await cargo_formatted(),
    await cargo_formatted(),
    await cargo_formatted(),
    await cargo_formatted(),
  ];
  const callsigns = [await callsign(), await callsign(), await callsign()];
  const e = await encryption();

  typer
    .type('<br>')
    .type('<br>')
    .type('<br>')
    .type('<br>')
    .type('COMPANION/CONCIERGE UNIT INITIALIZING')
    .break()
    .type('IPS-N COMP/CON Unit Carronade v9.3.1')
    .break()
    .type(`<span class="accent--text"><pre>${getLogo()}</pre></span>`)
    .break()
    .type('<span class="primary--text">Your friend in an unfriendly sea.<span>')
    .break()
    .type('Receiving ALLCOMM message from nearby vessel')
    .pause(150)
    .type('. ')
    .pause(150)
    .type('. ')
    .pause(150)
    .type('. ')
    .pause(150)
    .type('translated')
    .break()
    .type('[AUG(UNS-LS_03272)]:: TRANSMIT FLIGHT MANIFEST AND DOCUMENTS')
    .break()
    .break()
    .type(
      `Compiling Shipping Manifest for <b>${sn})}</b>  (Battlegroup ${flavorID('aNNAA')} ${Math.floor(Math.random() * 2) + 1}/3)`
    )
    .break()
    .type(`ShippingID IPS-N ${flavorID('NNAA-aaa-NNNNAA')}`)
    .break()
    .type(
      `Realtime start (4.3.50${Math.floor(Math.random() * 99)}u ${Math.floor(Math.random() * 1000)} CrST)`
    )
    .break()
    .type(`Subjective timedebt - ${Math.floor(Math.random() * 30) + 1} years`)
    .break()
    .type(`Subjective ETA - ${Math.floor(Math.random() * 20) + 1} years`)
    .break()
    .break()
    .type(`Designation/Route`)
    .break()
    .type(`o--------------o--------------o`)
    .break()
    .type(`${locations[0]}-->${locations[1]}-->${locations[2]}`)
    .break()
    .break()
    .type('Cargo Manifest:')
    .break()
    .type(`${cargo[0]}`)
    .break()
    .type(`${cargo[1]}`)
    .break()
    .type(`${cargo[2]}`)
    .break()
    .type(`${cargo[3]}`)
    .break()
    .type(`${cargo[4]}`)
    .break()
    .break()
    .type('Transmit? (Y/N)')
    .break()
    .type('******************************************')
    .break()
    .type('Escort')
    .break()
    .type(`Caliban LL5  ${callsigns[0]}`)
    .break()
    .type(`Vlad    LL4  ${callsigns[1]}`)
    .break()
    .type(`Tortuga LL3  ${callsigns[2]}`)
    .break()
    .break()
    .type(`Incident ${Math.floor(Math.random() * 20) + 1}`)
    .break()
    .type('Assignee: Caliban')
    .break()
    .type(`Hostile Casualties: ${Math.floor(Math.random() * 30) + 7}`)
    .break()
    .type('Allied Casualties: 0 (minor abrasions on armor)')
    .break()
    .type('Summary: Pirate Squad hidden onboard; Status: Green')
    .break()
    .break()
    .type(`Establishing encrypted link to tower (${e}) `)
    .break()
    .pause(200)
    .type('. ')
    .pause(200)
    .type('. ')
    .pause(200)
    .type('. ')
    .pause(300)
    .type('done')
    .break()
    .type(
      `>//[<span class="accent--text">COMP/CON</span>: <span class="stark-text--text">Welcome, Traveler. Point the way.</span>]`
    )
    .go();
};

export default plog;
