export interface SearchQuery {
  search: string;
  sortField?: string;
  sortDirection?: 'ASC' | 'DESC';
}

export interface UserFriendlyGrades {
  'A+'?: number;
  'A'?: number;
  'A-'?: number;
  'B+'?: number;
  'B'?: number;
  'B-'?: number;
  'C+'?: number;
  'C'?: number;
  'C-'?: number;
  'D+'?: number;
  'D'?: number;
  'D-'?: number;
  'F'?: number;
  'CR'?: number;
  'NC'?: number;
  'P'?: number;
  'W'?: number;
  'I'?: number;
  'NF'?: number;
}
