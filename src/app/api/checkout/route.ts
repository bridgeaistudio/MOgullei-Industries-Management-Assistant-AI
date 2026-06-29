import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer, items, paymentMethod, notes } = body;

    if (!customer?.name || !customer?.email || !customer?.phone || !customer?.address) {
      return NextResponse.json({ error: 'Customer details are required.' }, { status: 400 });
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 });
    }

    if (!paymentMethod) {
      return NextResponse.json({ error: 'Payment method is required.' }, { status: 400 });
    }

    const subtotal = items.reduce((sum: number, item: { unitPrice: number; quantity: number }) =>
      sum + item.unitPrice * item.quantity, 0
    );

    const order = await prisma.publicOrder.create({
      data: {
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        customerAddress: customer.address,
        paymentMethod,
        paymentStatus: 'pending',
        orderStatus: 'pending',
        subtotal,
        total: subtotal,
        notes: notes || null,
        items: {
          create: items.map((item: { productName: string; productType: string; quantity: number; unitPrice: number }) => ({
            productName: item.productName,
            productType: item.productType,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.unitPrice * item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      total: order.total,
      message: 'Order placed successfully! You will receive a confirmation shortly.',
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Failed to process order.' }, { status: 500 });
  }
}
