import { describe, it, expect } from "vitest";
import { render, screen } from "@solidjs/testing-library";

import AuthLayout from "../../src/layouts/AuthLayout";

describe("AuthLayout", () => {
  it("renders children", () => {
    render(() => (
      <AuthLayout>
        <span>Test child content</span>
      </AuthLayout>
    ));
    expect(screen.getByText("Test child content")).toBeDefined();
  });

  it("renders logo images", () => {
    const { container } = render(() => (
      <AuthLayout>
        <span>Content</span>
      </AuthLayout>
    ));
    const imgs = container.querySelectorAll("img");
    expect(imgs.length).toBe(1);
    expect(imgs[0].getAttribute("src")).toBe("/hyper-tern-logo.png");
    expect(imgs[0].getAttribute("alt")).toBe("Hyper-Tern");
  });

  it("links logo to hyper-tern website", () => {
    const { container } = render(() => (
      <AuthLayout>
        <span>Content</span>
      </AuthLayout>
    ));
    const link = container.querySelector(".auth-logo__link") as HTMLAnchorElement;
    expect(link).toBeDefined();
    expect(link.getAttribute("href")).toBe("https://hyper-tern.build");
  });
});
