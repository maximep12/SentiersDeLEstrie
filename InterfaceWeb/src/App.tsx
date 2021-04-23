import {
  ThemeProvider,
  unstable_createMuiStrictModeTheme,
} from "@material-ui/core/styles";
import React, { useState } from "react";
import "./App.css";
import LastUsedExcel from "./DesktopComponents/LastUsedExcel/LastUsedExcel";
import UpdateAppMap from "./DesktopControllers/UpdateAppMap";
import Header from "./Utils/HeaderSentier";
const theme = unstable_createMuiStrictModeTheme();

function App(): JSX.Element {
  const [isVisible, setIsVisibile] = useState<boolean>(true);

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Header />
        <UpdateAppMap visibilityToggle={setIsVisibile} />
        {isVisible && <LastUsedExcel />}
      </ThemeProvider>
    </div>
  );
}

export default App;
