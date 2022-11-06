interface Client {
  NO_ID_FIELD: string;
  name: string;
}

interface Order {
  NO_ID_FIELD: string;
  status: 'pending' | 'finished' | 'delivered';
  clientId: string;
  price: number;
  receivedTimestamp: number;
  deliveredTimestamp: number | null;
}

declare namespace Filters {
  type Status = 'all' | 'pending' | 'finished' | 'delivered';
  type OrderBy = 'price' | 'receivedTimestamp' | 'deliveredTimestamp';
  type Timeframe = 'week' | 'month' | 'year' | 'custom';
}
