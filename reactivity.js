let activeEffect = undefined;
const targetMap = new WeakMap();

const effect = function (fn) {
  activeEffect = fn;

  fn();

  activeEffect = undefined;
}

const track = function (target, key) {
  // Only track what caused by calling `effect` directly.
  // trigger 回放 dep 函数会导致再次执行 get，此时不应该 track
  if (!activeEffect) {
    return;
  }

  const dep = targetMap.get(target) || new Map();
  const funcs = dep.get(key) || new Set();
  funcs.add(activeEffect);
  dep.set(key, funcs);
  targetMap.set(target, dep);
}

const trigger = function (target, key) {
  const dep = targetMap.get(target);
  if (dep && dep.get(key)) {
    dep.get(key).forEach(fn => fn());
  }
}

const reactive = function (target) {
  return new Proxy(target, {
    get(target, key, reciever) {
      track(target, key);
      
      return Reflect.get(target, key, reciever);
    },
    set(target, key, value, reciever) {
      Reflect.set(target, key, value, reciever);
      trigger(target, key);
    }
  });
}

module.exports = {
  track,
  effect,
  trigger,
  reactive
}
