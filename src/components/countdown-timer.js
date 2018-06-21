import Timer from '/data/timer.js'

class CountdownTimer extends HTMLElement {
  static get observedAttributes() { return ['end-at', 'name']; }

  constructor() {
    super();

    this.timer = new Timer({
      name: this.getAttribute('name'),
      endAt: this.getAttribute('end-at'),
      uuid: this.getAttribute('uuid'),
    });

    const template = document.getElementById('countdown-timer')
      .content;
    const shadowRoot = this.attachShadow({ mode: 'open' })
      .appendChild(template.cloneNode(true));

    }

  connectedCallback() {
    this.connected = true;

    this.dom = {
      h3name: document.createElement('span'),
      timeEndAt: document.createElement('span'),
      smallUuid: document.createElement('span'),
    };

    this.dom.h3name.setAttribute('slot', 'name');
    this.dom.h3name.textContent = this.timer.name;

    this.dom.smallUuid.setAttribute('slot', 'uuid');
    this.dom.smallUuid.textContent = this.timer.uuid;

    this.dom.timeEndAt.setAttribute('slot', 'endAt');
    this.dom.timeEndAt.textContent = this.timer.distance(true, true, true, true).text;

    Object.values(this.dom).forEach((child) => {
      this.appendChild(child);
    });

    this.addEventListener('like-what', (e) => console.log(e.bubbles, e.detail));

    this.updateEndAtDisplayInterval = setInterval(() => this.updateEndAtDisplay(), 500);
  }

  updateEndAtDisplay() {
    const { seconds, text } = this.timer.distance(true, true, true, true);
    if (seconds > 0) {
      this.dom.timeEndAt.textContent = text;
    } else {
      this.dom.timeEndAt.remove();
    }
  }

  renderChanges(name) {
    switch (name) {
      case 'name':
        this.dom.h3name.textContent = this.timer.name;
        break;
      case 'end-at': // endAt doesn't work, use end-at
        this.updateEndAtDisplay();
        break;
      case 'uuid':
        this.dom.smallUuid.textContent = this.timer.uuid;
        break;
      default:
      // pass
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // Only change state here, not DOM because this element may
    // not have been connected
    // TODO: a proper render method for these attributes
    switch (name) {
      case 'name':
        this.timer.name = newValue;
        break;
      case 'end-at': // endAt doesn't work, use end-at
        this.timer.endAt = newValue;
        break;
      case 'uuid':
        this.timer.uuid = newValue;
        break;
      default:
      // pass
    }

    // change DOM only after it's connected
    if (this.connected) {
      this.renderChanges();
    }
  }
}

export default CountdownTimer;
