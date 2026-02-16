import { Dimensions, PixelRatio } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');


const [shortDimension, longDimension] = SCREEN_WIDTH < SCREEN_HEIGHT ? [SCREEN_WIDTH, SCREEN_HEIGHT] : [SCREEN_HEIGHT, SCREEN_WIDTH];

const guideLineBaseWidth = 375;
const guideLineBaseHeight = 812;

export const scale = (size) => {
    return Math.round(PixelRatio.roundToNearestPixel(shortDimension / guideLineBaseWidth) * size);
}

export const verticalScale = (size) => {
    return Math.round(PixelRatio.roundToNearestPixel(longDimension / guideLineBaseHeight) * size);
}