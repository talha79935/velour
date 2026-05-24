import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// GET /api/products
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const filter = searchParams.get('filter');

    let query;
    
    if (category && filter === 'new') {
      query = sql`SELECT * FROM "Product" WHERE "status" = 'ACTIVE' AND "category" = ${category} AND "isNew" = true ORDER BY "createdAt" DESC`;
    } else if (category && filter === 'featured') {
      query = sql`SELECT * FROM "Product" WHERE "status" = 'ACTIVE' AND "category" = ${category} AND "featured" = true ORDER BY "createdAt" DESC`;
    } else if (category) {
      query = sql`SELECT * FROM "Product" WHERE "status" = 'ACTIVE' AND "category" = ${category} ORDER BY "createdAt" DESC`;
    } else if (filter === 'new') {
      query = sql`SELECT * FROM "Product" WHERE "status" = 'ACTIVE' AND "isNew" = true ORDER BY "createdAt" DESC`;
    } else if (filter === 'featured') {
      query = sql`SELECT * FROM "Product" WHERE "status" = 'ACTIVE' AND "featured" = true ORDER BY "createdAt" DESC`;
    } else {
      query = sql`SELECT * FROM "Product" WHERE "status" = 'ACTIVE' ORDER BY "createdAt" DESC`;
    }

    const products = await query;
    return NextResponse.json(products);
  } catch (error) {
    console.error('Fetch products error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST /api/products
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description, price, comparePrice, imageUrl, images, category, subcategory, sizes, colors, tags, stock, featured, isNew, status } = body;

    if (!name || !description || !price) {
      return NextResponse.json({ error: 'Name, description, and price are required' }, { status: 400 });
    }

    const id = name.replace(/\s+/g, '-').toLowerCase() + '-' + Date.now();
    
    const result = await sql`
      INSERT INTO "Product" ("id", "name", "description", "price", "comparePrice", "imageUrl", "images", "category", "subcategory", "sizes", "colors", "tags", "stock", "featured", "isNew", "status", "createdAt", "updatedAt")
      VALUES (
        ${id},
        ${name},
        ${description},
        ${price},
        ${comparePrice || null},
        ${imageUrl || null},
        ${images || '[]'},
        ${category || 'other'},
        ${subcategory || null},
        ${sizes || '[]'},
        ${colors || '[]'},
        ${tags || '[]'},
        ${stock || 100},
        ${featured || false},
        ${isNew || false},
        ${status || 'ACTIVE'},
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
