import Timer from '../data/timer.js';

class CountdownTimerList extends HTMLElement {
  constructor() {
    super();

    this.timers = [
      //new Timer({ name: 'Last Christmas', endAt: 'Mon, 25 Dec 2017 15:00:00 GMT' }),
      //new Timer({ name: "Mom's birthday", endAt: 'Sun, 24 Jun 2018 15:00:00 GMT' }),
      //new Timer({ name: 'Her birthday', endAt: 'Sat, 7 Jul 2018 15:00:00 GMT' }),
      //new Timer({ name: 'Christmas', endAt: 'Tue, 25 Dec 2018 15:00:00 GMT' }),
    ];

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

    // update
    //this.localStorage.dispatchEvent(
      //new CustomEvent('update', {
        //detail: {
          //data: this.timers
        //}
      //})
    //);
  }

  renderTimers() {
    this.contentDiv.innerHTML = ''; // any better way to update like virtual DOM?
    this.timers.forEach((timer) => {
      this.contentDiv.appendChild(
        this.generateCountdownTimer(timer)
      );
    });
  }

  storeUpdateCallback(data) {
    this.timers = data.map((timer) => new Timer(timer));
    this.renderTimers();
  }
}

export default CountdownTimerList;
