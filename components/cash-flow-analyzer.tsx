"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { BarChart2, DollarSign, Calculator, ArrowRight, Save, Download, Info, Percent } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Line, ComposedChart } from "recharts"

export function CashFlowAnalyzer() {
  // Property details
  const [purchasePrice, setPurchasePrice] = useState(425000)
  const [downPayment, setDownPayment] = useState(20)
  const [interestRate, setInterestRate] = useState(5.0)
  const [loanTerm, setLoanTerm] = useState(30)

  // Income
  const [monthlyRent, setMonthlyRent] = useState(2200)
  const [otherIncome, setOtherIncome] = useState(0)
  const [vacancyRate, setVacancyRate] = useState(5)

  // Expenses
  const [propertyTax, setPropertyTax] = useState(4200)
  const [insurance, setInsurance] = useState(1440)
  const [maintenance, setMaintenance] = useState(2400)
  const [propertyManagement, setPropertyManagement] = useState(8)
  const [utilities, setUtilities] = useState(0)
  const [hoa, setHoa] = useState(0)

  // Growth assumptions
  const [appreciation, setAppreciation] = useState(3)
  const [rentGrowth, setRentGrowth] = useState(2)
  const [expenseGrowth, setExpenseGrowth] = useState(2)

  // Show results
  const [showResults, setShowResults] = useState(false)

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
    const annualUtilities = utilities * 12
    const annualHoa = hoa * 12

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

  // Generate projection data for 5 years
  const generateProjectionData = () => {
    const data = []
    let propertyValue = purchasePrice
    let yearlyRent = monthlyRent * 12
    let yearlyExpenses =
      propertyTax + insurance + maintenance + (propertyManagement / 100) * yearlyRent + utilities * 12 + hoa * 12

    for (let year = 1; year <= 5; year++) {
      // Apply appreciation and increases
      propertyValue = propertyValue * (1 + appreciation / 100)
      yearlyRent = yearlyRent * (1 + rentGrowth / 100)
      yearlyExpenses = yearlyExpenses * (1 + expenseGrowth / 100)

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

  const monthlyCashFlow = calculateCashFlow()
  const cashOnCashReturn = calculateCashOnCash()
  const capRate = calculateCapRate()
  const projectionData = generateProjectionData()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const runAnalysis = () => {
    setShowResults(true)
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-primary-foreground flex items-center">
            <BarChart2 className="mr-2 h-5 w-5 text-primary" />
            Cash Flow Analyzer
          </CardTitle>
          <CardDescription>Calculate potential returns and analyze investment performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-primary-foreground mb-4 flex items-center">
                  <DollarSign className="mr-2 h-5 w-5 text-primary" />
                  Property & Financing
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-primary-foreground">Purchase Price</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        className="pl-9 bg-card border-border"
                        value={purchasePrice}
                        onChange={(e) => setPurchasePrice(Number(e.target.value))}
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

                  <div className="grid grid-cols-2 gap-4">
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
                          size="sm"
                        >
                          15
                        </Button>
                        <Button
                          variant={loanTerm === 20 ? "default" : "outline"}
                          onClick={() => setLoanTerm(20)}
                          className="w-full"
                          size="sm"
                        >
                          20
                        </Button>
                        <Button
                          variant={loanTerm === 30 ? "default" : "outline"}
                          onClick={() => setLoanTerm(30)}
                          className="w-full"
                          size="sm"
                        >
                          30
                        </Button>
                      </div>
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
                        className="pl-9 bg-card border-border"
                        value={monthlyRent}
                        onChange={(e) => setMonthlyRent(Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-primary-foreground">Other Monthly Income</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        className="pl-9 bg-card border-border"
                        value={otherIncome}
                        onChange={(e) => setOtherIncome(Number(e.target.value))}
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

            <div className="space-y-4">
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
                        className="pl-9 bg-card border-border"
                        value={propertyTax}
                        onChange={(e) => setPropertyTax(Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-primary-foreground">Annual Insurance</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        className="pl-9 bg-card border-border"
                        value={insurance}
                        onChange={(e) => setInsurance(Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-primary-foreground">Annual Maintenance</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        className="pl-9 bg-card border-border"
                        value={maintenance}
                        onChange={(e) => setMaintenance(Number(e.target.value))}
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
                          className="pl-9 bg-card border-border"
                          value={utilities}
                          onChange={(e) => setUtilities(Number(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary-foreground">Monthly HOA</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          className="pl-9 bg-card border-border"
                          value={hoa}
                          onChange={(e) => setHoa(Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-primary-foreground mb-4 flex items-center">
                  <Percent className="mr-2 h-5 w-5 text-primary" />
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

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <label htmlFor="rent-growth">Rent Growth (%/year)</label>
                        <span className="text-primary-foreground">{rentGrowth}%</span>
                      </div>
                      <Slider
                        id="rent-growth"
                        min={0}
                        max={10}
                        step={0.5}
                        value={[rentGrowth]}
                        onValueChange={(value) => setRentGrowth(value[0])}
                        className="[&>span]:bg-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <label htmlFor="expense-growth">Expense Growth (%/year)</label>
                        <span className="text-primary-foreground">{expenseGrowth}%</span>
                      </div>
                      <Slider
                        id="expense-growth"
                        min={0}
                        max={10}
                        step={0.5}
                        value={[expenseGrowth]}
                        onValueChange={(value) => setExpenseGrowth(value[0])}
                        className="[&>span]:bg-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full" onClick={runAnalysis}>
                <Calculator className="mr-2 h-4 w-4" />
                Calculate Cash Flow
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {showResults && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-primary-foreground flex items-center">
                <BarChart2 className="mr-2 h-5 w-5 text-primary" />
                Cash Flow Analysis Results
              </CardTitle>
              <CardDescription>Detailed breakdown of your investment returns</CardDescription>
            </CardHeader>
            <CardContent>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-medium text-primary-foreground mb-4">Monthly Breakdown</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-primary-foreground mb-2">Income</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Gross Rent</span>
                          <span className="text-primary-foreground">{formatCurrency(monthlyRent)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Vacancy Loss ({vacancyRate}%)</span>
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
                      <h4 className="text-sm font-medium text-primary-foreground mb-2">Expenses</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Mortgage Payment</span>
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
                </div>

                <div>
                  <h3 className="text-lg font-medium text-primary-foreground mb-4">5-Year Projection</h3>
                  <div className="h-[300px]">
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
                </div>
              </div>

              <div className="p-4 rounded-lg border border-border bg-card/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Info className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-primary-foreground">Investment Analysis</h3>
                    <p className="text-xs text-muted-foreground">Key metrics and insights for your investment</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Cash Flow Quality</span>
                        <span className="text-primary-foreground">
                          {monthlyCashFlow > 300
                            ? "Excellent"
                            : monthlyCashFlow > 100
                              ? "Good"
                              : monthlyCashFlow > 0
                                ? "Fair"
                                : "Poor"}
                        </span>
                      </div>
                      <Progress
                        value={monthlyCashFlow > 0 ? Math.min(Math.max(monthlyCashFlow / 5, 0), 100) : 0}
                        className="h-1.5 [&>div]:bg-primary"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Cash on Cash Return</span>
                        <span className="text-primary-foreground">
                          {cashOnCashReturn > 8
                            ? "Excellent"
                            : cashOnCashReturn > 6
                              ? "Good"
                              : cashOnCashReturn > 4
                                ? "Fair"
                                : "Poor"}
                        </span>
                      </div>
                      <Progress value={Math.min(cashOnCashReturn * 10, 100)} className="h-1.5 [&>div]:bg-primary" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Appreciation Potential</span>
                        <span className="text-primary-foreground">
                          {appreciation > 4
                            ? "Excellent"
                            : appreciation > 3
                              ? "Good"
                              : appreciation > 2
                                ? "Fair"
                                : "Poor"}
                        </span>
                      </div>
                      <Progress value={Math.min(appreciation * 20, 100)} className="h-1.5 [&>div]:bg-primary" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Investment</span>
                      <span className="text-primary-foreground">
                        {formatCurrency(purchasePrice * (downPayment / 100) + purchasePrice * 0.03)}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">5-Year Equity Growth</span>
                      <span className="text-primary-foreground">{formatCurrency(projectionData[4].equity)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">5-Year Cash Flow Total</span>
                      <span className="text-primary-foreground">
                        {formatCurrency(projectionData.reduce((sum, year) => sum + year.cashFlow, 0))}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Break-even Ratio</span>
                      <span className="text-primary-foreground">
                        {(
                          ((calculateMortgage() +
                            propertyTax / 12 +
                            insurance / 12 +
                            maintenance / 12 +
                            (propertyManagement / 100) * monthlyRent +
                            utilities +
                            hoa) /
                            (monthlyRent * (1 - vacancyRate / 100) + otherIncome)) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="outline">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Adjust Inputs
                </Button>
                <div className="space-x-2">
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export Report
                  </Button>
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Analysis
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
