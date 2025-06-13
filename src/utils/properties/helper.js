import { dateFns } from "@/utils/properties/date-fns";
import md5 from "blueimp-md5";
import _ from "lodash";
import { serverDatabase } from "@/utils/properties/server-database";
import { localDatabase } from "@/utils/properties/local-database";

const helpers = {
  md5(value) {
    return md5(value);
  },
  parseDate(date) {
    if (!date) return null;
    if (_.isNumber(date)) date = new Date(date);
    else if (_.isString(date)) {
      if (/^\d{4}[-]\d{2}[-]\d{2}$/.test(date)) {
        date = dateFns.parse(date, "yyyy-MM-dd", new Date());
      } else if (/^\d{4}[-]\d{2}[-]\d{2}[ ]\d{2}[:]\d{2}$/.test(date)) {
        date = dateFns.parse(date, "yyyy-MM-dd HH:mm", new Date());
      } else if (/^\d{4}[-]\d{2}[-]\d{2}[ ]\d{2}[:]\d{2}[:]\d{2}$/.test(date)) {
        date = dateFns.parse(date, "yyyy-MM-dd HH:mm:ss", new Date());
      } else {
        date = new Date(date);
      }
    }
    if (date instanceof Date) return date;
    return null;
  },
  formatDate(date, format = "dd.MM.yyyy HH:mm") {
    if (!date) return "";
    date = helpers.parseDate(date);
    try {
      return dateFns.format(date, format);
    } catch (e) {}
  },
  diffTimeByNow(time) {
    const startDate = new Date();
    const endDate = helpers.parseDate(time * 1000);

    return helpers.millisecondToDay(
      Math.floor((endDate ? endDate.getTime() : 0) - startDate.getTime()),
      "0"
    );
  },
  millisecondToDay(milliseconds, prefix = "") {
    let days = Math.floor(milliseconds / 86400000);
    let hours = Math.floor((milliseconds % 86400000) / 3600000);
    let minutes = Math.floor(((milliseconds % 86400000) % 3600000) / 60000);
    let seconds = Math.floor(
      (((milliseconds % 86400000) % 3600000) % 60000) / 1000
    );
    let ms = Math.floor((((milliseconds % 86400000) % 3600000) % 60000) % 1000);

    if (days <= 0) days = 0;
    if (hours <= 0) hours = 0;
    if (minutes <= 0) minutes = 0;
    if (seconds <= 0) seconds = 0;
    if (ms <= 0) ms = 0;

    if (days.toString().length < 2) days = `${prefix}${days}`;
    if (hours.toString().length < 2) hours = `${prefix}${hours}`;
    if (minutes.toString().length < 2) minutes = `${prefix}${minutes}`;
    if (seconds.toString().length < 2) seconds = `${prefix}${seconds}`;
    if (ms.toString().length < 2) ms = `${prefix}${ms}`;

    return {
      days,
      hours,
      minutes,
      seconds,
      milliseconds: ms,
      toString: () => {
        if (!milliseconds) return "";

        const str = [];
        if (days !== `${prefix}0`) str.push(`${days} Gün`);
        if (hours !== `${prefix}0`) str.push(`${hours} Saat`);
        str.push(`${minutes} Dakika`);
        str.push(`${seconds} Saniye`);
        return str.join(" ");
      },
      millisecondToString: () => {
        if (!milliseconds) return "";

        const str = [];
        if (minutes !== `${prefix}0`) str.push(`${minutes} dk`);
        if (seconds !== `${prefix}0`) str.push(`${seconds} sn`);
        if (ms !== `${prefix}0`) str.push(`${ms} ms`);
        return str.join(" ");
      },
    };
  },
  formatNameSurname(data) {
    const arr = [];

    const title = _.get(data, "title", "");
    const salutation = _.get(data, "salutation", "");
    const name = _.get(data, "name", _.get(data, "name_surname", ""));
    const surname = _.get(data, "surname", "");

    if (title && _.isString(title) && title.length < 10) arr.push(title);
    else if (salutation) arr.push(salutation);

    if (name) arr.push(name);
    if (surname) arr.push(surname);

    return helpers.capitalizeEachWords(arr.join(" "));
  },
  capitalizeFirstLetter(string) {
    if (string === null || string === undefined) return "";
    return helpers.upperCase(string.charAt(0)) + string.slice(1);
  },
  capitalizeEachWords(string) {
    if (string === null || string === undefined) return "";
    return string.replace(/(^|\s)\S/g, (l) => helpers.upperCase(l));
  },
  upperCase(string) {
    if (string === null || string === undefined) return "";
    const letters = {
      i: "İ",
      ş: "Ş",
      ğ: "Ğ",
      ü: "Ü",
      ö: "Ö",
      ç: "Ç",
      ı: "I",
    };
    const newString = string.replace(/(([iışğüçö]))+/g, function (letter) {
      return _.get(letters, letter, "");
    });
    return newString.toUpperCase();
  },
  lowerCase(string) {
    if (string === null || string === undefined) return "";
    const letters = {
      İ: "i",
      I: "ı",
      Ş: "ş",
      Ğ: "ğ",
      Ü: "ü",
      Ö: "ö",
      Ç: "ç",
    };
    const newString = string.replace(/(([İIŞĞÜÇÖ]))+/g, function (letter) {
      return _.get(letters, letter, "");
    });
    return newString.toLowerCase();
  },
  slug(string) {
    if (string === null || string === undefined) return "";
    let newString = _.clone(string);
    const trMap = {
      çÇ: "c",
      ğĞ: "g",
      şŞ: "s",
      üÜ: "u",
      ıİ: "i",
      öÖ: "o",
    };
    for (let key in trMap) {
      newString = newString.replace(
        new RegExp("[" + key + "]", "g"),
        trMap[key]
      );
    }
    return newString
      .replace(/[^-a-zA-Z0-9\s]+/gi, "") // remove non-alphanumeric chars
      .replace(/\s/gi, "-") // convert spaces to dashes
      .replace(/[-]+/gi, "-") // trim repeated dashes
      .toLowerCase();
  },
  round(number, digits = 2) {
    try {
      if (!number) return 0;
      let decimal = 1;
      for (let i = 0; i < digits; i += 1) {
        decimal *= 10;
      }
      const value = Math.round(number * decimal) / decimal;
      return _.isNaN(value) ? 0 : value;
    } catch (e) {
      return 0;
    }
  },
  countDecimals(value) {
    if (Math.floor(value * 1) === value * 1) return 0;
    return value.toString().split(".")[1].length || 0;
  },
  toRGB(colors) {
    const tempColors = Object.assign({}, colors);
    const rgbColors = Object.entries(tempColors);
    for (const [key, value] of rgbColors) {
      if (typeof value === "string") {
        if (value.replace("#", "").length == 6) {
          const aRgbHex = value.replace("#", "").match(/.{1,2}/g);
          tempColors[key] = (opacity = 1) =>
            `rgb(${parseInt(aRgbHex[0], 16)} ${parseInt(
              aRgbHex[1],
              16
            )} ${parseInt(aRgbHex[2], 16)} / ${opacity})`;
        }
      } else {
        tempColors[key] = helpers.toRGB(value);
      }
    }
    return tempColors;
  },
  base64Encode(str) {
    return window.btoa(unescape(encodeURIComponent(str)));
  },
  base64Decode(str) {
    return decodeURIComponent(escape(window.atob(str)));
  },
  uuid() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  },
  onNextFocus({ target }) {
    const container = dom(target).closest("#content-container, .modal");
    // button:not(.dismiss-select):not(.vs__clear):not(:disabled):not([role='tab'])
    const inputs = container.find(
      "input:not([type='radio']):not([type='checkbox']):not(:disabled), select:not(:disabled)"
    );
    let found = false;
    inputs.each((i, e) => {
      if (e === target) found = true;
      else if (found) {
        if (
          e &&
          e.tabIndex !== -1 &&
          _.cloneDeep(dom(e).closest(".dismiss-select")).length === 0
        ) {
          found = false;
          e.focus();
        }
      }
    });
  },
  combineFields(data, fields = [], separator = " / ") {
    const values = [];
    fields.map((key) => {
      if (_.get(data, key)) values.push(_.get(data, key));
    });
    return values.join(separator);
  },
  generateRandomPassword(length = 10) {
    const group = [
      "0123456789",
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
      "!@#$%&*",
    ];
    let password = "";
    for (let i = 0; i <= length; i++) {
      const index = Math.floor(Math.random() * 3);
      const chars = _.get(group, index) || "";
      const randomNumber = Math.floor(Math.random() * chars.length);
      password += chars.substring(randomNumber, randomNumber + 1);
    }
    return password;
  },
  invertColor(hex, bw = true) {
    let { r, g, b } = helpers.hexToRGB(hex);
    if (bw) {
      // http://stackoverflow.com/a/3943023/112731
      return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? "#000000" : "#FFFFFF";
    }
    // invert color components
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    // pad each with zeros and return
    return "#" + helpers.padZero(r) + helpers.padZero(g) + helpers.padZero(b);
  },
  hexToRGB(hex) {
    if (typeof hex !== "string") return "#000000";

    if (hex.indexOf("#") === 0) {
      hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
      return "#000000";
    }
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
    };
  },
  padZero(str, len = 2) {
    len = len || 2;
    const zeros = new Array(len).join("0");
    return (zeros + str).slice(-len);
  },
  isset(value) {
    return value !== undefined && value !== null && value !== "";
  },
  copyToClipboard(text) {
    const clipboardData = window.clipboardData || navigator.clipboard;
    if (clipboardData && typeof clipboardData.writeText === "function") {
      clipboardData.writeText(text);
    }
  },
  async sqlReplaceParameters(
    query,
    { perpage = null, page = null, date = null }
  ) {
    const str = (query || "").toString();
    const offset =
      helpers.isset(perpage) && helpers.isset(page)
        ? perpage * (page - 1)
        : null;

    let categoryCodes = "";

    if (str.indexOf('"@categories"') > -1) {
      const categories = await localDatabase().categories.get({
        select: ["code"],
      });
      categoryCodes = _.map(categories, "code").join(",");
    }

    return str
      .replace(/"@offset"/g, (offset || "0").toString())
      .replace(/"@perpage"/g, (perpage || "0").toString())
      .replace(/"@page"/g, (page || "0").toString())
      .replace(/"@categories"/g, `'${categoryCodes}'`)
      .replace(/"@date"/g, `'${(date || "").toString()}'`)
      .trim();
  },
  async sleep(ms) {
    return new Promise((res) => setTimeout(res, ms));
  },
};

const install = (app) => {
  app.config.globalProperties.$h = helpers;
};

export { install as default, helpers as helper };
