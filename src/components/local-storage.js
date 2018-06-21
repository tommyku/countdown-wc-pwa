class LocalStorage extends HTMLElement {
  constructor() {
    super();

    let store = {};
    const subscriptions = [];
    const storeName = this.getAttribute('store') || 'untitled-store';

    const storeContent = localStorage.getItem(storeName);

    if (storeContent) {
      store = JSON.parse(storeContent);
    }

    this.store = store;
    this.subscriptions = subscriptions;
    this.storeName = storeName;

    this.addEventListener('update', (e) => this.update(e));

    this.addEventListener('subscribe', (e) => this.subscribe(e));
  }

  update(e) {
    this.store = e.detail.data;
    localStorage.setItem(this.storeName, JSON.stringify(this.store));

    this.subscriptions.forEach((callback) => callback(this.store));
  }

  subscribe(e) {
    this.subscriptions.push(e.detail.callback);
    e.detail.callback(this.store);
  }
}

export default LocalStorage;
