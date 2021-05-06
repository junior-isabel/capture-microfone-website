let audioContext
let microfone,
  bufferSource,
  analyser,
  devices,
  dataView;
start.disabled = true
barValue.disabled = true

let len
let bars;
const constraint = {
  video: false,
  audio: {}
}
navigator.mediaDevices.enumerateDevices().then(devices => {
  devices.forEach(device => {
    let cardDevice = document.createElement('card-device')
    cardDevice.setAttribute('data-id', device.deviceId)
    cardDevice.setAttribute('data-label', device.label)
    cardDevice.setAttribute('data-kind', device.kind)

    controllers.appendChild(cardDevice)
  })
})


function drawBars () {
  visualizationEl.innerHTML = ''
  for (let i = 0; i < len; i++) {

    let micro = visualizationEl.appendChild(document.createElement('div'))
    micro.classList = "bar"
  }
}
function reset() {
  visualizationEl.innerHTML = ''
  if (audioContext) {

    if (bufferSource)
      bufferSource.disconnect()
    if (analyser)
      analyser.disconnect()

  }
  audioContext = new AudioContext()
}


function init() {


  analyser = audioContext.createAnalyser()
  analyser.fftSize = 1024
  barValue.max = Math.log2(analyser.fftSize) - 1
  len = analyser.frequencyBinCount / Math.pow(2, barValue.value)
  bufferSource = audioContext.createMediaStreamSource(microfone)

  dataView = new Uint8Array(analyser.frequencyBinCount)
  barValue.disabled = false
  drawBars()
  bars = document.querySelectorAll('.bar')
  bufferSource.connect(analyser).connect(audioContext.destination);

  audioContext.resume()
  requestAnimationFrame(visualization)
}

function visualization() {

  requestAnimationFrame(visualization)

  analyser.getByteFrequencyData(dataView)
  for (let i = 0; i < len; i++) {
    let angle = i * (360 / len)
    let height = dataView[i]
    bars[i].style = `
      height: ${height}px;
      background-color: rgb(${height}, 0, ${255 - height});
      transform-origin: center;
      transform: rotate(${angle}deg);
      z-index: ${i}
    `
  }

}


start.addEventListener('click', init)

window.addEventListener('custom:selectmediadevice', event => {

  reset()
  constraint.audio.deviceId = event.detail
  navigator.mediaDevices.getUserMedia(constraint).then(stream => {
    microfone = stream
    start.disabled = false
  })
})

barValue.addEventListener('change', e => {
  if (analyser) {
    len = analyser.frequencyBinCount / Math.pow(2, barValue.value)
    drawBars()

  }
})