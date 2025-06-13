import { Howl } from "howler";
import definite from "@/assets/sounds/definite.mp3";
import error from "@/assets/sounds/error.mp3";
import success from "@/assets/sounds/success.mp3";
import info from "@/assets/sounds/info.mp3";
import point from "@/assets/sounds/point.mp3";
import tweet from "@/assets/sounds/tweet.mp3";
import system from "@/assets/sounds/system.mp3";

const sound = (key, options = {}) => {
  const keys = { definite, error, success, info, point, tweet, system };
  if (!_.get(keys, key)) return;

  const instance = new Howl({
    src: [_.get(keys, key)],
    autoplay: true,
    loop: false,
    volume: 0.5,
    onend: function () {
      instance.unload();
    },
    ...options,
  });
};

const install = (app) => {
  app.config.globalProperties.$sound = sound;
};

export { install as default, sound };
