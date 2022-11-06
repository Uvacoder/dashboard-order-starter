import dayjs from 'dayjs';
import { DocumentData, DocumentReference, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { RiMoneyDollarCircleLine, RiUserLine } from 'react-icons/ri';

import { Button, Group, Loader, Modal, NumberInput, Select, Title } from '@mantine/core';
import { useForm } from '@mantine/form';

interface OrderFormProps {
  opened: boolean;
  closeForm: () => void;
  values?: Order;
  clients: Client[];
  addClient: (name: string) => Promise<DocumentReference<DocumentData>>;
  addOrder: (order: Omit<Order, 'NO_ID_FIELD'>) => Promise<DocumentReference<DocumentData>>;
  editOrder: (order: Order) => void;
}

interface InitialValues {
  clientId: string;
  price: number | null;
}

function OrderForm({
  opened,
  closeForm,
  values,
  clients,
  addClient,
  addOrder,
  editOrder,
}: OrderFormProps) {
  const form = useForm({
    initialValues: {
      clientId: '',
      price: null,
    } as InitialValues,
    validate: {
      clientId: (value) => value?.length ? null : 'Invalid client',
    },
  });
  const [isClientLoading, setIsClientLoading] = useState(false);

  useEffect(() => {
    if (opened) {
      if (values) form.setValues({ ...values, price: values.price === 0 ? null : values.price });
      else form.reset();
    }
  }, [opened]);

  return (
    <Modal
      opened={opened}
      title={<Title order={5}>{values ? 'Edit order' : 'Add order'}</Title>}
      size={520}
      trapFocus
      onClose={closeForm}
      target=".modal-container"
    >
      <form onSubmit={form.onSubmit(({ clientId, price }) => {
        closeForm();
        if (values) editOrder({
          ...values,
          clientId,
          price: price || 0,
        });
        else addOrder({
          clientId,
          price: price || 0,
          status: 'pending',
          receivedTimestamp: dayjs().valueOf(),
          deliveredTimestamp: null,
        });
      })}>
        <Group align="flex-start" spacing="sm" grow>
          <Select
            label="Client"
            data={clients.map((client) => ({ value: client.NO_ID_FIELD, label: client.name }))}
            icon={isClientLoading ? <Loader size={16} /> : <RiUserLine />}
            placeholder={isClientLoading ? 'Loading client...' : 'Select client'}
            nothingFound="Client not found"
            initiallyOpened={false}
            creatable
            searchable
            selectOnBlur
            data-autofocus={values ? undefined : true}
            disabled={isClientLoading}
            getCreateLabel={(query) => `+ Add client ${query}`}
            onCreate={async (query) => {
              setIsClientLoading(true);
              const newClientRef = await addClient(query);
              const newClient = await getDoc(newClientRef);
              setIsClientLoading(false);
              form.setFieldValue('clientId', newClient.id);
            }}
            {...form.getInputProps('clientId')}
          />
          <NumberInput
            label="Price"
            icon={<RiMoneyDollarCircleLine />}
            placeholder="Pending"
            min={0}
            data-autofocus
            {...form.getInputProps('price')}
          />
        </Group>
        <Group position="right" mt="md">
          <Button type="submit">Confirm</Button>
        </Group>
      </form>
    </Modal>
  );
}

export default OrderForm;
