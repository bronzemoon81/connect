import {
  h,
  ref,
  inject,
  onMounted,
  defineComponent,
  resolveDirective,
  withDirectives,
  computed,
  watch,
} from "vue";
import { useRoute } from "vue-router";
import dom from "@/libs/dom";
import "@/libs/dropdown";

const init = (el, { props, emit }) => {
  const dropdown = tailwind.Dropdown.getOrCreateInstance(el);
  setTimeout(() => {
    const isDropdownShowed = dom(el).find("[data-dropdown-replacer]").length;
    if (props.show && !isDropdownShowed) {
      dropdown.show();
    } else if (!props.show && isDropdownShowed) {
      dropdown.hide();
    }
  });

  if (el["__initiated"] === undefined) {
    el["__initiated"] = true;

    el.addEventListener("show.tw.dropdown", () => {
      emit("show");
    });

    el.addEventListener("shown.tw.dropdown", () => {
      emit("shown");
    });

    el.addEventListener("hide.tw.dropdown", () => {
      emit("hide");
    });

    el.addEventListener("hidden.tw.dropdown", () => {
      emit("hidden");
    });
  }
};

// Dropdown wrapper
const Dropdown = defineComponent({
  name: "Dropdown",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    placement: {
      type: String,
      default: "bottom-end",
    },
    refKey: {
      type: String,
      default: null,
    },
  },
  directives: {
    dropdown: {
      mounted(el, { value }) {
        init(el, value);
      },
      updated(el, { value }) {
        init(el, value);
      },
    },
  },
  setup(props, { slots, attrs, emit }) {
    const route = useRoute();
    const dropdownRef = ref();

    const bindInstance = () => {
      if (props.refKey) {
        const bind = inject(`bind[${props.refKey}]`);
        if (bind) {
          bind(tailwind.Dropdown.getOrCreateInstance(dropdownRef.value));
        }
      }
    };

    onMounted(() => {
      bindInstance();
    });

    // Hide dropdown when route is changed
    watch(
      computed(() => route.path),
      () => {
        tailwind.Dropdown.getOrCreateInstance(dropdownRef.value).hide();
      }
    );

    const dropdownDirective = resolveDirective("dropdown");

    return () =>
      withDirectives(
        h(
          "div",
          {
            class: "dropdown",
            ref: dropdownRef,
            "data-tw-placement": props.placement,
          },
          slots.default({
            dismiss: () => {
              tailwind.Dropdown.getOrCreateInstance(dropdownRef.value).hide();
            },
          })
        ),
        [[dropdownDirective, { props, emit }]]
      );
  },
});

// Dropdown toggle
const DropdownToggle = defineComponent({
  name: "DropdownToggle",
  props: {
    tag: {
      type: String,
      default: "button",
    },
  },
  setup(props, { slots, attrs, emit }) {
    return () =>
      h(
        props.tag,
        {
          class: "dropdown-toggle",
          "aria-expanded": false,
          "data-tw-toggle": "dropdown",
        },
        slots.default()
      );
  },
});

// Dropdown menu
const DropdownMenu = defineComponent({
  name: "DropdownMenu",
  setup(props, { slots, attrs, emit }) {
    return () =>
      h(
        "div",
        {
          class: "dropdown-menu",
        },
        slots.default()
      );
  },
});

// Dropdown content
const DropdownContent = defineComponent({
  name: "DropdownContent",
  props: {
    tag: {
      type: String,
      default: "ul",
    },
  },
  setup(props, { slots, attrs, emit }) {
    return () =>
      h(
        props.tag,
        {
          class: "dropdown-content",
        },
        slots.default()
      );
  },
});

// Dropdown item
const DropdownItem = defineComponent({
  name: "DropdownItem",
  props: {
    tag: {
      type: String,
      default: "button",
    },
    class: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    href: {
      default: null,
    },
  },
  setup(props, { slots, attrs, emit }) {
    return () =>
      h("li", { ...attrs }, [
        h(
          props.tag,
          {
            class: ["dropdown-item cursor-pointer", props.class],
            disabled: props.disabled,
            href: props.href,
            "data-tw-dismiss": ["dropdown"],
          },
          slots.default()
        ),
      ]);
  },
});

// Dropdown header
const DropdownHeader = defineComponent({
  name: "DropdownHeader",
  props: {
    tag: {
      type: String,
      default: "h6",
    },
    class: {
      type: String,
      default: "",
    },
  },
  setup(props, { slots, attrs, emit }) {
    return () =>
      h("li", [
        h(
          props.tag,
          {
            class: ["dropdown-header", props.class],
          },
          slots.default()
        ),
      ]);
  },
});

// Dropdown footer
const DropdownFooter = defineComponent({
  name: "DropdownFooter",
  props: {
    tag: {
      type: String,
      default: "div",
    },
    class: {
      type: String,
      default: "",
    },
  },
  setup(props, { slots, attrs, emit }) {
    return () =>
      h("li", [
        h(
          props.tag,
          {
            class: ["dropdown-footer", props.class],
          },
          slots.default()
        ),
      ]);
  },
});

// Dropdown divider
const DropdownDivider = defineComponent({
  name: "DropdownDivider",
  props: {
    tag: {
      type: String,
      default: "hr",
    },
    class: {
      type: String,
      default: "",
    },
  },
  setup(props, { slots, attrs, emit }) {
    return () =>
      h("li", { class: ["dropdown-divider-li"] }, [
        h(props.tag, {
          class: ["dropdown-divider", props.class],
        }),
      ]);
  },
});

export {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownContent,
  DropdownItem,
  DropdownHeader,
  DropdownFooter,
  DropdownDivider,
};
