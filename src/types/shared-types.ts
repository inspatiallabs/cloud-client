import type { ORMField } from "#/types/field-types.ts";
import type { ChildEntryTypeInfo } from "#/types/child-types.ts";

export interface BaseType {
  name: string;
  description: string;
  extension?: string;
  label: string;
  fields: Array<ORMField>;
  titleFields: Array<ORMField>;
  children?: Array<ChildEntryTypeInfo>;
  displayFields: Array<ORMField>;
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
