import { saveJson } from "../../common/helpers";
import { CountryLoader } from "./CountryLoader";

const countryLoader = new CountryLoader();
saveJson("./modules/capitalizer/countryData/countryData.json", countryLoader.countryBoundary);
