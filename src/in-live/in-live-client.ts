import type {
  EntryCallbackMap,
  EntryEvent,
  EntryListener,
  EntryTypeEventMap,
  EntryTypeListener,
  EventNameMap,
  SettingsEventMap,
  SettingsListener,
  SocketStatus,
} from "./in-live-types.ts";
import { InLiveClientBase } from "./in-live-base.ts";
import type { Entry } from "../types/entry-types.ts";

export class InLiveClient {
  client: InLiveClientBase;
  #callbacks: EntryCallbackMap = new Map();
  #settingsCallbacks: Map<string, Map<string, SettingsListener>> = new Map();
  #statusCallbacks: Map<
    string,
    (status: SocketStatus) => Promise<void> | void
  > = new Map();

  constructor(host?: string) {
    this.client = new InLiveClientBase(host);
    this.#setupListeners();
  }

  /**
   * Start the client connection to the server.
   * @param authToken The authentication token to use for the connection.
   */
  start(authToken?: string): void {
    if (this.client.connected) {
      return;
    }
    this.client.connect(authToken);
  }

  /**
   * Stop the client connection to the server.
   */
  stop(): void {
    this.client.disconnect();
  }

  /**
   * Add a listener for a specific entry event by `EntyType` and `id`.
   * If this is the first listener for the entry, the client will join the server room for the entry.
   */
  onEntry<
    T extends Entry = Entry,
    E extends EntryEvent<T> = EntryEvent<T>,
    L extends EntryListener<T, E> = EntryListener<T, E>,
  >(
    entryType: string,
    id: string,
    listener: L,
  ): void {
    const entryListeners = this.#ensureEntry(entryType, id);
    if (entryListeners.has(listener.name)) {
      throw new Error(`Listener with name ${listener.name} already exists`);
    }
    entryListeners.set(listener.name, listener);

    this.#joinEntryRoom(entryType, id);
  }

  // onSettings<S extends Settings = Settings>(
  //   settings: string,
  //   listener: EntryListener<Entry, EntryEvent<Entry>>,
  // ) {}
  /**
   * Remove a listener for a specific entry by `EntyType` and `id`.
   * If this is the last listener for the entry, the client will leave the server room for the entry.
   */
  removeEntryListener(
    entryType: string,
    id: string,
    listenerName: string,
  ): void {
    const entryListeners = this.#ensureEntry(entryType, id);
    if (!entryListeners.has(listenerName)) {
      throw new Error(`Listener with name ${listenerName} does not exist`);
    }
    entryListeners.delete(listenerName);

    if (entryListeners.size === 0) {
      this.leaveEntry(entryType, id);
    }
  }

  removeSettingsListener(
    settings: string,
    listenerName: string,
  ): void {
    const listenerMap = this.#ensureSettings(settings);
    if (!listenerMap.has(listenerName)) {
      throw new Error(`Listener with name ${listenerName} does not exist`);
    }
    listenerMap.delete(listenerName);

    if (listenerMap.size === 0) {
      this.leaveSettings(settings);
    }
  }

  /**
   * Clear all listeners for a specific entry by `EntyType` and `id`.
   * This will also leave the server room for the entry, so no more events will be sent
   * to the client for this entry.
   */
  leaveEntry(entryType: string, id: string): void {
    this.#leaveEntryRoom(entryType, id);
    this.#clearEntry(entryType, id);
  }

  leaveSettings(settings: string) {
    this.#leaveSettingsRoom(settings);
    this.#clearSettings(settings);
  }

  /**
   * Add a listener for a specific entry type event.
   * If this is the first listener for the entry type, the client will join the server room for the entry type.
   */
  onEntryType<T extends Record<string, any>>(
    entryType: string,
    listener: EntryTypeListener<T>,
  ): void {
    const listenerMap = this.#ensureEntryType(entryType);
    if (listenerMap.listeners.has(listener.name)) {
      console.warn(`Listener with name ${listener.name} already exists`);
      return;
    }
    listenerMap.listeners.set(listener.name, listener);

    this.#joinEntryTypeRoom(entryType);
  }

  /**
   * Remove a listener for a specific entry type.
   * If this is the last listener for the entry type, the client will leave the server room for the entry type.
   */
  removeEntryTypeListener(entryType: string, listenerName: string): void {
    const listenerMap = this.#ensureEntryType(entryType);
    listenerMap.listeners.delete(listenerName);

    if (listenerMap.listeners.size === 0) {
      this.leaveEntryType(entryType);
    }
  }

  /** */
  onSettings<L extends SettingsListener>(
    settings: string,
    listener: L,
  ): void {
    const listenerMap = this.#ensureSettings(settings);
    if (listenerMap.has(listener.name)) {
      throw new Error(`Listener with name ${listener.name} already exists`);
    }
    listenerMap.set(listener.name, listener);

    this.#joinSettingsRoom(settings);
  }

