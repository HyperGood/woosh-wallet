export const COLORS = {
  gray: {
    400: '#EBEBEB',
    600: '#444447',
    800: '#2C2C2E',
  },
  primary: {
    200: '#DDF5E3',
    400: '#1EE51E',
    600: '#17CE4A',
  },
  secondary: {
    400: '#EBEBEB',
  },
  dark: '#0B100C',
  light: '#F4F5F3',
  white: '#FFFFFF',
};

export const SkeletonCommonProps = {
  transition: {
    type: 'timing',
    duration: 2000,
  },
  colorMode: 'dark',
} as const;
