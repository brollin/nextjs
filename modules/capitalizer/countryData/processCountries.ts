import { saveJson } from "../../common/helpers";
import { CountryProcessor } from "./CountryLoader";

const countryLoader = new CountryProcessor();
saveJson("./modules/capitalizer/countryData/countryData.json", countryLoader.countryData);