  /**
   * Clear all listeners for a specific entry type.
   * This will also leave the server room for the entry type,
   * so no more events will be sent to this client for this entry type.
   */
  leaveEntryType(entryType: string): void {
    const entryTypeListeners = this.#ensureEntryType(entryType);
    entryTypeListeners.listeners.clear();
    this.#leaveEntryTypeRoom(entryType);
  }

  /**
   * Add a listener for the connection status of the client.
   * @param listener The listener to add
   * @returns The id of the listener, which can be used to remove the listener
   */
  onConnectionStatus(
    listener: (status: SocketStatus) => void,
  ): string {
    const id = this.#statusCallbacks.size.toString();
    this.#statusCallbacks.set(id, listener);
    return id;
  }

  /**
   * Remove a listener for the connection status of the client.
   * @param id The id of the listener to remove. This is the id returned from `onConnectionStatus`.
   */
  removeConnectionStatusListener(id: string): void {
    this.#statusCallbacks.delete(id);
  }

  #joinEntryRoom(
    entryType: string,
    id: string,
  ) {
    this.client.join(`entry:${entryType}:${id}`);
  }
  #leaveEntryRoom(
    entryType: string,
    id: string,
  ) {
    this.client.leave(`entry:${entryType}:${id}`);
  }
  #joinEntryTypeRoom(entryType: string) {
    this.client.join(`entryType:${entryType}`);
  }
  #leaveEntryTypeRoom(entryType: string) {
    this.client.leave(`entryType:${entryType}`);
  }

  #joinSettingsRoom(settings: string) {
    this.client.join(`settings:${settings}`);
  }
  #leaveSettingsRoom(settings: string) {
    this.client.leave(`settings:${settings}`);
  }

  #ensureSettings(settings: string) {
    if (!this.#settingsCallbacks.has(settings)) {
      this.#settingsCallbacks.set(settings, new Map());
    }
    const listenerMap = this.#settingsCallbacks.get(settings)!;
    return listenerMap;
  }
  #ensureEntryType(entryType: string) {
    if (!this.#callbacks.has(entryType)) {
      this.#callbacks.set(entryType, {
        listeners: new Map(),
        entries: new Map(),
      });
    }
    const listenerMap = this.#callbacks.get(entryType)!;
    return listenerMap;
  }

  #ensureEntry(entryType: string, id: string) {
    const listenerMap = this.#ensureEntryType(entryType);
    if (!listenerMap.entries.has(id)) {
      listenerMap.entries.set(id, new Map());
    }
    const entryMap = listenerMap.entries.get(id)!;

    return entryMap;
  }

  #clearEntry(entryType: string, id: string) {
    const listenerMap = this.#ensureEntryType(entryType);
    listenerMap.entries.delete(id);
  }
  #clearSettings(settings: string) {
    const listenerMap = this.#ensureSettings(settings);
    listenerMap.clear();
    this.#settingsCallbacks.delete(settings);
  }

  #setupListeners() {
    this.client.onMessage((room, event, data) => {
      const [prefix, name, id] = room.split(":");
      switch (prefix) {
        case "settings":
          return this.#handleSettingsEvent(name, event, data);
        case "entry":
          return this.#handleEntryEvent(name, id, event, data);
        case "entryType":
          return this.#handleEntryTypeEvent(name, event, data);
        case "everyone":
          return; // This is a broadcast message, no need to handle it here
      }
    });

    this.client.onStatusChange((status) => {
      for (const listener of this.#statusCallbacks.values()) {
        listener(status);
      }
    });
  }
  #handleSettingsEvent(
    settings: string,
    event: string,
    data: Record<string, unknown>,
  ) {
    const listenerMap = this.#ensureSettings(settings);
    if (listenerMap.size === 0) {
      this.leaveSettings(settings);
      return;
    }
    for (const listener of listenerMap.values()) {
      listener.callback(event as keyof SettingsEventMap, data);
    }
  }

  #handleEntryEvent(
    entryType: string,
    id: string,
    event: string,
    data: Record<string, unknown>,
  ) {
    const entryListeners = this.#ensureEntry(entryType, id);
    if (entryListeners.size === 0) {
      this.leaveEntry(entryType, id);
      return;
    }
    for (const listener of entryListeners.values()) {
      listener.callback(event as EntryEvent, data);
    }
  }

  #handleEntryTypeEvent(
    entryType: string,
    event: string,
    data: Record<string, unknown>,
  ) {
    const listenerMap = this.#ensureEntryType(entryType);
    if (listenerMap.listeners.size === 0) {
      this.leaveEntryType(entryType);
      return;
    }
    for (const listener of listenerMap.listeners.values()) {
      listener.callback(event as any, data);
    }
  }
}
