import * as dateFns from "date-fns";

const install = (app) => {
  app.config.globalProperties.$date = dateFns;
};

export { install as default, dateFns };
