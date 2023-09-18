export function formatDuration(duration) {
  const hours = duration.hours?.toString()
  const minutes = duration.minutes?.toString()
  const secondsString = duration.seconds?.toString()

  let result = ''

  if (hours && hours !== '0') {
    result += `${hours}hrs `
  }

  if (minutes && minutes !== '0') {
    result += `${minutes}min `
  }

  if (secondsString && secondsString !== '0') {
    result += `${secondsString}s`
  }

  return result
}