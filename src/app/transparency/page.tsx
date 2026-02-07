export const dynamic = 'force-dynamic'

import Link from "next/link"
import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Eye, TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import { formatDate, formatCurrency } from "@/lib/utils"

export default async function TransparencyPage() {
  // Get recent financial transactions
  const transactions = await db.financialTransaction.findMany({
    orderBy: { transactionDate: "desc" },
    take: 10,
    include: {
      createdByUser: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  })

  // Calculate totals
  const income = await db.financialTransaction.aggregate({
    where: { transactionType: "INCOME" },
    _sum: { amount: true },
  })

  const expenses = await db.financialTransaction.aggregate({
    where: { transactionType: "EXPENSE" },
    _sum: { amount: true },
  })

  const totalIncome = Number(income._sum.amount || 0)
  const totalExpenses = Number(expenses._sum.amount || 0)
  const balance = totalIncome - totalExpenses

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Transparency Portal</h1>
          <p className="text-muted-foreground">Barangay financial transparency and public records</p>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Income</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {formatCurrency(balance)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Financial Transactions</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/financial">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No transactions recorded yet</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      transaction.transactionType === "INCOME" 
                        ? "bg-green-100" 
                        : "bg-red-100"
                    }`}>
                      {transaction.transactionType === "INCOME" ? (
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description || transaction.category}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(transaction.transactionDate)} • {transaction.transactionNo}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.transactionType === "INCOME" 
                        ? "text-green-600" 
                        : "text-red-600"
                    }`}>
                      {transaction.transactionType === "INCOME" ? "+" : "-"}
                      {formatCurrency(Number(transaction.amount))}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {transaction.transactionType}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Public Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Public Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">2026 Annual Budget</p>
                  <p className="text-sm text-muted-foreground">PDF • 2.4 MB</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Q4 2025 Financial Report</p>
                  <p className="text-sm text-muted-foreground">PDF • 1.8 MB</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Barangay Development Plan 2026-2028</p>
                  <p className="text-sm text-muted-foreground">PDF • 5.1 MB</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">List of Barangay Officials</p>
                  <p className="text-sm text-muted-foreground">PDF • 856 KB</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
