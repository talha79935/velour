import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { items, guestName, guestEmail, guestPhone, address, city, country } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Calculate total and verify stock
    let calculatedTotal = 0;
    
    for (const item of items) {
      const products = await sql`SELECT * FROM "Product" WHERE "id" = ${item.id}`;
      const product = products[0];
      
      if (!product) {
        return NextResponse.json({ error: `Product ${item.id} not found` }, { status: 400 });
      }
      if (product.stock < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for ${product.name}` }, { status: 400 });
      }
      
      calculatedTotal += product.price * item.quantity;
    }

    // Add shipping if applicable (free over 5000)
    const shipping = calculatedTotal >= 5000 ? 0 : 350;
    const finalTotal = calculatedTotal + shipping;

    // Generate order ID
    const orderId = 'order-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);

    // Create order
    const orderResult = await sql`
      INSERT INTO "Order" ("id", "guestName", "guestEmail", "guestPhone", "address", "city", "country", "total", "status", "createdAt", "updatedAt")
      VALUES (${orderId}, ${guestName || null}, ${guestEmail || null}, ${guestPhone || null}, ${address || null}, ${city || null}, ${country || null}, ${finalTotal}, 'PENDING', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `;

    // Create order items and update stock
    for (const item of items) {
      const itemId = 'item-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
      
      await sql`
        INSERT INTO "OrderItem" ("id", "orderId", "productId", "quantity", "price", "size", "color")
        VALUES (${itemId}, ${orderId}, ${item.id}, ${item.quantity}, ${item.price}, ${item.size || null}, ${item.color || null})
      `;
      
      // Decrement stock
      await sql`UPDATE "Product" SET "stock" = "stock" - ${item.quantity} WHERE "id" = ${item.id}`;
    }

    // Fetch order items
    const orderItems = await sql`SELECT * FROM "OrderItem" WHERE "orderId" = ${orderId}`;

    return NextResponse.json({ ...orderResult[0], items: orderItems }, { status: 201 });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message || 'Checkout failed' }, { status: 500 });
  }
}

// GET /api/orders - for admin
export async function GET() {
  try {
    const orders = await sql`SELECT * FROM "Order" ORDER BY "createdAt" DESC`;
    
    // Fetch items for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await sql`
          SELECT oi.*, p."name" as "productName", p."imageUrl" 
          FROM "OrderItem" oi 
          JOIN "Product" p ON oi."productId" = p."id" 
          WHERE oi."orderId" = ${order.id}
        `;
        return { ...order, items };
      })
    );
    
    return NextResponse.json(ordersWithItems);
  } catch (error) {
    console.error('Fetch orders error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
