/**
 * Script to resolve Prisma migration P3005 error
 * This marks existing migrations as applied when database already has tables
 */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const migrationsDir = path.join(__dirname, '../../prisma/migrations');
const schemaPath = path.join(__dirname, '../../prisma/schema.postgresql.prisma');

console.log('🔧 Resolving Prisma migrations...');

// Get list of migration directories (excluding migration_lock.toml)
const migrations = fs.readdirSync(migrationsDir)
  .filter(item => {
    const fullPath = path.join(migrationsDir, item);
    return fs.statSync(fullPath).isDirectory();
  })
  .sort();

if (migrations.length === 0) {
  console.log('❌ No migrations found');
  process.exit(1);
}

console.log(`📋 Found ${migrations.length} migrations to resolve`);

// Resolve each migration as applied
migrations.forEach((migration, index) => {
  try {
    console.log(`\n[${index + 1}/${migrations.length}] Resolving: ${migration}`);
    execSync(
      `npx prisma migrate resolve --applied "${migration}" --schema="${schemaPath}"`,
      { stdio: 'inherit' }
    );
    console.log(`✅ Resolved: ${migration}`);
  } catch (error: any) {
    console.error(`⚠️  Failed to resolve ${migration}:`, error.message);
    // Continue with next migration
  }
});

console.log('\n✅ Migration resolution complete!');
console.log('📊 Checking migration status...');

try {
  execSync(
    `npx prisma migrate status --schema="${schemaPath}"`,
    { stdio: 'inherit' }
  );
} catch (error) {
  console.log('⚠️  Migration status check completed with warnings');
}

