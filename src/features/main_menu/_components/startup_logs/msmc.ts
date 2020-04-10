import _ from 'lodash'
import { callsign, encryption } from '@/io/Generators'

const logos = [
  `
███╗   ███╗███████╗███╗   ███╗ ██████╗
████╗ ████║██╔════╝████╗ ████║██╔════╝
██╔████╔██║███████╗██╔████╔██║██║     
██║╚██╔╝██║╚════██║██║╚██╔╝██║██║     
██║ ╚═╝ ██║███████║██║ ╚═╝ ██║╚██████╗
╚═╝     ╚═╝╚══════╝╚═╝     ╚═╝ ╚═════╝ 
-- [ MIRRORSMOKE MERCENARY COMPANY ] --
>>>>>>>>> ((   PILOT NET   )) <<<<<<<<< 
---------------------------------------
`,
  `
'7MMM.     ,MMF' .M"""bgd '7MMM.     ,MMF' .g8"""bgd 
  MMMb    dPMM  ,MI    "Y   MMMb    dPMM .dP'     'M 
  M YM   ,M MM  'MMb.       M YM   ,M MM dM'       ' 
  M  Mb  M' MM    'YMMNq.   M  Mb  M' MM MM          
  M  YM.P'  MM  .     'MM   M  YM.P'  MM MM.         
  M  'YM'   MM  Mb     dM   M  'YM'   MM 'Mb.     ,' 
.JML. ''  .JMML.P"Ybmmd"  .JML. ''  .JMML. '"bmmmd'  
--------- [ MIRRORSMOKE MERCENARY COMPANY ] ---------
|                ((   PILOT NET   ))                |
|---------------------------------------------------|
`,
  `
888b     d888  .d8888b.  888b     d888  .d8888b.  
8888b   d8888 d88P  Y88b 8888b   d8888 d88P  Y88b 
88888b.d88888 Y88b.      88888b.d88888 888    888 
888Y88888P888  "Y888b.   888Y88888P888 888        
888 Y888P 888     "Y88b. 888 Y888P 888 888        
888  Y8P  888       "888 888  Y8P  888 888    888 
888   "   888 Y88b  d88P 888   "   888 Y88b  d88P 
888       888  "Y8888P"  888       888  "Y8888P"  
------- [ MIRRORSMOKE MERCENARY COMPANY ] -------
|              ((   PILOT NET   ))              |
-------------------------------------------------     
`,
]

const phrases = [
  `LET'S GET THIS BREAD`,
  `REACH HEAVEN THROUGH VIOLENCE`,
  `KEEP POSTING I'M RELOADING`,
  `GET IN GET OUT GET PAID`,
  `SECURE THE BAG`,
  `TIME TO CAKE UP`,
  `MOVE TO THE SOUND OF THE GUNS`,
  `WHAT WOULD XAOLI DO?`,
  `UPHOLD THE CONTRACT`,
  `CHECK YOUR CORNERS, EVEN AT A DESK. CORPORATE ESPIONAGE STARTS AND STOPS WITH YOU`,
  `MSMC AND MSMC LEGAL CORPS RESERVE THE RIGHT TO ACCESS AND/OR REDISTRIBUTE ANY USER DATA`,
  `SHOOT FIRST, LET MSMC LEGAL CORPS HANDLE THE REST`,
]

const getLogo = (): string => {
  const l = _.sample(logos)
  return l.replace(/\//g, '&#47;')
}

const getPhrase = (): string => {
  return _.sample(phrases)
}

const plog = typer => {
  typer
    .type('<br>')
    .type('COMPANION/CONCIERGE UNIT INITIALIZING')
    .break()
    .type('GMS COMP/CON Unit Mk XI Rev 11.4.1c')
    .break()
    .type('5017.3.12 General Massive Systems // Please Operate Responsibly')
    .break()
    .type('Mirrorsmoke (R) MSMCOS (R) 8.0 (Build 113409)')
    .break()
    .type('Connecting to Pilot NET ')
    .pause(150)
    .type('. ')
    .pause(150)
    .type('. ')
    .pause(150)
    .type('. ')
    .pause(150)
    .break()
    .type('Connected to Pilot NET. Please enter MSMC LC-CRED ')
    .break()
    .type('USERNAME: ')
    .pause(90)
    .type(`${callsign()}_${Math.floor(Math.random() * 9999)}`)
    .break()
    .type('PASSWORD: ')
    .pause(90)
    .type(`************`)
    .pause(250)
    .break()
    .type('Credentials verified. Welcome to Pilot NET! ')
    .type(`&nbsp; (<b>${Math.floor(Math.random() * 99999)}</b> USERS ONLINE)`)
    .break()
    .type(`<pre>${getLogo()}</pre>`)
    .type(`>>${getPhrase()} `)
    .break()
    .break()
    .type(
      `AVAILABLE MISSIONS: <b>${Math.floor(Math.random() * 99)
        .toString()
        .padStart(2, '0')}</b> &emsp;&nbsp;&nbsp;|&emsp; AVAILABLE BOUNTIES: <b>${Math.floor(
        Math.random() * 99
      )
        .toString()
        .padStart(2, '0')}</b>`
    )
    .break()
    .type(
      `PENDING PAYMENTS: MN$<b>${Math.floor(Math.random() * 999)
        .toString()
        .padStart(3, '0')}</b> &emsp;|&emsp; INBOX: <b>${Math.floor(
        Math.random() * 999
      )}</b> UNREAD MSG`
    )
    .break()
    .type(`-------------------------------------`)
    .break()
    .type(
      '>//[<span class="accent--text">COMP/CON</span>: <span class="stark-text--text">Welcome, Lancer. Input Command.</span>]'
    )
    .go()
}

export default plog
