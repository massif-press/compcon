export const usePrintOptions = {
  methods: {
    hasPilotOption(this: any, title: string): boolean {
      return this.options.pilotInclude.some((x: any) => x.title === title);
    },
    hasMechOption(this: any, title: string): boolean {
      return this.options.mechInclude.some((x: any) => x.title === title);
    },
  },
};
