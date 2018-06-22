import Timer from '/data/timer.js';
import LocalStorage from '/components/local-storage.js'
import CountdownTimer from '/components/countdown-timer.js'
import CountdownTimerList from '/components/countdown-timer-list.js'

customElements.define('local-storage', LocalStorage);
customElements.define('countdown-timer', CountdownTimer);
customElements.define('countdown-timer-list', CountdownTimerList);

const dialogAddTimer = document.querySelector('#add-timer');
const dialogEditTimer = document.querySelector('#edit-timer');
const buttonAddTimer = document.querySelector('.button-add-timer');
const buttonEditTimer = document.querySelector('.button-edit-timer');
const buttonHideModals = document.querySelectorAll('.button-hide-modal');
const buttonShowModals = document.querySelectorAll('.button-show-modal');
const inputName = document.querySelector('#name');
const inputEndAt = document.querySelector('#end-at');
const inputEditName = document.querySelector('#edit-name');
const inputEditEndAt = document.querySelector('#edit-end-at');
const inputEditUuid = document.querySelector('#edit-uuid');
const countdownTimerList = document.querySelector('countdown-timer-list');

buttonShowModals.forEach(button => {
  button.addEventListener('click', (e) => {
    document.querySelector(`#${e.target.dataset.modal}`).showModal();
  });
});
buttonHideModals.forEach(button => {
  button.addEventListener('click', (e) => e.target.closest('dialog').close());
});

buttonAddTimer.addEventListener('click', (e) => {
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

  e.target.closest('dialog').close();
});

buttonEditTimer.addEventListener('click', (e) => {
  const name = inputEditName.value;
  const endAt = inputEditEndAt.value;
  const uuid = inputEditUuid.value;

  countdownTimerList.dispatchEvent(new CustomEvent('update', {
    detail: {
      timer: {
        name: name,
        endAt: (new Date(endAt)).toUTCString(),
        uuid: uuid
      }
    }
  }));

  e.target.closest('dialog').close();
});
