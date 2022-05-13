const reactivity = require('./reactivity');

const {
  effect,
  reactive
} = reactivity;

const person = {
  firstName: 'Lu',
  lastName: 'xun',
  get name() {
    return this.firstName + this.lastName;
  }
}

const proxy = reactive(person);

effect(() => {
  console.log('effect1', proxy.name)
});
effect(() => {
  console.log('effect2', proxy.name)
});

proxy.firstName = 'Zhang';
