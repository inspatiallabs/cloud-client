import type { BaseType, BaseTypeConfig } from "#/types/shared-types.ts";
import type { Entry } from "#/types/entry-types.ts";

export interface ChildEntryConfig extends BaseTypeConfig {
  tableName?: string;
  parentEntryType?: string;
}

export interface ChildEntryTypeInfo extends Omit<BaseType, "children"> {
}

export interface ChildEntry extends Entry {
}
