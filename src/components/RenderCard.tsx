import { useContext, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import { Card, IconButton, DarkTheme, useTheme } from "react-native-paper";
import AppContext, { CardType } from "../contexts/AppContext";

export default function RenderCard({ card }: { card: CardType }) {
  const { colors } = useTheme();
  const { removeCard } = useContext(AppContext);
  const [, setShowBack] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const fadeFront = useRef(new Animated.Value(1)).current;
  const fadeBack = useRef(new Animated.Value(0)).current;

  const fadeCard = () => {
    console.log("fade");

    setShowBack((current) => {
      console.log("current", current);

      Animated.timing(fadeFront, {
        toValue: current ? 0 : 1,
        duration: 200,
        useNativeDriver: false
      });
      Animated.timing(fadeBack, {
        toValue: current ? 1 : 0,
        duration: 200,
        useNativeDriver: false
      });
      return !current;
    });
  };

  return (
    <Pressable onLongPress={() => !showDelete && setShowDelete(true)} onPress={() => !showDelete && fadeCard()}>
      <Card elevation={2} style={styles.card}>
        <Animated.View style={[styles.cover, { opacity: fadeFront }]}>
          <Card.Cover style={styles.cover} source={{ uri: card.uriFront }} />
        </Animated.View>
        <Animated.View style={[styles.cover, { opacity: fadeBack }]}>
          <Card.Cover style={styles.cover} source={{ uri: card.uriBack }} />
        </Animated.View>
        {showDelete && (
          <View style={styles.remove}>
            <IconButton
              size={48}
              style={styles.trash}
              icon="trash-can-outline"
              color={colors.error}
              onPress={() => removeCard(card)}
            />
            <IconButton
              size={32}
              style={styles.close}
              icon="close"
              onPress={() => setShowDelete(false)}
              color={colors.primary}
            />
          </View>
        )}
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    overflow: "hidden",
    marginVertical: 8,
    borderRadius: 16,
    position: "relative",
    aspectRatio: 3 / 2
  },
  cover: {
    position: "absolute",
    height: "100%",
    width: "100%"
  },
  remove: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: DarkTheme.colors.backdrop
  },
  trash: {},
  close: {
    position: "absolute",
    top: 0,
    right: 0,
    margin: 8
  }
});
