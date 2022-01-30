import { useContext } from "react";
import { ImageStyle } from "react-native";
import { FAB } from "react-native-paper";
import AppContext from "../contexts/AppContext";

export default function AddCardFAB({ style }: { style: ImageStyle }) {
  const { setAddCardDrawerOpen } = useContext(AppContext);
  return <FAB style={style} icon="plus" onPress={() => setAddCardDrawerOpen(true)} />;
}
