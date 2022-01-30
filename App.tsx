import Main from "./src/Main";
import { DarkTheme, Provider as PaperProvider } from "react-native-paper";

export default function App() {
  return (
    <PaperProvider theme={DarkTheme}>
      <Main />
    </PaperProvider>
  );
}
