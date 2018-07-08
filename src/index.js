// @flow
import React from "react";
import { GestureHandler } from "expo";
import Reanimated from "react-native-reanimated";
import buildRowTranslateX from "./build-row-translate-x";
import buildRowRotations from "./build-row-rotations";
import buildRecordTranslations from "./build-record-translations";
import playlists from "./data";
import formatData from "./format-data";
import {
  Screen,
  Row,
  Item,
  List,
  Track,
  TrackTitle,
  TrackInfo,
  RecordWrapper,
  RecordDisc,
  RecordCase,
  RecordCaseWrapper
} from "./styles";

const { PanGestureHandler, State } = GestureHandler;
const playlistGrid = formatData(playlists);

class MusicApp extends React.Component {
  // eslint-disable-next-line
  dragState = new Reanimated.Value(State.UNDETERMINED);
  scrollState = new Reanimated.Value(State.UNDETERMINED);
  dragX = new Reanimated.Value(0);
  velocityX = new Reanimated.Value(0);
  scrollY = new Reanimated.Value(0);

  handleGestureEvent = Reanimated.event([
    {
      nativeEvent: {
        translationX: this.dragX,
        state: this.dragState,
        velocityX: this.velocityX
      }
    }
  ]);

  handleScroll = Reanimated.event([
    {
      nativeEvent: {
        // HACK: Because `dragState` does not seem to set its self back to UNDETERMINED
        // when the interaction has ended we get a jitter as we scroll as the rows
        // thinks the user is still dragging. So here we just set the dragState to
        // null when scrolling.
        someNullProp: this.dragState,
        contentOffset: { y: this.scrollY }
      }
    }
  ]);

  rowInteractionValues = playlistGrid.map((row, index) => {
    const transX = buildRowTranslateX({
      rowIndex: index,
      dragState: this.dragState,
      velocityX: this.velocityX,
      dragX: this.dragX,
      scrollY: this.scrollY,
      scrollState: this.scrollState
    });
    return {
      tracks: row,
      styles: {
        rotations: buildRowRotations(transX),
        transX
      },
      record: buildRecordTranslations({
        scrollY: this.scrollY,
        rowIndex: index
      })
    };
  });

  render() {
    return (
      <PanGestureHandler
        maxPointers={1}
        onGestureEvent={this.handleGestureEvent}
        onHandlerStateChange={this.handleGestureEvent}
      >
        <Screen>
          <List
            onScroll={this.handleScroll}
            scrollEventThrottle={1000 / 60}
            data={this.rowInteractionValues}
            keyExtractor={(item, index) => `${index}`}
            renderItem={({ item: row }) => (
              <Row style={[{ transform: [{ translateX: row.styles.transX }] }]}>
                {row.styles.rotations.map((rotation, boxIndex) => (
                  <Item
                    // eslint-disable-next-line react/no-array-index-key
                    key={`${boxIndex}`}
                    style={[
                      {
                        transform: [
                          { perspective: rotation.perspective },
                          { scale: rotation.scale },
                          { rotateY: rotation.rotateY }
                        ]
                      }
                    ]}
                  >
                    <Track>
                      <TrackTitle>{row.tracks[boxIndex].title}</TrackTitle>
                      <TrackInfo>Some random text can go here</TrackInfo>
                    </Track>
                    <RecordWrapper
                      style={{
                        transform: [
                          { scale: row.record.recordScale },
                          { translateX: row.record.recordTraslateX },
                          { translateY: row.record.recordTraslateY }
                        ]
                      }}
                    >
                      <RecordDisc
                        style={{
                          transform: [
                            {
                              translateX: row.record.diskTranslateX
                            }
                          ]
                        }}
                      />

                      <RecordCaseWrapper
                        style={{
                          shadowOpacity: row.record.recordShadowOpacity
                        }}
                      >
                        <RecordCase source={row.tracks[boxIndex].image} />
                      </RecordCaseWrapper>
                    </RecordWrapper>
                  </Item>
                ))}
              </Row>
            )}
          />
        </Screen>
      </PanGestureHandler>
    );
  }
}

export default MusicApp;
