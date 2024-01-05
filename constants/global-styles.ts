export const COLORS = {
  gray: {
    200: '#EFF1F0',
    400: '#D1D1D1',
    600: '#444447',
    800: '#2E2E2E',
  },
  primary: {
    100: '#E5F7F1',
    200: '#C1EFE0',
    400: '#28EB17',
    600: '#00B935',
    800: '#1C7D2F',
    900: '#26362A',
  },
  secondary: {
    400: '#68DBFF',
  },
  dark: '#19181D',
  light: '#F8FAF9',
};

export const SkeletonCommonProps = {
  transition: {
    type: 'timing',
    duration: 2000,
  },
  colorMode: 'dark',
} as const;
