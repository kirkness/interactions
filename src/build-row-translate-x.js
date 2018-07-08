import Animated from "react-native-reanimated";
import { GestureHandler } from "expo";
import { ROW_HEIGHT, SCREEN_WIDTH } from "./constants";

const { State } = GestureHandler;
const {
  Value,
  eq,
  cond,
  set,
  Clock,
  stopClock,
  spring,
  clockRunning,
  startClock,
  greaterThan,
  add,
  multiply,
  greaterOrEq,
  lessOrEq,
  lessThan,
  abs,
  sub,
  debug,
  neq,
  divide
} = Animated;

const ROW_OFFSET = 75;
const ROW_SNAP = 30;

const buildRowTranslateX = ({
  dragX,
  dragState,
  rowIndex,
  velocityX,
  scrollY
}) => {
  const clock = new Clock();

  // Spring animation state
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0)
  };

  // Spring animation config
  const config = {
    damping: 10,
    mass: 0.8,
    stiffness: 70,
    overshootClamping: false,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
    toValue: new Value(0)
  };

  const scrolledFirstRowIndex = divide(scrollY, ROW_HEIGHT);
  const visibleRowIndex = cond(
    lessOrEq(sub(rowIndex, scrolledFirstRowIndex), 0),
    0,
    cond(
      greaterOrEq(sub(rowIndex, scrolledFirstRowIndex), 3),
      3,
      sub(rowIndex, scrolledFirstRowIndex)
    )
  );

  // Drag position relative to previous position in animation (could be toValue or mid aimation)
  const relativeTransX = add(dragX, state.position);
  // Based on position get destination value if drag was to end
  const snapToTransX = debug(
    "[HELLO snapToTransX]",
    cond(
      // If the new drag dist isnt greater than our snap point then snap back to position
      lessOrEq(abs(dragX), ROW_SNAP),
      // Use previous point animated to
      config.toValue,
      cond(
        // If dragging left
        lessThan(dragX, 0),
        sub(config.toValue, SCREEN_WIDTH),
        add(config.toValue, SCREEN_WIDTH)
      )
    )
  );

  // Make sure new destination snap point is not out of bounds
  const safeSnapToTransX = cond(
    greaterOrEq(snapToTransX, 0),
    0,
    cond(
      lessOrEq(snapToTransX, SCREEN_WIDTH * -2),
      SCREEN_WIDTH * -2,
      snapToTransX
    )
  );

  const rowDragX = cond(
    // Get the row's drag position based on the stagger and whether its moving left/right
    lessOrEq(sub(state.position, relativeTransX), 0),
    add(relativeTransX, multiply(multiply(visibleRowIndex, -1), ROW_OFFSET)),
    add(relativeTransX, multiply(abs(visibleRowIndex), ROW_OFFSET))
  );
  const conditionalDragX = cond(
    // If this row should start moving (passed its offset) then move, if not leave.
    greaterThan(abs(dragX), multiply(visibleRowIndex, ROW_OFFSET)),
    rowDragX,
    state.position
  );

  return cond(
    // If is currently dragging accross the screen
    eq(dragState, State.ACTIVE),
    // Assure the clock is stopped (i.e. the one we start below and that
    // snaps the position) and return the drag position (based on conditions)
    [stopClock(clock), conditionalDragX],
    // Otherwise start the clock to spring it either back or to the next snap position
    [
      cond(dragState, [
        cond(
          clockRunning(clock),
          0,
          // If its not already in the destination snap position, set props and start the clock.
          cond(neq(safeSnapToTransX, conditionalDragX), [
            set(state.finished, 0),
            set(state.velocity, velocityX),
            set(state.position, conditionalDragX),
            set(config.toValue, safeSnapToTransX),
            startClock(clock)
          ])
        ),
        // Run spring with new config
        spring(clock, state, config)
      ]),

      // Once finished is truthy (1) then stop the clock.
      cond(state.finished, [stopClock(clock)]),
      // Return newly evaluated posotion
      state.position
    ]
  );
};

export default buildRowTranslateX;
