import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { Dispatch, SetStateAction } from 'react';
import { RiDeleteBin7Line, RiMoneyDollarCircleLine, RiPencilLine } from 'react-icons/ri';

import {
  ActionIcon, Badge, Button, Group, NumberInput, Popover, Stack, Text, Title, Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { openConfirmModal } from '@mantine/modals';

interface OrderItemProps {
  order: Order;
  clientName: string;
  visibleNumbers: boolean;
  setFormValues: Dispatch<SetStateAction<Order | undefined>>;
  openOrderForm: () => void;
  editOrder: (order: Order) => void;
  deleteOrder: (order: Order) => void;
}

dayjs.extend(calendar);
dayjs.extend(localizedFormat);
const statusColors = { pending: 'yellow', finished: 'green', delivered: 'cyan' };

function OrderItem({
  order,
  clientName,
  visibleNumbers,
  setFormValues,
  openOrderForm,
  editOrder,
  deleteOrder,
}: OrderItemProps) {
  const theme = useMantineTheme();
  const form = useForm({
    initialValues: { price: null },
    validate: {
      price: (value) => value ? null : 'Invalid price',
    },
  });
  const [pricePopoverOpened, pricePopoverHandler] = useDisclosure(false);

  const openPendingModal = () => openConfirmModal({
    title: <Title order={5}>Are you sure you want to mark this order as pending again?</Title>,
    children: <Text size="sm">The delivery date will be lost.</Text>,
    labels: { confirm: 'Confirm', cancel: 'Cancel' },
    onConfirm: () => editOrder({ ...order, status: 'pending', deliveredTimestamp: null }),
    centered: true,
    target: '.modal-container',
  });
  const openDeleteModal = () => openConfirmModal({
    title: <Title order={5}>Are you sure you want to delete this order?</Title>,
    labels: { confirm: 'Delete', cancel: 'Cancel' },
    onConfirm: () => deleteOrder(order),
    confirmProps: { color: 'red' },
    centered: true,
    target: '.modal-container',
  });

  return (
    <tr style={{ cursor: 'default' }}>
      <td>
        <Popover
          position="right-start"
          trapFocus
          opened={pricePopoverOpened}
          onChange={pricePopoverHandler.toggle}
        >
          <Popover.Target>
            <Tooltip
              label={`Set as ${order.status === 'pending' ? 'finished' :
                order.status === 'finished' ? 'delivered' : 'pending'}`}
              openDelay={500}
              withinPortal
            >
              <Button
                size="xs"
                variant="light"
                color={statusColors[order.status]}
                fullWidth
                onClick={() => {
                  switch (order.status) {
                    case 'pending':
                      if (order.price) editOrder({ ...order, status: 'finished' });
                      else {
                        form.reset();
                        pricePopoverHandler.open();
                      }
                      break;
                    case 'finished':
                      editOrder({
                        ...order,
                        status: 'delivered',
                        deliveredTimestamp: dayjs().valueOf(),
                      });
                      break;
                    case 'delivered':
                      openPendingModal();
                      break;
                  }
                }}
              >
                <Text transform="capitalize">{order.status}</Text>
              </Button>
            </Tooltip>
          </Popover.Target>
          <Popover.Dropdown>
            <form onSubmit={form.onSubmit(({ price }) => {
              if (!price) return;
              pricePopoverHandler.close();
              editOrder({ ...order, status: 'finished', price });
            })}>
              <Stack spacing="sm">
                <Text weight="500">Finish order</Text>
                <NumberInput
                  icon={<RiMoneyDollarCircleLine />}
                  placeholder="Enter price"
                  min={0}
                  {...form.getInputProps('price')}
                />
                <Group position="right">
                  <Button type="submit">Confirm</Button>
                </Group>
              </Stack>
            </form>
          </Popover.Dropdown>
        </Popover>
      </td>
      <td>{clientName || <Text italic>Deleted</Text>}</td>
      <td style={{ textAlign: 'right' }}>
        {visibleNumbers
          ? order.price
            ? `$${order.price.toLocaleString()}`
            : <Badge p={0} color="gray" sx={{ backgroundColor: 'transparent' }}>Pending</Badge>
          : '*****'}
      </td>
      <td>
        <Tooltip
          label={dayjs(order.receivedTimestamp).calendar(dayjs(), { sameElse: 'llll' })}
          openDelay={500}
        >
          <Text sx={{ cursor: 'help' }}>
            {dayjs(order.receivedTimestamp).format('L')}
          </Text>
        </Tooltip>
      </td>
      <td>
        <Tooltip
          label={dayjs(order.deliveredTimestamp).calendar(dayjs(), { sameElse: 'llll' })}
          openDelay={500}
          disabled={!order.deliveredTimestamp}
        >
          <Text sx={{ cursor: order.deliveredTimestamp ? 'help' : 'default' }}>
            {order.deliveredTimestamp ? dayjs(order.deliveredTimestamp).format('L') : '-'}
          </Text>
        </Tooltip>
      </td>
      <td>
        <Group position="right" spacing={0} noWrap>
          <Tooltip label="Edit">
            <ActionIcon color={theme.primaryColor} onClick={() => {
              setFormValues(order);
              openOrderForm();
            }}>
              <RiPencilLine />
            </ActionIcon>
          </Tooltip>
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

export default OrderItem;
