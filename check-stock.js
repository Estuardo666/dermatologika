const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    select: { slug: true, stock: true },
  });
  console.log("Current stock values:");
  console.table(products);
}

main().finally(() => prisma.$disconnect());
