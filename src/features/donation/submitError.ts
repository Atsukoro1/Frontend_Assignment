import { ApiError } from "@/api/client";

export type SubmitErrorDescriptor =
  { kind: "key"; key: "errors.network" | "errors.submitFailed" } | { kind: "text"; text: string };

/**
 * Maps a failed submit to something human-readable. Server messages are
 * shown verbatim when they look like copy (the API responds in Slovak);
 * technical validation identifiers like "joi.body…" fall back to the
 * generic message.
 */
export function describeSubmitError(error: unknown): SubmitErrorDescriptor {
  if (error instanceof ApiError) {
    const humanMessage = error.messages.find(
      (message) => message.type === "ERROR" && !message.message.startsWith("joi."),
    );
    if (humanMessage) {
      return { kind: "text", text: humanMessage.message };
    }
    return { kind: "key", key: "errors.submitFailed" };
  }
  // fetch() rejects with a TypeError when the network is unreachable.
  if (error instanceof TypeError) {
    return { kind: "key", key: "errors.network" };
  }
  return { kind: "key", key: "errors.submitFailed" };
}
