import {
  Flex,
  Grid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Image,
} from '@chakra-ui/react';
import { useMemo } from 'react';
import clsx from 'clsx';
import { useImmer } from 'use-immer';

import { useNftData } from '@/hooks';
import { type ModuleDataResult } from '@/hooks/useNftData';
import { ModuleCard } from '@/components';

const Module_TEMPLATE_TOKEN_ID = [29, 30, 31, 32, 33, 34];

interface ModalProps {
  onClose: () => void;
  isOpen: boolean;
  addAttribute: (attribute: ModuleDataResult[]) => void;
}

const ModuleSelectModal = ({ isOpen, onClose, addAttribute }: ModalProps) => {
  const nftDataResult = useNftData(Module_TEMPLATE_TOKEN_ID);

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

  const [selectIdx, setSelectIdx] = useImmer<number[]>([]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent width="90%" maxW={'1000px'} borderRadius="20px">
        <ModalHeader textTransform="capitalize" textAlign={'center'} pt={10}>
          Add game module
        </ModalHeader>
        <ModalBody py={6} overflowY="auto" minH="400px" maxH="60vh">
          {nftData.length > 1 && (
            <Grid
              templateColumns="repeat(auto-fit, minmax(260px, 1fr))"
              gap={7}
            >
              {nftData.map((nft, i) => {
                const { name, description } = nft;
                return (
                  <ModuleCard
                    cursor={'pointer'}
                    key={i}
                    name={name}
                    description={description}
                    border={`2px solid ${
                      selectIdx.includes(i) ? '#2375FF' : 'transparent'
                    }`}
                    _hover={{
                      border: '2px solid #2375FF',
                    }}
                    onClick={() => {
                      if (selectIdx.includes(i)) {
                        setSelectIdx((draft) => {
                          draft.splice(draft.indexOf(i), 1);
                        });
                      } else {
                        setSelectIdx((draft) => {
                          draft.push(i);
                        });
                      }
                    }}
                    pb={3}
                    extraArea={
                      <Flex justifyContent={'flex-end'} pt={5} h={14}>
                        {selectIdx.includes(i) && (
                          <Image src="/icons/add_icon.svg" alt="" />
                        )}
                      </Flex>
                    }
                  />
                );
              })}
            </Grid>
          )}
        </ModalBody>

        <ModalFooter justifyContent={'center'} pb={10}>
          <Flex gap={4}>
            <button
              className={clsx(
                'btn-outline btn-sm btn w-32',
                'rounded-full border-[#00000066]',
                'hover:border-transparent hover:bg-[#0000000F] hover:text-[#000000]',
              )}
              onClick={() => {
                setSelectIdx([]);
                onClose();
              }}
            >
              Cancel
            </button>

            <button
              className={clsx(
                'btn-sm btn w-32',
                'rounded-full border-[#2375FF] bg-[#2375FF]',
                'hover:border-transparent hover:bg-[#2375FF] hover:opacity-80',
              )}
              onClick={() => {
                const selectedNftData = nftData
                  .filter((_, i) => {
                    return selectIdx.includes(i);
                  })
                  .map((item) => {
                    return item.attributes;
                  });

                addAttribute(selectedNftData as unknown as ModuleDataResult[]);
                setSelectIdx([]);
                onClose();
              }}
            >
              Add
            </button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModuleSelectModal;
