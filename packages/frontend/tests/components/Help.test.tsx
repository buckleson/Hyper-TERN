import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@solidjs/testing-library";

vi.mock("@solidjs/router", () => ({
  A: (props: Record<string, unknown>) => {
    const { href, class: className, children, ...rest } = props;
    return <a href={href as string} class={className as string} {...rest}>{children}</a>;
  },
}));

vi.mock("@solidjs/meta", () => ({
  Title: (props: Record<string, unknown>) => <title>{props.children}</title>,
  Meta: () => null,
}));

import Help from "../../src/pages/Help";

describe("Help", () => {
  it("shows Help & Support heading", () => {
    render(() => <Help />);
    expect(screen.getByText("Help & Support")).toBeDefined();
  });

  it("shows Schedule a Call section", () => {
    render(() => <Help />);
    expect(screen.getByText("Schedule a Call")).toBeDefined();
  });

  it("shows Email Support section", () => {
    render(() => <Help />);
    expect(screen.getByText("Email Support")).toBeDefined();
  });

  it("has Book link", () => {
    render(() => <Help />);
    const links = screen.getAllByRole("link");
    const bookLink = links.find((l) => l.textContent?.includes("Book"));
    expect(bookLink).toBeDefined();
  });

  it("has Contact link", () => {
    render(() => <Help />);
    const links = screen.getAllByRole("link");
    const contactLink = links.find((l) => l.textContent?.includes("Contact"));
    expect(contactLink).toBeDefined();
  });

  it("booking link has correct href", () => {
    render(() => <Help />);
    const links = screen.getAllByRole("link");
    const bookLink = links.find((l) => l.textContent?.includes("Book"));
    expect(bookLink?.getAttribute("href")).toBe(
      "https://cal.com/buckleson-group/30min",
    );
  });

  it("booking link opens in new tab with noopener noreferrer", () => {
    render(() => <Help />);
    const links = screen.getAllByRole("link");
    const bookLink = links.find((l) => l.textContent?.includes("Book"));
    expect(bookLink?.getAttribute("target")).toBe("_blank");
    expect(bookLink?.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("Email link is mailto", () => {
    render(() => <Help />);
    const links = screen.getAllByRole("link");
    const contactLink = links.find((l) => l.textContent?.includes("Contact"));
    expect(contactLink?.getAttribute("href")).toBe(
      "mailto:vijay@buckleson.com",
    );
  });

  it("renders Title metadata", () => {
    const { container } = render(() => <Help />);
    const title = container.querySelector("title");
    expect(title?.textContent).toContain("Help & Support - Hyper-Tern");
  });

  it("renders breadcrumb prompt text", () => {
    render(() => <Help />);
    expect(
      screen.getByText(
        /Building with Hyper-Tern\? Book time with us or send the feedback that helps shape it\./,
      ),
    ).toBeDefined();
  });

  it("describes the call duration in the Schedule a Call section", () => {
    render(() => <Help />);
    expect(
      screen.getByText(/Book a 30-minute session for setup help, integration questions, or routing advice\./),
    ).toBeDefined();
  });

  it("shows the support email address with developer-focused copy", () => {
    render(() => <Help />);
    expect(
      screen.getByText(/vijay@buckleson.com/),
    ).toBeDefined();
    expect(
      screen.getByText(/comments, compliments, bug reports/),
    ).toBeDefined();
  });

  it("renders exactly two action links (Book and Contact)", () => {
    render(() => <Help />);
    const links = screen.getAllByRole("link");
    expect(links.length).toBe(2);
  });
});
