import { eq } from "drizzle-orm";

import { seededProfiles } from "@morph-ui/config";

import { db, pool } from "./client";
import { profiles, providerCapabilities, users } from "./schema";

async function main() {
  const [user] = await db.insert(users)
    .values({
      email: "demo@morphui.local",
      name: "Morph UI Demo",
      avatarUrl: "https://api.dicebear.com/9.x/shapes/svg?seed=morph-ui"
    })
    .onConflictDoNothing()
    .returning();

  const demoUser = user ?? await db.query.users.findFirst({
    where: eq(users.email, "demo@morphui.local")
  });

  if (!demoUser) {
    throw new Error("Failed to create demo user");
  }

  await db.insert(providerCapabilities).values([
    {
      provider: "openai",
      canUseOfficialOAuth: false,
      canUseServerOwnedApi: true,
      supportsConsumerAccountReuse: false,
      supportsVision: true,
      supportsStructuredOutput: true,
      limitationReason: "Morph UI uses server-owned OpenAI API credentials in v1. Consumer ChatGPT account reuse is not available in this extension flow."
    },
    {
      provider: "gemini",
      canUseOfficialOAuth: true,
      canUseServerOwnedApi: true,
      supportsConsumerAccountReuse: false,
      supportsVision: true,
      supportsStructuredOutput: true,
      limitationReason: "Morph UI uses server-owned Gemini API credentials in v1. Gemini Advanced subscription reuse is not wired into this product."
    }
  ]).onConflictDoNothing();

  for (const profile of seededProfiles) {
    await db.insert(profiles).values({
      userId: demoUser.id,
      name: profile.name,
      isDefault: profile.isDefault,
      naturalLanguageInstruction: profile.naturalLanguageInstruction,
      structuredPreferencesJson: profile.structuredPreferences,
      learnedAdjustmentsJson: profile.learnedAdjustments
    }).onConflictDoNothing();
  }

  await pool.end();
}

void main();
