import LucideIcons from "./lucide";
import * as Icons from "./icons";

import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownContent,
  DropdownItem,
  DropdownHeader,
  DropdownFooter,
  DropdownDivider,
} from "./dropdown";

import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "./tab";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "./modal";

import LoadingIcon from "./loading-icon/Main.vue";
import Tippy from "./tippy/Main.vue";
import FormButton from "./form-elements/button/Main.vue";
import FormInputContainer from "./form-elements/input-container/Main.vue";
import FormInput from "./form-elements/input/Main.vue";
import FormSelect from "./form-elements/select/Main.vue";
import FormCheckbox from "./form-elements/checkbox/Main.vue";
import FormTextarea from "./form-elements/textarea/Main.vue";
import FormDatetimePicker from "./form-elements/datetime-picker/Main.vue";
import FormCheckPassword from "./form-elements/check-password/Main.vue";
import FormSelectOrNot from "./form-elements/select-or-not/Main.vue";
import FormNativeDatepicker from "./form-elements/native-date-picker/Main.vue";
import SimplePagination from "./simple-pagination/Main.vue";
import TableList from "./table/Main.vue";
import TableHead from "./table-head/Main.vue";
import WaitingTransaction from "./waiting-transaction/Main.vue";
import Clipboard from "./clipboard/Main.vue";

export default (app) => {
  for (const [key, icon] of Object.entries(LucideIcons)) {
    app.component(key, icon);
  }

  for (const [key, icon] of Object.entries(Icons)) {
    app.component(key, icon);
  }

  app.component("LoadingIcon", LoadingIcon);

  app.component("Dropdown", Dropdown);
  app.component("DropdownToggle", DropdownToggle);
  app.component("DropdownMenu", DropdownMenu);
  app.component("DropdownContent", DropdownContent);
  app.component("DropdownItem", DropdownItem);
  app.component("DropdownHeader", DropdownHeader);
  app.component("DropdownFooter", DropdownFooter);
  app.component("DropdownDivider", DropdownDivider);

  app.component("TabGroup", TabGroup);
  app.component("TabList", TabList);
  app.component("Tab", Tab);
  app.component("TabPanels", TabPanels);
  app.component("TabPanel", TabPanel);

  app.component("Modal", Modal);
  app.component("ModalHeader", ModalHeader);
  app.component("ModalBody", ModalBody);
  app.component("ModalFooter", ModalFooter);

  app.component("Tippy", Tippy);
  app.component("FormButton", FormButton);
  app.component("FormInputContainer", FormInputContainer);
  app.component("FormInput", FormInput);
  app.component("FormSelect", FormSelect);
  app.component("FormCheckbox", FormCheckbox);
  app.component("FormTextarea", FormTextarea);
  app.component("FormDatetimePicker", FormDatetimePicker);
  app.component("FormCheckPassword", FormCheckPassword);
  app.component("FormSelectOrNot", FormSelectOrNot);
  app.component("FormNativeDatepicker", FormNativeDatepicker);
  app.component("TableList", TableList);
  app.component("TableHead", TableHead);
  app.component("WaitingTransaction", WaitingTransaction);
  app.component("SimplePagination", SimplePagination);
  app.component("Clipboard", Clipboard);
};
