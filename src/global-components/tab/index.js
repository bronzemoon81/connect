import { h, defineComponent, resolveDirective, withDirectives } from "vue";
import dom from "@/libs/dom";
import "@/libs/tab";

const init = (el, { props, emit }) => {
  const tabPanels = dom(el).find(".tab-content").first();
  const tabPanes = dom(tabPanels).children(".tab-pane");
  const tabList = [];
  const ids = [];

  dom(el)
    .find(".nav")
    .each(function () {
      if (dom(this).closest(".tab-content")[0] !== tabPanels[0]) {
        tabList.push(this);
      }
    });

  tabList.forEach((node) => {
    dom(node)
      .find(".nav-item")
      .each(function (key, el) {
        let id = "_" + Math.random().toString(36).substr(2, 9);
        if (ids[key] !== undefined) {
          id = ids[key];
        } else {
          ids[key] = id;
        }

        dom(this)
          .find(".nav-link")
          .attr({
            "data-tw-target": `#${id}`,
            "aria-controls": id,
            "aria-selected": false,
          });

        if (tabPanes[key] !== undefined) {
          dom(tabPanes[key]).attr({
            id: id,
            "aria-labelledby": `${id}-tab`,
          });
        }

        if (key === props.selectedIndex) {
          const tab = tailwind.Tab.getOrCreateInstance(
            dom(el).find(".nav-link")[0]
          );
          tab.show();
          dom(tabPanes).removeAttr("style");
        }

        const navLink = dom(el).find(".nav-link")[0];
        if (navLink["__initiated"] === undefined) {
          navLink["__initiated"] = true;

          navLink.addEventListener("show.tw.tab", () => {
            emit("change", key);
          });
        }
      });
  });
};

// Tab wrapper
const TabGroup = defineComponent({
  name: "TabGroup",
  props: {
    selectedIndex: {
      type: Number,
      default: 0,
    },
    tag: {
      type: String,
      default: "div",
    },
  },
  directives: {
    tab: {
      mounted(el, { value }) {
        init(el, value);
      },
      updated(el, { value }) {
        init(el, value);
      },
    },
  },
  setup(props, { slots, attrs, emit }) {
    const tabDirective = resolveDirective("tab");
    return () =>
      withDirectives(
        h(props.tag, { class: "nav-container" }, slots.default()),
        [[tabDirective, { props, emit }]]
      );
  },
});

// Tab wrapper
const TabList = defineComponent({
  name: "TabList",
  setup(props, { slots, attrs, emit }) {
    return () =>
      h(
        "ul",
        {
          class: "nav",
          role: "tablist",
        },
        [
          slots.header ? slots.header() : null,
          slots.default(),
          slots.footer ? slots.footer() : null,
        ]
      );
  },
});

const Tab = defineComponent({
  name: "Tab",
  props: {
    fullWidth: {
      type: Boolean,
      default: true,
    },
    tag: {
      type: String,
      default: "a",
    },
    class: {
      type: String,
      default: "",
    },
  },
  setup(props, { slots, attrs, emit }) {
    return () =>
      h(
        "li",
        {
          class: `nav-item`,
          role: "presentation",
        },
        [
          h(
            props.tag,
            {
              class: `nav-link ${props.class}`,
              type: "button",
              role: "tab",
            },
            slots.default()
          ),
        ]
      );
  },
});

const TabPanels = defineComponent({
  name: "TabPanels",
  setup(props, { slots, attrs, emit }) {
    return () =>
      h(
        "div",
        {
          class: "tab-content w-full",
        },
        slots.default()
      );
  },
});

const TabPanel = defineComponent({
  name: "TabPanel",
  render() {
    return h(
      "div",
      {
        class: "tab-pane",
        role: "tabpanel",
      },
      this.visible ? this.$slots.default() : null
    );
  },
  data() {
    return {
      visible: false,
      container: null,
    };
  },
  mounted() {
    this.container = dom(this.$el).closest(".nav-container")[0] || null;
    this.container.addEventListener("tabActiveChanged", this.tabActiveChanged);
  },
  beforeUnmount() {
    if (this.container) {
      this.container.removeEventListener(
        "tabActiveChanged",
        this.tabActiveChanged
      );
    }
  },
  methods: {
    tabActiveChanged({ detail }) {
      this.visible = this.$el.id === _.get(detail, "key");
    },
  },
});

export { TabGroup, TabList, Tab, TabPanels, TabPanel };
