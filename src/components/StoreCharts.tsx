'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const PRODUCT_COLORS = ['#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#f59e0b']

const PAYMENT_COLORS: Record<string, string> = {
  CASH: '#10b981',
  CARD: '#3b82f6',
  UPI: '#8b5cf6',
  OTHER: '#f59e0b',
}

function formatCurrency(value: number) {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`
  if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`
  return `₹${value}`
}

export function StoreCharts({
  salesData,
  topProductsData,
  inventoryData,
  paymentData,
}: {
  salesData: { name: string; total: number; count?: number }[]
  topProductsData: { name: string; quantity: number; revenue?: number }[]
  inventoryData: { name: string; value: number; color: string }[]
  paymentData?: { name: string; count: number; total: number }[]
}) {
  const tooltipStyle = {
    background: '#064e3b',
    border: '1px solid #065f46',
    borderRadius: '8px',
    color: '#d1fae5',
  }

  return (
    <div className="space-y-4">
      {/* Daily Sales Trend — full width */}
      <Card className="bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold" style={{ color: '#064e3b' }}>
            Daily Sales — Last 7 Days
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData} margin={{ top: 4, right: 4, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d1fae5" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6ee7b7', fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6ee7b7', fontSize: 11 }}
                  tickFormatter={formatCurrency}
                />
                <Tooltip
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) => [
                    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(
                      Number(value) || 0
                    ),
                    'Revenue',
                  ]}
                  contentStyle={tooltipStyle}
                />
                <Bar dataKey="total" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {salesData.length === 0 && (
            <p className="text-center text-muted-foreground text-sm py-8">No sales in last 7 days</p>
          )}
        </CardContent>
      </Card>

      {/* Row 2: Inventory + Payment Method */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold" style={{ color: '#064e3b' }}>
              Inventory Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={inventoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {inventoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: '12px', color: '#064e3b' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {inventoryData.length === 0 && (
              <p className="text-center text-muted-foreground text-sm py-8">No products</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold" style={{ color: '#064e3b' }}>
              Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              {paymentData && paymentData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="count"
                    >
                      {paymentData.map((entry, index) => (
                        <Cell
                          key={`pay-cell-${index}`}
                          fill={PAYMENT_COLORS[entry.name] ?? '#94a3b8'}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      formatter={(value: any, name: any) => [
                        `${value} transactions`,
                        name,
                      ]}
                      contentStyle={tooltipStyle}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', color: '#064e3b' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-muted-foreground text-sm py-24">
                  No payment data available
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      {topProductsData.length > 0 && (
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold" style={{ color: '#064e3b' }}>
              Top 5 Products by Quantity Sold
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topProductsData}
                  layout="vertical"
                  margin={{ top: 4, right: 16, left: 0, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#d1fae5" />
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6ee7b7', fontSize: 11 }}
                    allowDecimals={false}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={120}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#065f46', fontSize: 11 }}
                  />
                  <Tooltip
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(value: any, name: any) => [
                      name === 'revenue'
                        ? new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR',
                          }).format(Number(value) || 0)
                        : `${value} units`,
                      name === 'revenue' ? 'Revenue' : 'Units Sold',
                    ]}
                    contentStyle={tooltipStyle}
                  />
                  <Bar dataKey="quantity" name="quantity" radius={[0, 4, 4, 0]}>
                    {topProductsData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PRODUCT_COLORS[index % PRODUCT_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
