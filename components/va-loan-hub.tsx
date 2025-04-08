"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Shield,
  Calculator,
  FileText,
  Play,
  Download,
  ExternalLink,
  Info,
  ChevronRight,
  HelpCircle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function VALoanHub() {
  const [loanAmount, setLoanAmount] = useState("250000")
  const [interestRate, setInterestRate] = useState("3.5")
  const [loanTerm, setLoanTerm] = useState("30")

  // Calculate monthly payment
  const calculateMonthlyPayment = () => {
    const principal = Number.parseFloat(loanAmount)
    const monthlyRate = Number.parseFloat(interestRate) / 100 / 12
    const numberOfPayments = Number.parseFloat(loanTerm) * 12

    if (principal > 0 && monthlyRate > 0 && numberOfPayments > 0) {
      const monthlyPayment =
        (principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
      return monthlyPayment.toFixed(2)
    }

    return "0.00"
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="bg-card border-border flex-1">
          <CardHeader>
            <CardTitle className="text-primary-foreground flex items-center">
              <Shield className="mr-2 h-5 w-5 text-primary" />
              VA Loan Benefits
            </CardTitle>
            <CardDescription>Key advantages for veterans using VA loans</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <ChevronRight className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-primary-foreground">No Down Payment Required</h4>
                  <p className="text-sm text-muted-foreground">
                    VA loans allow eligible veterans to purchase homes with no down payment.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <ChevronRight className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-primary-foreground">No Private Mortgage Insurance</h4>
                  <p className="text-sm text-muted-foreground">
                    Unlike conventional loans, VA loans don't require PMI, saving you money monthly.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <ChevronRight className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-primary-foreground">Competitive Interest Rates</h4>
                  <p className="text-sm text-muted-foreground">
                    VA loans typically offer lower interest rates compared to conventional loans.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <ChevronRight className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-primary-foreground">Limited Closing Costs</h4>
                  <p className="text-sm text-muted-foreground">
                    The VA limits the closing costs that veterans can pay, reducing upfront expenses.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <ChevronRight className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-primary-foreground">No Prepayment Penalty</h4>
                  <p className="text-sm text-muted-foreground">
                    You can pay off your VA loan early without any penalties.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border flex-1">
          <CardHeader>
            <CardTitle className="text-primary-foreground flex items-center">
              <Calculator className="mr-2 h-5 w-5 text-primary" />
              VA Loan Calculator
            </CardTitle>
            <CardDescription>Estimate your monthly payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary-foreground">Loan Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    className="pl-7 bg-card border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-primary-foreground">Interest Rate (%)</label>
                <Input
                  type="number"
                  step="0.125"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="bg-card border-border"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-primary-foreground">Loan Term (years)</label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={loanTerm === "15" ? "default" : "outline"}
                    onClick={() => setLoanTerm("15")}
                    className="w-full"
                  >
                    15
                  </Button>
                  <Button
                    variant={loanTerm === "20" ? "default" : "outline"}
                    onClick={() => setLoanTerm("20")}
                    className="w-full"
                  >
                    20
                  </Button>
                  <Button
                    variant={loanTerm === "30" ? "default" : "outline"}
                    onClick={() => setLoanTerm("30")}
                    className="w-full"
                  >
                    30
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-border bg-card/50">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Monthly Payment:</span>
                  <span className="text-xl font-bold text-primary-foreground">${calculateMonthlyPayment()}</span>
                </div>
              </div>

              <div className="flex items-center text-xs text-muted-foreground">
                <Info className="h-3 w-3 mr-1" />
                <span>This is an estimate. Contact a VA loan specialist for accurate figures.</span>
              </div>

              <Button className="w-full">
                <Shield className="mr-2 h-4 w-4" />
                Apply for VA Loan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="resources" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="resources" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="p-4 rounded-lg border border-border bg-card/50"
              >
                <div className="flex flex-col h-full">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-medium text-primary-foreground mb-2">VA Loan Guide</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-grow">
                    Comprehensive guide to understanding VA loans and their benefits.
                  </p>
                  <Button size="sm" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="p-4 rounded-lg border border-border bg-card/50"
              >
                <div className="flex flex-col h-full">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Play className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-medium text-primary-foreground mb-2">VA Loan Masterclass</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-grow">
                    Video course on maximizing VA loan benefits for real estate investing.
                  </p>
                  <Button size="sm" className="w-full">
                    <Play className="mr-2 h-4 w-4" />
                    Watch Now
                  </Button>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="p-4 rounded-lg border border-border bg-card/50"
              >
                <div className="flex flex-col h-full">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <ExternalLink className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-medium text-primary-foreground mb-2">Official VA Resources</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-grow">
                    Links to official VA websites and resources for loan information.
                  </p>
                  <Button size="sm" className="w-full">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Visit Site
                  </Button>
                </div>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="eligibility" className="mt-0">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-primary-foreground">VA Loan Eligibility Requirements</CardTitle>
                <CardDescription>Who qualifies for VA loan benefits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border border-border bg-card/50">
                    <h3 className="font-medium text-primary-foreground mb-2">Service Requirements</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <ChevronRight className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">
                          90 consecutive days of active service during wartime
                        </span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">
                          181 days of active service during peacetime
                        </span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">
                          6 years of service in the National Guard or Reserves
                        </span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">
                          Spouse of a service member who died in the line of duty or from a service-related disability
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg border border-border bg-card/50">
                    <h3 className="font-medium text-primary-foreground mb-2">Financial Requirements</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <ChevronRight className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">
                          Stable, sufficient income to make mortgage payments
                        </span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">
                          Acceptable credit score (typically 620 or higher)
                        </span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Debt-to-income ratio within VA guidelines</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg border border-border bg-card/50">
                    <h3 className="font-medium text-primary-foreground mb-2">Property Requirements</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <ChevronRight className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Property must be your primary residence</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">
                          Property must meet VA minimum property requirements
                        </span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">
                          Loan amount must be within VA loan limits for your county
                        </span>
                      </li>
                    </ul>
                  </div>

                  <Button className="w-full">
                    <Shield className="mr-2 h-4 w-4" />
                    Check Your Eligibility
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faq" className="mt-0">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-primary-foreground flex items-center">
                  <HelpCircle className="mr-2 h-5 w-5 text-primary" />
                  Frequently Asked Questions
                </CardTitle>
                <CardDescription>Common questions about VA loans</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border border-border bg-card/50">
                    <h3 className="font-medium text-primary-foreground mb-1">Can I use a VA loan more than once?</h3>
                    <p className="text-sm text-muted-foreground">
                      Yes, you can use your VA loan benefit multiple times. If you've paid off your previous VA loan and
                      sold the property, you can have your full entitlement restored. You may also be able to have
                      multiple VA loans at once if you have remaining entitlement.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border border-border bg-card/50">
                    <h3 className="font-medium text-primary-foreground mb-1">What is the VA funding fee?</h3>
                    <p className="text-sm text-muted-foreground">
                      The VA funding fee is a one-time payment that helps offset the cost of the VA loan program. The
                      fee varies based on your down payment, service category, and whether it's your first VA loan. Some
                      veterans may be exempt from this fee, such as those receiving VA disability compensation.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border border-border bg-card/50">
                    <h3 className="font-medium text-primary-foreground mb-1">
                      Can I use a VA loan for investment properties?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      VA loans are primarily for primary residences. However, you can purchase a multi-unit property (up
                      to 4 units) with a VA loan if you live in one of the units. This allows you to use the VA loan for
                      a property that generates rental income from the other units.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border border-border bg-card/50">
                    <h3 className="font-medium text-primary-foreground mb-1">
                      Is there a minimum credit score for VA loans?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      The VA doesn't set a minimum credit score requirement, but most lenders have their own
                      requirements, typically around 620. Some lenders may approve loans with lower scores, especially
                      if other aspects of your application are strong.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border border-border bg-card/50">
                    <h3 className="font-medium text-primary-foreground mb-1">
                      What closing costs can I expect with a VA loan?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      VA loans limit the closing costs that veterans can pay. Typical costs include the VA funding fee,
                      appraisal fee, credit report fee, title insurance, and recording fees. The seller can pay all of
                      your closing costs, and the VA limits what lenders can charge for origination fees.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
