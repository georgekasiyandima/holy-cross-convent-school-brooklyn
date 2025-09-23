// Facebook SDK TypeScript declarations
declare global {
  interface Window {
    FB?: {
      XFBML: {
        parse: () => void;
      };
      init: (params: any) => void;
      api: (path: string, method: string, params: any, callback: (response: any) => void) => void;
    };
  }
}

export {}; 