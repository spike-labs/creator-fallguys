import type { CompletePrivateRouteInfo } from 'next/dist/shared/lib/router/router';
import type { Router } from 'next/dist/client/router';
import type { NextPage } from 'next';
import type { NextComponentType } from 'next/dist/shared/lib/utils';
import type { ComponentType } from 'react';

declare module 'next/app' {
  export declare type AppProps = Pick<
    CompletePrivateRouteInfo,
    'Component' | 'err'
  > & {
    router: Router;
  } & Record<string, any> & {
      Component: {
        getLayout?: (page: JSX.Element) => JSX.Element;
        layout?: ComponentType;
      };
    };
}

declare module 'next' {
  export declare type NextPageWithLayout<
    P = Record<string, unknown>,
    IP = P,
  > = NextPage<P, IP> & {
    getLayout?: (component: NextComponentType) => JSX.Element;
    layout?: NextComponentType;
  };
}
