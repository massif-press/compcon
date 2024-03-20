import { flavorID } from '@/io/Generators'

const getLogo = (): string => {
  return `
                         /                       
                        @@@*                      
                      /@@@@@@                     
                     @@@@@@@@@                    
                    @@@@@@@@@@@@                  
                  @@@@/      @@@@                 
                 @     @@@@@     @(               
                   @@@@@@@@@@@@@/                 
                 @@@@@@@@@@@@@@@@@#               
            &@   @@@@@@@@@@@@@@@@@#  @@           
           @@@   @@@@@@@@@@@@@@@@@#  @@@,         
         *@@@@   @@@@@@@@@@@@@@@@@#  @@@@@        
        @@@@@@     @@@@@@@@@@@@@&    @@@@@@       
       @@@@@@@@@@@     @@@@@     &@@@@@@@@@@@     
     @@@@@@@@@@@@@@@@@.      @@@@@@@@@@@@@@@@@@    
                                                  `
}
const plog = typer => {
  typer
    .type('<br>')
    .type('<br>')
    .type('<br>')
    .type('<br>')
    .type('HARRISON ARMORY CITY UNIT INITIALIZING')
    .break()
    .type('RAS SHAMRA City Unit Model DOMINANCE VII')
    .break()
    .break()
    .type(`<span class="accent--text"><pre>${getLogo()}</pre></span>`)
    .break()
    .type('5016.8.22 Harrison Armory Systems // Service Guarantees Citizenship')
    .break()
    .type('Initializing social credit system ')
    .pause(150)
    .type('. ')
    .pause(150)
    .type('. ')
    .pause(150)
    .type('. ')
    .pause(150)
    .type('done')
    .break()
    .type('Checking citizen rank ')
    .pause(150)
    .type('. ')
    .pause(150)
    .type('. ')
    .pause(150)
    .type('. ')
    .pause(150)
    .type('done')
    .break()
    .type(`&emsp;&emsp;Citizen[${flavorID("aNN-AANNA")}] Rank: Citizen`)
    .break()
    .type('Initializing elevator system ')
    .pause(150)
    .type('. ')
    .pause(150)
    .type('. ')
    .pause(150)
    .type('. ')
    .pause(150)
    .type('done')
    .break()
    .break()
    .type('Elevator ride through Ras Shamra commencing')
    .break()
    .type('Checking social credit for access clearance ')
    .pause(150)
    .type('. ')
    .pause(150)
    .type('. ')
    .pause(150)
    .type('. ')
    .pause(150)
    .type('done')
    .break()
    .type('&emsp;&emsp;Access Clearance: ' + 2)
    .break()
    .type(`Current Station living quarters Level -${flavorID("aNNN")}`)
    .break()
    .break()
    .type('Remember, we are all doing our part for a brighter tomorrow. Are you?')
    .break()
    .type('>//[<span class="accent--text">HARRISON ARMORY</span>: <span class="stark-text--text">Welcome, Citizen. Input Command.</span>]')
    .go()
}

export default plog
