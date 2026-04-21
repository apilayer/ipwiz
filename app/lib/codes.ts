import { customAlphabet } from "nanoid";

// 36^7 ≈ 78B combinations — collisions effectively impossible at demo scale.
// Lowercase + digits so shortened URLs stay tidy when copy/pasted.
export const newGrabCode = customAlphabet(
  "abcdefghijklmnopqrstuvwxyz0123456789",
  7
);

export const newId = () => crypto.randomUUID();
