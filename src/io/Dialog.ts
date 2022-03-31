const saveFile = function (filename, data, label = 'Save') {
  const blob = new Blob([data])
  if ((window.navigator as any).msSaveOrOpenBlob) {
    ;(window.navigator as any).msSaveBlob(blob, filename)
  } else {
    const elem = window.document.createElement('a')
    elem.href = window.URL.createObjectURL(blob)
    elem.download = filename
    document.body.appendChild(elem)
    elem.click()
    document.body.removeChild(elem)
  }
}

export { saveFile }
