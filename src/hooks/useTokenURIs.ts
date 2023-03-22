import { useMemo } from 'react';
import { useContractReads } from 'wagmi';

import GAME_COMPOSABLE_NFT_ABI from '@/abis/GameComposableNFT.json';
import { GAME_COMPOSABLE_NFT_ADDRESS } from '@/constants';

const gameNFTContract = {
  address: GAME_COMPOSABLE_NFT_ADDRESS,
  abi: GAME_COMPOSABLE_NFT_ABI,
};

const useTokenURIs = (ids: number[]) => {
  const contracts = useMemo(() => {
    return ids.map((id) => {
      return {
        ...gameNFTContract,
        functionName: 'tokenURI',
        args: [id],
      };
    });
  }, [ids]);

  const { data, ...rest } = useContractReads({ contracts });

  const mapData = useMemo(() => {
    if (data) {
      return data.map((uri, i) => {
        return {
          tokenId: ids[i],
          uri,
        };
      });
    }

    return [];
  }, [data, ids]);

  return {
    data: mapData,
    ...rest,
  };
};

export default useTokenURIs;
