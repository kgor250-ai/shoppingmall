/**
 * Aurelia Shopping Mall - Route and Navigation Utilities
 * Provides route matching, active state detection, breadcrumb generation,
 * and page titles across the public mall and dashboard panels.
 */

export function normalizePath(path: string): string {
  if (!path) return '/'
  // Strip query parameters and hash
  const cleanPath = path.split('?')[0].split('#')[0]
  // Strip trailing slash unless it's just root '/'
  if (cleanPath.length > 1 && cleanPath.endsWith('/')) {
    return cleanPath.slice(0, -1)
  }
  return cleanPath
}

export function isRouteActive(
  currentPathname: string,
  targetHref: string,
  exact: boolean = false
): boolean {
  const current = normalizePath(currentPathname)
  const target = normalizePath(targetHref)

  if (exact || target === '/admin' || target === '/store') {
    return current === target
  }

  // Exact match
  if (current === target) {
    return true
  }

  // Nested route match (e.g. /admin/stores/new or /admin/stores/123/edit)
  if (current.startsWith(target + '/')) {
    return true
  }

  return false
}

export type BreadcrumbItem = {
  label: string
  href?: string
}

export type RouteInfo = {
  title: string
  subtitle?: string
  breadcrumbs: BreadcrumbItem[]
}

const adminRoutesMap: Record<string, { title: string; subtitle?: string; label: string }> = {
  '/admin': {
    title: 'Executive Dashboard',
    subtitle: 'Mall performance overview, revenue metrics, and live occupancy',
    label: 'Dashboard',
  },
  '/admin/stores': {
    title: 'Stores Directory',
    subtitle: 'Manage all tenant retail outlets, boutiques, and lease statuses',
    label: 'Stores',
  },
  '/admin/owners': {
    title: 'Store Owners',
    subtitle: 'Registered merchant accounts, credentials, and contact records',
    label: 'Store Owners',
  },
  '/admin/employees': {
    title: 'Mall & Store Staff',
    subtitle: 'Employee roster, roles, designations, and store assignments',
    label: 'Employees',
  },
  '/admin/customers': {
    title: 'Customer Directory',
    subtitle: 'Registered shoppers, loyalty members, and purchase profiles',
    label: 'Customers',
  },
  '/admin/categories': {
    title: 'Retail Categories',
    subtitle: 'Mall shopping sectors, merchandising categories, and classifications',
    label: 'Categories',
  },
  '/admin/layout-management': {
    title: 'Mall Layout & 3D Floor Plans',
    subtitle: 'Interactive architectural levels, shop spatial coordinates, and facilities',
    label: 'Mall Layout',
  },
  '/admin/rent': {
    title: 'Rent & Lease Billing',
    subtitle: 'Monthly tenant rent collections, due dates, invoices, and payment tracking',
    label: 'Rent',
  },
  '/admin/complaints': {
    title: 'Customer & Store Complaints',
    subtitle: 'Feedback resolution desk, support tickets, and incident management',
    label: 'Complaints',
  },
  '/admin/reports': {
    title: 'Mall Performance Reports',
    subtitle: 'Consolidated sales reports, category revenue breakdowns, and audits',
    label: 'Reports',
  },
}

const storeRoutesMap: Record<string, { title: string; subtitle?: string; label: string }> = {
  '/store': {
    title: 'Store Management Console',
    subtitle: 'Daily operational summary, revenue trends, and quick store actions',
    label: 'Dashboard',
  },
  '/store/billing': {
    title: 'Point of Sale (POS) Billing',
    subtitle: 'Fast customer checkout, barcode lookup, invoice generation, and receipt printing',
    label: 'Billing POS',
  },
  '/store/products': {
    title: 'Product Catalog',
    subtitle: 'Inventory management, pricing, SKU codes, and stock thresholds',
    label: 'Products',
  },
  '/store/stock': {
    title: 'Inventory & Stock History',
    subtitle: 'Restock transactions, adjustments, audits, and physical count logs',
    label: 'Stock',
  },
  '/store/low-stock': {
    title: 'Low Stock Alerts',
    subtitle: 'Urgent inventory reorder warnings and critical threshold monitors',
    label: 'Low Stock',
  },
  '/store/sales': {
    title: 'Sales & Invoices History',
    subtitle: 'Transaction archive, past receipts, payment methods, and customer order logs',
    label: 'Sales',
  },
  '/store/reports': {
    title: 'Store Financial Reports',
    subtitle: 'Sales analytics, profit margin summaries, and best-performing merchandise',
    label: 'Reports',
  },
}

