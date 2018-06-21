import Timer from '/data/timer.js';
import LocalStorage from '/components/local-storage.js'
import CountdownTimer from '/components/countdown-timer.js'
import CountdownTimerList from '/components/countdown-timer-list.js'

customElements.define('local-storage', LocalStorage);
customElements.define('countdown-timer', CountdownTimer);
customElements.define('countdown-timer-list', CountdownTimerList);

const dialogAddTimer = document.querySelector('#add-timer');
const buttonAddTimer = document.querySelector('.button-add-timer');
const buttonHideModal = document.querySelector('.button-hide-modal');
const buttonShowModal = document.querySelector('.button-show-modal');
const inputName = document.querySelector('#name');
const inputEndAt = document.querySelector('#end-at');
const countdownTimerList = document.querySelector('countdown-timer-list');

buttonShowModal.addEventListener('click', () => dialogAddTimer.showModal());
buttonHideModal.addEventListener('click', () => dialogAddTimer.close());

buttonAddTimer.addEventListener('click', () => {
  const name = inputName.value;
  const endAt = inputEndAt.value;

  countdownTimerList.dispatchEvent(new CustomEvent('add', {
    detail: {
      timer: {
        name: name,
        endAt: (new Date(endAt)).toUTCString()
      }
    }
  }));
});
