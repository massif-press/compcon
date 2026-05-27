import { NavStore } from '@/stores';

export const srdViewMixin = {
  inheritAttrs: false,
  props: {
    title: {
      type: String,
    },
    content: {
      type: Array,
      default: () => [],
    },
    preScroll: {
      type: String,
      default: '',
    },
  },
  mounted(this: any) {
    if (this.preScroll) {
      this.scrollTo(this.preScroll);
    } else window.scrollTo({ top: 0 });
  },
  computed: {
    lang(this: any) {
      return NavStore().Language;
    },
  },
  methods: {
    getLangItem(this: any, item: any, type: string) {
      if (typeof item === 'string') return item;
      return item[type][this.lang] ? item[type][this.lang] : item[type].en;
    },
    scrollTo(this: any, item: any): void {
      const title = this.getLangItem(item, 'title');
      const el = document.getElementById(`e_${title.replace(/\W/g, '')}`);
      if (el) {
        const yOffset = -60;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    },
  },
};
