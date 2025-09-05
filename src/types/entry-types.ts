import type { IDMode, InField, InValue } from "./field-types.ts";
import type { BaseType, BaseTypeConfig } from "./shared-types.ts";
import type { IDValue } from "./mod.ts";

export interface EntryAction {
  key: string;
  label?: string;
  description?: string;
  params: Array<InField>;
}
export interface EntryConnection {
  referencingEntry: string;
  referencingEntryLabel: string;
  referencingField: string;
  referencingFieldLabel: string;
  listFields: Array<InField>;
}

export interface EntryTypeConfig extends BaseTypeConfig {
  tableName: string;
  titleField?: string;
  taggable?: boolean;
  idMode: IDMode;
  searchFields?: Array<string>;
  defaultListFields?: Array<string>;
}

export interface EntryType extends BaseType {
  config: EntryTypeConfig;
  actions: Array<EntryAction>;
  defaultListFields: Array<InField>;
  statusField?: InField<"ChoicesField">;
  imageField?: InField<"ImageField">;
  connections: Array<EntryConnection>;
  permission: Record<string, unknown>;
}

export interface Entry {
  id: IDValue;
  createdAt: number;
  updatedAt: number;
  in__tags?: number[];
  [key: string]: InValue | undefined;
}
