import { Appbar } from "react-native-paper";
import { StatusBar, StyleSheet } from "react-native";
import { useContext } from "react";
import AppContext from "../contexts/AppContext";

const TopAppBar = () => {
  const { reverseCards } = useContext(AppContext);
  return (
    <>
      <StatusBar backgroundColor="transparent" barStyle="light-content" translucent />
      <Appbar.Header dark style={{ justifyContent: "flex-end" }}>
        <Appbar.Action icon="sort" onPress={() => reverseCards()} />
      </Appbar.Header>
    </>
  );
};

export default TopAppBar;
