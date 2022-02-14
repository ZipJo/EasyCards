import { forwardRef, useCallback, useContext, useEffect, useImperativeHandle, useState } from "react";
import { Image, Platform, ViewStyle, Text, StyleSheet } from "react-native";
import { Button, Card, DarkTheme } from "react-native-paper";
import AppContext, { CardType } from "../contexts/AppContext";
import {
  requestMediaLibraryPermissionsAsync,
  requestCameraPermissionsAsync,
  launchImageLibraryAsync,
  launchCameraAsync
} from "expo-image-picker";

const AddCardDrawer = forwardRef(({ style }: { style: ViewStyle }, ref) => {
  const { editCard, addCard, setAddCardDrawerOpen } = useContext(AppContext);

  const [frontImage, setFrontImage] = useState<string>("");
  const [backImage, setBackImage] = useState<string>("");
  const [isEdit, setIsEdit] = useState(false);
  const [cardId, setCardId] = useState<number | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      setCard: (card: CardType) => {
        setFrontImage(card.uriFront);
        setBackImage(card.uriBack);
        setCardId(card.id);
        setIsEdit(true);
      }
    }),
    []
  );

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status: statusLib } = await requestMediaLibraryPermissionsAsync();
        const { status: statusCam } = await requestCameraPermissionsAsync();
        if (statusCam !== "granted" || statusLib !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const pickImage = async (side: "front" | "back") => {
    const selectedImage = await launchImageLibraryAsync({
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
    const selectedImage = await launchCameraAsync({
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
      addCard({ uriFront: frontImage, uriBack: backImage, timestamp: new Date() });
      setAddCardDrawerOpen(false);
    } else {
      setWarning("Please choose two images for your Card.");
    }
  }, [frontImage, backImage, addCard, setAddCardDrawerOpen]);

  const updateCard = useCallback(() => {
    if (frontImage && backImage) {
      editCard({ id: cardId || 0, uriFront: frontImage, uriBack: backImage, timestamp: new Date() });
      setAddCardDrawerOpen(false);
    } else {
      setWarning("Please choose two images for your Card.");
    }
  }, [frontImage, backImage, editCard, cardId, setAddCardDrawerOpen]);

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
        {!!warning && <Text style={styles.warning}>{warning}</Text>}
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => setAddCardDrawerOpen(false)}>Cancel</Button>
        <Button onPress={() => (isEdit ? updateCard() : addNewCard())}>Ok</Button>
      </Card.Actions>
    </Card>
  );
});

AddCardDrawer.displayName = "AddCardDrawer";

export default AddCardDrawer;

const styles = StyleSheet.create({
  warning: {
    color: DarkTheme.colors.error
  }
});
