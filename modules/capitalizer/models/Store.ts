import { makeAutoObservable } from "mobx";

import Country, { UnhydratedCountry } from "@/modules/capitalizer/models/Country";
import { doesTextRoughlyMatch, shuffleArray } from "@/modules/capitalizer/helpers";

const countryDataRaw: {
  [name: string]: UnhydratedCountry;
} = require("../countryData/countryData.json");

const DEBUG_COUNTRY = "";

type CameraMode = "follow" | "control-start" | "control";

type AnimationMode = "zoomToCountry" | "countrySpotlight";

export default class Store {
  animationMode: AnimationMode = "zoomToCountry";
  cameraMode: CameraMode = "follow";

  correctCount = 0;
  countryIndex = -1;
  countries: Country[] = [];

  initialized = false;

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

    if (DEBUG_COUNTRY) {
      this.countryIndex = this.countries.findIndex((country) => country.name === DEBUG_COUNTRY);
      console.log("Debugging country:", DEBUG_COUNTRY);
      console.log(this.countries[this.countryIndex]);
    } else {
      this.countryIndex = 0;
    }

    this.initialized = true;
  };

  checkCapital = (potentialAnswer: string): boolean => {
    if (doesTextRoughlyMatch(potentialAnswer, this.currentCountry!.capital)) {
      this.countryIndex++;
      this.correctCount++;
      return true;
    }

    return false;
  };

  advanceAfterIncorrect = () => {
    this.countryIndex++;
  };

  toggleCameraMode = () => {
    this.cameraMode = this.cameraMode === "follow" ? "control-start" : "follow";
  };
}
