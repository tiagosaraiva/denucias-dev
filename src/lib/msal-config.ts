import { Configuration, LogLevel, PublicClientApplication } from '@azure/msal-browser';

// MSAL configuration
const msalConfig: Configuration = {
  auth: {
    clientId: 'f908b044-ab8b-4ec1-a54a-8a0b0b715969',
    authority: `https://login.microsoftonline.com/f0cf303c-4184-4e61-8678-84de56a635f3`,
    redirectUri: window.location.origin
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false
  },
  system: {
    loggerOptions: {
      loggerCallback: (level: LogLevel, message: string, containsPii: boolean) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            break;
          case LogLevel.Info:
            console.info(message);
            break;
          case LogLevel.Verbose:
            console.debug(message);
            break;
          case LogLevel.Warning:
            console.warn(message);
            break;
        }
      },
      logLevel: LogLevel.Verbose
    }
  }
};

// Authentication request scopes
export const loginRequest = {
  scopes: ['User.Read', 'User.ReadBasic.All']
};

// Initialize MSAL instance
export const msalInstance = new PublicClientApplication(msalConfig);
