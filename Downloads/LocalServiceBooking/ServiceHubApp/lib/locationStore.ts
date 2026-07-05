type Listener = (address: string) => void;

let _address = '';
let _listeners: Listener[] = [];

export const locationStore = {
  setAddress(addr: string) {
    _address = addr;
    _listeners.forEach((l) => l(addr));
  },
  getAddress() {
    return _address;
  },
  subscribe(listener: Listener) {
    _listeners.push(listener);
    return () => {
      _listeners = _listeners.filter((l) => l !== listener);
    };
  },
};
