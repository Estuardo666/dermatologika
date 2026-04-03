const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Obtener todos los productos
  const products = await prisma.product.findMany({
    select: { id: true, slug: true },
  });

  console.log(`Actualizando stock de ${products.length} productos...`);

  // Índices hardcodeados para los casos especiales
  const stockUpdates = products.map((product, index) => {
    let stock;

    // 2 productos con stock 5
    if (index === 0 || index === 1) {
      stock = 5;
    }
    // 1 producto con stock 0
    else if (index === 2) {
      stock = 0;
    }
    // 1 producto con stock 1
    else if (index === 3) {
      stock = 1;
    }
    // El resto con valores variados (15-50)
    else {
      stock = Math.floor(Math.random() * 36) + 15; // 15-50
    }

    return prisma.product.update({
      where: { id: product.id },
      data: { stock },
    });
  });

  const results = await Promise.all(stockUpdates);
  console.log(`✅ Actualizado stock de ${results.length} productos`);

  // Mostrar resultado
  const updated = await prisma.product.findMany({
    select: { slug: true, stock: true },
    orderBy: { slug: "asc" },
  });

  console.log("\nNuevos valores de stock:");
  console.table(updated);
}

main().finally(() => prisma.$disconnect());
