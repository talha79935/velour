import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { items, total, guestName, guestEmail, guestAddress, guestPhone } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Process order in a transaction to safely handle stock updates
    const order = await prisma.$transaction(async (tx) => {
      // 1. Verify stock and calculate final price dynamically
      let calculatedTotal = 0;
      
      for (const item of items) {
        const product = await tx.product.findUnique({ where: { id: item.id } });
        if (!product) throw new Error(`Product ${item.id} not found`);
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }
        
        calculatedTotal += product.price * item.quantity;
        
        // 2. Decrement stock
        await tx.product.update({
          where: { id: item.id },
          data: { stock: product.stock - item.quantity }
        });
      }

      // Add shipping if applicable (mimicking client logic: free over 5000)
      const shipping = calculatedTotal >= 5000 ? 0 : 350;
      const finalTotal = calculatedTotal + shipping;

      // 3. Create Order
      const newOrder = await tx.order.create({
        data: {
          total: finalTotal,
          guestName,
          guestEmail,
          guestAddress,
          guestPhone,
          status: 'PENDING',
          items: {
            create: items.map(item => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price
            }))
          }
        },
        include: { items: true }
      });

      return newOrder;
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message || 'Checkout failed' }, { status: 500 });
  }
}
