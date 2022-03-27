export type SearchQuery = UnparsedSearchQuery | ParsedSearchQuery;

export interface UnparsedSearchQuery {
  search: string;
  sortField?: string;
  sortDirection?: 'ASC' | 'DESC';
}

export interface ParsedSearchQuery {
  coursePrefix?: string;
  courseNumber?: string;
  year?: string;
  type?: string;
  sectionNumber?: string;
  firstName?: string;
  lastName?: string;
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
