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

export type DBFilter =
  | Array<InFilter>
  | Record<string, string | number | null | boolean>;

export interface GetListResponse<T = Record<string, InValue>> {
  rowCount: number;
  totalCount: number;
  rows: T[];
  columns: string[];
}

type EqualsOp = "=" | "equal" | "!=" | "notEqual";
type ComparisonOp =
  | "<"
  | "<="
  | ">"
  | ">="
  | "lessThanOrEqual"
  | "lessThan"
  | "greaterTan"
  | "greaterThanOrEqual";
type BetweenOps = "between" | "notBetween";
type EmptyOps = "isEmpty" | "isNotEmpty";
type ListOps = "notInList" | "inList";
type ContainsOps = "contains" | "notContains" | "startsWith" | "endsWith";
export type FilterOps =
  | EqualsOp
  | ComparisonOp
  | BetweenOps
  | EmptyOps
  | ListOps
  | ContainsOps;

type FilterInList = {
  op: ListOps;
  value: Array<string> | Array<number>;
};

type FilterEqual = {
  op: EqualsOp;
  value: string | number;
};
export type FilterBetween = {
  op: BetweenOps;
  value: [string, string] | [number, number];
};

type FilterEmpty = {
  op: EmptyOps;
};
type FilterCompare = {
  op: ComparisonOp;
  value: string | number;
};

type FilterContains = {
  op: ContainsOps;
  value: string;
  caseSensitive?: boolean;
};
export type FilterAll =
  | FilterInList
  | FilterEqual
  | FilterBetween
  | FilterEmpty
  | FilterCompare
  | FilterContains;

export type InFilter =
  | FilterAll
    & {
      field: string;
      or?: Array<FilterAll>;
      and?: Array<FilterAll>;
    }
  | {
    field: string;
    or?: Array<FilterAll>;
    and?: Array<FilterAll>;
  };
