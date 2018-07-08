import Animated from "react-native-reanimated";
import { range, map } from "lodash/fp";
import { SCREEN_WIDTH } from "./constants";

const { interpolate } = Animated;
const radians = degrees => (degrees * Math.PI) / 180;

// Rotation
const ACTIVE_ROTATION = 0;
const INACTIVE_RIGHT_ROTATION = 75;
const INACTIVE_LEFT_ROTATION = -1 * INACTIVE_RIGHT_ROTATION;

// Rotation perspective
const ACTIVE_PERSPECTIVE = -600;
const INACTIVE_PERSPECTIVE = -300;

// Scaling
const ACTIVE_SCALE = 1;
const INACTIVE_SCALE = 0.45;

const INDEX_ROTATIONS = [
  // Box 0
  [
    radians(INACTIVE_RIGHT_ROTATION),
    radians(INACTIVE_RIGHT_ROTATION),
    radians(ACTIVE_ROTATION)
  ],
  // Box 1
  [
    radians(INACTIVE_RIGHT_ROTATION),
    radians(ACTIVE_ROTATION),
    radians(INACTIVE_LEFT_ROTATION)
  ],
  // Box 2
  [
    radians(ACTIVE_ROTATION),
    radians(INACTIVE_LEFT_ROTATION),
    radians(ACTIVE_ROTATION)
  ]
];

const INDEX_PERSPECTIVES = [
  // Box 0
  [INACTIVE_PERSPECTIVE, INACTIVE_PERSPECTIVE, ACTIVE_PERSPECTIVE],
  // Box 1
  [INACTIVE_PERSPECTIVE, ACTIVE_PERSPECTIVE, INACTIVE_PERSPECTIVE],
  // Box 2
  [ACTIVE_PERSPECTIVE, INACTIVE_PERSPECTIVE, INACTIVE_PERSPECTIVE]
];

const INDEX_SCALE = [
  // Box 0
  [INACTIVE_SCALE, INACTIVE_SCALE, ACTIVE_SCALE],
  // Box 1
  [INACTIVE_SCALE, ACTIVE_SCALE, INACTIVE_SCALE],
  // Box 2
  [ACTIVE_SCALE, INACTIVE_SCALE, INACTIVE_SCALE]
];

/**
 * Builds the rows animated nodes based on the current translate X.
 */

const buildRowRotations = transX =>
  map(
    boxIndex => ({
      perspective: interpolate(transX, {
        extrapolate: "clamp",
        inputRange: [-SCREEN_WIDTH * 2, -SCREEN_WIDTH, 0],
        outputRange: INDEX_PERSPECTIVES[boxIndex]
      }),
      rotateY: interpolate(transX, {
        extrapolate: "clamp",
        inputRange: [-SCREEN_WIDTH * 2, -SCREEN_WIDTH, 0],
        outputRange: INDEX_ROTATIONS[boxIndex]
      }),
      scale: interpolate(transX, {
        extrapolate: "clamp",
        inputRange: [-SCREEN_WIDTH * 2, -SCREEN_WIDTH, 0],
        outputRange: INDEX_SCALE[boxIndex]
      })
    }),
    range(0, 3)
  );

export default buildRowRotations;
