#!/usr/bin/env node

/**
 * Pre-deployment verification script
 * Run this before deploying to catch issues early
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

console.log('🔍 KryptoCritics Deployment Verification\n');

const checks = {
  passed: 0,
  failed: 0,
  warnings: 0
};

function checkPassed(message) {
  console.log(`✅ ${message}`);
  checks.passed++;
}

function checkFailed(message) {
  console.log(`❌ ${message}`);
  checks.failed++;
}

function checkWarning(message) {
  console.log(`⚠️  ${message}`);
  checks.warnings++;
}

// Check 1: Package.json exists and has required scripts
console.log('📦 Checking package.json...');
try {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  
  if (pkg.scripts?.build) {
    checkPassed('Build script exists');
  } else {
    checkFailed('Build script missing');
  }
  
  if (pkg.scripts?.dev) {
    checkPassed('Dev script exists');
  } else {
    checkFailed('Dev script missing');
  }
  
  if (pkg.name === 'krypto-critics') {
    checkPassed('Project name is correct');
  } else {
    checkWarning('Project name should be "krypto-critics"');
  }
} catch (error) {
  checkFailed('Cannot read package.json');
}

// Check 2: Environment files
console.log('\n🔐 Checking environment configuration...');
if (existsSync('.env.example')) {
  checkPassed('.env.example exists');
} else {
  checkFailed('.env.example missing');
}

if (existsSync('.env.local')) {
  checkPassed('.env.local exists');
  
  // Check environment variables
  const envContent = readFileSync('.env.local', 'utf8');
  if (envContent.includes('VITE_SUPABASE_URL=')) {
    checkPassed('VITE_SUPABASE_URL is set');
  } else {
    checkFailed('VITE_SUPABASE_URL missing');
  }
  
  if (envContent.includes('VITE_SUPABASE_ANON_KEY=')) {
    checkPassed('VITE_SUPABASE_ANON_KEY is set');
  } else {
    checkFailed('VITE_SUPABASE_ANON_KEY missing');
  }
} else {
  checkWarning('.env.local missing (needed for local development)');
}

// Check 3: Vercel configuration
console.log('\n🚀 Checking Vercel configuration...');
if (existsSync('vercel.json')) {
  checkPassed('vercel.json exists');
  
  try {
    const vercelConfig = JSON.parse(readFileSync('vercel.json', 'utf8'));
    if (vercelConfig.rewrites) {
      checkPassed('SPA routing configured');
    } else {
      checkFailed('SPA routing not configured');
    }
  } catch (error) {
    checkFailed('vercel.json is invalid JSON');
  }
} else {
  checkFailed('vercel.json missing');
}

// Check 4: Build test
console.log('\n🔨 Testing build process...');
try {
  console.log('Running build...');
  execSync('npm run build', { stdio: 'pipe' });
  checkPassed('Build completed successfully');
  
  // Check if dist folder exists
  if (existsSync('dist')) {
    checkPassed('Dist folder created');
    
    if (existsSync('dist/index.html')) {
      checkPassed('index.html generated');
    } else {
      checkFailed('index.html not generated');
    }
    
    if (existsSync('dist/assets')) {
      checkPassed('Assets folder created');
    } else {
      checkFailed('Assets folder not created');
    }
  } else {
    checkFailed('Dist folder not created');
  }
} catch (error) {
  checkFailed('Build failed');
  console.log('Build error:', error.message);
}

// Check 5: TypeScript validation
console.log('\n📝 Checking TypeScript...');
try {
  execSync('npx tsc --noEmit', { stdio: 'pipe' });
  checkPassed('TypeScript compilation successful');
} catch (error) {
  checkFailed('TypeScript errors found');
  console.log('Run "npx tsc --noEmit" to see details');
}

// Check 6: Essential files
console.log('\n📁 Checking essential files...');
const essentialFiles = [
  'src/main.tsx',
  'src/App.tsx',
  'index.html',
  'vite.config.ts',
  'tailwind.config.ts',
  'tsconfig.json'
];

essentialFiles.forEach(file => {
  if (existsSync(file)) {
    checkPassed(`${file} exists`);
  } else {
    checkFailed(`${file} missing`);
  }
});

// Check 7: Supabase configuration
console.log('\n🗄️  Checking Supabase setup...');
if (existsSync('QUICK_SETUP.sql')) {
  checkPassed('Database setup script exists');
} else {
  checkWarning('QUICK_SETUP.sql missing (needed for database setup)');
}

// Summary
console.log('\n📊 Verification Summary');
console.log('========================');
console.log(`✅ Passed: ${checks.passed}`);
console.log(`❌ Failed: ${checks.failed}`);
console.log(`⚠️  Warnings: ${checks.warnings}`);

if (checks.failed === 0) {
  console.log('\n🎉 Ready for deployment!');
  console.log('\nNext steps:');
  console.log('1. Push code to GitHub');
  console.log('2. Set up Supabase database (run QUICK_SETUP.sql)');
  console.log('3. Deploy to Vercel');
  console.log('4. Configure environment variables in Vercel');
  process.exit(0);
} else {
  console.log('\n🛠️  Please fix the failed checks before deploying.');
  process.exit(1);
}