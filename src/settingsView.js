import * as C from "./constants"

export const settingsView = ({ element, listeners, direction, rows, cols }) => {
  element.innerHTML =
    "<div>" +
      "<label title='Align in a row'>" +
        "<input type='radio' name='direction' value='row' " +
          (direction === "row" ? "checked" : "") + " />" +
        "Row " +
      "</label>" +
      "<label title='Align in a column'>" +
        "<input type='radio' name='direction' value='column' " +
          (direction === "column" ? "checked" : "") + " />" +
        "Col " +
      "</label>" +
      "<input title='Number of rows' id='" + C.rowsId + "' type='text' size='2'" +
        " value='" + rows + "'/>" +
      "<span> &times; </span> " +
      "<input title='Number of columns' id='" + C.colsId + "' type='text' size='2'" +
        " value='" + cols + "'/>" +
      "<label title='Toggle auto-send'>" +
        "<input id='" + C.autoId + "' type='checkbox' checked />" +
        " Auto " +
      "</label>" +
      "<label title='Toggle accumulate history'>" +
        "<input id='" + C.histId + "' type='checkbox' checked />" +
        " Hist " +
      "</label>" +
    "</div>"

  document.getElementById(C.rowsId).addEventListener("input", evt => {
    listeners.onRowsColsChange(parseInt(evt.target.value, 10), parseInt(document.getElementById(C.colsId).value, 10))
  })

  document.getElementById(C.colsId).addEventListener("input", evt => {
    listeners.onRowsColsChange(parseInt(document.getElementById(C.rowsId).value, 10), parseInt(evt.target.value, 10))
  })

  const radios = document.querySelectorAll("input[name='direction']")
  for (let i = 0, t = radios.length; i < t; i++) {
    radios[i].addEventListener("change", evt => {
      if (evt.target.checked) {
        listeners.onDirectionChange(evt.target.value)
      }
    })
  }

  document.getElementById(C.autoId).addEventListener("change", evt => {
    listeners.onAutoChange(evt.target.checked)
  })

  document.getElementById(C.histId).addEventListener("change", evt => {
    listeners.onHistChange(evt.target.checked)
  })
}

export const initializeResizeChangeDirection = (listeners, direction) => {
  const directionAccordingToWindowSize = () => {
    const dir = window.innerWidth > window.innerHeight ? "row" : "column"
    const radios = document.querySelectorAll("input[name='direction']")
    for (let i = 0, t = radios.length; i < t; i++) {
      radios[i].checked = radios[i].value === dir
    }
    listeners.onDirectionChange(dir)
  }

  window.addEventListener("resize", directionAccordingToWindowSize)

  if (direction === "row" || direction === "column") {
    listeners.onDirectionChange(direction)
  }
  else {
    directionAccordingToWindowSize()
  }
}