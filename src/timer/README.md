# Timer source boundary

Phase 3 places the pure timestamp-based state machine in `engine.ts`, guarded local recovery in `storage.ts`, and browser coordination in `useTimer.ts`. The visible refresh interval never represents elapsed time. Remaining time is always derived from a target wall-clock timestamp, while a monotonic clock detects meaningful device-clock changes and asks the visitor how to recover.
