import Bugsnag from "@bugsnag/js";
import BugsnagPluginVue from "@bugsnag/plugin-vue";

let bugsnag = null;

if (import.meta.env.VITE_APP_BUGSNAG_KEY) {
  bugsnag = Bugsnag.start({
    apiKey: import.meta.env.VITE_APP_BUGSNAG_KEY,
    plugins: [new BugsnagPluginVue()],
    onError: function (event) {
      if (event.app.releaseStage === "development") {
        console.debug(event.errors[0]); // or whatever is of interest about the event
        return false; // discard the error
      }
      // const authStore = useAuthStore();
      // const profile = authStore.profile;
      // if (profile) {
      //   event.setUser(
      //     _.get(profile, "id"),
      //     _.get(profile, "email"),
      //     _.get(profile, "name")
      //   );
      // }
    },
  });
}

export default bugsnag;
