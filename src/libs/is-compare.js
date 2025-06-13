export function IsCompare(x, y) {
  let p;

  // remember that NaN === NaN returns false
  // and isNaN(undefined) returns true
  if (isNaN(x) && isNaN(y) && typeof x === "number" && typeof y === "number") {
    return true;
  }

  // Compare primitives and functions.
  // Check if both arguments link to the same object.
  // Especially useful on the step where we compare prototypes
  if (x === y) {
    return true;
  }

  // Works in case when functions are created in constructor.
  // Comparing dates is a common scenario. Another built-ins?
  // We can even handle functions passed across iframes
  if (
    (typeof x === "function" && typeof y === "function") ||
    (x instanceof Date && y instanceof Date) ||
    (x instanceof RegExp && y instanceof RegExp) ||
    (x instanceof String && y instanceof String) ||
    (x instanceof Number && y instanceof Number)
  ) {
    return x.toString() === y.toString();
  }

  // At last checking prototypes as good as we can
  if (!(x instanceof Object && y instanceof Object)) {
    return false;
  }

  // eslint-disable-next-line no-prototype-builtins
  if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
    return false;
  }

  if (x.constructor !== y.constructor) {
    return false;
  }

  if (x.prototype !== y.prototype) {
    return false;
  }

  // Quick checking of one object being a subset of another.
  // todo: cache the structure of arguments[0] for performance
  for (p in y) {
    if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
      return false;
    }

    let yValue = _.cloneDeep(y[p]);
    let xValue = _.cloneDeep(x[p]);

    if (yValue === "") yValue = null;
    if (xValue === "") xValue = null;

    if (typeof yValue !== typeof xValue) {
      return false;
    }
  }

  for (p in x) {
    if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
      return false;
    }

    let yValue = _.cloneDeep(y[p]);
    let xValue = _.cloneDeep(x[p]);

    if (yValue === "") yValue = null;
    if (xValue === "") xValue = null;

    if (typeof yValue !== typeof xValue) {
      return false;
    }

    switch (typeof xValue) {
      case "object":
      case "function":
        if (!IsCompare(xValue, yValue)) {
          return false;
        }
        break;

      default:
        if (xValue !== yValue) {
          return false;
        }
        break;
    }
  }

  return true;
}
