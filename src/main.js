import Timer from '/data/timer.js';
import LocalStorage from '/components/local-storage.js'
import CountdownTimer from '/components/countdown-timer.js'
import CountdownTimerList from '/components/countdown-timer-list.js'

customElements.define('local-storage', LocalStorage);
customElements.define('countdown-timer', CountdownTimer);
customElements.define('countdown-timer-list', CountdownTimerList);

//document.getElementsByTagName('countdown-timer')[0].dispatchEvent(
  //new CustomEvent('like-what', { detail: false, bubbles: true })
//);
