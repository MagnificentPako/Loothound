import { BellIcon, ChevronDownIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorModeValue,
} from '@chakra-ui/react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import useAuth from '../AuthContext';
import getRequest from '../api/client';
import { ExtendedStashTab, StashTab } from '../types/types';

type Props = {
  setStash: Dispatch<SetStateAction<ExtendedStashTab | null>>;
};

const TopBar = ({ setStash }: Props) => {
  const token = useAuth();
  const [stashList, setStashList] = useState<StashTab[]>([]);
  const [isStashListLoading, setIsStashListLoading] = useState(false);
  const [selectedStashId, setSelectedStashId] = useState<string | null>(null);

  useEffect(() => {
    setIsStashListLoading(true);
    console.log(selectedStashId);
    getRequest<{ stashes: StashTab[] }>('stash/Crucible', token)
      .then(({ stashes }) => {
        setStashList(stashes);
      })
      .finally(() => setIsStashListLoading(false));
  }, []);

  return (
    <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
      <Flex h={14} alignItems={'center'} justifyContent={'space-between'}>
        <Box />
        <Flex h={14} alignItems={'center'} justifyContent={'center'} gap="5px">
          <Menu>
            <MenuButton
              as={Button}
              variant="outline"
              rightIcon={<ChevronDownIcon />}
            >
              {selectedStashId
                ? stashList.find((stash) => stash.id === selectedStashId)?.name
                : 'Select...'}
            </MenuButton>
            <MenuList>
              {stashList &&
                stashList.map((stash) => (
                  <MenuItem
                    key={stash?.id}
                    onClick={() => setSelectedStashId(stash.id)}
                  >
                    {stash?.name}
                  </MenuItem>
                ))}
            </MenuList>
          </Menu>
          <Divider orientation="vertical" />
          <ButtonGroup isAttached variant="outline">
            <Button
              isDisabled={isStashListLoading || !selectedStashId}
              onClick={async () => {
                const { stash } = await getRequest<{ stash: ExtendedStashTab }>(
                  `stash/Crucible/${selectedStashId}`,
                  token
                );
                setStash(stash);
              }}
            >
              Take Snapshot
            </Button>
            <IconButton
              aria-label="Delete snapshots"
              colorScheme="red"
              icon={<DeleteIcon />}
            />
          </ButtonGroup>
          <Divider orientation="vertical" />
          <IconButton
            variant="outline"
            icon={<BellIcon />}
            aria-label="Show notifications"
          />
          <Divider orientation="vertical" />
          <IconButton
            variant="outline"
            icon={<BellIcon />}
            aria-label="Show notifications"
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default TopBar;
