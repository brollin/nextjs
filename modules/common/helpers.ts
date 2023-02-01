import fs from "fs";

export const saveJson = (filename: string, data: any) => fs.writeFileSync(filename, JSON.stringify(data));
