# Line annotation: `tsconfig.json`

`tsconfig.json` is strict JSON, so this companion explains every meaningful line in source order.

- The opening object contains the TypeScript project.
- `compilerOptions` opens the rules applied to every included program file.
- `target: ES2022` keeps emitted-language assumptions modern enough for the supported evergreen browsers, although `noEmit` leaves Vite responsible for output.
- `useDefineForClassFields` follows current JavaScript class-field semantics.
- `lib` provides modern language, browser DOM, and iterable DOM type definitions.
- `allowJs: false` prevents untyped JavaScript from entering TypeScript application modules accidentally.
- `skipLibCheck` avoids spending project checks on declaration internals already owned by installed packages.
- `esModuleInterop` and `allowSyntheticDefaultImports` make standards-oriented dependencies usable through predictable import syntax.
- `strict` activates TypeScript's complete strict family.
- `noUncheckedIndexedAccess` makes an indexed lookup acknowledge that a value may be absent.
- `exactOptionalPropertyTypes` distinguishes a missing field from a field explicitly assigned `undefined`.
- `noImplicitOverride` requires derived classes to state when they replace base behavior.
- `noFallthroughCasesInSwitch` protects later timer transitions from accidental branch fallthrough.
- `noUnusedLocals` and `noUnusedParameters` reject abandoned code and inputs.
- `forceConsistentCasingInFileNames` prevents imports that work on one file system but fail in Linux automation.
- `module: ESNext` preserves modern modules for Vite.
- `moduleResolution: Bundler` matches Vite's package resolution model.
- `resolveJsonModule` permits typed local JSON imports when later approved schemas require them.
- `isolatedModules` requires every module to be safe for independent Vite transformation.
- `moduleDetection: force` treats every included authored file as an isolated module.
- `noEmit` reserves production output for Vite rather than creating loose JavaScript beside source files.
- `jsx: react-jsx` enables React's modern JSX transform.
- `types` loads Vite asset declarations, Vitest globals, and Node configuration APIs.
- The first closing brace ends `compilerOptions`.
- `include` limits checks to source and the four human-authored configuration modules.
- The final brace closes the TypeScript project.
