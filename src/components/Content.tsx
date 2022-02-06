import React, { useContext } from "react";
import { View, Text } from "react-native";
import AppContext from "../contexts/AppContext";
import RenderCard from "./RenderCard";

export default function Content() {
  const { cards } = useContext(AppContext);
  return (
    <View>
      {!cards.length && <Text>This is looking a bit empty, don't you think?</Text>}
      {cards.map(({ id, uriFront, uriBack }) => (
        <RenderCard key={id} front={uriFront} back={uriBack} />
      ))}
    </View>
  );
}
