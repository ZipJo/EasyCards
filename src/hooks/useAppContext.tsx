import { useCallback, useEffect, useMemo, useState } from "react";
import { AppContextDto } from "../contexts/AppContext";
import { openDatabase, SQLTransaction } from "expo-sqlite";
import { documentDirectory, copyAsync, deleteAsync } from "expo-file-system";

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

  const setCardsFromDb = useCallback(
    (tx: SQLTransaction) => {
      tx.executeSql(
        `select * from cards;`,
        [],
        (_, { rows: { _array = [] } }: { rows: { _array: AppContextDto["cards"] } }) =>
          setCards(_array.sort((a, b) => (desc ? a.id - b.id : b.id - a.id)))
      );
    },
    [desc]
  );

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
      try {
        const newFrontUri = fileRoot + card.timestamp.getTime() + "_front.jpeg";
        const newBackUri = fileRoot + card.timestamp.getTime() + "_back.jpeg";
        await Promise.all([
          copyAsync({
            from: card.uriFront,
            to: newFrontUri
          }),
          copyAsync({
            from: card.uriBack,
            to: newBackUri
          })
        ]);
        db.transaction((tx) => {
          tx.executeSql(`insert into cards (uriFront, uriBack, timestamp) values (?,?,?);`, [
            newFrontUri,
            newBackUri,
            card.timestamp.getTime()
          ]);
          setCardsFromDb(tx);
        });
      } catch (error) {
        alert(`error while adding entry: ${error}`);
      }
    },
    [db, fileRoot, setCardsFromDb]
  );

  const editCard = useCallback<AppContextDto["editCard"]>(
    async (card) => {
      try {
        const newFrontUri = fileRoot + card.timestamp.getTime() + "_front.jpeg";
        const newBackUri = fileRoot + card.timestamp.getTime() + "_back.jpeg";
        await Promise.all([
          !card.uriFront.startsWith(fileRoot) &&
            copyAsync({
              from: card.uriFront,
              to: newFrontUri
            }),
          !card.uriBack.startsWith(fileRoot) &&
            copyAsync({
              from: card.uriBack,
              to: newBackUri
            })
        ]);
        db.transaction((tx) => {
          tx.executeSql(`update cards set uriFront = ?, uriBack = ?, timestamp = ? where id = ?;`, [
            !card.uriFront.startsWith(fileRoot) ? newFrontUri : card.uriFront,
            !card.uriBack.startsWith(fileRoot) ? newBackUri : card.uriBack,
            card.timestamp.getTime(),
            card.id
          ]);
          setCardsFromDb(tx);
        });
      } catch (error) {
        alert(`error while updating entry: ${error}`);
      }
    },
    [db, fileRoot, setCardsFromDb]
  );

  const removeCard = useCallback<AppContextDto["removeCard"]>(
    async (card) => {
      try {
        await Promise.all([
          deleteAsync(card.uriFront, { idempotent: false }),
          deleteAsync(card.uriBack, { idempotent: false })
        ]);
        db.transaction((tx) => {
          tx.executeSql("delete from cards where id = ?;", [card.id]);
          setCardsFromDb(tx);
        });
      } catch (error) {
        alert(`error while deleting entry: ${error}`);
      }
    },
    [db, setCardsFromDb]
  );

  return {
    addCardDrawerOpen,
    setAddCardDrawerOpen,
    cards,
    addCard,
    editCard,
    removeCard,
    reverseCards
  };
}
