import type { InValue } from "#/types/field-types.ts";
import type { BaseType, BaseTypeConfig } from "#/types/shared-types.ts";

export interface Settings {
  [key: string]: InValue;
}

export interface SettingsWithTimestamp<S extends Settings = Settings> {
  data: S;
  updatedAt: {
    [K in keyof S]: number;
  };
}
export interface SettingsTypeConfig extends BaseTypeConfig {
}

export interface SettingsType extends BaseType {
  config: SettingsTypeConfig;
}
