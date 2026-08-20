// Import timer fixtures and guarded local storage helpers for recovery checks.
import { createTimerState, timerReducer } from "../../timer/engine";
import { TIMER_STORAGE_KEY, loadTimerState, saveTimerState } from "../../timer/storage";
// Import Vitest helpers for isolated in-memory persistence assertions.
import { describe, expect, it } from "vitest";

// Implement the narrow Storage contract used by timer persistence without browser side effects.
function createStorage(): Storage {
  const values = new Map<string, string>();
  return {
    get length() {
      return values.size;
    },
    clear: () => values.clear(),
    getItem: (key) => values.get(key) ?? null,
    key: (index) => [...values.keys()][index] ?? null,
    removeItem: (key) => void values.delete(key),
    setItem: (key, value) => void values.set(key, value),
  };
}

describe("timer recovery storage", () => {
  it("round-trips a target timestamp without writing per-second snapshots", () => {
    const storage = createStorage();
    const running = timerReducer(createTimerState("focus"), { type: "START", now: 20_000 });
    saveTimerState(running, storage);
    expect(loadTimerState(storage)).toEqual(running);
    expect(storage.length).toBe(1);
  });

  it("ignores malformed or unrecognized saved state safely", () => {
    const storage = createStorage();
    storage.setItem(TIMER_STORAGE_KEY, JSON.stringify({ phase: "invented" }));
    expect(loadTimerState(storage)).toBeNull();
    storage.setItem(TIMER_STORAGE_KEY, "not json");
    expect(loadTimerState(storage)).toBeNull();
  });
});
