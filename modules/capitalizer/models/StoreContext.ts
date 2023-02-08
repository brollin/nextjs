import { createContext } from "react";
import { Store } from "./Store";

// Keep this in its own file so that it is not refreshed upon a next fast refresh
export const StoreContext = createContext<Store>(null);
