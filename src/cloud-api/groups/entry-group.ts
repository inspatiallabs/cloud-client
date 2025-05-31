import type { InValue } from "#/types/field-types.ts";
import type { Entry } from "#/types/entry-types.ts";
import type {
  GetListResponse,
  ListOptions,
  ServerCall,
} from "../api-client-types.ts";
import type { IDValue } from "#/types/mod.ts";

export class EntryGroup {
  #call: ServerCall;

  constructor(
    call: ServerCall,
  ) {
    this.#call = call;
  }

  async getEntry<T = Entry>(entryType: string, id: string): Promise<T> {
    return await this.#call<T>("entry", "getEntry", { entryType, id });
  }

  /**
   * Get a list of entries of a given type.
   */
  async getEntryList<T = Record<string, InValue>>(
    entryType: string,
    options?: ListOptions,
  ): Promise<GetListResponse<T>> {
    return await this.#call("entry", "getEntryList", {
      entryType,
      options,
    });
  }

  async getNewEntry<T = Record<string, InValue>>(
    entryType: string,
  ): Promise<T> {
    return await this.#call<T>("entry", "getNewEntry", { entryType });
  }

  async createEntry<T = Entry>(
    entryType: string,
    entry: Record<string, InValue>,
  ): Promise<T> {
    return await this.#call<T>("entry", "createEntry", {
      entryType,
      data: entry,
    });
  }

  async updateEntry<T = Record<string, InValue>>(
    entryType: string,
    id: IDValue,
    entry: T,
  ): Promise<T> {
    return await this.#call<T>("entry", "updateEntry", {
      entryType,
      id,
      data: entry,
    });
  }

  async deleteEntry(entryType: string, id: IDValue): Promise<void> {
    return await this.#call<void>("entry", "deleteEntry", { entryType, id });
  }

  async runEntryAction(
    entryType: string,
    id: string,
    action: string,
    data?: Record<string, InValue>,
  ): Promise<void | unknown> {
    return await this.#call("entry", "runEntryAction", {
      entryType,
      id,
      action,
      data,
    });
  }
}
