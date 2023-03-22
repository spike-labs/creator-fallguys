import { useContractRead, useContractWrite } from 'wagmi';
import { BigNumber } from 'ethers';
import axios from 'axios';
import { utils } from 'ethers';

import GAME_COMPOSABLE_NFT_ABI from '@/abis/GameComposableNFT.json';
import { GAME_COMPOSABLE_NFT_ADDRESS } from '@/constants';
import { type ModuleDataResult } from './useNftData';

export interface GameNftMetadata {
  name: string;
  description: string;
  image: string;
  external_url: string;
  spike_info: {
    version: string;
    type: string;
    url: string;
  };
  attributes: ModuleDataResult[];
}

interface MintProps {
  gameNftMetadata: GameNftMetadata;
  mintRoyaltyFee: string;
  marketRoyaltyFraction: number;
  newUsageFee: string;
}

const pinJSONToIPFS = async (gameNftMetadata: GameNftMetadata) => {
  const metadata = JSON.stringify(gameNftMetadata);

  const config = {
    method: 'post',
    url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
    },
    data: metadata,
  };

  const { data } = await axios(config);

  return data;
};

const useNftMint = (gameTemplateId: number) => {
  const { data: tokenMintRoyaltyInfo } = useContractRead({
    address: GAME_COMPOSABLE_NFT_ADDRESS,
    abi: GAME_COMPOSABLE_NFT_ABI,
    functionName: 'tokenMintRoyaltyInfo',
    args: [gameTemplateId],
  });

  const { write, ...rest } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: GAME_COMPOSABLE_NFT_ADDRESS,
    abi: GAME_COMPOSABLE_NFT_ABI,
    functionName: 'mint',
  });

  const mint = async ({
    gameNftMetadata,
    mintRoyaltyFee,
    marketRoyaltyFraction,
    newUsageFee,
  }: MintProps) => {
    if (!gameNftMetadata) {
      return;
    }

    const { IpfsHash } = await pinJSONToIPFS(gameNftMetadata);
    const tokenUri = `https://oasis.mypinata.cloud/ipfs/${IpfsHash}`;
    const fee = (tokenMintRoyaltyInfo as [`0x${string}`, BigNumber])[1];

    const mintRoyaltyFeeWei = utils.parseEther(mintRoyaltyFee).toString();
    const newUsageFeeWei = utils.parseEther(newUsageFee).toString();

    write({
      recklesslySetUnpreparedArgs: [
        tokenUri,
        gameTemplateId,
        mintRoyaltyFeeWei,
        marketRoyaltyFraction,
        newUsageFeeWei,
      ],
      recklesslySetUnpreparedOverrides: {
        value: fee,
      },
    });
  };

  return {
    mint,
    contractWriteResult: rest,
  };
};

export default useNftMint;
