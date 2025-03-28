export default defineAppConfig({
  ui: {
    colors: {
      primary: "orange",
      neutral: "zinc",
    },
    button: {
      defaultVariants: {
        size: "lg",
      },
    },
    input: {
      slots: {
        root: "relative flex items-center",
      },
      defaultVariants: {
        size: "lg",
      },
    },
    inputNumber: {
      slots: {
        root: "relative flex items-center",
      },
      defaultVariants: {
        size: "lg",
      },
    },
    textarea: {
      slots: {
        root: "relative flex items-center",
      },
      defaultVariants: {
        size: "lg",
      },
    },
    selectMenu: {
      defaultVariants: {
        size: "lg",
      },
      slots: {
        base: "flex w-full",
      },
    },
  },
});
