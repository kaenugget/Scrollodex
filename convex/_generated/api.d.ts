/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as actions from "../actions.js";
import type * as agents from "../agents.js";
import type * as ai from "../ai.js";
import type * as auth from "../auth.js";
import type * as contacts from "../contacts.js";
import type * as dex from "../dex.js";
import type * as files from "../files.js";
import type * as integrations from "../integrations.js";
import type * as notes from "../notes.js";
import type * as nudges from "../nudges.js";
import type * as pets from "../pets.js";
import type * as preferences from "../preferences.js";
import type * as seed from "../seed.js";
import type * as sharing from "../sharing.js";
import type * as social from "../social.js";
import type * as users from "../users.js";
import type * as wallet from "../wallet.js";
import type * as workflows from "../workflows.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  actions: typeof actions;
  agents: typeof agents;
  ai: typeof ai;
  auth: typeof auth;
  contacts: typeof contacts;
  dex: typeof dex;
  files: typeof files;
  integrations: typeof integrations;
  notes: typeof notes;
  nudges: typeof nudges;
  pets: typeof pets;
  preferences: typeof preferences;
  seed: typeof seed;
  sharing: typeof sharing;
  social: typeof social;
  users: typeof users;
  wallet: typeof wallet;
  workflows: typeof workflows;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {};
