import {
  addDoc, collection, DocumentData, orderBy, OrderByDirection, query, where,
} from 'firebase/firestore';
import { useState } from 'react';
import {
  RiAddLine, RiEyeLine, RiEyeOffLine, RiFilterLine, RiFilterOffLine, RiUserSettingsLine,
} from 'react-icons/ri';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';

import { Box, Button, Center, Collapse, Group, Loader, Tooltip } from '@mantine/core';
import { useDisclosure, useLocalStorage } from '@mantine/hooks';

import { Table } from '../../components';
import { MainLayout } from '../../layouts';
import { ClientList, Earnings, OrderForm, OrderItem, OrdersFilters } from './components';

interface OrdersProps {
  visibleFilters: boolean;
  visibleNumbers: boolean;
  toggleVisibleFilters(): void;
  toggleVisibleNumbers(): void;
  editDocument: (path: string, document: DocumentData) => void;
  deleteDocument: (path: string, document: DocumentData) => void;
}

function Orders({
  visibleFilters,
  visibleNumbers,
  toggleVisibleFilters,
  toggleVisibleNumbers,
  editDocument,
  deleteDocument,
}: OrdersProps) {
  const firestore = useFirestore();
  const [statusFilter] = useLocalStorage<Filters.Status>({
    key: 'status-filter',
    defaultValue: 'pending',
  });
  const [orderByFilter] = useLocalStorage<Filters.OrderBy>({
    key: 'order-by-filter',
    defaultValue: 'receivedTimestamp',
  });
  const [directionFilter] = useLocalStorage<OrderByDirection>({
    key: 'direction-filter',
    defaultValue: 'desc',
  });
  const [clientsFilter] = useLocalStorage<string[]>({
    key: 'clients-filter',
    defaultValue: [],
  });
  const clientCollection = collection(firestore, 'clients');
  const clientQuery = query(clientCollection, orderBy('name', 'asc'));
  const { status: clientStatus, data: clients } = useFirestoreCollectionData(clientQuery);
  const orderCollection = collection(firestore, 'orders');
  const queryConstraints = [orderBy(orderByFilter, directionFilter)];
  if (statusFilter !== 'all') {
    queryConstraints.push(where('status', '==', statusFilter));
  }
  if (clientsFilter.length) {
    queryConstraints.push(where('clientId', 'in', clientsFilter));
  }
  const orderQuery = query(orderCollection, ...queryConstraints);
  const { status: orderStatus, data: orders } = useFirestoreCollectionData(orderQuery);
  const [orderFormOpened, orderFormHandler] = useDisclosure(false);
  const [clientListOpened, clientListHandler] = useDisclosure(false);
  const [formValues, setFormValues] = useState<Order>();
  const addClient = async (name: string) => await addDoc(clientCollection, { name });
  const addOrder = async (order: Omit<Order, 'NO_ID_FIELD'>) =>
    await addDoc(orderCollection, order);
  const editClient = (client: Client) => editDocument('clients', client);
  const deleteClient = (client: Client) => deleteDocument('clients', client);
  const editOrder = (order: Order) => editDocument('orders', order);
  const deleteOrder = (order: Order) => deleteDocument('orders', order);

  return (
    <MainLayout
      headerTitle="Orders"
      header={<>
        <Group spacing="sm">
          <Button leftIcon={<RiAddLine />} onClick={() => {
            setFormValues(undefined);
            orderFormHandler.open();
          }}>
            New order
          </Button>
          <Button
            variant="light"
            leftIcon={<RiUserSettingsLine />}
            onClick={clientListHandler.open}
          >
            Manage clients
          </Button>
          <Group spacing={8} ml="auto">
            <Tooltip label={visibleFilters ? 'Hide filters' : 'Show filters'} withinPortal>
              <Button
                variant={visibleFilters ? 'light' : 'subtle'}
                px="xs"
                onClick={toggleVisibleFilters}
              >
                {visibleFilters ? <RiFilterLine /> : <RiFilterOffLine />}
              </Button>
            </Tooltip>
            <Tooltip label={visibleNumbers ? 'Hide numbers' : 'Show numbers'} withinPortal>
              <Button
                variant={visibleNumbers ? 'light' : 'subtle'}
                px="xs"
                onClick={toggleVisibleNumbers}
              >
                {visibleNumbers ? <RiEyeLine /> : <RiEyeOffLine />}
              </Button>
            </Tooltip>
          </Group>
        </Group>
        <Collapse in={clients && visibleFilters}>
          <Box pt="md">
            <OrdersFilters clients={clients as Client[]} />
          </Box>
        </Collapse>
      </>}
      body={<>
        {clientStatus === 'success' && (
          <>
            <OrderForm
              opened={orderFormOpened}
              closeForm={orderFormHandler.close}
              values={formValues}
              clients={clients as Client[]}
              addClient={addClient}
              addOrder={addOrder}
              editOrder={editOrder}
            />
            <ClientList
              opened={clientListOpened}
              close={clientListHandler.close}
              clients={clients as Client[]}
              addClient={addClient}
              editClient={editClient}
              deleteClient={deleteClient}
            />
          </>
        )}
        {clientStatus === 'loading' || orderStatus === 'loading' ? (
          <Center sx={{ height: '100%' }}>
            <Loader />
          </Center>
        ) : (
          <Table
            headerCellElements={<tr>
              <th style={{ width: 0 }}>Status</th>
              <th>Client</th>
              <th style={{ width: 0, textAlign: 'right' }}>Price</th>
              <th style={{ width: 0 }}>Received</th>
              <th style={{ width: 0 }}>Delivered</th>
              <th style={{ width: 0 }}></th>
            </tr>}
            bodyCellElements={orders.map((order) => (
              <OrderItem
                key={order.NO_ID_FIELD}
                order={order as Order}
                clientName={clients.find((client) =>
                  client.NO_ID_FIELD === order.clientId)?.name || ''}
                visibleNumbers={visibleNumbers}
                setFormValues={setFormValues}
                openOrderForm={orderFormHandler.open}
                editOrder={editOrder}
                deleteOrder={deleteOrder}
              />
            ))}
          />
        )}
      </>}
      sidePanel={<Earnings visibleNumbers={visibleNumbers} />}
    />
  );
}

export default Orders;
