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

export const darkTheme = {
  name: 'dark',
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

export const redTheme = {
  name: 'dark',
  COLORS: {
    GREY: { ...GREYS },
    WHITE: '#FFFFFF',
    BLACK: '#000000',
    PRIMARY: 'red',
    INFO: '#4788ff',
    DANGER: '#ff3a3a',
    SUCCESS: '#8db36b',
    WARNING: '#ffa02b',
  },
};
