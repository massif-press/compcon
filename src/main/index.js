'use strict'

import { app, BrowserWindow, Menu } from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'

const isDevelopment = process.env.NODE_ENV !== 'production'

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow

function createMainWindow() {
  const window = new BrowserWindow({
    height: 800,
    // minHeight: 720,
    width: 1400,
    // minWidth: 1280,
    titleBarStyle: process.platform === 'win32' ? 'hidden' : 'default',
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
    },
  })

  console.log(process.platform)

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
    window.webContents.once('dom-ready', () => {
      window.webContents.openDevTools()
    })
  }
  else {
    window.loadURL(formatUrl({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true
    }))
  }

  window.on('closed', () => {
    mainWindow = null
  })

  window.webContents.on('devtools-opened', () => {
    window.focus()
    setImmediate(() => {
      window.focus()
    })
  })

  return window
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
})

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow()
})

// Create the Application's main menu
var template = [{
  label: "Comp/Con",
  submenu: [{
    label: "About Comp/Con",
    selector: "orderFrontStandardAboutPanel:"
  },
  {
    type: "separator"
  },
  {
    label: "Quit",
    accelerator: "CmdOrCtrl+Q",
    click: function () {
      app.quit();
    }
  }
  ]
}, {
  label: "Edit",
  submenu: [{
    label: "Cut",
    accelerator: "CmdOrCtrl+X",
    role: "cut"
  },
  {
    label: "Copy",
    accelerator: "CmdOrCtrl+C",
    role: "copy"
  },
  {
    label: "Paste",
    accelerator: "CmdOrCtrl+V",
    role: "paste"
  },
  {
    label: "Select All",
    accelerator: "CmdOrCtrl+A",
    role: "selectAll"
  }
  ]
}, {
  label: 'View',
  submenu: [{
    label: "Toggle Dev Tools",
    accelerator: "Alt+CmdOrCtrl+I",
    role: "toggleDevTools"
  }]
}]

Menu.setApplicationMenu(Menu.buildFromTemplate(template));


// const template = [{
//     label: 'File',
//     submenu: [{
//       role: 'about'
//     }, {
//       role: 'quit'
//     }],
//   },
//   {
//     label: 'Edit',
//     submenu: [{
//         role: 'undo'
//       },
//       {
//         role: 'redo'
//       },
//       {
//         type: 'separator'
//       },
//       {
//         role: 'cut'
//       },
//       {
//         role: 'copy'
//       },
//       {
//         role: 'paste'
//       },
//       {
//         role: 'pasteandmatchstyle'
//       },
//       {
//         role: 'delete'
//       },
//       {
//         role: 'selectall'
//       },
//     ],
//   },
//   {
//     label: 'View',
//     submenu: [{
//         role: 'reload'
//       },
//       {
//         role: 'forcereload'
//       },
//       {
//         role: 'toggledevtools'
//       },
//       {
//         type: 'separator'
//       },
//       {
//         role: 'resetzoom'
//       },
//       {
//         role: 'zoomin'
//       },
//       {
//         role: 'zoomout'
//       },
//       {
//         type: 'separator'
//       },
//       {
//         role: 'togglefullscreen'
//       },
//     ],
//   },
//   {
//     role: 'window',
//     submenu: [{
//       role: 'minimize'
//     }, {
//       role: 'close'
//     }],
//   },
//   {
//     role: 'help',
//     submenu: [{
//         click() {
//           require('electron').shell.openExternal(
//             'https://getstream.io/winds',
//           );
//         },
//         label: 'Learn More',
//       },
//       {
//         click() {
//           require('electron').shell.openExternal(
//             'https://github.com/GetStream/Winds/issues',
//           );
//         },
//         label: 'File Issue on GitHub',
//       },
//     ],
//   },
// ];