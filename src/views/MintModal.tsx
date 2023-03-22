import {
  Grid,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';
import clsx from 'clsx';
import { type ModuleDataResult } from '@/hooks/useNftData';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { useNftMint } from '@/hooks';
import type { GameNftMetadata } from '@/hooks/useNftMint';

interface ModalProps {
  onClose: () => void;
  isOpen: boolean;
  nftDataAttributesEdited: ModuleDataResult[];
  gameTemplateId: number;
}

const MintModal = ({
  isOpen,
  onClose,
  nftDataAttributesEdited,
  gameTemplateId,
}: ModalProps) => {
  const router = useRouter();

  const {
    getValues,
    register,
    trigger,
    formState: { errors },
  } = useForm();

  const {
    mint,
    contractWriteResult: { isLoading, isSuccess },
  } = useNftMint(gameTemplateId);

  useEffect(() => {
    if (isSuccess) {
      onClose();
      router.push('/market');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent width="90%" maxW={'700px'} borderRadius="20px">
        <ModalHeader textTransform="capitalize" textAlign={'center'} pt={10}>
          Create a new strategy
        </ModalHeader>
        <ModalBody py={6} px={10} overflowY="auto" minH="380px" maxH="60vh">
          <form>
            <Grid
              templateColumns="repeat(auto-fit, minmax(280px, 1fr))"
              gap={7}
            >
              <FormControl isInvalid={!!errors.name}>
                <FormLabel>Name</FormLabel>
                <Input
                  {...register('name', {
                    required: 'Name is required',
                  })}
                />
                <FormErrorMessage>
                  <>{errors.name && errors.name.message}</>
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.description}>
                <FormLabel>Description</FormLabel>
                <Input {...register('description')} />
                <FormErrorMessage>
                  <>{errors.description && errors.description.message}</>
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.mintRoyaltyFee}>
                <FormLabel>NFT Royalties</FormLabel>
                <NumberInput>
                  <NumberInputField
                    {...register('mintRoyaltyFee', {
                      required: 'MintRoyaltyFee is required',
                    })}
                  />
                </NumberInput>

                {!!errors.mintRoyaltyFee ? (
                  <FormErrorMessage>
                    <>
                      {errors.mintRoyaltyFee && errors.mintRoyaltyFee.message}
                    </>
                  </FormErrorMessage>
                ) : (
                  <FormHelperText>Coins of the Current Chain</FormHelperText>
                )}
              </FormControl>
              <FormControl isInvalid={!!errors.marketRoyaltyFraction}>
                <FormLabel>Royalty Percentage(‱)</FormLabel>
                <NumberInput min={0} max={10000}>
                  <NumberInputField
                    {...register('marketRoyaltyFraction', {
                      required: 'MarketRoyaltyFraction is required',
                    })}
                  />
                </NumberInput>

                {!!errors.marketRoyaltyFraction ? (
                  <FormErrorMessage>
                    <>
                      {errors.marketRoyaltyFraction &&
                        errors.marketRoyaltyFraction.message}
                    </>
                  </FormErrorMessage>
                ) : (
                  <FormHelperText>Between 0 and 10000.</FormHelperText>
                )}
              </FormControl>
              <FormControl isInvalid={!!errors.newUsageFee}>
                <FormLabel>New Usage Fee</FormLabel>
                <NumberInput>
                  <NumberInputField
                    {...register('newUsageFee', {
                      required: 'NewUsageFee is required',
                    })}
                  />
                </NumberInput>

                {!!errors.newUsageFee ? (
                  <FormErrorMessage>
                    <>{errors.newUsageFee && errors.newUsageFee.message}</>
                  </FormErrorMessage>
                ) : (
                  <FormHelperText>Coins of the Current Chain</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </form>
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
                `${isLoading && 'loading'}`,
              )}
              onClick={async () => {
                const triggerRes = await trigger();

                if (triggerRes) {
                  const {
                    name,
                    description,
                    mintRoyaltyFee,
                    marketRoyaltyFraction,
                    newUsageFee,
                  } = getValues();

                  const gameNftMetadata = {
                    name,
                    description,
                    image: '',
                    external_url: '',
                    spike_info: {
                      version: '1',
                      type: 'Game',
                      url: 'placeholder for icon',
                    },
                    attributes: nftDataAttributesEdited,
                  } as GameNftMetadata;

                  mint({
                    gameNftMetadata,
                    mintRoyaltyFee,
                    marketRoyaltyFraction,
                    newUsageFee,
                  });
                }
              }}
            >
              Mint
            </button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MintModal;