export function getRouteInfo(pathname: string): RouteInfo {
  const clean = normalizePath(pathname)

  // 1. Admin Routes
  if (clean.startsWith('/admin')) {
    const matched = adminRoutesMap[clean]
    if (matched) {
      return {
        title: matched.title,
        subtitle: matched.subtitle,
        breadcrumbs:
          clean === '/admin'
            ? [{ label: 'Admin', href: '/admin' }, { label: 'Dashboard' }]
            : [
                { label: 'Admin', href: '/admin' },
                { label: matched.label, href: clean },
              ],
      }
    }

    // Check nested parent routes (e.g. /admin/stores/new or /admin/stores/123)
    for (const [routeKey, meta] of Object.entries(adminRoutesMap)) {
      if (routeKey !== '/admin' && clean.startsWith(routeKey + '/')) {
        const subPath = clean.slice(routeKey.length + 1)
        let subLabel = subPath
        if (subPath === 'new') subLabel = 'Add New'
        else if (subPath.endsWith('/edit')) subLabel = 'Edit Record'
        else if (subPath.startsWith('add-')) subLabel = subPath.replace('-', ' ')
        else if (subPath === 'editor') subLabel = '3D Layout Editor'
        else subLabel = 'Details'

        return {
          title: `${meta.label} — ${subLabel}`,
          subtitle: meta.subtitle,
          breadcrumbs: [
            { label: 'Admin', href: '/admin' },
            { label: meta.label, href: routeKey },
            { label: subLabel },
          ],
        }
      }
    }

    return {
      title: 'Mall Administration',
      subtitle: 'Administration portal',
      breadcrumbs: [{ label: 'Admin', href: '/admin' }],
    }
  }

  // 2. Store Routes
  if (clean.startsWith('/store')) {
    const matched = storeRoutesMap[clean]
    if (matched) {
      return {
        title: matched.title,
        subtitle: matched.subtitle,
        breadcrumbs:
          clean === '/store'
            ? [{ label: 'Store Portal', href: '/store' }, { label: 'Dashboard' }]
            : [
                { label: 'Store Portal', href: '/store' },
                { label: matched.label, href: clean },
              ],
      }
    }

    // Check nested parent routes
    for (const [routeKey, meta] of Object.entries(storeRoutesMap)) {
      if (routeKey !== '/store' && clean.startsWith(routeKey + '/')) {
        const subPath = clean.slice(routeKey.length + 1)
        let subLabel = subPath
        if (subPath === 'new') subLabel = 'Add Item'
        else if (subPath.endsWith('/edit')) subLabel = 'Edit'
        else subLabel = 'Details'

        return {
          title: `${meta.label} — ${subLabel}`,
          subtitle: meta.subtitle,
          breadcrumbs: [
            { label: 'Store Portal', href: '/store' },
            { label: meta.label, href: routeKey },
            { label: subLabel },
          ],
        }
      }
    }

    return {
      title: 'Store Portal',
      subtitle: 'Store owner workspace',
      breadcrumbs: [{ label: 'Store Portal', href: '/store' }],
    }
  }

  // 3. Fallback / Public
  return {
    title: 'Aurelia Luxury Shopping Mall',
    subtitle: 'World-class retail and fine dining destination',
    breadcrumbs: [{ label: 'Home', href: '/' }],
  }
}
