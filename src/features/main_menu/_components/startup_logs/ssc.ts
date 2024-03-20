import _ from 'lodash'
import { callsign, encryption, tracert } from '@/io/Generators'

const logos = [
  `╭═══════════════════════════════════════════╮ 
║                     %..,                  ║  
║                  ((((((((.                ║    
║    (((((((((((    ((((((    (((((((((((   ║    
║      ((((((((((((  ((((  ((((((((((((.    ║    
║       (((((((((((.  ((   (((((((((((      ║    
║         ((((((((((/  .  ((((((((((        ║    
║    *((    & (((((((    ((((((( #    ((*   ║    
║   .(((((((((                  /((((((((.  ║    
║   .((((((((                    ((((((((.  ║    
║     ((     ((((((((    ((((((((    .((    ║    
║         ((((((((((#  ,  ((((((((((.       ║    
║       (((((((((((.  (((  (((((((((((,     ║    
║      ((((((((((((  ((((  /(((((((((((.    ║    
║     *********..  &((((((%  . *********,   ║    
║                .((((((((                  ║   
║                    %%                     ║   
╚═══════════════════════════════════════════╝
`,
  `
   ___     ___     ___   
  / __|   / __|   / __|  
  \\__ \\   \\__ \\  | (__
  |___/   |___/   \\___|  
_|"""""|_|"""""|_|"""""| 
 "-0-0-"^"-0-0-'^"-0-0-"
`,
  `
,d88~~\\ ,d88~~\\  e88~-_  
8888    8888    d888   \\ 
'Y88b   'Y88b   8888     
 'Y88b,  'Y88b, 8888     
   8888    8888 Y888   / 
\\__88P' \\__88P'  "88_-~  
                         
`,
` ______ ______ _______ 
 / _____) _____|_______)
( (____( (____  _       
 \\____ \\\\____ \\| |      
 _____) )____) ) |_____ 
(______(______/ \\______)
`,
`
...                ...               ...          
.x888888hx    :    .x888888hx    :    xH88"'~ .x8X    
d88888888888hxx    d88888888888hxx   :8888   .f"8888Hf 
8" ... '"*8888%'   8" ... '"*8888%'  :8888>  X8L  ^""'  
!  "   ' .xnxx.    !  "   ' .xnxx.    X8888  X888h       
X X   .H8888888%:  X X   .H8888888%:  88888  !88888.     
X 'hn8888888*"   > X 'hn8888888*"   > 88888   %88888     
X: '*88888%'     ! X: '*88888%'     ! 88888 '> '8888>    
'8h.. ''     ..x8> '8h.. ''     ..x8> '8888L %  ?888   ! 
'88888888888888f   '88888888888888f   '8888  '-*""   /  
'%8888888888*"     '%8888888888*"      "888.      :"   
  ^"****""'          ^"****""'          '""***~"'     
`,
`
_       ___       ____    __
 )  ____)  )  ____)  /  __) 
(  (___   (  (___   |  /    
 \\___  \\   \\___  \\  | |     
 ____)  )  ____)  ) |  \\__  
(      (__(      (___\\    )_
`,
]


const getLogo = (): string => {
  const weights = [ //probability = amount index/amount all index
    0,0,0,0,0,0,0,0,0,0,  //original ssc logo   50%
    1,                    //train ssc logo      5%
    2,2,2,                //cursive ssc logo    15%
    3,3,                  //tronlike ssc logo   10%
    4,4,4,                //calligraphy ssc logo15%
    5,5,                  //banner ssc logo     10%
  ]
  return logos[_.sample(weights)]
}


const plog = typer => {
  typer
    .type('<br>')
    .type('<br>')
    .type('<br>')
    .type('<br>')
    .type('<span class="secondary--text">Constellar Congress access requested</span>')
    .break()
    .break()
    .type('<strong>INITIALIZING PRIVATE OMNINET TUNNEL⏣</strong>')
    .break()
    .type('analyzing')
    .type(` 𐄫 [[${tracert(0)}]] found`)
    .pause(500)
    .type(' --> evaluation fail [insecure]')
    .pause(500)
    .break()
    .type('analyzing')
    .type(` 𐄫 [[${tracert(0)}]] found`)
    .type(' --> evaluation success [secure]')
    .break()
    .type('Congress Node connected. Your connection is secure.')
    .break()
    .break()
    .type('<strong>CONNECTING TO CONSTELLAR CONGRESS ⧟</strong>')
    .break()
    .type('Connected to Constellar Congress. Prepare for bio-authentication flare.')
    .break()
    .break()
    .type('<strong>USERSCAN INITIATED ⊹</strong>')
    .break()
    .type('GENETIC PROFILING')
    .pause(700)
    .type(` 99.99${Math.floor(Math.random() * 999)}% match`)
    .break()
    .type(`Biometric readings confirmed.  Welcome, ${callsign()}_${Math.floor(Math.random() * 9999)}!`)
    .break()
    .break()
    .type('<strong>VR BUILDING SIMULATION ACTIVATED🏛 🏗</strong>')
    .break()
    .type('Smith-Shimano Corpro - Constellar Congress EAAS 8.0 (Build 118765)')
    .break()
    .type(`Sector/Campus 𐄘 ${encryption()}`)
    .break()
    .break()
    .type(`<span class="accent--text"><pre>${getLogo()}</pre></span>`)
    .break()
    .type('<strong>VIRTUAL ENVIRONMENT NAVIGATION ENABLED 🗺</strong>')
    .break()
    .type('Immerse yourself in the vast expanse of knowledge, where every task is a celestial odyssey.')
    .break()
    .type('Your contributions ripple through the cosmic network of thinkers and innovators.')
    .break()
    .break()
    .type('|WELCOME, PROTEGÉ|')
    .break()
    .type(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`)
    .break()
    .type(
      '>//[<span class="accent--text">ATHENA</span>: <span class="stark-text--text">Select destination-chamber.</span>]'
    )
    .go()
}

export default plog
