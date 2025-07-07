import type { InField } from "#/types/field-types.ts";
import type { ChildEntryType } from "#/types/child-types.ts";

export interface BaseType {
  name: string;
  description: string;
  extension?: string;
  systemGlobal: boolean;
  label: string;
  fields: Array<InField>;
  titleFields: Array<InField>;
  children?: Array<ChildEntryType>;
  displayFields: Array<InField>;
  fieldGroups: Array<FieldGroup>;
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

export interface FieldGroup {
  key: string;
  label: string;
  description?: string;
  fields: Array<InField>;
  displayFields: Array<InField>;
}
