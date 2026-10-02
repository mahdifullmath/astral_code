import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function POST(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const { id } = await req.json().catch(() => ({}) as any);
  const cosmetic = await prisma.cosmetic.findUnique({ where: { id } });
  if (!cosmetic) return NextResponse.json({ error: "Item not found" }, { status: 404 });

  // Atomic purchase: check balance, deduct, create ledger + ownership in one transaction.
  const result = await prisma.$transaction(async (tx) => {
    const wallet = await tx.wallet.findUnique({ where: { userId: s.id } });
    if (!wallet || wallet.balance < cosmetic.price) return { denied: true as const, balance: wallet?.balance ?? 0 };
    const newBalance = wallet.balance - cosmetic.price;
    await tx.wallet.update({ where: { userId: s.id }, data: { balance: newBalance } });
    await tx.coinTransaction.create({
      data: { userId: s.id, amount: -cosmetic.price, kind: "shop_spend", refId: cosmetic.id, balanceAfter: newBalance },
    });
    await tx.ownedCosmetic.create({ data: { userId: s.id, cosmeticId: cosmetic.id } });
    return { denied: false as const, balance: newBalance };
  });

  if (result.denied) return NextResponse.json({ error: "Insufficient balance" }, { status: 402 });
  return NextResponse.json({ ok: true, balance: result.balance });
}
