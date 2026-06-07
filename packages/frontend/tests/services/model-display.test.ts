import { describe, it, expect, vi } from "vitest";

vi.mock("../../src/services/provider-utils.js", () => ({
  getModelLabel: (_providerId: string, model: string) => `label:${model}`,
}));

vi.mock("../../src/services/routing-utils.js", () => ({
  inferProviderFromModel: (model: string) => {
    if (model.startsWith("gpt-")) return "openai";
    if (model.startsWith("claude-")) return "anthropic";
    if (model.startsWith("custom:")) return "custom";
    return undefined;
  },
  stripCustomPrefix: (model: string) => model.replace(/^custom:[^/]+\//, ""),
}));

describe("model-display", () => {
  it("keeps preload as a no-op", async () => {
    const { preloadModelDisplayNames } = await import("../../src/services/model-display.js");
    expect(() => preloadModelDisplayNames()).not.toThrow();
  });

  it("falls back to provider labels for known providers", async () => {
    const { getModelDisplayName } = await import("../../src/services/model-display.js");
    expect(getModelDisplayName("gpt-4o")).toBe("label:gpt-4o");
  });

  it("strips custom prefix for unknown provider models", async () => {
    const { getModelDisplayName } = await import("../../src/services/model-display.js");
    expect(getModelDisplayName("custom:abc/my-model")).toBe("label:custom:abc/my-model");
  });

  it("returns plain slug for unknown models", async () => {
    const { getModelDisplayName } = await import("../../src/services/model-display.js");
    expect(getModelDisplayName("unknown-model")).toBe("unknown-model");
  });
});
