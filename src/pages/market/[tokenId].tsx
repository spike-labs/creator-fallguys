import Head from 'next/head';
import {
  Flex,
  Box,
  Text,
  Breadcrumb,
  BreadcrumbItem,
  Grid,
  useDisclosure,
} from '@chakra-ui/react';
import { ChevronRightIcon, AddIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import clsx from 'clsx';
import { useImmer } from 'use-immer';

import { DefaultLayout } from '@/layouts';
import { useNftData } from '@/hooks';
import { type ModuleDataResult } from '@/hooks/useNftData';
import { ModuleCard } from '@/components';
import { ModuleSelectModal, MintModal } from '@/views';

const PageHeader = () => {
  return (
    <Flex
      as="header"
      width="full"
      align="center"
      pos="sticky"
      top={0}
      py={4}
      px={10}
      zIndex="3"
      bg={'white'}
    >
      <Breadcrumb
        spacing="8px"
        separator={<ChevronRightIcon color="gray.500" />}
      >
        <BreadcrumbItem>
          <Link href="/market">
            <Text color="#00000066" fontWeight="bold" fontSize="14px">
              Please select a game NFT template
            </Text>
          </Link>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <Link href="/market/19">
            <Text color="#1C1C1C" fontWeight="bold" fontSize="14px">
              Edit 19
            </Text>
          </Link>
        </BreadcrumbItem>
      </Breadcrumb>
    </Flex>
  );
};

const Page = () => {
  const router = useRouter();
  const { tokenId } = router.query;

  const tokenIdArr = useMemo(() => {
    if (tokenId) {
      return [parseInt(tokenId as string, 10)];
    }
    return [];
  }, [tokenId]);

  const nftData = useNftData(tokenIdArr)[0];

  const nftDataAttributes = useMemo(() => {
    if (nftData && nftData.isSuccess) {
      return nftData.data.attributes;
    }

    return [];
  }, [nftData]);

  const [nftDataAttributesEdited, updateNftDataAttributesEdited] = useImmer<
    ModuleDataResult[]
  >([]);

  useEffect(() => {
    if (nftDataAttributes) updateNftDataAttributesEdited(nftDataAttributes);
  }, [nftDataAttributes, updateNftDataAttributesEdited]);

  const deleteAttribute = (attributeUri: string) => {
    updateNftDataAttributesEdited((draft) => {
      return draft.filter((item) => item.uri !== attributeUri);
    });
  };

  const addAttribute = (attributeArr: ModuleDataResult[]) => {
    updateNftDataAttributesEdited((draft) => {
      draft.push(...attributeArr);
    });
  };

  const {
    isOpen: isModuleSelectModalOpen,
    onOpen: onModuleSelectModalOpen,
    onClose: onModuleSelectModalClose,
  } = useDisclosure();

  const {
    isOpen: isMintModalOpen,
    onOpen: onMintModalOpen,
    onClose: onMintModalClose,
  } = useDisclosure();

  return (
    <>
      <Head>
        <title>Spike Web3 Game - Market</title>
        <meta name="description" content="Spike Web3 Game - login" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Box>
        <PageHeader />
        {nftDataAttributesEdited.length > 1 && (
          <>
            <Grid
              templateColumns="repeat(auto-fit, minmax(260px, 1fr))"
              gap={7}
              px={10}
            >
              <ModuleCard
                cursor={'pointer'}
                _hover={{
                  opacity: 0.6,
                }}
                extraArea={
                  <Flex flex={1} alignItems="center" justifyContent="center">
                    <AddIcon boxSize={12} fontWeight="normal" />
                  </Flex>
                }
                onClick={() => onModuleSelectModalOpen()}
              />
              {nftDataAttributesEdited.map((item, i) => {
                const { name, type, description, uri } = item;
                return (
                  <ModuleCard
                    key={i}
                    name={name}
                    description={description}
                    justifyContent="space-between"
                    extraArea={
                      <Flex pt={10} w="full" justifyContent={'center'}>
                        {(type === 'portable' ||
                          uri ===
                            'https://oasis.mypinata.cloud/ipfs/QmcTCacuQkrj6sdwXPh2427j5fHZhqJPQzRJsiXaMjwihq/NFTGuys.pck') && (
                          <button
                            className={clsx(
                              'btn-outline btn-sm btn w-full',
                              'rounded-full border-[#00000066]',
                              'hover:border-transparent hover:bg-[#0000000F] hover:text-[#000000]',
                            )}
                            onClick={() => deleteAttribute(uri)}
                          >
                            Delete
                          </button>
                        )}
                      </Flex>
                    }
                  />
                );
              })}
            </Grid>

            <Flex px={10} mt={10}>
              <button
                className={clsx(
                  'btn-sm btn w-32',
                  'rounded-full border-[#2375FF] bg-[#2375FF]',
                  'hover:border-transparent hover:bg-[#2375FF] hover:opacity-80',
                )}
                onClick={() => {
                  onMintModalOpen();
                }}
              >
                Mint
              </button>
            </Flex>
          </>
        )}
      </Box>

      {isModuleSelectModalOpen && (
        <ModuleSelectModal
          onClose={onModuleSelectModalClose}
          isOpen={isModuleSelectModalOpen}
          addAttribute={addAttribute}
        />
      )}
      {isMintModalOpen && (
        <MintModal
          onClose={onMintModalClose}
          isOpen={isMintModalOpen}
          nftDataAttributesEdited={nftDataAttributesEdited}
          gameTemplateId={tokenIdArr[0]}
        />
      )}
    </>
  );
};

Page.layout = DefaultLayout;

export default Page;
