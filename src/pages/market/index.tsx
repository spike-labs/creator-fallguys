import Head from 'next/head';
import {
  Flex,
  Box,
  Text,
  Grid,
  Image,
  Breadcrumb,
  BreadcrumbItem,
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { DefaultLayout } from '@/layouts';
import { useNftData } from '@/hooks';
import { ModuleCard } from '@/components';

const GAME_TEMPLATE_TOKEN_ID = [19];

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
          <Link href="/market">
            <Text color="#1C1C1C" fontWeight="bold" fontSize="14px">
              Please select a game NFT template
            </Text>
          </Link>
        </BreadcrumbItem>
      </Breadcrumb>
    </Flex>
  );
};

const Page = () => {
  const router = useRouter();
  const nftDataResult = useNftData(GAME_TEMPLATE_TOKEN_ID);

  const nftData = useMemo(() => {
    return nftDataResult
      .filter(({ status, data }) => {
        return status === 'success' && data;
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
        <title>Spike Web3 Game - Market</title>
        <meta name="description" content="Spike Web3 Game - login" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Box px={10}>
        <PageHeader />
        {nftData.length > 0 && (
          <Grid templateColumns="repeat(auto-fill, minmax(260px, 1fr))" gap={7}>
            {nftData.map((nft, i) => {
              const { name, description, tokenId } = nft;
              return (
                <ModuleCard
                  key={i}
                  name={name}
                  description={description}
                  bg={i % 2 === 0 ? '#E3F5FF' : '#E5ECF6'}
                  openTransition
                  extraArea={
                    <>
                      <Text fontSize={'14px'} color={'#00000066'}>
                        Token ID: {tokenId}
                      </Text>
                      <Box mt={12}>
                        <Image src="/icons/arrow_icon.svg" alt="" />
                      </Box>
                    </>
                  }
                  onClick={() => {
                    router.push(`/market/${tokenId}`);
                  }}
                />
              );
            })}
          </Grid>
        )}
      </Box>
    </>
  );
};

Page.layout = DefaultLayout;

export default Page;
