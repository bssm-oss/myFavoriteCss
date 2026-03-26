import { openDB, type DBSchema } from "idb";

import { determineCacheMatch, scoreFingerprintSimilarity } from "@morph-ui/cache";
import type { CompiledTransform, PageFingerprint, TransformPlan } from "@morph-ui/shared";

import { buildUrlProfileKey } from "./cache-keys";

export interface TransformArtifactRecord {
  key: string;
  origin: string;
  normalizedUrl: string;
  urlProfileKey: string;
  profileId: string;
  pathSignature: string;
  fingerprint: PageFingerprint;
  plan: TransformPlan;
  compiled: CompiledTransform;
  confidence: number;
  ttlSeconds: number;
  screenshotHash?: string;
  validationStats: {
    lastValidatedAt: string;
    selectorMismatchRate: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface MorphUiDb extends DBSchema {
  transformArtifacts: {
    key: string;
    value: TransformArtifactRecord;
    indexes: {
      "by-url-profile": string;
      "by-origin": string;
    };
  };
}

const DB_NAME = "morph-ui-cache";
const DB_VERSION = 1;

const dbPromise = openDB<MorphUiDb>(DB_NAME, DB_VERSION, {
  upgrade(db) {
    const store = db.createObjectStore("transformArtifacts", {
      keyPath: "key"
    });
    store.createIndex("by-url-profile", "urlProfileKey", { unique: false });
    store.createIndex("by-origin", "origin", { unique: false });
  }
});

export async function putTransformArtifact(record: TransformArtifactRecord) {
  const db = await dbPromise;
  await db.put("transformArtifacts", record);
}

export async function getTransformArtifact(key: string) {
  const db = await dbPromise;
  return db.get("transformArtifacts", key);
}

export async function findBestArtifact(input: {
  origin: string;
  normalizedUrl: string;
  profileId: string;
  fingerprint: PageFingerprint;
}) {
  const db = await dbPromise;
  const urlProfileKey = buildUrlProfileKey({
    origin: input.origin,
    normalizedUrl: input.normalizedUrl,
    profileId: input.profileId
  });
  const records = await db.getAllFromIndex("transformArtifacts", "by-url-profile", urlProfileKey);
  const candidates = records.map((record) => ({
    record,
    similarity: scoreFingerprintSimilarity(input.fingerprint, record.fingerprint),
    match: determineCacheMatch(scoreFingerprintSimilarity(input.fingerprint, record.fingerprint))
  })).sort((left, right) => right.similarity - left.similarity);

  return candidates[0] ?? null;
}

export async function removeArtifactsForOrigin(origin: string) {
  const db = await dbPromise;
  const tx = db.transaction("transformArtifacts", "readwrite");
  const store = tx.objectStore("transformArtifacts");
  const index = store.index("by-origin");
  let cursor = await index.openCursor(origin);
  while (cursor) {
    await cursor.delete();
    cursor = await cursor.continue();
  }
  await tx.done;
}
