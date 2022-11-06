import { Dispatch, SetStateAction } from 'react';
import { RiCalendar2Line, RiCalendarEventLine } from 'react-icons/ri';

import { Collapse, MultiSelect, Stack } from '@mantine/core';
import { DateRangePicker, DateRangePickerValue } from '@mantine/dates';
import { useLocalStorage } from '@mantine/hooks';

import { LabeledSegmentedControl } from '../../../components';

interface EarningsFiltersProps {
  dateRange: DateRangePickerValue;
  setDateRange: Dispatch<SetStateAction<DateRangePickerValue>>;
}

function EarningsFilters({ dateRange, setDateRange }: EarningsFiltersProps) {
  const [timeframe, setTimeframe] = useLocalStorage<Filters.Timeframe>({
    key: 'timeframe-filter',
    defaultValue: 'year',
  });
  const [excludedDays, setExcludedDays] = useLocalStorage<string[]>({
    key: 'excluded-days-filter',
    defaultValue: [],
  });

  return (
    <Stack>
      <Stack spacing={0}>
        <LabeledSegmentedControl
          label="Timeframe"
          data={[
            { label: 'Week', value: 'week' },
            { label: 'Month', value: 'month' },
            { label: 'Year', value: 'year' },
            { label: 'Custom', value: 'custom' },
          ]}
          value={timeframe}
          onChange={(value: Filters.Timeframe) => setTimeframe(value)}
        />
        <Collapse in={timeframe === 'custom'}>
          <DateRangePicker
            icon={<RiCalendar2Line />}
            placeholder="Select dates range"
            firstDayOfWeek="sunday"
            value={dateRange}
            onChange={setDateRange}
            pt="md"
          />
        </Collapse>
      </Stack>
      <MultiSelect
        label="Exclude"
        data={[
          { label: 'Sunday', value: '0' },
          { label: 'Monday', value: '1' },
          { label: 'Tuesday', value: '2' },
          { label: 'Wednesday', value: '3' },
          { label: 'Thursday', value: '4' },
          { label: 'Friday', value: '5' },
          { label: 'Saturday', value: '6' },
        ]}
        icon={<RiCalendarEventLine />}
        placeholder="Select days"
        value={excludedDays}
        onChange={setExcludedDays}
      />
    </Stack>
  );
}

export default EarningsFilters;
