// In-memory access token store — never persisted to localStorage
let inMemoryAccessToken: string | null = null;

export const tokenMemory = {
  get: (): string | null => inMemoryAccessToken,
  set: (token: string): void => { inMemoryAccessToken = token; },
  clear: (): void => { inMemoryAccessToken = null; },
};
