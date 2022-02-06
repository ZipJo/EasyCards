import React from "react";

type CardType = {
  id: number;
  uriFront: string;
  uriBack: string;
  timestamp: Date;
};

export interface AppContextDto {
  addCardDrawerOpen: boolean;
  setAddCardDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  cards: CardType[];
  addCard: (card: Omit<CardType, "id">) => void;
  removeCard: (id: CardType["id"]) => void;
  reverseCards: () => void;
}

export default React.createContext<AppContextDto>({
  addCardDrawerOpen: false,
  setAddCardDrawerOpen: () => {},
  cards: [],
  addCard: () => {},
  removeCard: () => {},
  reverseCards: () => {}
});
