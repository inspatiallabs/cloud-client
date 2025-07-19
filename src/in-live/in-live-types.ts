import type { Entry } from "../types/entry-types.ts";
import type { IDValue } from "../types/mod.ts";
import type { Settings } from "../types/settings-types.ts";

/**
 * The status of the websocket connection.
 */
export type SocketStatus =
  | "open"
  | "closed"
  | "connecting"
  | "error"
  | "reconnected";

export type EntryEventUpdate<E extends Entry> = E;

export interface EntryEventDelete<E> {
  [key: string]: unknown;
}

export interface EntryEventJoin<E = Entry> {
  [key: string]: unknown;
}

export interface EntryEventLeave<E> {
  [key: string]: unknown;
}

export type EntryEventMap<E extends Entry = Entry> = {
  update: EntryEventUpdate<E>;
  delete: EntryEventDelete<E>;
  create: EntryEventUpdate<E>;
  join: EntryEventJoin<E>;
  leave: EntryEventLeave<E>;
};

export type SettingsEventMap<S extends Settings = Settings> = {
  update: S;
  join: Record<string, unknown>;
  leave: Record<string, unknown>;
};
export type SettingsListener<S extends Settings = Settings, E extends keyof SettingsEventMap<S> = keyof SettingsEventMap<S>> = {
  name: ListenerName;
  callback(event: E, data: SettingsEventMap<S>[E]): Promise<void> | void;
};
export type EntryEvent<E extends Entry = Entry> = keyof EntryEventMap<E>;

export type EntryListener<
  T extends Entry = Entry,
  E extends EntryEvent<T> = EntryEvent<T>,
> = {
  name: ListenerName;
  callback(event: E, data: EntryEventMap<T>[E]): Promise<void> | void;
};

export interface EntryTypeEventCreate<E> {
  [key: string]: unknown;
}

export interface EntryTypeEventUpdate<E> {
  [key: string]: unknown;
}

export interface EntryTypeEventDelete {
  deleted: boolean;
  entryType: string;
  id: IDValue;
}

export type EntryTypeEventMap<T extends Record<string, any>> = {
  create: T;
  update: T;
  delete: { deleted: boolean }
};


export type EntryTypeListener<
  T extends Record<string, any>,
> = {
  name: ListenerName;
  callback(event: keyof EventNameMap, data: T): void | Promise<void>;
};
type EntryTypeName = string;
type EntryId = string;
type ListenerName = string;
export type EntryCallbackMap = Map<EntryTypeName, {
  listeners: Map<ListenerName, EntryTypeListener<any>>;
  entries: Map<EntryId, Map<ListenerName, EntryListener>>;
}>;


export interface EventNameMap {
  create: any,
  update: any,
  delete: any,
  join: any,
  leave: any,
}
