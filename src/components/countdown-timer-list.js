import Timer from '../data/timer.js';

class CountdownTimerList extends HTMLElement {
  constructor() {
    super();

    this.timers = {};

    this.storeName = this.getAttribute('store') || 'untitled-store';

    const template = document.getElementById('countdown-timer-list')
      .content;
    const shadowRoot = this.attachShadow({ mode: 'open' })
      .appendChild(template.cloneNode(true));

    const contentDiv = document.createElement('div');
    contentDiv.setAttribute('slot', 'content');

    this.contentDiv = contentDiv;

    this.appendChild(contentDiv);

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
    this.renderTimers();

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

  renderTimers() {
    this.contentDiv.innerHTML = ''; // any better way to update like virtual DOM?
    if (Object.keys(this.timers).length > 0) {
      Object.values(this.timers).forEach((timer) => {
        this.contentDiv.appendChild(
          this.generateCountdownTimer(timer)
        );
      });
    } else {
      this.contentDiv.innerHTML = 'No timer! Add one!';
    }
  }

  storeUpdateCallback(data) {
    if (Array.isArray(data)) {
      this.timers = {};
      data.forEach((timer) => this.timers[timer.uuid] = new Timer(timer));
      this.renderTimers();
    }
  }
}

export default CountdownTimerList;
