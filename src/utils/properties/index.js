import lodash from "./lodash";
import helper from "./helper";
import colors from "./colors";
import dateFns from "./date-fns";
import sound from "./sound";
import bugsnag from "./bugsnag";
import localDatabase from "./local-database";
import serverDatabase from "./server-database";

export default (app) => {
  app.use(lodash);
  app.use(helper);
  app.use(colors);
  app.use(dateFns);
  app.use(sound);
  app.use(localDatabase);
  app.use(serverDatabase);
  if (bugsnag) app.use(bugsnag.getPlugin("vue"));
};
