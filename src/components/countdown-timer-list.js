import Timer from '../data/timer.js';

const patch = snabbdom.init([
  snabbdom_attributes.default,
]);
const h = snabbdom.h;

class CountdownTimerList extends HTMLElement {
  constructor() {
    super();

    this.timers = {};

    this.storeName = this.getAttribute('store') || 'untitled-store';

    const template = countdownTimerListDoc.getElementById('countdown-timer-list')
      .content;
    const shadowRoot = this.attachShadow({ mode: 'open' })
      .appendChild(template.cloneNode(true));

    const contentDiv = document.createElement('div');
    contentDiv.setAttribute('slot', 'content');

    this.contentDiv = contentDiv;

    this.appendChild(contentDiv);

    this.render();

    this.localStorage = document.querySelector(`local-storage[store="${this.storeName}"]`);

    this.addEventListener('add', (e) => this.addTimer(e.detail));
    this.addEventListener('remove', (e) => this.removeTimer(e.detail));
    this.addEventListener('update', (e) => this.updateTimer(e.detail));
  }

  generateCountdownTimer(timer) {
    const { name, endAt, uuid } = timer.serialize();
    const countdownTimer = document.createElement('countdown-timer');
    countdownTimer.setAttribute('name', name);
    countdownTimer.setAttribute('end-at', endAt);
    countdownTimer.setAttribute('uuid', uuid);
    return countdownTimer;
  }

  connectedCallback() {
    this.localStorage.dispatchEvent(
      new CustomEvent('subscribe', {
        detail: {
          callback: (d) => this.storeUpdateCallback(d)
        }
      })
    );
  }

  addTimer(d) {
    const timer = new Timer(d.timer);
    this.timers[timer.uuid] = timer;
    this.updateStorage();
  }

  updateStorage() {
    this.localStorage.dispatchEvent(
      new CustomEvent('update', {
        detail: {
          data: Object.values(this.timers)
        }
      })
    );
  }

  removeTimer(d) {
    const uuid = d.uuid;
    delete this.timers[uuid];
    this.updateStorage();
  }

  updateTimer(d) {
    const { uuid, name, endAt } = d.timer;
    const timer = this.timers[uuid];
    timer.name = name;
    timer.endAt = endAt;
    this.updateStorage();
  }

  render() {
    let newVnode;
    if (Object.keys(this.timers).length > 0) {
      const children = Object.values(this.timers).map((timer) => h(
        'countdown-timer', { attrs: { name: timer.name, 'end-at': timer.endAt, uuid: timer.uuid } }
      ));
      newVnode = h('div', { attrs: { slot: 'content' } }, children);
    } else {
      newVnode = h('div', { attrs: { slot: '' } });
    }

    this.contentDiv = patch(this.contentDiv, newVnode);
  }

  storeUpdateCallback(data) {
    if (Array.isArray(data)) {
      this.timers = {};
      data.forEach((timer) => this.timers[timer.uuid] = new Timer(timer));
      this.render();
    }
  }
}

customElements.define('countdown-timer-list', CountdownTimerList);
