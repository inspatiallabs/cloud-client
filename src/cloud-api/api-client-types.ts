import type { InValue } from "#/types/field-types.ts";

export interface ErrorInfo {
  statusCode: number;
  message: string;
  title?: string;
}

export type ServerCall = <T>(
  group: string,
  action: string,
  data?: Record<string, unknown>,
  method?: RequestInit["method"],
) => Promise<T>;

export interface NotificationInfo {
  title: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
}

export interface ListResponse<T = Record<string, InValue>> {
  columns: Array<string>;
  rowCount: number;
  rows: Array<T>;
  totalCount: number;
}

export interface ListOptions {
  columns?: Array<string>;
  filter?: DBFilter;
  orFilter?: DBFilter;
  limit?: number;
  offset?: number;
  orderBy?: string;
  order?: "asc" | "desc";
}

export type DBFilter = Record<string, InValue | AdvancedFilter>;

export interface AdvancedFilter {
  op:
    | "contains"
    | "notContains"
    | "inList"
    | "notInList"
    | "between"
    | "notBetween"
    | "is"
    | "isNot"
    | "isEmpty"
    | "isNotEmpty"
    | "startsWith"
    | "endsWith"
    | "greaterThan"
    | "lessThan"
    | "greaterThanOrEqual"
    | "lessThanOrEqual"
    | "equal"
    | ">"
    | "<"
    | ">="
    | "<="
    | "="
    | "!=";
  value: InValue | Array<InValue>;
}

export interface GetListResponse<T = Record<string, InValue>> {
  rowCount: number;
  totalCount: number;
  rows: T[];
  columns: string[];
}
