import { StyleSheet, Image } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

export default function App() {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);

  const pressed = useSharedValue(false);

  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);

  const savedOffsetX = useSharedValue(0);
  const savedOffsetY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      pressed.value = true;
    })
    .onUpdate((event) => {
      offsetX.value = savedOffsetX.value + event.translationX;
      offsetY.value = savedOffsetY.value + event.translationY;
    })
    .onFinalize(() => {
      savedOffsetX.value = offsetX.value;
      savedOffsetY.value = offsetY.value;
      pressed.value = false;
    });

  const pinchGesture = Gesture.Pinch()
    .onBegin((e) => {
      // console.log(e.focalX, e.focalY);
      if (e.numberOfPointers == 2) {
        focalX.value = e.focalX;
        focalY.value = e.focalY;
      }
    })
    .onUpdate((e) => {
      // focalX.value = e.focalX;
      // focalY.value = e.focalY;
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const doubleTapGesture = Gesture.Tap()
    .maxDuration(100)
    .numberOfTaps(2)
    .onStart(() => {
      savedOffsetX.value = withTiming(0);
      savedOffsetX.value = withTiming(0);
      savedScale.value = withTiming(1);
      if (scale.value == 1) scale.value = withTiming(4);
      else scale.value = withTiming(1);
      offsetX.value = withTiming(0);
      offsetY.value = withTiming(0);
    });

  const composed = Gesture.Simultaneous(
    panGesture,
    pinchGesture,
    doubleTapGesture
  );

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      // { translateX: focalX.value },
      // { translateY: focalY.value },
      // { translateX: -100 },
      // { translateY: -150 },
      { scale: scale.value },
      // { translateX: -focalX.value },
      // { translateY: -focalY.value },
      // { translateX: 100 },
      // { translateY: 150 },
      { translateX: offsetX.value / scale.value },
      { translateY: offsetY.value / scale.value },
    ],
    backgroundColor: pressed.value ? "#FFE04B" : "#b58df1",
  }));

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={composed}>
        <Animated.View style={[styles.box, animatedStyles]}>
          <Image
            style={styles.image}
            source={{
              uri: "https://images.unsplash.com/photo-1629740067905-bd3f515aa739",
            }}
          />
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    backgroundColor: "yellow",
  },
  box: {
    backgroundColor: "#b58df1",
    marginBottom: 30,
    padding: 10,
  },
  image: {
    height: 300,
    width: 200,
  },
});
