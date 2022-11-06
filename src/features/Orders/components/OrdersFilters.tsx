import { OrderByDirection } from 'firebase/firestore';
import {
  RiArrowDownLine, RiArrowUpLine, RiCalendarCheckLine, RiCalendarTodoLine, RiMoneyDollarCircleLine,
  RiUserLine,
} from 'react-icons/ri';

import { Group, MultiSelect, Text } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';

import { LabeledSegmentedControl } from '../../../components';

interface OrdersFiltersProps {
  clients: Client[];
}

function OrdersFilters({ clients }: OrdersFiltersProps) {
  const [statusFilter, setStatusFilter] = useLocalStorage<Filters.Status>({
    key: 'status-filter',
    defaultValue: 'all',
  });
  const [orderByFilter, setOrderByFilter] = useLocalStorage<Filters.OrderBy>({
    key: 'order-by-filter',
    defaultValue: 'receivedTimestamp',
  });
  const [directionFilter, setDirectionFilter] = useLocalStorage<OrderByDirection>({
    key: 'direction-filter',
    defaultValue: 'desc',
  });
  const [clientsFilter, setClientsFilter] = useLocalStorage<string[]>({
    key: 'clients-filter',
    defaultValue: [],
  });

  return (
    <Group align="flex-end" spacing="sm">
      <LabeledSegmentedControl
        label="Status"
        data={[
          { label: 'All', value: 'all' },
          { label: 'Pending', value: 'pending' },
          { label: 'Finished', value: 'finished' },
          { label: 'Delivered', value: 'delivered' },
        ]}
        value={statusFilter}
        onChange={(value: Filters.Status) => setStatusFilter(value)}
      />
      <LabeledSegmentedControl
        label="Order by"
        data={[
          {
            label: (
              <Group spacing="xs" noWrap>
                <RiMoneyDollarCircleLine />
                <Text>Price</Text>
              </Group>
            ),
            value: 'price',
          },
          {
            label: (
              <Group spacing="xs" noWrap>
                <RiCalendarTodoLine />
                <Text>Received</Text>
              </Group>
            ),
            value: 'receivedTimestamp',
          },
          {
            label: (
              <Group spacing="xs" noWrap>
                <RiCalendarCheckLine />
                <Text>Delivered</Text>
              </Group>
            ),
            value: 'deliveredTimestamp',
          },
        ]}
        value={orderByFilter}
        onChange={(value: Filters.OrderBy) => setOrderByFilter(value)}
      />
      <LabeledSegmentedControl
        label="Direction"
        data={[
          {
            label: (
              <Group spacing="xs" noWrap>
                <RiArrowUpLine />
                <Text>Ascending</Text>
              </Group>
            ),
            value: 'asc',
          },
          {
            label: (
              <Group spacing="xs" noWrap>
                <RiArrowDownLine />
                <Text>Descending</Text>
              </Group>
            ),
            value: 'desc',
          },
        ]}
        value={directionFilter}
        onChange={(value: OrderByDirection) => setDirectionFilter(value)}
      />
      <MultiSelect
        label="Filter by clients"
        data={clients?.map((client) => ({ value: client.NO_ID_FIELD, label: client.name })) || []}
        icon={<RiUserLine />}
        placeholder="Select clients"
        nothingFound="Client not found"
        searchable
        value={clientsFilter}
        onChange={setClientsFilter}
      />
    </Group>
  );
}

export default OrdersFilters;
