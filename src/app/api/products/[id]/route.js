import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// GET /api/products/[id]
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const products = await sql`SELECT * FROM "Product" WHERE "id" = ${id}`;
    
    if (products.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    
    return NextResponse.json(products[0]);
  } catch (error) {
    console.error('Fetch product error:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

// PUT /api/products/[id]
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, price, comparePrice, imageUrl, images, category, subcategory, sizes, colors, tags, stock, featured, isNew, status } = body;

    const result = await sql`
      UPDATE "Product" 
      SET 
        "name" = COALESCE(${name}, "name"),
        "description" = COALESCE(${description}, "description"),
        "price" = COALESCE(${price}, "price"),
        "comparePrice" = ${comparePrice},
        "imageUrl" = COALESCE(${imageUrl}, "imageUrl"),
        "images" = COALESCE(${images}, "images"),
        "category" = COALESCE(${category}, "category"),
        "subcategory" = ${subcategory},
        "sizes" = COALESCE(${sizes}, "sizes"),
        "colors" = COALESCE(${colors}, "colors"),
        "tags" = COALESCE(${tags}, "tags"),
        "stock" = COALESCE(${stock}, "stock"),
        "featured" = COALESCE(${featured}, "featured"),
        "isNew" = COALESCE(${isNew}, "isNew"),
        "status" = COALESCE(${status}, "status"),
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE "id" = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE /api/products/[id]
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    // Check for order items first
    const orderItems = await sql`SELECT * FROM "OrderItem" WHERE "productId" = ${id}`;
    if (orderItems.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete product with existing orders. Archive it instead.' },
        { status: 400 }
      );
    }

    await sql`DELETE FROM "Product" WHERE "id" = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
