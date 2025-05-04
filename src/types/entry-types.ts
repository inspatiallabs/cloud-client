import type { IDMode, InValue, ORMField } from "#/types/field-types.ts";
import type { BaseType, BaseTypeConfig } from "#/types/shared-types.ts";
import type { IDValue } from "#/types/mod.ts";

export interface EntryAction {
  key: string;
  label?: string;
  description?: string;
  params: Array<ORMField>;
}

export interface EntryTypeConfig extends BaseTypeConfig {
  tableName: string;
  titleField?: string;
  idMode: IDMode;
  searchFields?: Array<string>;
  defaultListFields?: Array<string>;
}

export interface EntryType extends BaseType {
  config: EntryTypeConfig;
  actions: Array<EntryAction>;
  defaultListFields: Array<ORMField>;
}

export interface Entry {
  id: IDValue;
  createdAt: number;
  updatedAt: number;

  [key: string]: InValue;
}
