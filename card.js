class CardInfo extends HTMLElement {

  constructor() {
    super()
  }
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'closed' })

    let card = document.createElement('div')
    card.classList ="card"
    card.addEventListener('click', () => {
      
      this.selectMediaSource(this.getAttribute('data-id'))
    }
    , true)
    card.title = `${this.getAttribute('data-id')}`

    let id = card.appendChild(document.createElement('p'))
    id.classList = "deviceId"
    id.innerText = this.getAttribute('data-id') || 'deviceId'

    let kind = card.appendChild(document.createElement('p'))
    kind.classList ="kind"
    kind.innerText = this.getAttribute('data-kind') || 'kind'


    let label = card.appendChild(document.createElement('p'))
    label.classList = "label"
    label.innerText = this.getAttribute('data-label') || 'label'


    const style = document.createElement('link')
    style.rel ="stylesheet"
    style.href ="./card-style.css"
    shadow.appendChild(style)
    shadow.appendChild(card)
  }

  selectMediaSource (evt) {
   
    const event = new CustomEvent("selectmediadevice", {
      detail: evt
    })
    window.dispatchEvent(event)
  }
}


window.customElements.define("card-device", CardInfo);