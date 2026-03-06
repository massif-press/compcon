<h1 align="center">COMP/CON</h1>
 
<p align="center" style="font-style: italic; font-weight: bold">
  <img width="250" src="public/img/icons/192x192.png">
</p>
<p align="center"><b><i>The companion app for <a href="https://massif-press.itch.io/corebook-pdf">Massif Press's LANCER Tabletop RPG</a></b></i></p>
<p align="center">
  <a href="https://massif-press.itch.io/compcon"><img width="250" src="https://static.itch.io/images/badge-color.svg"></a>
  <br>
  <a href="https://compcon.app">
    <img width="200" src="https://www.netlify.com/img/global/badges/netlify-color-accent.svg"/>
  </a>
  <br>
  <a href="https://app.netlify.com/sites/compcon/deploys"><img alt="Netlify Status" src="https://api.netlify.com/api/v1/badges/8c8ba126-8074-4a99-98f9-9b0529107214/deploy-status"></a>
  <!-- <a href="http://commitizen.github.io/cz-cli/"><img src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg" alt="Commitizen friendly"></a> -->
  <a href="https://discord.gg/rwcpzsU"><img src="https://img.shields.io/badge/discord-%23compcon-7289DA?logo=discord&logoColor=white" alt="Join the LANCER discord"></a>
  <br>
  <a href="https://patreon.com/compcon"><img src="https://img.shields.io/endpoint.svg?url=https%3A%2F%2Fshieldsio-patreon.vercel.app%2Fapi%3Fusername%3Dcompcon%26type%3Dpatrons&style=for-the-badge" alt="Support COMP/CON on Patreon"></a>
</p>

## Features

- Character & mech creation
  - Active Play Mode for status tracking during sessions
- Compendium
- Encounter Toolkit for GMs
  - NPC Roster
  - Encounter Builder & Mission Runner
- Homebrew Support

## Usage

### Character & mech creation
Character creation is done through the Pilot Roster.
Pilots can either be created in the application, or imported via two different methods
1. Import from file, which requires a valid pilot .json
2. Import from share code, which can be generated in the application

It is important to note that a COMP/CON account is required to create and import from a share code.

### Compendium
The Compendium is a database containing player options, NPC options, and gameplay reference material. 
By default, COMP/CON ships with only the data within the free edition of the core book. Official content meant for use by players is available for free under their respective pages' demos, while content meant for use by GMs running the game is paid, available with purchase of the pdf.

### Encounter Toolkit for GMs
Importing Lancer Content Packages is done through Content Management>Install Content>Uploading the relevant LCP file.
Official LCP files can be found on Massif Press's itch page, and there are links to both official and community made LCP files within the LCP directory under Content Management.

The Encounter Toolkit requires use of an LCP containing NPC data, most likely the Core Rulebook's NPC LCPs.
The workflow consists of
1. Create NPCs in the NPC roster using a Class as a base, adding Templates and Features as needed
2. Create Encounters in the Encounter Builder using those NPCs
3. Create Missions in the Mission Builder using those Encounters
4. Run those Missions in the Mission Runner

### Homebrew Support
Homebrew is also implemented through LCP files.
An LCP file is simply a renamed ZIP file containing .json files.
To create custom LCPs, one may either use the [experimental LCP Generator](https://cc-lcp-editor.netlify.app/#/) or manually edit .json files and zip them together, renaming the final archive with the LCP file extension.

If creating an LCP by hand, editing an LCP generated with the experimental editor, or using an offical LCP as a base, examples of the data structures for the different kinds of custom content can be found [here](https://github.com/massif-press/lancer-data/tree/master/lib).

That library does not contain information on the necessary manifest file, public repositories for the free official lcps are available [here](https://github.com/massif-press).

An example of a manifest file can be found [here](https://github.com/massif-press/long-rim-data/blob/master/lib/lcp_manifest.json).

## Contributing

See [CONTRIBUTORS](CONTRIBUTORS.md).

## Building

COMP/CON is built with [Vue.js](https://vuejs.org/).

```sh
# Install dependencies
  yarn
# Run in dev mode in the browser, with hot reloading
  yarn serve
# Build
  yarn build
```

## Got a problem?

- [**Request a feature/Report a bug**](https://forms.gle/pj6o8BzxCe4xGQ5M7)

You can also just [create an issue](https://github.com/massif-press/compcon/issues/new) if you know what you're doing.

## License

[GPL](/LICENSE)
