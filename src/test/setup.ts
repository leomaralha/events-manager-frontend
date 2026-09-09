import "@testing-library/jest-dom/vitest";

// jsdom's AbortController/AbortSignal shadow Node's native ones once the
// jsdom test environment is installed. React Router's data router builds an
// internal Request on every navigation using `new AbortController()`, and
// Node's native Request/fetch implementation rejects a signal that isn't its
// own native AbortSignal, throwing and aborting the navigation. This app
// never issues a real network request, so the signal is never actually used
// for cancellation — strip it before delegating to the native Request.
const NativeRequest = globalThis.Request;
class PatchedRequest extends NativeRequest {
  constructor(input: RequestInfo | URL, init?: RequestInit) {
    if (init && Object.prototype.hasOwnProperty.call(init, "signal")) {
      const { signal, ...rest } = init;
      super(input, rest);
    } else {
      super(input, init);
    }
  }
}
globalThis.Request = PatchedRequest as unknown as typeof Request;
