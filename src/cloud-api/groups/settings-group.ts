import type {
  Settings,
  SettingsWithTimestamp,
} from "../../types/settings-types.ts";
import type { ServerCall } from "../api-client-types.ts";

export class SettingsGroup {
  #call: ServerCall;

  constructor(call: ServerCall) {
    this.#call = call;
  }

  async getSettings<S extends Settings = Settings>(
    settingsType: string,
  ): Promise<S> {
    return await this.#call<S>("settings", "getSettings", { settingsType });
  }

  async getSettingsWithModifiedTime<S extends Settings = Settings>(
    settingsType: string,
  ): Promise<SettingsWithTimestamp<S>> {
    return await this.#call<SettingsWithTimestamp<S>>(
      "settings",
      "getSettings",
      {
        settingsType,
        withModifiedTime: true,
      },
    );
  }

  async updateSettings<S extends Settings = Settings>(
    settingsType: string,
    data: Partial<S>,
  ): Promise<S> {
    return await this.#call<S>("settings", "updateSettings", {
      settingsType,
      data,
    });
  }

  async runSettingsAction<T, R>(
    settingsType: string,
    action: string,
    data: T,
    enqueue: boolean = false,
  ): Promise<R> {
    return await this.#call<R>("settings", "runSettingsAction", {
      settingsType,
      action,
      data,
      enqueue,
    });
  }
}
