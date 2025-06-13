import Toastify from "toastify-js";
import { sound } from "@/utils/properties/sound";

export function ToastNotify(options) {
  Toastify({
    duration: 10000,
    close: true,
    gravity: "bottom",
    position: "right",
    stopOnFocus: true,
    ...options,
    text: options.text || "Bildirim Mesajı Yok!",
  }).showToast();

  if (_.get(options, "sound", false)) {
    sound(_.get(options, "className"));
  }
}
