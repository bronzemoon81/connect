export class ValidationErrors {
  errors = {};

  constructor() {
    this.errors = {};
  }

  has(...args) {
    const fields = [];
    for (let i = 0; i < args.length; i++) {
      // eslint-disable-next-line prefer-rest-params
      fields.push(args[i]);
    }

    const errorKeys = Object.keys(this.errors);

    let hasError = false;
    fields.map((o) => {
      errorKeys.map((key) => {
        if (o === key) {
          hasError = true;
        } else {
          const starIndex = o.indexOf("*");
          if (starIndex > -1 && key.indexOf(o.substr(0, starIndex)) > -1) {
            hasError = true;
          }
        }
      });
    });
    return hasError;
  }

  any() {
    return Object.keys(this.errors).length > 0;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  get(...args) {
    const fields = [];
    for (let i = 0; i < args.length; i++) {
      // eslint-disable-next-line prefer-rest-params
      fields.push(args[i]);
    }

    if (fields.length === 0) {
      return this.errors;
    }

    let errors = [];
    fields.map((field) => {
      if (_.has(this.errors, field)) {
        errors = errors.concat(_.get(this.errors, [field], []));
      }
    });
    return errors.length > 0 ? errors : null;
  }

  all() {
    const errors = [];
    _.forEach(this.errors, (fieldErrors) => {
      fieldErrors.map((error) => {
        errors.push(error);
      });
    });
    return errors;
  }

  first(field) {
    if (field === null) {
      return "";
    }
    return _.get(this.errors, [field, 0], "");
  }

  record(errors) {
    this.errors = errors;
  }

  insert(errors) {
    this.errors = { ...this.errors, ...errors };
  }

  clear(field) {
    let errors = _.cloneDeep(this.errors);
    if (field) _.unset(errors, field);
    else errors = {};
    this.errors = errors;
  }
}
