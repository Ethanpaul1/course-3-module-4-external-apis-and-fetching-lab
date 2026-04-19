// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

function getElements() {
  return {
    input: document.getElementById('state-input'),
    button: document.getElementById('fetch-alerts'),
    alertsDisplay: document.getElementById('alerts-display'),
    errorMessage: document.getElementById('error-message'),
  }
}

function clearError(errorMessage) {
  errorMessage.textContent = ''
  errorMessage.classList.add('hidden')
}

function displayError(errorMessage, message) {
  errorMessage.textContent = message
  errorMessage.classList.remove('hidden')
}

function renderAlerts(alertsDisplay, data) {
  const alerts = Array.isArray(data.features) ? data.features : []
  const title = data.title || 'Current watches, warnings, and advisories'

  alertsDisplay.innerHTML = ''

  const summary = document.createElement('p')
  summary.textContent = `${title}: ${alerts.length}`
  alertsDisplay.appendChild(summary)

  const list = document.createElement('ul')
  alerts.forEach((alert) => {
    const headline = alert?.properties?.headline
    if (!headline) {
      return
    }

    const item = document.createElement('li')
    item.textContent = headline
    list.appendChild(item)
  })

  alertsDisplay.appendChild(list)
}

async function fetchWeatherData(stateAbbr) {
  const response = await fetch(`${weatherApi}${stateAbbr}`)

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return response.json()
}

async function handleFetchClick() {
  const { input, alertsDisplay, errorMessage } = getElements()
  const stateAbbr = input.value.trim().toUpperCase()

  input.value = ''
  alertsDisplay.innerHTML = ''
  clearError(errorMessage)

  if (!stateAbbr) {
    displayError(errorMessage, 'Please enter a state abbreviation.')
    return
  }

  if (!/^[A-Z]{2}$/.test(stateAbbr)) {
    displayError(errorMessage, 'Please enter a valid two-letter state abbreviation.')
    return
  }

  try {
    const data = await fetchWeatherData(stateAbbr)
    renderAlerts(alertsDisplay, data)
    clearError(errorMessage)
  } catch (error) {
    displayError(errorMessage, error.message)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const { button } = getElements()
  button.addEventListener('click', handleFetchClick)
})
