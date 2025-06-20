import type {
  EntryCallbackMap,
  EntryEvent,
  EntryListener,
  EntryTypeEvent,
  EntryTypeListener,
  SocketStatus,
} from "./in-live-types.ts";
import { InLiveClientBase } from "./in-live-base.ts";
import type { Entry } from "#/types/entry-types.ts";

export class InLiveClient {
  client: InLiveClientBase;
  #callbacks: EntryCallbackMap = new Map();
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

  /**
   * Clear all listeners for a specific entry by `EntyType` and `id`.
   * This will also leave the server room for the entry, so no more events will be sent
   * to the client for this entry.
   */
  leaveEntry(entryType: string, id: string): void {
    this.#leaveEntryRoom(entryType, id);
    this.#clearEntry(entryType, id);
  }

  /**
   * Add a listener for a specific entry type event.
   * If this is the first listener for the entry type, the client will join the server room for the entry type.
   */
  onEntryType<T, E extends EntryTypeEvent<T> = EntryTypeEvent<T>>(
    entryType: string,
    listener: EntryTypeListener<T, E>,
  ): void {
    const listenerMap = this.#ensureEntryType(entryType);
    if (listenerMap.listeners.has(listener.name)) {
      throw new Error(`Listener with name ${listener.name} already exists`);
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
    this.client.join(`${entryType}:${id}`);
  }

  #joinEntryTypeRoom(entryType: string) {
    this.client.join(entryType);
  }

  #leaveEntryRoom(
    entryType: string,
    id: string,
  ) {
    this.client.leave(`${entryType}:${id}`);
  }

  #leaveEntryTypeRoom(entryType: string) {
    this.client.leave(entryType);
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

  #setupListeners() {
    this.client.onMessage((room, event, data) => {
      const [entryType, id] = room.split(":");
      if (id) {
        this.#handleEntryEvent(entryType, id, event, data);
      } else {
        this.#handleEntryTypeEvent(entryType, event, data);
      }
    });

    this.client.onStatusChange((status) => {
      for (const listener of this.#statusCallbacks.values()) {
        listener(status);
      }
    });
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
      listener.callback(event as EntryTypeEvent, data);
    }
  }
}
