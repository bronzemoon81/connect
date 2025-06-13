import _ from "lodash";

window._ = _;
const install = (app) => {
  app.config.globalProperties.$_ = _;
};

export { install as default };
