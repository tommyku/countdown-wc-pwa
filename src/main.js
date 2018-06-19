import Timer from '/data/timer.js';
import CountdownTimer from '/components/countdown-timer.js'

customElements.define('countdown-timer', CountdownTimer);
document.getElementsByTagName('countdown-timer')[0].dispatchEvent(
  new CustomEvent('like-what', { detail: false, bubbles: true })
);
