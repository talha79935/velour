import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/products
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const filter = searchParams.get('filter');

    const where = { status: 'ACTIVE' };
    if (category) where.category = category;
    if (filter === 'new') where.isNew = true;
    if (filter === 'featured') where.featured = true;

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST /api/products
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description, price, ...rest } = body;

    if (!name || !description || !price) {
      return NextResponse.json({ error: 'Name, description, and price are required' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: { name, description, price, ...rest },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
