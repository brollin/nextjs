import { useState, useContext, useEffect } from "react";
import { Checkbox, Divider, Heading, Select, VStack } from "@chakra-ui/react";
import { action } from "mobx";
import { observer } from "mobx-react-lite";

import StoreContext from "@/modules/capitalizer/models/StoreContext";
import LearnView from "@/modules/capitalizer/components/LearnView";
import QuizView from "@/modules/capitalizer/components/QuizView";
import { ContinentSelection } from "@/modules/capitalizer/models/Store";

const UserInterface = observer(() => {
  const store = useContext(StoreContext);
  const [isPanelOpen, setPanelOpen] = useState(false);
  const [, setHasOpened] = useState(false); // currently not using

  useEffect(() => {
    const handleKeypress = action((e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") store.advance();
    });
    document.addEventListener("keydown", handleKeypress);
  }, [store]);

  const togglePanel = () => {
    setPanelOpen(!isPanelOpen);
    setHasOpened(true);
  };

  // wrap as a mobx action so that it creates a transaction of two underlying actions
  const handleContinentChange = action((newContinentSelection: ContinentSelection) => {
    store.continentSelection = newContinentSelection;
    store.advance();
  });

  return (
    <>
      {isPanelOpen ? (
        <>
          <Heading size="md" textAlign="center">
            Options
          </Heading>
          <VStack marginBottom={2} width="100%" alignItems="self-start">
            <Checkbox isChecked={store.gameMode === "quiz"} onChange={store.toggleGameMode}>
              Quiz mode
            </Checkbox>
            <Select iconSize="50" onChange={(e) => handleContinentChange(e.target.value as ContinentSelection)}>
              {["All continents", "Africa", "Americas", "Asia", "Europe", "Oceania"].map((continent) => (
                <option value={continent} key={continent}>
                  {continent}
                </option>
              ))}
            </Select>
          </VStack>
          <Divider marginTop={2} marginBottom={3} />
        </>
      ) : null}
      {store.gameMode === "quiz" ? (
        <QuizView isPanelOpen={isPanelOpen} togglePanel={togglePanel} />
      ) : (
        <LearnView isPanelOpen={isPanelOpen} togglePanel={togglePanel} />
      )}
    </>
  );
});

export default UserInterface;
