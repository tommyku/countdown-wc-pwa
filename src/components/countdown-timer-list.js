import Timer from '../data/timer.js';

class CountdownTimerList extends HTMLElement {
  constructor() {
    super();

    this.timers = [
      new Timer({ name: 'Last Christmas', endAt: 'Mon, 25 Dec 2017 15:00:00 GMT' }),
      new Timer({ name: "Mom's birthday", endAt: 'Sun, 24 Jun 2018 15:00:00 GMT' }),
      new Timer({ name: 'Her birthday', endAt: 'Sat, 7 Jul 2018 15:00:00 GMT' }),
      new Timer({ name: 'Christmas', endAt: 'Tue, 25 Dec 2018 15:00:00 GMT' }),
    ];

    const template = document.getElementById('countdown-timer-list')
      .content;
    const shadowRoot = this.attachShadow({ mode: 'open' })
      .appendChild(template.cloneNode(true));

    const contentDiv = document.createElement('div');
    contentDiv.setAttribute('slot', 'content');

    this.contentDiv = contentDiv;

    this.appendChild(contentDiv);
  }

  connectedCallback() {
    const generateCountdownTimer = (timer) => {
      const { name, endAt, uuid } = timer.serialize();
      const countdownTimer = document.createElement('countdown-timer');
      countdownTimer.setAttribute('name', name);
      countdownTimer.setAttribute('end-at', endAt);
      countdownTimer.setAttribute('uuid', uuid);
      return countdownTimer;
    };

    this.timers.forEach((timer) => {
      this.contentDiv.appendChild(
        generateCountdownTimer(timer)
      );
    });
  }
}

export default CountdownTimerList;
