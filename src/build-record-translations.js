import Animated from "react-native-reanimated";
import { ROW_HEIGHT } from "./constants";

const { interpolate, sub } = Animated;

const buildRecordTranslations = ({ rowIndex, scrollY }) => {
  const halfHeight = ROW_HEIGHT / 2;
  const rowDistanceFromTop = halfHeight * rowIndex;
  const diskMovePoint = rowDistanceFromTop + halfHeight;
  const rowCaseSchrinkPoint = rowDistanceFromTop - ROW_HEIGHT;
  return {
    diskTranslateX: interpolate(sub(scrollY, rowDistanceFromTop), {
      extrapolate: "clamp",
      inputRange: [rowCaseSchrinkPoint, diskMovePoint],
      outputRange: [20, 0]
    }),
    recordScale: interpolate(sub(scrollY, rowDistanceFromTop), {
      extrapolate: "clamp",
      inputRange: [rowCaseSchrinkPoint, rowDistanceFromTop],
      outputRange: [1, 0.7]
    }),
    recordShadowOpacity: interpolate(sub(scrollY, rowDistanceFromTop), {
      extrapolate: "clamp",
      inputRange: [rowCaseSchrinkPoint, rowDistanceFromTop],
      outputRange: [0.3, 0.03]
    }),
    recordTraslateX: interpolate(sub(scrollY, rowDistanceFromTop), {
      extrapolate: "clamp",
      inputRange: [rowCaseSchrinkPoint, rowDistanceFromTop],
      outputRange: [0, 20]
    }),
    recordTraslateY: interpolate(sub(scrollY, rowDistanceFromTop), {
      extrapolate: "clamp",
      inputRange: [rowCaseSchrinkPoint, rowDistanceFromTop],
      outputRange: [0, 20]
    })
  };
};

export default buildRecordTranslations;
