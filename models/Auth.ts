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
  me?: Me;

  init = async () => {
    try {
      const accessContext = await this.oauth.getAccessToken();
      if (accessContext) await this.authenticate();
    } catch (err) {
      console.error(err);
    }
    if (!this.me) {
      try {
        const hasAuthCode = await this.oauth.isReturningFromAuthServer();
        if (hasAuthCode) await this.authenticate();
      } catch (err) {
        console.error(err);
      }
    }
  };

  login = async () => {
    await this.oauth.fetchAuthorizationCode();
  };

  logout = async () => {
    if (this.me) await this.me.httpClient(`${lichessHost}/api/token`, { method: "DELETE" });
    localStorage.clear();
    this.me = undefined;
  };

  private authenticate = async () => {
    const httpClient = this.oauth.decorateFetchHTTPClient(window.fetch);
    const res = await httpClient(`${lichessHost}/api/account`);
    const me = {
      ...(await res.json()),
      httpClient,
    };
    if (me.error) throw me.error;
    this.me = me;
  };

  fetchBody = async (path: string, config: any = {}) => {
    const res = await this.fetchResponse(path, config);
    const body = await res.json();
    return body;
  };

  private fetchResponse = async (path: string, config: any = {}) => {
    const res = await (this.me?.httpClient || window.fetch)(`${lichessHost}${path}`, config);
    if (res.error || !res.ok) {
      const err = `${res.error} ${res.status} ${res.statusText}`;
      alert(err);
      throw err;
    }
    return res;
  };
}
