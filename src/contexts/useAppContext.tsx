import { useCallback, useEffect, useMemo, useState } from "react";
import { AppContextDto } from "./AppContext";
import { openDatabase, SQLTransaction } from "expo-sqlite";
import { StorageAccessFramework, documentDirectory, copyAsync } from "expo-file-system";

const DBNAME = "easycards.db";

export default function useAppContext(): AppContextDto {
  const [addCardDrawerOpen, setAddCardDrawerOpen] = useState(false);
  const [cards, setCards] = useState<AppContextDto["cards"]>([]);
  const [desc, setDesc] = useState(false);
  const db = useMemo(() => openDatabase(DBNAME), []);
  const fileRoot = useMemo(() => documentDirectory + "images/", []);

  const reverseCards = useCallback(() => {
    setDesc((old) => {
      setCards(cards.sort((a, b) => (!old ? a.id - b.id : b.id - a.id)));
      return !old;
    });
  }, [cards]);

  const setCardsFromDb = useCallback((tx: SQLTransaction) => {
    tx.executeSql(`select * from cards;`, [], (_, { rows: { _array } }: { rows: { _array: AppContextDto["cards"] } }) =>
      setCards(_array.sort((a, b) => (desc ? a.id - b.id : b.id - a.id)))
    );
  }, []);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists cards (id integer primary key not null, uriFront text not null, uriBack text not null, timestamp text not null);"
      );
      setCardsFromDb(tx);
    });
  }, [db, setCardsFromDb]);

  const addCard = useCallback<AppContextDto["addCard"]>(
    async (card) => {
      await copyAsync({
        from: card.uriFront,
        to: fileRoot + card.timestamp.getTime() + "_front.jpeg"
      });
      await copyAsync({
        from: card.uriBack,
        to: fileRoot + card.timestamp.getTime() + "_back.jpeg"
      });

      db.transaction((tx) => {
        tx.executeSql(`insert into cards (uriFront, uriBack, timestamp) values (?,?,?);`, [
          card.uriFront,
          card.uriBack,
          card.timestamp.getTime()
        ]);
        setCardsFromDb(tx);
      });
    },
    [db, setCardsFromDb]
  );

  const removeCard = useCallback<AppContextDto["removeCard"]>(
    (id) => {
      db.transaction((tx) => {
        tx.executeSql("delete from cards where id = ?;", [id]);
        setCardsFromDb(tx);
      });
    },
    [db, setCardsFromDb]
  );

  return {
    addCardDrawerOpen,
    setAddCardDrawerOpen,
    cards,
    addCard,
    removeCard,
    reverseCards
  };
}
