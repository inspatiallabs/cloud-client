import type { InField } from "#/types/field-types.ts";
import type { ChildEntryType } from "#/types/child-types.ts";

export interface BaseType {
  name: string;
  description: string;
  extension?: string;
  label: string;
  fields: Array<InField>;
  titleFields: Array<InField>;
  children?: Array<ChildEntryType>;
  displayFields: Array<InField>;
}

export interface BaseTypeConfig {
  label: string;
  description: string;
  extension?: {
    extensionType: {
      key: string;
      label: string;
    };
    key: string;
    label: string;
    description: string;
    version?: string;
  };
}
