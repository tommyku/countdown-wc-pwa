import Timer from '../data/timer.js';

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
    if (Object.keys(this.timers).length > 0) {
      // something like React's virtual DOM may be grest here coz I don't wanna replace innerHTML all the time
      // first remove textNodes for empty list message
      [].slice.call(this.contentDiv.childNodes)
        .filter(child => child.nodeName === '#text')
        .forEach(textNode => textNode.remove());

      // 1. get the childNodes, remove if in timers
      // 2. leftovers gets removed
      // 3. now get timers, and remove if in childNodes
      // 4. leftovers gets added
      const timersUuids = Object.values(this.timers).map(timer => timer.uuid);
      const childNodeUuids = [].slice.call(this.contentDiv.children)
        .filter(child => child.tagName === 'COUNTDOWN-TIMER')
        .map(child => child.getAttribute('uuid'));

      const toRemove = childNodeUuids.filter((uuid) => timersUuids.indexOf(uuid) == -1); // not in timers
      const toAdd = timersUuids.filter((uuid) => childNodeUuids.indexOf(uuid) == -1); // not in children

      toRemove.forEach((uuid) => this.contentDiv.querySelector(`countdown-timer[uuid="${uuid}"]`).remove());
      toAdd.forEach((uuid) => this.contentDiv.appendChild(
          this.generateCountdownTimer(this.timers[uuid])
      ));

      // update attributes
      [].slice.call(this.contentDiv.children)
        .filter(child => child.tagName === 'COUNTDOWN-TIMER')
        .forEach(countdownTimer => {
          const timer = this.timers[countdownTimer.getAttribute('uuid')];
          if (timer) {
            const { name, endAt } = timer.serialize();
            countdownTimer.setAttribute('name', name);
            countdownTimer.setAttribute('end-at', endAt);
          }
        });
    } else {
      this.contentDiv.textContent = 'No timer! Add one!';
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

customElements.define('countdown-timer-list', CountdownTimerList);
