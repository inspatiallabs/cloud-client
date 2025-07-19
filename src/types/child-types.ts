import type { BaseType, BaseTypeConfig } from "./shared-types.ts";
import type { Entry } from "./entry-types.ts";

export interface ChildEntryConfig extends BaseTypeConfig {
  tableName?: string;
  parentEntryType?: string;
}

export interface ChildEntryType extends Omit<BaseType, "children"> {
}

export interface ChildEntry extends Entry {
  order: number;
}
