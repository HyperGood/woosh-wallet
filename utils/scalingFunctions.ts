import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
console.log('width', width);
console.log('height', height);
const baseWidth = 430;
const baseHeight = 942;

export const scale = (size: number) => (width / baseWidth) * size;
export const verticalScale = (size: number) => (height / baseHeight) * size;
export const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;
export const minMaxScale = (minSize: number, maxSize: number) => {
  if (width > 375) {
    return maxSize;
  }
  return minSize;
};
