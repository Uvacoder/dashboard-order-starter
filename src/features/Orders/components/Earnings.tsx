import dayjs, { OpUnitType } from 'dayjs';
import { collection, query, where } from 'firebase/firestore';
import { useMemo, useState } from 'react';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';

import {
  Box, Center, Collapse, Divider, Group, Loader, Paper, Stack, Text, Title,
} from '@mantine/core';
import { DateRangePickerValue } from '@mantine/dates';
import { useLocalStorage } from '@mantine/hooks';

import { Chart } from '../../../components';
import { EarningsFilters } from './';

interface EarningsProps {
  visibleNumbers: boolean;
}

function Earnings({ visibleNumbers }: EarningsProps) {
  console.log(dayjs('2022-01-01').valueOf(), dayjs().valueOf());
  const firestore = useFirestore();
  const [timeframe] = useLocalStorage<Filters.Timeframe>({
    key: 'timeframe-filter',
    defaultValue: 'year',
  });
  const [excludedDays] = useLocalStorage<string[]>({
    key: 'excluded-days-filter',
    defaultValue: [],
  });
  const [dateRange, setDateRange] = useState<DateRangePickerValue>([null, null]);
  const [startTime, endTime] = timeframe === 'custom'
    ? [dayjs(dateRange[0]), dayjs(dateRange[1])]
    : [dayjs().startOf(timeframe as OpUnitType), dayjs()];
  const orderCollection = collection(firestore, 'orders');
  const queryConstraints = [
    where('status', '==', 'delivered'),
    where('deliveredTimestamp', '>=', startTime.valueOf()),
  ];
  if (timeframe === 'custom') {
    queryConstraints.push(where('deliveredTimestamp', '<=', endTime.endOf('day').valueOf()));
  }
  const orderQuery = query(orderCollection, ...queryConstraints);
  const { status, data: orders } = useFirestoreCollectionData(orderQuery);

  const { labels, data, totalEarnings, orderCount } = useMemo(() => {
    const excludedDaysNumbers = excludedDays.map((day) => +day);
    let labels: (string | number)[] = [];
    let data: number[] = [];
    let totalEarnings = 0;
    let orderCount = 0;

    if (orders) {
      const dates: Record<string, number> = {};
      const timeUnit = timeframe === 'year' ? 'month' : 'day';
      const dateFormat = timeframe === 'year' ? 'MMM' : 'YYYY-MM-DD';

      for (let i = 0; i <= endTime.diff(startTime, timeUnit); i++) {
        const date = startTime.add(i, timeUnit);
        const formatedDate = date.format(dateFormat);
        if (timeframe === 'year' || !excludedDaysNumbers.includes(date.day())) {
          dates[formatedDate] = 0;
        }
      }
      (orders as Order[]).forEach((order) => {
        const date = dayjs(order.deliveredTimestamp);
        const formatedDate = date.format(dateFormat);
        if (!excludedDaysNumbers.includes(date.day())) {
          dates[formatedDate] += order.price;
          orderCount++;
        }
      });
      [labels, data] = Object.entries(dates).reduce(([labels, data], [date, value]) => {
        labels.push(timeframe === 'year' ? date : dayjs(date).date());
        data.push(value);
        totalEarnings += value;
        return [labels, data];
      }, [labels, data]);
    }

    return { labels, data, totalEarnings, orderCount };
  }, [excludedDays, orders]);

  return (
    <Stack>
      <Title order={1}>Earnings</Title>
      {status === 'loading'
        ? (
          <Center>
            <Loader />
          </Center>
        ) : (
          <Stack spacing={0}>
            <Paper p="xs" sx={(theme) => ({
              cursor: 'default',
              backgroundColor: theme.colorScheme === 'dark'
                ? theme.colors.dark[8]
                : theme.colors.gray[1],
            })}>
              <Group>
                <Stack p={4} spacing={8} align="center" sx={{ flex: 1 }} >
                  <Text size={26} weight="bold" inline>
                    {visibleNumbers ? `$${totalEarnings.toLocaleString()}` : '*****'}
                  </Text>
                  <Text size="sm" weight="bold" color="dimmed" inline>Total</Text>
                </Stack>
                <Divider orientation="vertical" />
                <Stack p={4} spacing={8} align="center" sx={{ flex: 1 }} >
                  <Text size={26} weight="bold" inline>{orderCount}</Text>
                  <Text size="sm" weight="bold" color="dimmed" inline>Orders</Text>
                </Stack>
              </Group>
            </Paper>
            <Collapse in={visibleNumbers && labels.length > 1}>
              <Box pt="md">
                <Chart labels={labels} data={data} />
              </Box>
            </Collapse>
          </Stack>
        )}
      <EarningsFilters dateRange={dateRange} setDateRange={setDateRange} />
    </Stack>
  );
}

export default Earnings;
