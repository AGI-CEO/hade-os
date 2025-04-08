"use client"

import { useState } from "react"
import {
  Sparkles,
  DollarSign,
  Home,
  Calculator,
  BarChart2,
  ArrowRight,
  Save,
  RefreshCw,
  HelpCircle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Line, ComposedChart } from "recharts"

export function PropertySimulator() {
  // Property details
  const [purchasePrice, setPurchasePrice] = useState(300000)
  const [downPayment, setDownPayment] = useState(20)
  const [interestRate, setInterestRate] = useState(4.5)
  const [loanTerm, setLoanTerm] = useState(30)

  // Income
  const [monthlyRent, setMonthlyRent] = useState(2000)
  const [otherIncome, setOtherIncome] = useState(0)
  const [vacancyRate, setVacancyRate] = useState(5)

  // Expenses
  const [propertyTax, setPropertyTax] = useState(3000)
  const [insurance, setInsurance] = useState(1200)
  const [maintenance, setMaintenance] = useState(1800)
  const [propertyManagement, setPropertyManagement] = useState(8)
  const [utilities, setUtilities] = useState(0)
  const [hoa, setHoa] = useState(0)

  // Appreciation and other factors
  const [appreciation, setAppreciation] = useState(3)
  const [rentIncrease, setRentIncrease] = useState(2)
  const [expenseIncrease, setExpenseIncrease] = useState(2)

  // Calculate mortgage payment
  const calculateMortgage = () => {
    const loanAmount = purchasePrice * (1 - downPayment / 100)
    const monthlyRate = interestRate / 100 / 12
    const numberOfPayments = loanTerm * 12

    if (loanAmount > 0 && monthlyRate > 0 && numberOfPayments > 0) {
      const monthlyPayment =
        (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
      return monthlyPayment
    }

    return 0
  }

  // Calculate monthly cash flow
  const calculateCashFlow = () => {
    const effectiveRent = monthlyRent * (1 - vacancyRate / 100) + otherIncome
    const mortgagePayment = calculateMortgage()
    const monthlyPropertyTax = propertyTax / 12
    const monthlyInsurance = insurance / 12
    const monthlyMaintenance = maintenance / 12
    const managementFee = (propertyManagement / 100) * monthlyRent
    const monthlyUtilities = utilities / 12
    const monthlyHoa = hoa / 12

    const totalExpenses =
      mortgagePayment +
      monthlyPropertyTax +
      monthlyInsurance +
      monthlyMaintenance +
      managementFee +
      monthlyUtilities +
      monthlyHoa

    return effectiveRent - totalExpenses
  }

  // Calculate cash on cash return
  const calculateCashOnCash = () => {
    const downPaymentAmount = purchasePrice * (downPayment / 100)
    const closingCosts = purchasePrice * 0.03 // Estimated closing costs at 3%
    const totalInvestment = downPaymentAmount + closingCosts

    const annualCashFlow = calculateCashFlow() * 12

    if (totalInvestment > 0) {
      return (annualCashFlow / totalInvestment) * 100
    }

    return 0
  }

  // Calculate cap rate
  const calculateCapRate = () => {
    const annualRent = monthlyRent * 12
    const annualVacancyLoss = annualRent * (vacancyRate / 100)
    const annualPropertyTax = propertyTax
    const annualInsurance = insurance
    const annualMaintenance = maintenance
    const annualManagementFee = (propertyManagement / 100) * annualRent
    const annualUtilities = utilities
    const annualHoa = hoa

    const netOperatingIncome =
      annualRent -
      annualVacancyLoss -
      annualPropertyTax -
      annualInsurance -
      annualMaintenance -
      annualManagementFee -
      annualUtilities -
      annualHoa

    if (purchasePrice > 0) {
      return (netOperatingIncome / purchasePrice) * 100
    }

    return 0
  }

  // Generate projection data for 10 years
  const generateProjectionData = () => {
    const data = []
    let propertyValue = purchasePrice
    let yearlyRent = monthlyRent * 12
    let yearlyExpenses =
      propertyTax + insurance + maintenance + (propertyManagement / 100) * yearlyRent + utilities + hoa

    for (let year = 1; year <= 10; year++) {
      // Apply appreciation and increases
      propertyValue = propertyValue * (1 + appreciation / 100)
      yearlyRent = yearlyRent * (1 + rentIncrease / 100)
      yearlyExpenses = yearlyExpenses * (1 + expenseIncrease / 100)

      // Calculate equity (assuming linear mortgage paydown for simplicity)
      const initialLoanAmount = purchasePrice * (1 - downPayment / 100)
      const equityFromDownPayment = purchasePrice * (downPayment / 100)
      const equityFromPaydown = initialLoanAmount * (year / loanTerm)
      const equityFromAppreciation = propertyValue - purchasePrice
      const totalEquity = equityFromDownPayment + equityFromPaydown + equityFromAppreciation

      // Calculate cash flow
      const effectiveRent = yearlyRent * (1 - vacancyRate / 100)
      const mortgagePayment = calculateMortgage() * 12
      const netCashFlow = effectiveRent - mortgagePayment - yearlyExpenses

      data.push({
        year,
        propertyValue: Math.round(propertyValue),
        equity: Math.round(totalEquity),
        cashFlow: Math.round(netCashFlow),
      })
    }

    return data
  }

  const projectionData = generateProjectionData()
  const monthlyCashFlow = calculateCashFlow()
  const cashOnCashReturn = calculateCashOnCash()
  const capRate = calculateCapRate()

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-primary-foreground flex items-center">
            <Sparkles className="mr-2 h-5 w-5 text-primary" />
            Property Investment Simulator
          </CardTitle>
          <CardDescription>Analyze potential real estate investments and forecast returns</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="inputs" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="inputs">
                <Calculator className="mr-2 h-4 w-4" />
                Inputs
              </TabsTrigger>
              <TabsTrigger value="results">
                <BarChart2 className="mr-2 h-4 w-4" />
                Results
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="inputs" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-primary-foreground mb-4 flex items-center">
                        <Home className="mr-2 h-5 w-5 text-primary" />
                        Property Details
                      </h3>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-primary-foreground">Purchase Price</label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="number"
                              value={purchasePrice}
                              onChange={(e) => setPurchasePrice(Number(e.target.value))}
                              className="pl-9 bg-card border-border"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <label htmlFor="down-payment">Down Payment (%)</label>
                            <span className="text-primary-foreground">{downPayment}%</span>
                          </div>
                          <Slider
                            id="down-payment"
                            min={0}
                            max={100}
                            step={1}
                            value={[downPayment]}
                            onValueChange={(value) => setDownPayment(value[0])}
                            className="[&>span]:bg-primary"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <label htmlFor="interest-rate">Interest Rate (%)</label>
                            <span className="text-primary-foreground">{interestRate}%</span>
                          </div>
                          <Slider
                            id="interest-rate"
                            min={1}
                            max={10}
                            step={0.125}
                            value={[interestRate]}
                            onValueChange={(value) => setInterestRate(value[0])}
                            className="[&>span]:bg-primary"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-primary-foreground">Loan Term (years)</label>
                          <div className="grid grid-cols-3 gap-2">
                            <Button
                              variant={loanTerm === 15 ? "default" : "outline"}
                              onClick={() => setLoanTerm(15)}
                              className="w-full"
                            >
                              15
                            </Button>
                            <Button
                              variant={loanTerm === 20 ? "default" : "outline"}
                              onClick={() => setLoanTerm(20)}
                              className="w-full"
                            >
                              20
                            </Button>
                            <Button
                              variant={loanTerm === 30 ? "default" : "outline"}
                              onClick={() => setLoanTerm(30)}
                              className="w-full"
                            >
                              30
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-primary-foreground mb-4 flex items-center">
                        <DollarSign className="mr-2 h-5 w-5 text-primary" />
                        Income
                      </h3>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-primary-foreground">Monthly Rent</label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="number"
                              value={monthlyRent}
                              onChange={(e) => setMonthlyRent(Number(e.target.value))}
                              className="pl-9 bg-card border-border"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-primary-foreground">Other Monthly Income</label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="number"
                              value={otherIncome}
                              onChange={(e) => setOtherIncome(Number(e.target.value))}
                              className="pl-9 bg-card border-border"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <label htmlFor="vacancy-rate">Vacancy Rate (%)</label>
                            <span className="text-primary-foreground">{vacancyRate}%</span>
                          </div>
                          <Slider
                            id="vacancy-rate"
                            min={0}
                            max={20}
                            step={1}
                            value={[vacancyRate]}
                            onValueChange={(value) => setVacancyRate(value[0])}
                            className="[&>span]:bg-primary"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-primary-foreground mb-4 flex items-center">
                        <Calculator className="mr-2 h-5 w-5 text-primary" />
                        Expenses
                      </h3>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-primary-foreground">Annual Property Tax</label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="number"
                              value={propertyTax}
                              onChange={(e) => setPropertyTax(Number(e.target.value))}
                              className="pl-9 bg-card border-border"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-primary-foreground">Annual Insurance</label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="number"
                              value={insurance}
                              onChange={(e) => setInsurance(Number(e.target.value))}
                              className="pl-9 bg-card border-border"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-primary-foreground">Annual Maintenance</label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="number"
                              value={maintenance}
                              onChange={(e) => setMaintenance(Number(e.target.value))}
                              className="pl-9 bg-card border-border"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <label htmlFor="property-management">Property Management (%)</label>
                            <span className="text-primary-foreground">{propertyManagement}%</span>
                          </div>
                          <Slider
                            id="property-management"
                            min={0}
                            max={15}
                            step={0.5}
                            value={[propertyManagement]}
                            onValueChange={(value) => setPropertyManagement(value[0])}
                            className="[&>span]:bg-primary"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-primary-foreground">Monthly Utilities</label>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="number"
                                value={utilities}
                                onChange={(e) => setUtilities(Number(e.target.value))}
                                className="pl-9 bg-card border-border"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-primary-foreground">Monthly HOA</label>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="number"
                                value={hoa}
                                onChange={(e) => setHoa(Number(e.target.value))}
                                className="pl-9 bg-card border-border"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-primary-foreground mb-4 flex items-center">
                        <BarChart2 className="mr-2 h-5 w-5 text-primary" />
                        Growth Assumptions
                      </h3>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <label htmlFor="appreciation">Property Appreciation (%/year)</label>
                            <span className="text-primary-foreground">{appreciation}%</span>
                          </div>
                          <Slider
                            id="appreciation"
                            min={0}
                            max={10}
                            step={0.5}
                            value={[appreciation]}
                            onValueChange={(value) => setAppreciation(value[0])}
                            className="[&>span]:bg-primary"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <label htmlFor="rent-increase">Annual Rent Increase (%)</label>
                            <span className="text-primary-foreground">{rentIncrease}%</span>
                          </div>
                          <Slider
                            id="rent-increase"
                            min={0}
                            max={10}
                            step={0.5}
                            value={[rentIncrease]}
                            onValueChange={(value) => setRentIncrease(value[0])}
                            className="[&>span]:bg-primary"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <label htmlFor="expense-increase">Annual Expense Increase (%)</label>
                            <span className="text-primary-foreground">{expenseIncrease}%</span>
                          </div>
                          <Slider
                            id="expense-increase"
                            min={0}
                            max={10}
                            step={0.5}
                            value={[expenseIncrease]}
                            onValueChange={(value) => setExpenseIncrease(value[0])}
                            className="[&>span]:bg-primary"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <Button variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                  <Button>
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Calculate Results
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="results" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 rounded-lg border border-border bg-card/50">
                    <h3 className="text-sm text-muted-foreground mb-1">Monthly Cash Flow</h3>
                    <div className="text-2xl font-bold text-primary-foreground">{formatCurrency(monthlyCashFlow)}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {monthlyCashFlow > 0 ? "Positive cash flow" : "Negative cash flow"}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border border-border bg-card/50">
                    <h3 className="text-sm text-muted-foreground mb-1">Cash on Cash Return</h3>
                    <div className="text-2xl font-bold text-primary-foreground">{cashOnCashReturn.toFixed(2)}%</div>
                    <p className="text-xs text-muted-foreground mt-1">Annual return on invested capital</p>
                  </div>

                  <div className="p-4 rounded-lg border border-border bg-card/50">
                    <h3 className="text-sm text-muted-foreground mb-1">Cap Rate</h3>
                    <div className="text-2xl font-bold text-primary-foreground">{capRate.toFixed(2)}%</div>
                    <p className="text-xs text-muted-foreground mt-1">Net operating income / property value</p>
                  </div>
                </div>

                <Card className="bg-card border-border mb-6">
                  <CardHeader>
                    <CardTitle className="text-primary-foreground">10-Year Projection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ChartContainer
                        config={{
                          propertyValue: {
                            label: "Property Value",
                            color: "hsl(var(--chart-1))",
                          },
                          equity: {
                            label: "Equity",
                            color: "hsl(var(--chart-2))",
                          },
                          cashFlow: {
                            label: "Annual Cash Flow",
                            color: "hsl(var(--chart-3))",
                          },
                        }}
                        className="w-full h-full"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <ComposedChart data={projectionData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" />
                            <YAxis
                              yAxisId="left"
                              stroke="hsl(var(--muted-foreground))"
                              tickFormatter={(value) => `$${Math.round(value / 1000)}k`}
                            />
                            <YAxis
                              yAxisId="right"
                              orientation="right"
                              stroke="hsl(var(--muted-foreground))"
                              tickFormatter={(value) => `$${Math.round(value / 1000)}k`}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Legend />
                            <Bar
                              yAxisId="left"
                              dataKey="propertyValue"
                              fill="var(--color-propertyValue)"
                              name="Property Value"
                              radius={[4, 4, 0, 0]}
                            />
                            <Bar
                              yAxisId="left"
                              dataKey="equity"
                              fill="var(--color-equity)"
                              name="Equity"
                              radius={[4, 4, 0, 0]}
                            />
                            <Line
                              yAxisId="right"
                              type="monotone"
                              dataKey="cashFlow"
                              stroke="var(--color-cashFlow)"
                              name="Annual Cash Flow"
                              strokeWidth={2}
                              dot={{ r: 4 }}
                              activeDot={{ r: 6, strokeWidth: 1 }}
                            />
                          </ComposedChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-primary-foreground">Monthly Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-primary-foreground mb-2">Income</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Gross Rent</span>
                              <span className="text-primary-foreground">{formatCurrency(monthlyRent)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Vacancy Loss</span>
                              <span className="text-red-500">-{formatCurrency(monthlyRent * (vacancyRate / 100))}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Other Income</span>
                              <span className="text-primary-foreground">{formatCurrency(otherIncome)}</span>
                            </div>
                            <div className="border-t border-border my-2"></div>
                            <div className="flex justify-between font-medium">
                              <span className="text-primary-foreground">Effective Income</span>
                              <span className="text-primary-foreground">
                                {formatCurrency(monthlyRent * (1 - vacancyRate / 100) + otherIncome)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-primary-foreground mb-2">Expenses</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Mortgage</span>
                              <span className="text-red-500">-{formatCurrency(calculateMortgage())}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Property Tax</span>
                              <span className="text-red-500">-{formatCurrency(propertyTax / 12)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Insurance</span>
                              <span className="text-red-500">-{formatCurrency(insurance / 12)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Maintenance</span>
                              <span className="text-red-500">-{formatCurrency(maintenance / 12)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Property Management</span>
                              <span className="text-red-500">
                                -{formatCurrency((propertyManagement / 100) * monthlyRent)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Utilities</span>
                              <span className="text-red-500">-{formatCurrency(utilities)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">HOA</span>
                              <span className="text-red-500">-{formatCurrency(hoa)}</span>
                            </div>
                            <div className="border-t border-border my-2"></div>
                            <div className="flex justify-between font-medium">
                              <span className="text-primary-foreground">Total Expenses</span>
                              <span className="text-red-500">
                                -
                                {formatCurrency(
                                  calculateMortgage() +
                                    propertyTax / 12 +
                                    insurance / 12 +
                                    maintenance / 12 +
                                    (propertyManagement / 100) * monthlyRent +
                                    utilities +
                                    hoa,
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-border pt-2">
                          <div className="flex justify-between font-bold">
                            <span className="text-primary-foreground">Monthly Cash Flow</span>
                            <span className={monthlyCashFlow >= 0 ? "text-green-500" : "text-red-500"}>
                              {formatCurrency(monthlyCashFlow)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-primary-foreground">Investment Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-primary-foreground mb-2">Initial Investment</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Down Payment</span>
                              <span className="text-primary-foreground">
                                {formatCurrency(purchasePrice * (downPayment / 100))}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Closing Costs (est. 3%)</span>
                              <span className="text-primary-foreground">{formatCurrency(purchasePrice * 0.03)}</span>
                            </div>
                            <div className="border-t border-border my-2"></div>
                            <div className="flex justify-between font-medium">
                              <span className="text-primary-foreground">Total Investment</span>
                              <span className="text-primary-foreground">
                                {formatCurrency(purchasePrice * (downPayment / 100) + purchasePrice * 0.03)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-primary-foreground mb-2">Return Metrics</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Monthly Cash Flow</span>
                              <span className={monthlyCashFlow >= 0 ? "text-green-500" : "text-red-500"}>
                                {formatCurrency(monthlyCashFlow)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Annual Cash Flow</span>
                              <span className={monthlyCashFlow * 12 >= 0 ? "text-green-500" : "text-red-500"}>
                                {formatCurrency(monthlyCashFlow * 12)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Cash on Cash Return</span>
                              <span className={cashOnCashReturn >= 0 ? "text-green-500" : "text-red-500"}>
                                {cashOnCashReturn.toFixed(2)}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Cap Rate</span>
                              <span className={capRate >= 0 ? "text-green-500" : "text-red-500"}>
                                {capRate.toFixed(2)}%
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-primary-foreground mb-2">5-Year Projection</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Property Value</span>
                              <span className="text-primary-foreground">
                                {formatCurrency(projectionData[4].propertyValue)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Equity</span>
                              <span className="text-primary-foreground">
                                {formatCurrency(projectionData[4].equity)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Annual Cash Flow</span>
                              <span className={projectionData[4].cashFlow >= 0 ? "text-green-500" : "text-red-500"}>
                                {formatCurrency(projectionData[4].cashFlow)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-between mt-6">
                  <Button variant="outline">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Analysis Help
                  </Button>
                  <div className="space-x-2">
                    <Button variant="outline">
                      <Save className="mr-2 h-4 w-4" />
                      Save Analysis
                    </Button>
                    <Button>
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Adjust Inputs
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
