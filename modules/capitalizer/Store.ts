import { observer } from "mobx-react-lite";
import { makeAutoObservable } from "mobx";
// import { countries, capitals } from "./countryCapitalData";
import { shuffleArrays } from "./helpers";

type CameraMode = "follow" | "control";

export class Store {
  countryIndex = -1;
  cameraMode: CameraMode = "follow";

  constructor() {
    makeAutoObservable(this);
  }

  initialize = () => {
    // shuffleArrays(countries, capitals);
    this.countryIndex = 0;
  };

  toggleCameraMode = () => {
    this.cameraMode = this.cameraMode === "follow" ? "control" : "follow";
  };
}
