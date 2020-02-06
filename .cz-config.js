module.exports = {
    types: [
        { value: 'feat', name: 'feat:     A new feature' },
        { value: 'fix', name: 'fix:      A bug fix' },
        { value: 'docs', name: 'docs:     Documentation only changes' },
        {
            value: 'style',
            name:
                'style:    Changes that do not affect the meaning of the code\n            (white-space, formatting, missing semi-colons, etc)',
        },
        {
            value: 'refactor',
            name: 'refactor: A code change that neither fixes a bug nor adds a feature',
        },
        {
            value: 'build',
            name: 'build:    Related to the build or CI process'
        },
        {
            value: 'perf',
            name: 'perf:     A code change that improves performance',
        },
        { value: 'test', name: 'test:     Adding missing tests' },
        {
            value: 'chore',
            name:
                'chore:    Changes to the build process or auxiliary tools\n            and libraries such as documentation generation',
        },
        { value: 'revert', name: 'revert:   Revert to a commit' },
        { value: 'WIP', name: 'WIP:      Work in progress' },
    ],

    allowTicketNumber: false,

    scopes: [
        "Compendium",
        "Pilot Sheet",
        "Mech Sheet",
        "Active Mode",
        "Homebrew Content",
        "NPC Roster",
        "Encounter Builder",
        "Mission Builder",
        "Mission Runner",
    ],
    allowCustomScopes: true,

    scopeOverrides: {
        chore: []
    },


    subjectLimit: 100,

    footerPrefix: 'Closes',
};