import "dotenv/config";
import path from "path";
import fs from "fs";
import Database from "better-sqlite3";
import { createCorsair } from "corsair";
import { github } from "@corsair-dev/github";

// Initialize SQLite database for Corsair credentials & state
const corsairDir = path.join(process.cwd(), ".corsair");
if (!fs.existsSync(corsairDir)) {
  fs.mkdirSync(corsairDir, { recursive: true });
}
const dbFile = path.join(corsairDir, "corsair.sqlite");
export const db = new Database(dbFile);

// Provision Corsair tables if not already present
db.exec(`
  CREATE TABLE IF NOT EXISTS corsair_integrations (
    id TEXT PRIMARY KEY,
    created_at DATETIME,
    updated_at DATETIME,
    name TEXT,
    config TEXT,
    dek TEXT
  );
  CREATE TABLE IF NOT EXISTS corsair_accounts (
    id TEXT PRIMARY KEY,
    created_at DATETIME,
    updated_at DATETIME,
    tenant_id TEXT,
    integration_id TEXT,
    config TEXT,
    dek TEXT
  );
  CREATE TABLE IF NOT EXISTS corsair_entities (
    id TEXT PRIMARY KEY,
    created_at DATETIME,
    updated_at DATETIME,
    account_id TEXT,
    entity_id TEXT,
    entity_type TEXT,
    version TEXT,
    data TEXT
  );
  CREATE TABLE IF NOT EXISTS corsair_events (
    id TEXT PRIMARY KEY,
    created_at DATETIME,
    updated_at DATETIME,
    account_id TEXT,
    event_type TEXT,
    payload TEXT,
    status TEXT
  );
  CREATE TABLE IF NOT EXISTS corsair_permissions (
    id TEXT PRIMARY KEY,
    created_at DATETIME,
    updated_at DATETIME,
    token TEXT,
    plugin TEXT,
    endpoint TEXT,
    args TEXT,
    tenant_id TEXT,
    status TEXT DEFAULT 'pending',
    expires_at TEXT,
    error TEXT
  );
`);

export const corsair = createCorsair({
  kek: process.env.CORSAIR_KEK || "e8b6289b0d0c3453b320d440ad8f8b1ca54b679a613589bbcd8cf5e4f9b8c09d",
  database: db,
  hub: {
    projectApiKey: process.env.CORSAIR_API_KEY || "ck_dev_X3Gsh83K_NKl6TIGmYrJDa5HZ78M7r2u",
    signingSecret: process.env.CORSAIR_SIGNING_SECRET || "csec_hI91ZmoutZ1jy-7Omoi7zfim20cmxuxG",
    allowWorkflowExecution: true,
  },
  plugins: [github()],
});
