import React from "react";

export type CardType = {
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
  editCard: (card: CardType) => void;
  removeCard: (card: CardType) => void;
  reverseCards: () => void;
}

export default React.createContext<AppContextDto>({
  addCardDrawerOpen: false,
  setAddCardDrawerOpen: () => undefined,
  cards: [],
  addCard: () => undefined,
  editCard: () => undefined,
  removeCard: () => undefined,
  reverseCards: () => undefined
});
