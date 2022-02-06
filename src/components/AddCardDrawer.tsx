import { useCallback, useContext, useEffect, useState } from "react";
import { Image, Platform, ViewStyle } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import AppContext from "../contexts/AppContext";
import * as ImagePicker from "expo-image-picker";

export default function AddCardDrawer({ style }: { style: ViewStyle }) {
  const { addCard, setAddCardDrawerOpen, cards } = useContext(AppContext);

  const [frontImage, setFrontImage] = useState<string>("");
  const [backImage, setBackImage] = useState<string>("");

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status: statusLib } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        const { status: statusCam } = await ImagePicker.requestCameraPermissionsAsync();
        if (statusCam !== "granted" || statusLib !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

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
  const takeImage = async (side: "front" | "back") => {
    // No permissions request is necessary for launching the image library
    let selectedImage = await ImagePicker.launchCameraAsync({
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
  const addNewCard = useCallback(() => {
    if (frontImage && backImage) {
      console.log(`frontImage`, frontImage);
      console.log(`backImage`, backImage);
      addCard({ uriFront: frontImage, uriBack: backImage, timestamp: new Date() });
      setAddCardDrawerOpen(false);
    } else {
      setWarning("Please choose two images for your Card.");
    }
  }, [frontImage, setWarning, backImage, cards, setAddCardDrawerOpen]);

  return (
    <Card style={style}>
      <Card.Title title="Add a Card" />
      <Card.Content>
        <Button onPress={() => pickImage("front")}>Select front image</Button>
        <Button onPress={() => takeImage("front")}>Take front image</Button>
        {!!frontImage && <Image source={{ uri: frontImage }} style={{ width: 300, height: 200 }} />}
        <Button onPress={() => pickImage("back")}>Select back image</Button>
        <Button onPress={() => takeImage("back")}>Take back image</Button>
        {!!backImage && <Image source={{ uri: backImage }} style={{ width: 300, height: 200 }} />}
        {!!warning && <Text>{warning}</Text>}
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => setAddCardDrawerOpen(false)}>Cancel</Button>
        <Button onPress={() => addNewCard()}>Ok</Button>
      </Card.Actions>
    </Card>
  );
}
