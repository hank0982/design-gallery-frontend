export interface IPagination<T> {
  count: number;
  nextSkip: number;
  results: T[];
}