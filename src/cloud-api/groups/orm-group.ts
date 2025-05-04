import type { ServerCall } from "#/cloud-api/api-client-types.ts";
import type { EntryType } from "#/types/entry-types.ts";
import type { SettingsType } from "#/types/settings-types.ts";

export class ORMGroup {
  readonly #call: ServerCall;

  constructor(call: ServerCall) {
    this.#call = call;
  }

  /**
   * Get all `EntryType` definitions.
   */
  async entryTypes(): Promise<Array<EntryType>> {
    return await this.#call<Array<EntryType>>("orm", "entryTypes");
  }

  async settingsTypes(): Promise<Array<SettingsType>> {
    return await this.#call<Array<SettingsType>>("orm", "settingsTypes");
  }

  async planMigration(): Promise<void> {
    return await this.#call<void>("orm", "planMigration");
  }

  async migrate(): Promise<void> {
    return await this.#call<void>("orm", "migrate");
  }

  async generateInterfaces(): Promise<void> {
    return await this.#call<void>("orm", "generateInterfaces");
  }
}
