/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const write = (filepath, content) => {
  const dir = path.dirname(filepath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filepath, content.trim() + '\n');
};

const adminDir = 'src/app/(admin)/admin';

// Employees Page
write(`${adminDir}/employees/page.tsx`, `
import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { connection } from 'next/server'

export const dynamic = 'force-dynamic'

export default async function AdminEmployeesPage() {
  await connection()
  const employees = await prisma.employee.findMany({
    include: { store: true }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Employees</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-zinc-50 dark:bg-zinc-900 border-b">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Designation</th>
                  <th className="px-4 py-3">Store</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id} className="border-b dark:border-zinc-800">
                    <td className="px-4 py-3 font-medium">{emp.employeeId}</td>
                    <td className="px-4 py-3">{emp.name}</td>
                    <td className="px-4 py-3">{emp.designation}</td>
                    <td className="px-4 py-3">{emp.store.name}</td>
                    <td className="px-4 py-3">{emp.phone || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <span className={\`px-2 py-1 rounded-full text-xs font-medium \${
                        emp.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }\`}>
                        {emp.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {employees.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      No employees found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
`);

// Customers Page
write(`${adminDir}/customers/page.tsx`, `
import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { connection } from 'next/server'

export const dynamic = 'force-dynamic'

export default async function AdminCustomersPage() {
  await connection()
  const customers = await prisma.customer.findMany({
    include: { _count: { select: { sales: true } } }
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-zinc-50 dark:bg-zinc-900 border-b">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Total Purchases</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} className="border-b dark:border-zinc-800">
                    <td className="px-4 py-3 font-medium">{c.name}</td>
                    <td className="px-4 py-3">{c.phone || 'N/A'}</td>
                    <td className="px-4 py-3">{c.email || 'N/A'}</td>
                    <td className="px-4 py-3">{c._count.sales} bills</td>
                  </tr>
                ))}
                {customers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
`);

// Categories Page
write(`${adminDir}/categories/page.tsx`, `
import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { connection } from 'next/server'

export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage() {
  await connection()
  const categories = await prisma.category.findMany({
    include: { _count: { select: { stores: true, products: true } } }
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-zinc-50 dark:bg-zinc-900 border-b">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Stores</th>
                  <th className="px-4 py-3">Products</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id} className="border-b dark:border-zinc-800">
                    <td className="px-4 py-3 font-medium">{cat.name}</td>
                    <td className="px-4 py-3">{cat.description || 'N/A'}</td>
                    <td className="px-4 py-3">{cat._count.stores}</td>
                    <td className="px-4 py-3">{cat._count.products}</td>
                    <td className="px-4 py-3">
                      <span className={\`px-2 py-1 rounded-full text-xs font-medium \${
                        cat.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }\`}>
                        {cat.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                      No categories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
`);

// Rent Page
write(`${adminDir}/rent/page.tsx`, `
import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { connection } from 'next/server'

export const dynamic = 'force-dynamic'

export default async function AdminRentPage() {
  await connection()
  const rents = await prisma.rent.findMany({
    include: { store: true },
    orderBy: [{ year: 'desc' }, { month: 'desc' }]
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Rent Management</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Rent Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-zinc-50 dark:bg-zinc-900 border-b">
                <tr>
                  <th className="px-4 py-3">Store</th>
                  <th className="px-4 py-3">Month/Year</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Due Date</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {rents.map((rent) => (
                  <tr key={rent.id} className="border-b dark:border-zinc-800">
                    <td className="px-4 py-3 font-medium">{rent.store.name}</td>
                    <td className="px-4 py-3">{rent.month}/{rent.year}</td>
                    <td className="px-4 py-3">\${rent.amount.toFixed(2)}</td>
                    <td className="px-4 py-3">{new Date(rent.dueDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={\`px-2 py-1 rounded-full text-xs font-medium \${
                        rent.status === 'PAID' ? 'bg-green-100 text-green-700' : rent.status === 'OVERDUE' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-800'
                      }\`}>
                        {rent.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {rents.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                      No rent records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
`);

// Complaints Page
write(`${adminDir}/complaints/page.tsx`, `
import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { connection } from 'next/server'

export const dynamic = 'force-dynamic'

export default async function AdminComplaintsPage() {
  await connection()
  const complaints = await prisma.complaint.findMany({
    include: { store: true, customer: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Complaints</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>All Complaints</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-zinc-50 dark:bg-zinc-900 border-b">
                <tr>
                  <th className="px-4 py-3">Store</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr key={c.id} className="border-b dark:border-zinc-800">
                    <td className="px-4 py-3 font-medium">{c.store.name}</td>
                    <td className="px-4 py-3">{c.customer ? c.customer.name : 'N/A'}</td>
                    <td className="px-4 py-3">{c.subject}</td>
                    <td className="px-4 py-3">{c.priority}</td>
                    <td className="px-4 py-3">{c.status}</td>
                  </tr>
                ))}
                {complaints.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                      No complaints found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
`);

// Reports Page
write(`${adminDir}/reports/page.tsx`, `
import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { connection } from 'next/server'

export const dynamic = 'force-dynamic'

export default async function AdminReportsPage() {
  await connection()
  
  const totalSales = await prisma.sale.aggregate({ _sum: { total: true } })
  const salesCount = await prisma.sale.count()
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">System Reports</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">\${totalSales._sum.total?.toFixed(2) || '0.00'}</div>
            <p className="text-xs text-muted-foreground">From {salesCount} sales</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
`);

// Store Owner Reports Page
const storeDir = 'src/app/(store)/store/reports';
write(`${storeDir}/page.tsx`, `
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { redirect } from 'next/navigation'
import { connection } from 'next/server'

export const dynamic = 'force-dynamic'

export default async function StoreReportsPage() {
  await connection()
  const session = await getSession()
  if (!session?.storeId) redirect('/login')
  
  const totalSales = await prisma.sale.aggregate({ 
    where: { storeId: session.storeId },
    _sum: { total: true } 
  })
  const salesCount = await prisma.sale.count({ where: { storeId: session.storeId } })
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Store Reports</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Store Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">\${totalSales._sum.total?.toFixed(2) || '0.00'}</div>
            <p className="text-xs text-muted-foreground">From {salesCount} sales</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
`);

// Store Owner Low Stock Page
write(`src/app/(store)/store/low-stock/page.tsx`, `
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { redirect } from 'next/navigation'
import { connection } from 'next/server'

export const dynamic = 'force-dynamic'

export default async function LowStockPage() {
  await connection()
  const session = await getSession()
  if (!session?.storeId) redirect('/login')
  
  const products = await prisma.product.findMany({ 
    where: { storeId: session.storeId, currentStock: { lte: prisma.product.fields.minimumStock } }
  })
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Low Stock Alerts</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Products Below Minimum Stock</CardTitle>
        </CardHeader>
        <CardContent>
           <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-zinc-50 dark:bg-zinc-900 border-b">
                <tr>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Current Stock</th>
                  <th className="px-4 py-3">Min Stock</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b dark:border-zinc-800">
                    <td className="px-4 py-3 font-medium">{p.sku}</td>
                    <td className="px-4 py-3">{p.name}</td>
                    <td className="px-4 py-3 text-red-500 font-bold">{p.currentStock}</td>
                    <td className="px-4 py-3">{p.minimumStock}</td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                      No low stock products.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
`);

console.log('Admin and Store generic pages generated successfully.');
