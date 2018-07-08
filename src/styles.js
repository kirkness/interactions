import styled from "styled-components";
import { FlatList } from "react-native";
import Animated from "react-native-reanimated";
import createAnimatedComponent from "react-native-reanimated/src/createAnimatedComponent";
import { SCREEN_WIDTH, ROW_HEIGHT } from "./constants";

export const Screen = styled(Animated.View)`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.05);
`;

export const Row = styled(Animated.View)`
  width: ${SCREEN_WIDTH * 3}px;
  justify-content: space-around;
  flex-direction: row;
`;

export const List = styled(createAnimatedComponent(FlatList))`
  flex: 1;
`;

export const Item = styled(Animated.View)`
  height: ${ROW_HEIGHT}px;
  width: ${SCREEN_WIDTH}px;
  padding: 30px 15px;
  position: relative;
  padding-bottom: 0px;
`;

export const Track = styled.View`
  border-radius: 15px;
  background-color: white;
  justify-content: center;
  flex: 1;
  shadow-opacity: 0.08;
  shadow-radius: 8px;
  shadow-color: black;
  shadow-offset: 0px 5px;
  /* Nudge the item left for the record */
  margin-left: 10px;
  padding-left: 100px;
  padding-right: 15px;
`;

export const TrackTitle = styled.Text`
  font-size: 20px;
  font-weight: 500;
`;

export const TrackInfo = styled.Text`
  font-size: 16px;
  font-weight: 300;
  color: #ccc;
`;

export const RecordWrapper = styled(Animated.View)`
  position: absolute;
  top: 15px;
  left: 15px;
`;

export const RecordDisc = styled(Animated.View)`
  background-color: black;
  height: ${ROW_HEIGHT * 0.4}px;
  width: ${ROW_HEIGHT * 0.4}px;
  border-radius: ${ROW_HEIGHT * 0.2}px;
`;

export const RecordCase = styled(Animated.Image)`
  resize-mode: cover;
  height: ${ROW_HEIGHT * 0.4}px;
  width: ${ROW_HEIGHT * 0.4}px;
  border-radius: 5px;
`;

export const RecordCaseWrapper = styled(Animated.View)`
  position: absolute;
  height: ${ROW_HEIGHT * 0.4}px;
  width: ${ROW_HEIGHT * 0.4}px;
  shadow-color: black;
  shadow-offset: 0px 5px;
  border-radius: 8px;
`;
