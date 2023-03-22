import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';
import axios from 'axios';

import useTokenURIs from './useTokenURIs';

export interface ModuleDataResult {
  name: string;
  size: number;
  trait_type: string;
  type: string;
  uri: string;
  description?: string;
}

interface NftDataResult {
  description: string;
  external_url: string;
  image: string;
  name: string;
  attributes: ModuleDataResult[];
  spike_info: {
    type: string;
    version: string;
    url: string;
  };
}

const getNftData = async (uri: string): Promise<NftDataResult> => {
  const { data } = await axios.get(
    `${uri}?pinataGatewayToken=${process.env.NEXT_PUBLIC_PINATA_GATEWAY_TOKEN}`,
  );

  return data;
};

const useNftData = (ids: number[]) => {
  const { data: tokenURIs } = useTokenURIs(ids);

  const uris = useMemo(() => {
    if (tokenURIs) {
      return tokenURIs;
    }
    return [];
  }, [tokenURIs]) as { tokenId: number; uri: string }[];

  const queries = useMemo(() => {
    return uris.map((uri) => {
      return {
        queryKey: ['nftData', uri.tokenId],
        queryFn: async () => {
          const data = await getNftData(uri.uri);

          return {
            tokenId: uri.tokenId,
            ...data,
          };
        },
      };
    });
  }, [uris]);

  return useQueries({ queries });
};

export default useNftData;
