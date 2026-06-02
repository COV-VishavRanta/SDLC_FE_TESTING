const DEFAULT_PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 800;
const INITIAL_PAGE_INDEX = 0; // TanStack is 0-indexed; GraphQL page is 1-indexed
const ALL_RECORDS_PAGE_SIZE = -1;

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

/** Page size options for card-based list layouts (orders, installation proof tabs) */
const CARD_PAGE_SIZE_OPTIONS = [5, 10, 50, 100] as const;
const DEFAULT_CARD_PAGE_SIZE = 5;

const STATUS_OPTIONS = [
  { label: 'Active', value: 'true' },
  { label: 'Inactive', value: 'false' },
];
export {
  ALL_RECORDS_PAGE_SIZE,
  CARD_PAGE_SIZE_OPTIONS,
  DEFAULT_CARD_PAGE_SIZE,
  DEFAULT_PAGE_SIZE,
  INITIAL_PAGE_INDEX,
  PAGE_SIZE_OPTIONS,
  SEARCH_DEBOUNCE_MS,
  STATUS_OPTIONS,
};
