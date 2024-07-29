import { action, cache } from "@solidjs/router";
import { postToServer as PTS } from "./server";

export const postToServer = action(PTS, "postToServer");
