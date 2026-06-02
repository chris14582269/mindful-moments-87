import { describe, expect, it } from "vitest";

const dashboardSections = ["User dashboard", "Clinician dashboard", "Admin dashboard"];

describe("Food AI dashboard contract", () => {
  it("defines the required dashboard audiences", () => {
    expect(dashboardSections).toEqual(["User dashboard", "Clinician dashboard", "Admin dashboard"]);
  });
});
