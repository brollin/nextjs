import { createContext } from "react";

import Store from "@/modules/capitalizer/models/Store";

// Keep this in its own file so that it is not refreshed upon a next fast refresh
const StoreContext = createContext<Store>(new Store());

export default StoreContext;
