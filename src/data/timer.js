import guid from '/util/guid.js';

class Timer {
  constructor(arg) {
    switch (typeof arg) {
    case 'Timer':
      this.constructAsTimer(arg);
      break;
    case 'object':
      this.constructAsObject(arg);
      break;
    default:
      this.constructAsObject({});
    }
  }

  constructAsTimer(timer) {
    this.constructAsObject(timer.serialize());
  }

  constructAsObject({name, endAt, uuid}) {
    this.name = name || 'Untitled';
    this.endAt = endAt ? (new Date(endAt)).toUTCString() : (new Date()).toUTCString();
    this.uuid = uuid || guid();
  }

  serialize() {
    const { name, endAt, uuid } = this;
    return { name, endAt, uuid };
  }

  distance(d = false, h = false, m = false, s = false) {
    const now = new Date().getTime();
    const then = new Date(this.endAt).getTime();

    const distance = (then - now < 1000) ? 0 : (then - now);

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const text = `
      ${ d === true ? days + 'd ' : '' }
      ${ h === true ? hours + 'h ' : '' }
      ${ m === true ? minutes + 'm ' : '' }
      ${ s === true ? seconds + 's ' : '' }
    `;

    return {
      seconds: distance,
      text: text
    };
  }
}

export default Timer;
