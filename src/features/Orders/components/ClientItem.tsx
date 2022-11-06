import { useEffect, useRef, useState } from 'react';
import { RiCheckLine, RiDeleteBin7Line, RiPencilLine } from 'react-icons/ri';

import { ActionIcon, Group, TextInput, Title, Tooltip, useMantineTheme } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useClickOutside } from '@mantine/hooks';
import { openConfirmModal } from '@mantine/modals';

interface ClientItemProps {
  client: Client;
  editClient: (client: Client) => void;
  deleteClient: (client: Client) => void;
}

function ClientItem({ client, editClient, deleteClient }: ClientItemProps) {
  const theme = useMantineTheme();
  const form = useForm({
    initialValues: { name: client.name },
    validate: {
      name: (value) => value ? null : 'Invalid name',
    },
  });
  const [editMode, setEditMode] = useState(false);
  const clientItemRef = useClickOutside(() => setEditMode(false));
  const inputRef = useRef<HTMLInputElement>(null);

  const openDeleteModal = () => openConfirmModal({
    title: <Title order={5}>Are you sure you want to delete this client?</Title>,
    labels: { confirm: 'Delete', cancel: 'Cancel' },
    onConfirm: () => deleteClient(client),
    confirmProps: { color: 'red' },
    size: 'auto',
    centered: true,
    target: '.modal-container',
  });

  useEffect(() => {
    if (editMode) {
      form.setFieldValue('name', client.name);
      inputRef.current?.focus();
    }
  }, [editMode]);

  return (
    <tr ref={clientItemRef}>
      <td style={{ border: 'none' }}>
        {editMode
          ? (
            <form onSubmit={form.onSubmit(({ name }) => {
              setEditMode(false);
              editClient({ ...client, name });
            })}>
              <TextInput
                ref={inputRef}
                placeholder="Enter name"
                data-autofocus
                {...form.getInputProps('name')}
                ml={-12}
                my={-4}
              />
            </form>
          ) : client.name}
      </td>
      <td style={{ width: 0, border: 'none' }}>
        <Group position="right" spacing={0} noWrap>
          {editMode
            ? (
              <Tooltip label="Confirm">
                <ActionIcon color={theme.primaryColor} onClick={() => {
                  setEditMode(false);
                  editClient({ ...client, name: form.values.name });
                }}>
                  <RiCheckLine />
                </ActionIcon>
              </Tooltip>
            ) : (
              <Tooltip label="Edit name">
                <ActionIcon color={theme.primaryColor} onClick={() => setEditMode(true)}>
                  <RiPencilLine />
                </ActionIcon>
              </Tooltip>
            )}
          <Tooltip label="Delete">
            <ActionIcon color="red" onClick={openDeleteModal}>
              <RiDeleteBin7Line />
            </ActionIcon>
          </Tooltip>
        </Group>
      </td>
    </tr>
  );
}

export default ClientItem;
