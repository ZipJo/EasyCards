import { ScrollView, StyleSheet } from "react-native";
import AddCardDrawer from "./components/AddCardDrawer";
import AddCardFAB from "./components/AddCardFAB";
import Content from "./components/Content";
import TopAppBar from "./components/TopAppBar";
import AppContext from "./contexts/AppContext";
import useAppContext from "./hooks/useAppContext";
import AppLoading from "expo-app-loading";

export default function Main() {
  const appContext = useAppContext();
  if (!appContext) return <AppLoading />;
  return (
    <AppContext.Provider value={appContext}>
      <TopAppBar />
      <ScrollView>
        <Content />
      </ScrollView>
      {appContext.addCardDrawerOpen ? <AddCardDrawer style={styles.drawer} /> : <AddCardFAB style={styles.fab} />}
    </AppContext.Provider>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0
  },
  drawer: {
    position: "absolute",
    padding: 16,
    right: 0,
    bottom: 0,
    left: 0
  }
});
