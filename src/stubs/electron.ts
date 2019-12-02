const remote = {
  app: {
    getPath: () => '',
  },
}
const clipboard = {
  writeText(text: string): void {
    var textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
  },
}

export { remote, clipboard }

export default {}
