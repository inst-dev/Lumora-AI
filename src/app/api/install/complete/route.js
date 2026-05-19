/**
 * ====================================================
 * LUMORA AI - Installation Complete API
 * ====================================================
 * Finalizes installation: creates tables, admin user,
 * and marks system as installed.
 */

import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { hashPassword } from '@/lib/security/password';
import { generateId, getClientIP } from '@/utils/helpers';
import { encrypt } from '@/lib/security/encryption';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      purchaseCode, dbHost, dbPort, dbName, dbUser, dbPassword,
      adminName, adminEmail, adminPassword, appName, appUrl,
    } = body;

    // Validate required fields
    if (!adminEmail || !adminPassword || !adminName) {
      return NextResponse.json({ success: false, error: 'All admin fields are required' }, { status: 400 });
    }

    // Connect to database
    let connection;
    try {
      connection = await mysql.createConnection({
        host: dbHost || 'localhost',
        port: parseInt(dbPort || '3306'),
        user: dbUser || 'root',
        password: dbPassword || '',
        database: dbName || 'lumora_ai',
        multipleStatements: true,
      });
    } catch (dbError) {
      return NextResponse.json({ success: false, error: 'Database connection failed: ' + dbError.message }, { status: 500 });
    }

    try {
      // Read and execute schema SQL
      const schemaPath = path.join(process.cwd(), 'src', 'lib', 'database', 'schema.sql');
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await connection.query(schemaSql);

      // Create admin user
      const adminId = generateId();
      const hashedAdminPassword = await hashPassword(adminPassword);
      await connection.execute(
        `INSERT INTO users (id, name, email, password, role, status, email_verified, email_verified_at) 
         VALUES (?, ?, ?, ?, 'admin', 'active', TRUE, NOW())
         ON DUPLICATE KEY UPDATE name = VALUES(name)`,
        [adminId, adminName, adminEmail, hashedAdminPassword]
      );

      // Assign enterprise plan to admin
      await connection.execute(
        `INSERT INTO user_subscriptions (id, user_id, plan_id, status, billing_cycle) 
         VALUES (?, ?, 'plan-enterprise', 'active', 'yearly')
         ON DUPLICATE KEY UPDATE status = 'active'`,
        [generateId(), adminId]
      );

      // Save license activation
      const ip = getClientIP(request);
      const domain = appUrl || request.headers.get('host') || 'localhost';
      await connection.execute(
        `INSERT INTO license_activations (id, purchase_code, domain, ip_address, status) 
         VALUES (?, ?, ?, ?, 'active')`,
        [generateId(), encrypt(purchaseCode || 'dev-mode'), domain, ip]
      );

      // Update site settings
      await connection.execute(
        `UPDATE site_settings SET value = ? WHERE key_name = 'site_name'`,
        [appName || 'Lumora AI']
      );

      await connection.end();

      // Note: In production, you would write to .env.local file
      // For security, this should be done manually or via a secure process

      return NextResponse.json({
        success: true,
        message: 'Installation completed successfully!',
        nextSteps: [
          'Set INSTALLED=true in your .env.local file',
          'Restart the application',
          'Access admin panel at /admin/dashboard',
        ],
      });
    } catch (queryError) {
      await connection.end();
      console.error('Installation SQL error:', queryError);
      return NextResponse.json({ success: false, error: 'Database setup failed: ' + queryError.message }, { status: 500 });
    }
  } catch (error) {
    console.error('Installation error:', error);
    return NextResponse.json({ success: false, error: 'Installation failed' }, { status: 500 });
  }
}
