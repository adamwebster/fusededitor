// Grey colors from here https://www.w3schools.com/colors/colors_shades.asp

const GREYS = {
  50: '#F8F8F8',
  100: '#E0E0E0',
  150: '#D0D0D0',
  200: '#B0B0B0',
  250: '#909090',
  300: '#787878',
  350: '#686868',
  400: '#505050',
  450: '#404040',
  500: '#303030',
  550: '#202020',
  600: '#101010',
};

const GREYS_REVERSED = {
  600: '#F8F8F8',
  550: '#E0E0E0',
  500: '#D0D0D0',
  450: '#B0B0B0',
  400: '#909090',
  350: '#787878',
  300: '#686868',
  250: '#505050',
  200: '#404040',
  150: '#303030',
  100: '#202020',
  50: '#101010',
};

export const darkTheme = {
  name: 'dark',
  colorName: 'default',
  COLORS: {
    GREY: { ...GREYS },
    WHITE: '#FFFFFF',
    BLACK: '#000000',
    PRIMARY: '#81d0ff',
    INFO: '#4788ff',
    DANGER: '#ff3a3a',
    SUCCESS: '#8db36b',
    WARNING: '#ffa02b',
  },
};

export const redThemeDark = {
  name: 'dark',
  colorName: 'red',
  COLORS: {
    GREY: { ...GREYS },
    WHITE: '#FFFFFF',
    BLACK: '#000000',
    PRIMARY: '#ff6d6d',
    INFO: '#4788ff',
    DANGER: '#ff3a3a',
    SUCCESS: '#8db36b',
    WARNING: '#ffa02b',
  },
};

export const redThemeLight = {
  name: 'light',
  colorName: 'red',
  COLORS: {
    GREY: { ...GREYS_REVERSED },
    WHITE: '#FFFFFF',
    BLACK: '#000000',
    PRIMARY: '#b90000',
    INFO: '#4788ff',
    DANGER: '#ff3a3a',
    SUCCESS: '#8db36b',
    WARNING: '#ffa02b',
  },
};

export const lightTheme = {
  name: 'light',
  colorName: 'default',
  COLORS: {
    GREY: { ...GREYS_REVERSED },
    WHITE: '#FFFFFF',
    BLACK: '#000000',
    PRIMARY: '#005181',
    INFO: '#4788ff',
    DANGER: '#ff3a3a',
    SUCCESS: '#8db36b',
    WARNING: '#ffa02b',
  },
};
