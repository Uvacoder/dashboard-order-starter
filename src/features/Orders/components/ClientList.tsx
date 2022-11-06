import { DocumentData, DocumentReference } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { RiUserAddLine, RiUserSearchLine } from 'react-icons/ri';

import {
  ActionIcon, Box, Group, Modal, Stack, Table, TextInput, Title, Tooltip, useMantineTheme,
} from '@mantine/core';
import { useInputState } from '@mantine/hooks';

import { ClientItem } from './';

interface ClientListProps {
  opened: boolean;
  close: () => void;
  clients: Client[];
  addClient: (name: string) => Promise<DocumentReference<DocumentData>>;
  editClient: (client: Client) => void;
  deleteClient: (client: Client) => void;
}

function ClientList({
  opened,
  close,
  clients,
  addClient,
  editClient,
  deleteClient,
}: ClientListProps) {
  const theme = useMantineTheme();
  const [searchValue, setSearchValue] = useInputState('');
  const [isExactMatch, setIsExactMatch] = useState(false);

  const filteredClients = clients.filter((client) =>
    client.name.match(new RegExp(searchValue, 'gi')));

  useEffect(() => {
    if (opened) setSearchValue('');
  }, [opened]);
  useEffect(() => {
    setIsExactMatch(!!filteredClients.find((client) => {
      return client.name.toLowerCase() === searchValue.toLowerCase();
    }));
  }, [filteredClients]);

  return (
    <Modal
      opened={opened}
      title={<Title order={5}>Manage clients</Title>}
      size={450}
      overflow="inside"
      trapFocus
      onClose={close}
      target=".modal-container"
    >
      <Stack spacing="xs" sx={{ maxHeight: 'calc(100vh - 200px)' }}>
        <TextInput
          icon={<RiUserSearchLine />}
          placeholder="Search client"
          data-autofocus
          value={searchValue}
          onChange={setSearchValue}
        />
        <Box sx={{ flexGrow: 1, overflowY: 'scroll' }}>
          <Table verticalSpacing="xs" horizontalSpacing="sm">
            <tbody>
              {filteredClients.map((client) => (
                <ClientItem
                  key={client.NO_ID_FIELD}
                  client={client}
                  editClient={editClient}
                  deleteClient={deleteClient}
                />
              ))}
              {!!searchValue.length && !isExactMatch && (
                <tr>
                  <td>{searchValue}</td>
                  <td style={{ width: 0 }}>
                    <Group position="right">
                      <Tooltip label="Add client">
                        <ActionIcon color={theme.primaryColor} onClick={() => {
                          addClient(searchValue);
                          setSearchValue('');
                        }}>
                          <RiUserAddLine />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Box>
      </Stack>
    </Modal>
  );
}

export default ClientList;
