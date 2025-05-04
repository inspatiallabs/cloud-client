import type { InField } from "#/types/field-types.ts";

/**
 * The full documentation for an ActionsAPI instance in JSON format.
 */
export interface CloudAPIDocs extends Record<string, unknown> {
  /**
   * An array of groups in the API.
   * Each group contains an array of actions.
   */
  groups: CloudAPIGroupDocs[];
}

/**
 * The documentation for an ActionsAPI group in JSON format.
 */
export interface CloudAPIGroupDocs {
  /**
   * The name of the group.
   */
  groupName: string;

  /**
   * A description of the group.
   */
  description: string;
  /**
   * An array of actions in the group.
   */

  /**
   * A label for the group to display in the UI.
   */
  label?: string;
  actions: CloudAPIActionDocs[];
}

/**
 * The documentation for an ActionsAPI action in JSON format.
 */
export interface CloudAPIActionDocs {
  /**
   * The name of the action.
   */
  actionName: string;
  /**
   * A description of the action.
   */
  description: string;
  /**
   * An array of parameters for the action.
   */

  /**
   * A label for the action to display in the UI.
   */
  label?: string;
  /**
   * A list of parameters available for this action
   */
  params: Array<InField>;
}
