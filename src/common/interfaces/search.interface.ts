export interface FilterParams {
  [x: string]: any;
}

export interface Pagination {
  page: number;
  size: number;
}

export interface Sort {
  field: string;
  order: 'ASC' | 'DESC';
}

export interface SearchParams {
  filter: FilterParams;
  pagination: Pagination;
  sort: Sort;
}

export interface SearchDto {
  page?: number;
  size?: number;
  field?: string;
  order?: 'ASC' | 'DESC';
  [x: string]: any;
}
