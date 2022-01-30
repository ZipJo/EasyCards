import { useState } from "react";
import { Card } from "react-native-paper";

export default function RenderCard({ front, back }: { front: string; back: string }) {
  const [showBack, setShowBack] = useState(false);
  return (
    <Card onPress={() => setShowBack((current) => !current)}>
      <Card.Cover source={{ uri: showBack ? back : front }} />
    </Card>
  );
}
