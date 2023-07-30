declare global {
    interface Window {
      FB: {
        init: (options: any) => void;
        AppEvents: {
          logPageView: () => void;
        };
        getLoginStatus: (callback: (response: any) => void) => void;
      };
    }
  }
  
  export {};
  