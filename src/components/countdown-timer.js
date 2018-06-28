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

    const buttonRemove = this.shadowRoot.querySelector('.button-remove');
    buttonRemove.addEventListener('click', () => this.removeTimer());

    const buttonEdit = this.shadowRoot.querySelector('.button-edit');
    buttonEdit.addEventListener('click', () => this.editTimer());

    // attributeChangedCallback not fired between
    // construction and connect, so we need to read them again here
    this.timer = new Timer({
      name: this.getAttribute('name'),
      endAt: this.getAttribute('end-at'),
      uuid: this.getAttribute('uuid'),
    });

    this.dom = {
      h3name: document.createElement('span'),
      timeCountdown: document.createElement('span'),
      timeEndAt: document.createElement('span'),
      smallUuid: document.createElement('span'),
    };

    this.dom.h3name.setAttribute('slot', 'name');
    this.dom.h3name.textContent = this.timer.name;

    this.dom.smallUuid.setAttribute('slot', 'uuid');
    this.dom.smallUuid.textContent = this.timer.uuid;

    this.dom.timeCountdown.setAttribute('slot', 'countdown');
    this.dom.timeCountdown.textContent = this.timer.distance(true, true, true, true).text;

    this.dom.timeEndAt.setAttribute('slot', 'endAt');
    this.dom.timeEndAt.textContent = new Date(this.timer.endAt).toLocaleString();

    Object.values(this.dom).forEach((child) => {
      this.appendChild(child);
    });

    this.updateEndAtDisplayInterval = setInterval(() => this.updateEndAtDisplay(), 500);
  }

  updateEndAtDisplay() {
    const { seconds, text } = this.timer.distance(true, true, true, true);
    if (seconds > 0) {
      this.dom.timeCountdown.textContent = text;
    } else {
      this.dom.timeCountdown.remove();
      if (seconds <= 0 && !this.notified && Notification.permission === 'granted') {
        this.notified = true;
        const title = `It's time for ${this.timer.name}!`;
        const body = `The designated time for ${this.timer.name} is ${(new Date(this.timer.endAt)).toLocaleString()}.`
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification(title, {
              body,
              icon: '/static/icon-192.png',
              vibrate: [200, 100, 200]
            });
          });
        } else {
          try {
            const notification = new Notification(title, { body });
          } catch (e) {
            // no notification support
          }
        }
      }
    }
  }

  removeTimer() {
    const countdownTimerList = this.closest('countdown-timer-list');
    countdownTimerList.dispatchEvent(
      new CustomEvent('remove', {
        detail: {
          uuid: this.timer.uuid
        }
      })
    );
  }

  editTimer() {
    const dialogEditTimer = document.getElementById('edit-timer');
    const inputEditName = document.querySelector('#edit-name');
    const inputEditEndAt = document.querySelector('#edit-end-at');
    const inputEditUuid = document.querySelector('#edit-uuid');

    inputEditName.value = this.timer.name;
    inputEditEndAt.valueAsDate = new Date(this.timer.endAt);
    inputEditUuid.value = this.timer.uuid;

    dialogEditTimer.showModal();
  }

  renderChanges(name) {
    switch (name) {
      case 'name':
        this.dom.h3name.textContent = this.timer.name;
        break;
      case 'end-at': // endAt doesn't work, use end-at
        this.updateEndAtDisplay();
        this.dom.timeEndAt.textContent = new Date(this.timer.endAt).toLocaleString();
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
      this.renderChanges(name);
    }
  }
}

export default CountdownTimer;
