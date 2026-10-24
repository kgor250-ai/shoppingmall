import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting massive database seed with realistic Indian business data...')

  // Check if already seeded
  const storeCount = await prisma.store.count()
  if (storeCount > 0) {
    console.log('Database already seeded. Upserting main users to ensure passwords are correct...')
    const adminPassword = await bcrypt.hash('admin123', 10)
    await prisma.user.upsert({
      where: { email: 'admin1@gmail.com' },
      update: { passwordHash: adminPassword, role: 'ADMIN', status: 'ACTIVE' },
      create: {
        name: 'System Administrator',
        email: 'admin1@gmail.com',
        passwordHash: adminPassword,
        role: 'ADMIN',
        status: 'ACTIVE',
        phone: '9876543210'
      }
    })

    const ownerPassword = await bcrypt.hash('owner123', 10)
    await prisma.user.upsert({
      where: { email: 'owner1@gmail.com' },
      update: { passwordHash: ownerPassword, role: 'STORE_OWNER', status: 'ACTIVE' },
      create: {
        name: 'Rahul Sharma',
        email: 'owner1@gmail.com',
        passwordHash: ownerPassword,
        role: 'STORE_OWNER',
        status: 'ACTIVE',
        phone: '9123456101'
      }
    })
    console.log('Safely updated admin1@gmail.com and owner1@gmail.com. Exiting seed.')
    return
  }

  // 1. Create Admin
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.create({
    data: {
      name: 'System Administrator',
      email: 'admin1@gmail.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
      phone: '9876543210'
    }
  })

  // 2. Create Categories
  const categoryNames = [
    'Clothing', 'Electronics', 'Footwear', 'Grocery', 'Cosmetics',
    'Jewelry', 'Food & Beverages', 'Sports', 'Home & Lifestyle', 'Books & Stationery'
  ]
  const categories = []
  for (const name of categoryNames) {
    categories.push(await prisma.category.create({
      data: { name, description: `${name} items and accessories` }
    }))
  }

  // 3. Create Store Owners & Stores
  const ownerPassword = await bcrypt.hash('owner123', 10)
  const storesData = [
    { name: 'Fashion Hub', floor: 'Ground Floor', category: 'Clothing', ownerName: 'Rahul Sharma', emailPrefix: 'owner1' },
    { name: 'Tech World', floor: '1st Floor', category: 'Electronics', ownerName: 'Amit Patel', emailPrefix: 'owner2' },
    { name: 'Sneaker Head', floor: 'Ground Floor', category: 'Footwear', ownerName: 'Priya Singh', emailPrefix: 'owner3' },
    { name: 'Fresh Mart Grocery', floor: 'Basement', category: 'Grocery', ownerName: 'Suresh Kumar', emailPrefix: 'owner4' },
    { name: 'Glow Cosmetics', floor: '2nd Floor', category: 'Cosmetics', ownerName: 'Neha Gupta', emailPrefix: 'owner5' },
    { name: 'Kalyan Jewelers', floor: 'Ground Floor', category: 'Jewelry', ownerName: 'Ramesh Reddy', emailPrefix: 'owner6' },
    { name: 'Cafe Mocha', floor: '3rd Floor', category: 'Food & Beverages', ownerName: 'Vikram Singh', emailPrefix: 'owner7' },
    { name: 'Decathlon Sports', floor: '2nd Floor', category: 'Sports', ownerName: 'Anil Desai', emailPrefix: 'owner8' },
    { name: 'Home Centre', floor: '3rd Floor', category: 'Home & Lifestyle', ownerName: 'Sunita Rao', emailPrefix: 'owner9' },
    { name: 'Crossword Books', floor: '1st Floor', category: 'Books & Stationery', ownerName: 'Rajesh Nair', emailPrefix: 'owner10' }
  ]

  const stores = []
  let storeCounter = 101

  for (const s of storesData) {
    const owner = await prisma.user.create({
      data: {
        name: s.ownerName,
        email: `${s.emailPrefix}@gmail.com`,
        passwordHash: ownerPassword,
        role: 'STORE_OWNER',
        phone: `9123456${storeCounter}`
      }
    })

    const category = categories.find(c => c.name === s.category)

    const store = await prisma.store.create({
      data: {
        name: s.name,
        storeNumber: `A-${storeCounter}`,
        floor: s.floor,
        categoryId: category!.id,
        ownerId: owner.id,
        monthlyRent: 50000 + (Math.random() * 50000), // 50k to 100k INR
        openingDate: new Date(2023, 0, 1),
        phone: `022-2555-${storeCounter}`,
        email: `contact@${s.name.toLowerCase().replace(/ /g, '')}.com`
      }
    })
    stores.push({ ...store, categoryName: s.category })
    storeCounter++
  }

  // 4. Create Employees
  const designations = ['Manager', 'Sales Executive', 'Cashier', 'Helper']
  for (const store of stores) {
    for (let i = 0; i < 2; i++) {
      await prisma.employee.create({
        data: {
          name: `Employee ${i + 1} of ${store.name}`,
          employeeId: `EMP-${store.storeNumber}-${i + 1}`,
          designation: designations[i % designations.length],
          storeId: store.id,
          joiningDate: new Date(),
          salary: 15000 + (Math.random() * 10000), // 15k to 25k INR
        }
      })
    }
  }

  // 5. Create Customers
  const customers = []
  for (let i = 1; i <= 30; i++) {
    customers.push(await prisma.customer.create({
      data: {
        name: `Customer ${i}`,
        phone: `99887766${i.toString().padStart(2, '0')}`,
        email: `customer${i}@example.com`
      }
    }))
  }

  // 6. Create Products, Stock, Sales, Rent, Complaints
  const productTemplates: Record<string, { name: string; cp: number; sp: number }[]> = {
    'Clothing': [
      { name: "Levi's 511 Slim Fit Jeans", cp: 2200, sp: 3999 },
      { name: 'Zara Relaxed Linen Casual Shirt', cp: 1600, sp: 2990 },
      { name: 'Brooks Brothers Supima Oxford Shirt', cp: 3500, sp: 6499 },
      { name: 'Manyavar Embroidered Silk Kurta Set', cp: 4500, sp: 8999 },
      { name: 'H&M Pleated Evening Wrap Dress', cp: 2100, sp: 3999 },
      { name: 'Zara Faux Leather Biker Jacket', cp: 3200, sp: 5990 },
      { name: 'Biba Gold Foil Anarkali Kurti', cp: 1800, sp: 3499 },
    ],
    'Electronics': [
      { name: 'Apple iPhone 16 Pro 256GB Titanium', cp: 110000, sp: 129900 },
      { name: 'Samsung Galaxy S24 Ultra 512GB', cp: 115000, sp: 139999 },
      { name: 'Sony WH-1000XM5 Wireless Headphones', cp: 20000, sp: 28990 },
      { name: 'Apple MacBook Air 15” M3 512GB', cp: 130000, sp: 154900 },
      { name: 'Apple Watch Ultra 2 Titanium 49mm', cp: 75000, sp: 89900 },
      { name: 'Sony Bravia XR 65” 4K OLED Smart TV', cp: 195000, sp: 249990 },
      { name: 'Anker 737 140W Fast Power Bank', cp: 9500, sp: 13999 },
    ],
    'Footwear': [
      { name: 'Nike Air Max 90 Classic Sneakers', cp: 7500, sp: 11495 },
      { name: 'Adidas Originals Stan Smith Shoes', cp: 5000, sp: 7999 },
      { name: 'Birkenstock Arizona Double Strap Sandals', cp: 3800, sp: 5990 },
      { name: 'Cole Haan Grand Ambition Leather Loafers', cp: 8500, sp: 13999 },
      { name: 'Nike Pegasus 41 Running Shoes', cp: 7800, sp: 11895 },
    ],
    'Grocery': [
      { name: 'Shimla Royal Gala Red Apples (Pack of 4)', cp: 140, sp: 199 },
      { name: 'Amul Fresh Malai Paneer Block (200g)', cp: 75, sp: 95 },
      { name: 'Blue Tokai Attikan Dark Roast Beans (250g)', cp: 380, sp: 520 },
      { name: 'Artisanal Multigrain Sourdough Loaf (400g)', cp: 120, sp: 180 },
      { name: 'Organic Cavendish Bananas (1 Dozen)', cp: 55, sp: 85 },
      { name: 'Barilla Italian Penne Rigate Pasta (500g)', cp: 190, sp: 275 },
    ],
    'Cosmetics': [
      { name: 'Estée Lauder Advanced Night Repair 50ml', cp: 6500, sp: 9200 },
      { name: 'Forest Essentials Soundarya 24K Gold Cream', cp: 4800, sp: 6800 },
      { name: 'MAC Retro Matte Lipstick - Ruby Woo', cp: 1500, sp: 2300 },
      { name: 'Dior Sauvage Eau de Parfum 100ml', cp: 9500, sp: 13500 },
      { name: 'Clinique Moisture Surge 100H Hydrator', cp: 2200, sp: 3250 },
    ],
    'Jewelry': [
      { name: 'Tanishq 22KT Filigree Gold Choker', cp: 150000, sp: 185000 },
      { name: 'CaratLane 18KT Solitaire Diamond Ring', cp: 58000, sp: 78500 },
      { name: 'Kalyan Jewellers 22KT Gold Jhumka Earrings', cp: 49000, sp: 64999 },
      { name: 'CaratLane 18KT Diamond Tennis Bracelet', cp: 110000, sp: 145000 },
      { name: 'Senco Gold 925 Sterling Silver Royal Kada', cp: 6800, sp: 9499 },
    ],
    'Food & Beverages': [
      { name: 'Single Origin French Press Dark Roast', cp: 180, sp: 320 },
      { name: 'Double Baked Pistachio Butter Croissant', cp: 220, sp: 420 },
      { name: 'Artisanal Smoked Truffle Burrata Melt', cp: 450, sp: 850 },
      { name: 'Nitro Cold Brew on Tap with Cascara', cp: 190, sp: 340 },
    ],
    'Sports': [
      { name: 'SG HP 33 Grade 1 English Willow Bat', cp: 12500, sp: 18499 },
      { name: 'Adidas FIFA World Cup Match Football', cp: 8500, sp: 12999 },
      { name: 'Yonex Astrox 99 Pro Graphite Racket', cp: 11800, sp: 17499 },
      { name: 'Decathlon Domyos Hex Dumbbells (Pair 10kg)', cp: 2600, sp: 3999 },
      { name: 'Manduka PRO 6mm Cushion Yoga Mat', cp: 7800, sp: 11500 },
    ],
    'Home & Lifestyle': [
      { name: 'Poltrona Frau Handcrafted Leather Armchair', cp: 620000, sp: 890000 },
      { name: 'Egyptian Long-Staple Cotton Sheet Set', cp: 6500, sp: 11999 },
      { name: 'Artisanal Ceramic Dinner Set (16 Pcs)', cp: 4200, sp: 7499 },
    ],
    'Books & Stationery': [
      { name: 'LEGO Architecture Paris City Skyline', cp: 3600, sp: 4999 },
      { name: 'Skillmatics World Map Educational Puzzle', cp: 850, sp: 1299 },
      { name: 'Monopoly Super Electronic Banking Game', cp: 1700, sp: 2499 },
      { name: 'Montblanc Meisterstück Gold Coated Pen', cp: 28000, sp: 38500 },
    ],
  }

  let skuCounter = 1000
  for (const store of stores) {
    // RENT (last 3 months)
    for (let m = 7; m <= 9; m++) {
      await prisma.rent.create({
        data: {
          storeId: store.id,
          month: m,
          year: 2026,
          amount: store.monthlyRent,
          dueDate: new Date(2026, m - 1, 5),
          paidDate: m < 9 ? new Date(2026, m - 1, 3) : null,
          status: m < 9 ? 'PAID' : 'PENDING'
        }
      })
    }

    // COMPLAINTS
    if (Math.random() > 0.5) {
      await prisma.complaint.create({
        data: {
          storeId: store.id,
          customerId: customers[Math.floor(Math.random() * customers.length)].id,
          subject: 'Service delay',
          description: 'The staff was very slow.',
          priority: 'MEDIUM',
          status: 'RESOLVED',
          resolvedAt: new Date()
        }
      })
    }

    // PRODUCTS
    const templates = productTemplates[store.categoryName as keyof typeof productTemplates] || [
      { name: `Item 1 of ${store.categoryName}`, cp: 100, sp: 200 },
      { name: `Item 2 of ${store.categoryName}`, cp: 200, sp: 400 },
      { name: `Item 3 of ${store.categoryName}`, cp: 300, sp: 600 },
      { name: `Item 4 of ${store.categoryName}`, cp: 400, sp: 800 },
      { name: `Item 5 of ${store.categoryName}`, cp: 500, sp: 1000 }
    ]

    const storeProducts = []
    for (const pt of templates) {
      skuCounter++
      const initialStock = 50 + Math.floor(Math.random() * 50) // 50 to 100
      
      const product = await prisma.product.create({
        data: {
          storeId: store.id,
          categoryId: store.categoryId,
          name: pt.name,
          sku: `SKU-${skuCounter}`,
          costPrice: pt.cp,
          sellingPrice: pt.sp,
          currentStock: initialStock,
          minimumStock: 10
        }
      })
      storeProducts.push(product)

      await prisma.stockTransaction.create({
        data: {
          productId: product.id,
          storeId: store.id,
          type: 'STOCK_IN',
          quantity: initialStock,
          previousStock: 0,
          newStock: initialStock,
          reason: 'Initial Seeding',
          createdBy: admin.id
        }
      })
    }

    // SALES
    // 5 sales per store
    for (let i = 0; i < 5; i++) {
      const customer = customers[Math.floor(Math.random() * customers.length)]
      
      // select 2 random products
      const p1 = storeProducts[Math.floor(Math.random() * storeProducts.length)]
      const p2 = storeProducts[Math.floor(Math.random() * storeProducts.length)]
      
      const q1 = Math.floor(Math.random() * 3) + 1
      const q2 = Math.floor(Math.random() * 3) + 1
      
      const subtotal = (p1.sellingPrice * q1) + (p2.sellingPrice * q2)
      const tax = subtotal * 0.1
      const total = subtotal + tax

      const sale = await prisma.sale.create({
        data: {
          invoiceNumber: `INV-${store.storeNumber}-${Date.now()}-${i}`,
          storeId: store.id,
          customerId: customer.id,
          createdBy: store.ownerId!,
          subtotal,
          tax,
          total,
          paymentMethod: 'CARD',
          status: 'COMPLETED'
        }
      })

      // Items and Stock deductions
      const processItem = async (p: { id: string, sellingPrice: number, currentStock: number }, q: number) => {
        await prisma.saleItem.create({
          data: {
            saleId: sale.id,
            productId: p.id,
            quantity: q,
            unitPrice: p.sellingPrice,
            total: p.sellingPrice * q
          }
        })

        const dbProduct = await prisma.product.findUnique({ where: { id: p.id } })
        await prisma.product.update({
          where: { id: p.id },
          data: { currentStock: dbProduct!.currentStock - q }
        })

        await prisma.stockTransaction.create({
          data: {
            productId: p.id,
            storeId: store.id,
            type: 'SALE',
            quantity: q,
            previousStock: dbProduct!.currentStock,
            newStock: dbProduct!.currentStock - q,
            reason: `Sale ${sale.invoiceNumber}`,
            createdBy: store.ownerId!
          }
        })
      }

      await processItem(p1, q1)
      if (p1.id !== p2.id) await processItem(p2, q2)
    }
  }

  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
