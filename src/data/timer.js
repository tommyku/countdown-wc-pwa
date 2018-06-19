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
}

export default Timer;
