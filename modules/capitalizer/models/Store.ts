import { makeAutoObservable } from "mobx";

import Country, { DehydratedCountry } from "@/modules/capitalizer/models/Country";
import { doesTextRoughlyMatch, shuffleArray } from "@/modules/capitalizer/helpers";
import { Continent } from "@/modules/capitalizer/models/RawCountry";
import { computeCameraDelta } from "@/modules/capitalizer/cameraHelpers";
// TODO: use clamp in more places
import { clamp } from "three/src/math/MathUtils";

const dehydratedCountryData: {
  [name: string]: DehydratedCountry;
} = require("../countryData/countryData.json");

const DEBUG_COUNTRY = "";

type CameraMode = "follow" | "control-start" | "control";

type AnimationMode = "zoomToCountry" | "countrySpotlight";

type GameMode = "learn" | "quiz";

export type ContinentSelection = Continent | "All continents";

export default class Store {
  animationMode: AnimationMode = "zoomToCountry";
  cameraMode: CameraMode = "follow";
  gameMode: GameMode = "learn";
  continentSelection: ContinentSelection = "All continents";
  gridEnabled = false;
  initialized = false;

  correctCount = 0;
  countryIndex = -1;
  countries: Country[] = [];
  countriesByName: Record<string, Country> = {};

  /**
   * A percentage describing the cameras current zoom level. 0 is all the way zoomed in, 1 is all
   * the way zoomed out.
   *
   * @type {number}
   * @memberof Store
   */
  private _cameraZoom: number = 0.03;

  get cameraZoom(): number {
    return this._cameraZoom;
  }

  set cameraZoom(newZoom: number) {
    this._cameraZoom = clamp(newZoom, 0, 1);
    this._cameraDelta = computeCameraDelta(this._cameraZoom);
  }

  /**
   * The additional distance away that the camera should be placed based on the current cameraZoom.
   *
   * @readonly
   * @type {number}
   * @memberof Store
   */
  private _cameraDelta: number = computeCameraDelta(this._cameraZoom);

  get cameraDelta(): number {
    return this._cameraDelta;
  }

  previousCountry: Country | undefined;

  get currentCountry(): Country | undefined {
    return !this.initialized || this.countryIndex < 0 ? undefined : this.countries[this.countryIndex];
  }

  constructor() {
    makeAutoObservable(this);
  }

  initializeCountries = () => {
    // logic that should only be performed on the client
    const countries = Object.values(dehydratedCountryData).map(
      (country) => (this.countriesByName[country.name] = new Country(country))
    );

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
      this.advance();
      this.correctCount++;
      return true;
    }

    return false;
  };

  advanceAfterIncorrect = () => {
    this.advance();
  };

  advance = (countryName?: string) => {
    this.previousCountry = this.currentCountry;

    if (countryName && this.countriesByName[countryName]) {
      this.countryIndex = this.countries.indexOf(this.countriesByName[countryName]);
      return;
    }

    if (this.continentSelection === "All continents") {
      this.countryIndex++;
      if (this.countryIndex >= this.countries.length) this.countryIndex = 0;
      return;
    }

    let newIndex = this.countryIndex + 1;
    if (newIndex >= this.countries.length) newIndex = 0;
    while (
      this.countries[newIndex].continent !== this.continentSelection ||
      this.countries[newIndex].status !== "Member State"
    ) {
      newIndex++;
      if (newIndex >= this.countries.length) newIndex = 0;
    }
    this.countryIndex = newIndex;
  };

  toggleCameraMode = () => {
    this.cameraMode = this.cameraMode === "follow" ? "control-start" : "follow";
  };

  toggleGameMode = () => {
    this.gameMode = this.gameMode === "quiz" ? "learn" : "quiz";
  };
}
