import { useContext } from "react";
import { View, Text } from "react-native";
import AppContext from "../contexts/AppContext";
import RenderCard from "./RenderCard";

export default function Content() {
  const { cards } = useContext(AppContext);
  return (
    <View style={{ paddingVertical: 8 }}>
      {!cards.length && <Text>This is looking a bit empty, don&apos;t you think?</Text>}
      {cards.map((card, idx) => (
        <RenderCard key={idx} card={card} />
      ))}
      <RenderCard
        card={{
          uriBack: "https://i.imgur.com/4PdKa5T.jpeg",
          uriFront:
            "https://www.npmjs.com/npm-avatar/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdmF0YXJVUkwiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci9iZTU4ZDUyMmY0ZDc4ODZlOWZlOTAzMWMwNzcwMDlhOD9zaXplPTEwMCZkZWZhdWx0PXJldHJvIn0.o1neQs0JvalqS3y8bU106o1VWMp163zH8pdP8MGX98g",
          timestamp: new Date(),
          id: 987789
        }}
      />
    </View>
  );
}
