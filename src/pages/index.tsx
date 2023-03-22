import Head from 'next/head';
import { useContractRead, useAccount } from 'wagmi';
import { useMemo } from 'react';
import {
  Flex,
  Box,
  Text,
  Grid,
  Breadcrumb,
  BreadcrumbItem,
  Image,
} from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { ChevronRightIcon } from '@chakra-ui/icons';
import clsx from 'clsx';

import { DefaultLayout } from '@/layouts';
import GAME_COMPOSABLE_NFT_ABI from '@/abis/GameComposableNFT.json';
import { GAME_COMPOSABLE_NFT_ADDRESS } from '@/constants';
import { useNftData } from '@/hooks';
import { ModuleCard } from '@/components';

const PageHeader = () => {
  return (
    <Flex
      as="header"
      width="full"
      align="center"
      pos="sticky"
      top={0}
      py={10}
      zIndex="1"
      bg={'white'}
    >
      <Breadcrumb
        spacing="8px"
        separator={<ChevronRightIcon color="gray.500" />}
      >
        <BreadcrumbItem>
          <Text color="#1C1C1C" fontWeight="bold" fontSize="14px">
            My modules
          </Text>
        </BreadcrumbItem>
      </Breadcrumb>
    </Flex>
  );
};

const Page = () => {
  const { address } = useAccount();

  const { data: tokenIds } = useContractRead({
    address: GAME_COMPOSABLE_NFT_ADDRESS,
    abi: GAME_COMPOSABLE_NFT_ABI,
    functionName: 'balanceOfTokens',
    args: [address],
  }) as { data: BigNumber[] };

  const nftIds = useMemo(() => {
    if (tokenIds) {
      return tokenIds.map((tokenId) => {
        return tokenId.toNumber();
      });
    }
    return [];
  }, [tokenIds]);

  const nftDataResult = useNftData(nftIds);

  const nftData = useMemo(() => {
    return nftDataResult
      .filter(({ status, data }) => {
        return status === 'success' && data && data.spike_info?.type === 'Game';
      })
      .map(({ data }) => {
        return {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          ...data!,
        };
      });
  }, [nftDataResult]);

  return (
    <>
      <Head>
        <title>Spike Web3 Game</title>
        <meta name="description" content="Spike Web3 Game" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {nftData.length === 0 && (
        <Flex
          gap={10}
          justifyContent="center"
          alignItems="center"
          direction="column"
          h="full"
        >
          <Image src="/images/library_null_icon.png" alt="" w="28" />
          Oops, You don't have a game NFT yet, go to the market to mint one!
        </Flex>
      )}

      {nftData.length > 0 && (
        <Box px={10}>
          <PageHeader />

          <Grid templateColumns="repeat(auto-fill, minmax(260px, 1fr))" gap={7}>
            {nftData.map((nft, i) => {
              const { name, description, tokenId } = nft;
              return (
                <ModuleCard
                  key={i}
                  name={name}
                  description={description}
                  bg={i % 2 === 0 ? '#E3F5FF' : '#E5ECF6'}
                  extraArea={
                    <>
                      <Text fontSize={'14px'} color={'#00000066'}>
                        Token ID: {tokenId}
                      </Text>
                      <Flex
                        mt={12}
                        flex={1}
                        direction="column"
                        justifyContent={'flex-end'}
                      >
                        <button
                          className={clsx(
                            'btn-sm btn ',
                            'rounded-full border-transparent bg-[#FFFFFF] text-[#000]',
                            'hover:border-transparent hover:bg-[#2375FF] hover:text-[#FFFFFF] hover:opacity-80',
                            'w-full',
                          )}
                          onClick={() => {
                            window.open(
                              `https://demo.eclair.spike.network/${tokenId}`,
                            );
                          }}
                        >
                          PLAY GAME
                        </button>
                      </Flex>
                    </>
                  }
                />
              );
            })}
          </Grid>
        </Box>
      )}
    </>
  );
};

Page.layout = DefaultLayout;

export default Page;
