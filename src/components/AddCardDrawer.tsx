import { useCallback, useContext, useState } from "react";
import { Image, ViewStyle } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import AppContext from "../contexts/AppContext";
import * as ImagePicker from "expo-image-picker";

export default function AddCardDrawer({ style }: { style: ViewStyle }) {
  const { addCardDrawerOpen, setAddCardDrawerOpen, cards } = useContext(AppContext);

  const [frontImage, setFrontImage] = useState<string>("");
  const [backImage, setBackImage] = useState<string>("");

  const pickImage = async (side: "front" | "back") => {
    // No permissions request is necessary for launching the image library
    let selectedImage = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [3, 2],
      quality: 0.8
    });

    if (!selectedImage.cancelled) {
      if (side === "front") setFrontImage(selectedImage.uri);
      if (side === "back") setBackImage(selectedImage.uri);
    }
  };
  const [warning, setWarning] = useState("");
  const addCard = useCallback(() => {
    if (frontImage && backImage) {
      cards.push({ uriFront: frontImage, uriBack: backImage, timestamp: new Date() });
      setAddCardDrawerOpen(false);
    } else {
      setWarning("Please choose two images for your Card.");
    }
  }, [frontImage, setWarning, backImage, cards, setAddCardDrawerOpen]);

  return (
    <Card style={style}>
      <Card.Title title="Add a Card" />
      <Card.Content>
        <Button onPress={() => pickImage("front")}>Pick front</Button>
        {!!frontImage && <Image source={{ uri: frontImage }} style={{ width: 200, height: 200 }} />}
        <Button onPress={() => pickImage("back")}>Pick back</Button>
        {!!backImage && <Image source={{ uri: backImage }} style={{ width: 200, height: 200 }} />}
        {!!warning && <Text>{warning}</Text>}
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => setAddCardDrawerOpen(false)}>Cancel</Button>
        <Button onPress={() => addCard()}>Ok</Button>
      </Card.Actions>
    </Card>
  );
}
