import { describe, it, expect } from "vitest";
import {
  cn,
  formatNPR,
  formatDate,
  getDaysLeft,
  getScoreColor,
  getGradeColor,
} from "@/lib/utils";
import { loginSchema, registerSchema } from "@/app/(auth)/_components/schema";
import {
  PostFormSchema,
  CommentFormSchema,
} from "@/app/(dashboard)/feed/_components/schema";
import { editProfileSchema } from "@/app/(dashboard)/profile/_components/schema";
import {
  Step1Schema,
  Step3Schema,
} from "@/app/(dashboard)/entrepreneur/pitches/_components/schema";

// ── Utility: cn (className merge) ───────────────────────────────────────────
describe("cn", () => {
  it("merges class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("dedupes conflicting tailwind classes (last wins)", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("ignores falsy values", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });
});

// ── Utility: formatNPR ──────────────────────────────────────────────────────
describe("formatNPR", () => {
  it("formats a number as NPR currency without decimals", () => {
    const result = formatNPR(1000);
    expect(result).toContain("1,000");
  });

  it("formats zero", () => {
    expect(formatNPR(0)).toContain("0");
  });
});

// ── Utility: formatDate ─────────────────────────────────────────────────────
describe("formatDate", () => {
  it("formats an ISO date into a readable string", () => {
    expect(formatDate("2024-01-15")).toBe("Jan 15, 2024");
  });
});

// ── Utility: getDaysLeft ────────────────────────────────────────────────────
describe("getDaysLeft", () => {
  it("returns 0 when no date is provided", () => {
    expect(getDaysLeft()).toBe(0);
  });

  it("returns 0 for a past date", () => {
    expect(getDaysLeft("2000-01-01")).toBe(0);
  });

  it("returns a positive number for a future date", () => {
    const future = new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString();
    expect(getDaysLeft(future)).toBeGreaterThan(0);
  });
});

// ── Utility: getScoreColor ──────────────────────────────────────────────────
describe("getScoreColor", () => {
  it("returns green for high scores", () => {
    expect(getScoreColor(80)).toBe("text-green-600");
  });

  it("returns yellow for mid scores", () => {
    expect(getScoreColor(65)).toBe("text-yellow-600");
  });

  it("returns orange for low scores", () => {
    expect(getScoreColor(40)).toBe("text-orange-600");
  });
});

// ── Utility: getGradeColor ──────────────────────────────────────────────────
describe("getGradeColor", () => {
  it("returns correct colors per grade", () => {
    expect(getGradeColor("A")).toBe("text-green-600");
    expect(getGradeColor("B")).toBe("text-yellow-600");
    expect(getGradeColor("C")).toBe("text-orange-600");
  });
});

// ── Schema: loginSchema ─────────────────────────────────────────────────────
describe("loginSchema", () => {
  it("accepts a valid login payload", () => {
    const r = loginSchema.safeParse({
      email: "user@example.com",
      password: "password123",
    });
    expect(r.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const r = loginSchema.safeParse({ email: "nope", password: "password123" });
    expect(r.success).toBe(false);
  });

  it("rejects a short password", () => {
    const r = loginSchema.safeParse({ email: "user@example.com", password: "123" });
    expect(r.success).toBe(false);
  });
});

// ── Schema: registerSchema ──────────────────────────────────────────────────
describe("registerSchema", () => {
  const valid = {
    username: "john_doe",
    email: "john@example.com",
    role: "investor",
    password: "Password1",
    confirmPassword: "Password1",
  };

  it("accepts a valid registration", () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects mismatched passwords", () => {
    const r = registerSchema.safeParse({ ...valid, confirmPassword: "Different1" });
    expect(r.success).toBe(false);
  });

  it("rejects a password without an uppercase letter", () => {
    const r = registerSchema.safeParse({
      ...valid,
      password: "password1",
      confirmPassword: "password1",
    });
    expect(r.success).toBe(false);
  });

  it("rejects a username with invalid characters", () => {
    const r = registerSchema.safeParse({ ...valid, username: "bad name!" });
    expect(r.success).toBe(false);
  });
});

// ── Schema: PostFormSchema & CommentFormSchema ──────────────────────────────
describe("feed schemas", () => {
  it("accepts valid post content", () => {
    expect(PostFormSchema.safeParse({ content: "Hello world" }).success).toBe(true);
  });

  it("rejects empty post content", () => {
    expect(PostFormSchema.safeParse({ content: "" }).success).toBe(false);
  });

  it("rejects a comment over 1000 characters", () => {
    const r = CommentFormSchema.safeParse({ content: "x".repeat(1001) });
    expect(r.success).toBe(false);
  });
});

// ── Schema: editProfileSchema ───────────────────────────────────────────────
describe("editProfileSchema", () => {
  it("accepts an empty object (all fields optional)", () => {
    expect(editProfileSchema.safeParse({}).success).toBe(true);
  });

  it("rejects a bio longer than 500 characters", () => {
    const r = editProfileSchema.safeParse({ bio: "x".repeat(501) });
    expect(r.success).toBe(false);
  });
});

// ── Schema: pitch wizard steps ──────────────────────────────────────────────
describe("pitch wizard schemas", () => {
  it("Step1 accepts valid basic info", () => {
    const r = Step1Schema.safeParse({
      title: "My Startup",
      tagline: "We solve real problems",
      industry: "technology",
      fundingStage: "seed",
    });
    expect(r.success).toBe(true);
  });

  it("Step1 rejects an invalid industry enum", () => {
    const r = Step1Schema.safeParse({
      title: "My Startup",
      tagline: "We solve real problems",
      industry: "spaceships",
      fundingStage: "seed",
    });
    expect(r.success).toBe(false);
  });

  it("Step3 rejects a funding goal below the minimum", () => {
    const r = Step3Schema.safeParse({
      fundingGoal: 500,
      equityOffered: 10,
      minInvestment: 100,
    });
    expect(r.success).toBe(false);
  });
});
