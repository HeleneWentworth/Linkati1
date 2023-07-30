

declare module 'react-facebook-login' {
    import { FC } from 'react';
  
    export interface ReactFacebookLoginInfo {
      id: string;
      accessToken: string;
      name: string;
      email?: string;
      picture?: {
        data: {
          url: string;
        };
      };
    }
  
    interface ReactFacebookLoginProps {
      appId: string;
      fields?: string;
      callback?: (response: ReactFacebookLoginInfo) => void;
      onFailure?: (error: any) => void;
      onClick?: () => void;
      render?: (props: { onClick: () => void }) => React.ReactNode;
      isDisabled?: boolean;
      scope?: string;
      returnScopes?: boolean;
      responseType?: string;
      redirectUri?: string;
      autoLoad?: boolean;
      disableMobileRedirect?: boolean;
      reAuthenticate?: boolean;
      authType?: string;
      version?: string;
      cookie?: boolean;
      language?: string;
      debug?: boolean;
      xfbml?: boolean;
      disableFetching?: boolean;
      state?: string;
    }
  
    const FacebookLogin: FC<ReactFacebookLoginProps>;
  
    export default FacebookLogin;
  }
  