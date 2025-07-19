import type { InValue } from "./field-types.ts";
import type { BaseType, BaseTypeConfig } from "./shared-types.ts";

export interface Settings {
  [key: string]: any;
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
