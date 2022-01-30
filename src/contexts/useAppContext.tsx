import { useState } from "react";
import { AppContextDto } from "./AppContext";

export default function useAppContext(): AppContextDto {
  const [addCardDrawerOpen, setAddCardDrawerOpen] = useState(false);
  const [cards] = useState<AppContextDto["cards"]>([]);

  return {
    addCardDrawerOpen,
    setAddCardDrawerOpen,
    cards
  };
}
