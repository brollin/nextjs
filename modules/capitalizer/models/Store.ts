import { createContext } from "react";
import { makeAutoObservable } from "mobx";
import { Country, UnhydratedCountry } from "./Country";
import { doesTextRoughlyMatch, shuffleArray } from "../helpers";

const countryDataRaw: {
  [name: string]: UnhydratedCountry;
} = require("../countryData/countryData.json");

type CameraMode = "follow" | "control";

type AnimationMode = "zoomToCountry" | "countrySpotlight";

export class Store {
  cameraMode: CameraMode = "follow";

  correctCount = 0;
  countryIndex = -1;
  countries: Country[];

  initialized = false;
  animationMode: AnimationMode = "zoomToCountry";

  get previousCountry(): Country | undefined {
    return !this.initialized || this.countryIndex - 1 < 0 ? undefined : this.countries[this.countryIndex - 1];
  }

  get currentCountry(): Country | undefined {
    return !this.initialized || this.countryIndex < 0 ? undefined : this.countries[this.countryIndex];
  }

  constructor() {
    makeAutoObservable(this);
  }

  initializeCountries = () => {
    // logic that should only be performed on the client
    const countries = Object.values(countryDataRaw).map((country) => new Country(country));

    const memberCountries = countries.filter(({ status }) => status === "Member State");
    const nonMemberCountries = countries.filter(({ status }) => status !== "Member State");

    shuffleArray(memberCountries);
    this.countries = [...memberCountries, ...nonMemberCountries];
    this.countryIndex = 0;

    this.initialized = true;
  };

  checkCapital = (potentialAnswer: string): boolean => {
    if (doesTextRoughlyMatch(potentialAnswer, this.currentCountry.capital)) {
      this.countryIndex++;
      this.correctCount++;
      this.animationMode = "zoomToCountry";
      return true;
    }

    return false;
  };

  advanceAfterIncorrect = () => {
    this.countryIndex++;
    this.animationMode = "zoomToCountry";
  };

  toggleCameraMode = () => {
    this.cameraMode = this.cameraMode === "follow" ? "control" : "follow";
  };
}

export const StoreContext = createContext<Store>(null);
