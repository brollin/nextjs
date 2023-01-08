import { HttpClient } from "@bity/oauth2-auth-code-pkce";
import { LICHESS_HOST } from "./constants";

export class Me {
  constructor(
    readonly id: string,
    readonly username: string,
    readonly perfs: { [key: string]: any },
    readonly httpClient: HttpClient // with pre-set Authorization header
  ) {}

  logout = async () => {
    await this.httpClient(`${LICHESS_HOST}/api/token`, { method: "DELETE" });
    localStorage.clear();
  };

  fetchBody = async (path: string, config: any = {}) => {
    const res = await this.fetchResponse(path, config);
    const body = await res.json();
    return body;
  };

  private fetchResponse = async (path: string, config: any = {}) => {
    const res = await (this.httpClient || window.fetch)(`${LICHESS_HOST}${path}`, config);
    if (res.error || !res.ok) {
      const err = `${res.error} ${res.status} ${res.statusText}`;
      alert(err);
      throw err;
    }
    return res;
  };
}
