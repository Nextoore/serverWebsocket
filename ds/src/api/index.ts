import { action, cache } from "@solidjs/router";
import { getUser as gU, logout as l, postToServer as PTS } from "./server";

export const getUser = cache(gU, "user");
export const postToServer = action(PTS, "postToServer");
export const logout = action(l, "logout");