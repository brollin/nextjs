import { OAuth2AuthCodePKCE } from "@bity/oauth2-auth-code-pkce";
import { Me } from "./Me";
import { CLIENT_ID, LICHESS_HOST, REDIRECT_PATH } from "./constants";

export class Auth {
  oauth = new OAuth2AuthCodePKCE({
    authorizationUrl: `${LICHESS_HOST}/oauth`,
    tokenUrl: `${LICHESS_HOST}/api/token`,
    clientId: CLIENT_ID,
    scopes: ["board:play"],
    redirectUrl: `${window.location.protocol}//${location.host}${REDIRECT_PATH}`,
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

  private authenticate = async (setMe: (me: Me) => void) => {
    const httpClient = this.oauth.decorateFetchHTTPClient(window.fetch);
    const res = await httpClient(`${LICHESS_HOST}/api/account`);
    const { id, username, perfs, error } = await res.json();
    if (error) throw error;

    setMe(new Me(id, username, perfs, httpClient));
  };
}
