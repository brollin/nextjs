import { HttpClient, OAuth2AuthCodePKCE } from "@bity/oauth2-auth-code-pkce";

export const lichessHost = "https://lichess.org";

export interface Me {
  id: string;
  username: string;
  httpClient: HttpClient; // with pre-set Authorization header
  perfs: { [key: string]: any };
}

export class Auth {
  oauth = new OAuth2AuthCodePKCE({
    authorizationUrl: `${lichessHost}/oauth`,
    tokenUrl: `${lichessHost}/api/token`,
    clientId: "brollin-lichess-demo",
    scopes: ["board:play"],
    redirectUrl: `${window.location.protocol}//${location.host}/chess`,
    onAccessTokenExpiry: (refreshAccessToken) => refreshAccessToken(),
    onInvalidGrant: console.warn,
  });

  init = async (setMe: (me: Me) => void) => {
    try {
      const accessContext = await this.oauth.getAccessToken();
      if (accessContext) await this.authenticate(setMe);
    } catch (err) {
      console.error(err);
    }

    try {
      const hasAuthCode = await this.oauth.isReturningFromAuthServer();
      if (hasAuthCode) await this.authenticate(setMe);
    } catch (err) {
      console.error(err);
    }

    // remove the state and code from the query parameters
    window.history.replaceState(null, null, window.location.pathname);
  };

  login = async () => {
    await this.oauth.fetchAuthorizationCode();
  };

  logout = async (me: Me) => {
    await me.httpClient(`${lichessHost}/api/token`, { method: "DELETE" });
    localStorage.clear();
  };

  private authenticate = async (setMe: (me: Me) => void) => {
    const httpClient = this.oauth.decorateFetchHTTPClient(window.fetch);
    const res = await httpClient(`${lichessHost}/api/account`);
    const me = {
      ...(await res.json()),
      httpClient,
    };
    if (me.error) throw me.error;
    setMe(me);
  };

  fetchBody = async (me: Me, path: string, config: any = {}) => {
    const res = await this.fetchResponse(me, path, config);
    const body = await res.json();
    return body;
  };

  private fetchResponse = async (me: Me, path: string, config: any = {}) => {
    const res = await (me.httpClient || window.fetch)(`${lichessHost}${path}`, config);
    if (res.error || !res.ok) {
      const err = `${res.error} ${res.status} ${res.statusText}`;
      alert(err);
      throw err;
    }
    return res;
  };
}
