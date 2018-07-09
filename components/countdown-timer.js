import Timer from '/data/timer.js'

const patch = snabbdom.init([
  snabbdom_attributes.default,
]);
const h = snabbdom.h;

class CountdownTimer extends HTMLElement {
  static get observedAttributes() { return ['end-at', 'name']; }

  constructor() {
    super();

    this.timer = new Timer({
      name: this.getAttribute('name'),
      endAt: this.getAttribute('end-at'),
      uuid: this.getAttribute('uuid'),
    });

    const template = countdownTimerDoc.getElementById('countdown-timer')
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

    this.dom = [
      document.createElement('span'),
      document.createElement('span'),
      document.createElement('span'),
      document.createElement('span'),
    ];

    this.dom.forEach((child) => this.appendChild(child));

    this.render();

    this.updateEndAtDisplayInterval = setInterval(() => {
      this.timeUpNotification();
      this.render();
    }, 500);
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
    const endAt = new Date(this.timer.endAt);
    const lo = (num) => (num < 10) ? `0${num}` : num.toString();
    const endAtValue = `${endAt.getFullYear()}-${lo(endAt.getMonth()+1)}-${lo(endAt.getDate())}T${lo(endAt.getHours())}:${lo(endAt.getMinutes())}`;

    inputEditName.value = this.timer.name;
    inputEditEndAt.value = endAtValue;
    inputEditUuid.value = this.timer.uuid;

    dialogEditTimer.showModal();
  }

  isTimeUp() {
    return this.timer && this.timer.distance(true, true, true, true).seconds <= 0;
  }

  slots() {
    const isTimeUp = this.isTimeUp();

    return [
      h('span', { attrs: { slot: 'name' } }, this.timer.name),
      h('span', { attrs: { slot: 'uuid' } }, this.timer.uuid),
      h('span', { attrs: { slot: (isTimeUp ? 'not-countdown' : 'countdown') } }, (isTimeUp ? '' : this.timer.distance(true, true, true, true).text)),
      h('span', { attrs: { slot: 'endAt' } }, new Date(this.timer.endAt).toLocaleString())
    ];
  }

  timeUpNotification() {
    if (this.isTimeUp()) {
      if (!this.notified && Notification.permission === 'granted') {
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

  render() {
    const slots = this.slots();
    this.dom.map((child, index) => patch(child, slots[index]));
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

        const now = new Date();
        const newDate = new Date(this.timer.endAt);
        if (newDate.getTime() > now.getTime() && this.notified) {
          this.notified = false; // reset
        }
        break;
      case 'uuid':
        this.timer.uuid = newValue;
        break;
      default:
      // pass
    }

    // change DOM only after it's connected
    if (this.connected) {
      this.render();
    }
  }
}

customElements.define('countdown-timer', CountdownTimer);
