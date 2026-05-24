import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    // Check if user exists
    const existingUsers = await sql`SELECT * FROM "User" WHERE "email" = ${email}`;
    if (existingUsers.length > 0) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);
    const id = 'user-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
    
    const result = await sql`
      INSERT INTO "User" ("id", "name", "email", "password", "role", "createdAt", "updatedAt")
      VALUES (${id}, ${name || null}, ${email}, ${hashed}, 'CUSTOMER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING "id", "email"
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Failed to register' }, { status: 500 });
  }
}
