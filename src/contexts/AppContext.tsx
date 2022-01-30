import React from "react";

type CardType = {
  uriFront: string;
  uriBack: string;
  timestamp: Date;
};

export interface AppContextDto {
  addCardDrawerOpen: boolean;
  setAddCardDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  cards: CardType[];
}

export default React.createContext<AppContextDto>({
  addCardDrawerOpen: false,
  setAddCardDrawerOpen: () => {},
  cards: []
});
