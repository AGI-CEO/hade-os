"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Shield,
  Calculator,
  FileText,
  Info,
  ChevronRight,
  HelpCircle,
  Home,
  DollarSign,
  Calendar,
  Building,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function VALoanCalculator() {
  const [loanAmount, setLoanAmount] = useState(250000)
  const [interestRate, setInterestRate] = useState(3.5)
  const [loanTerm, setLoanTerm] = useState(30)
  const [propertyType, setPropertyType] = useState("single")
  const [firstTimeUse, setFirstTimeUse] = useState(true)
  const [downPayment, setDownPayment] = useState(0)

  // Calculate monthly payment
  const calculateMonthlyPayment = () => {
    const principal = loanAmount - downPayment
    const monthlyRate = interestRate / 100 / 12
    const numberOfPayments = loanTerm * 12

    if (principal > 0 && monthlyRate > 0 && numberOfPayments > 0) {
      const monthlyPayment =
        (principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
      return monthlyPayment.toFixed(2)
    }

    return "0.00"
  }

  // Calculate funding fee
  const calculateFundingFee = () => {
    let feePercentage = 0

    if (propertyType === "single") {
      if (firstTimeUse) {
        feePercentage = downPayment < loanAmount * 0.05 ? 2.3 : downPayment < loanAmount * 0.1 ? 1.65 : 1.4
      } else {
        feePercentage = downPayment < loanAmount * 0.05 ? 3.6 : downPayment < loanAmount * 0.1 ? 1.65 : 1.4
      }
    } else {
      // Multi-unit properties have slightly higher fees
      if (firstTimeUse) {
        feePercentage = downPayment < loanAmount * 0.05 ? 2.4 : downPayment < loanAmount * 0.1 ? 1.75 : 1.5
      } else {
        feePercentage = downPayment < loanAmount * 0.05 ? 3.7 : downPayment < loanAmount * 0.1 ? 1.75 : 1.5
      }
    }

    return ((loanAmount - downPayment) * (feePercentage / 100)).toFixed(2)
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
                  <h4 className="font-medium text-primary-foreground">Multi-Unit Properties</h4>
                  <p className="text-sm text-muted-foreground">
                    You can use VA loans for properties with up to 4 units if you live in one unit.
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
            <CardDescription>Estimate your monthly payments and funding fee</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="calculator" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="calculator">Calculator</TabsTrigger>
                <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
              </TabsList>
              <TabsContent value="calculator" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-primary-foreground">Loan Amount</label>
                    <span className="text-sm text-primary-foreground">${loanAmount.toLocaleString()}</span>
                  </div>
                  <Slider
                    value={[loanAmount]}
                    min={50000}
                    max={1000000}
                    step={5000}
                    onValueChange={(value) => setLoanAmount(value[0])}
                    className="[&>span]:bg-primary"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-primary-foreground">Interest Rate (%)</label>
                    <span className="text-sm text-primary-foreground">{interestRate}%</span>
                  </div>
                  <Slider
                    value={[interestRate]}
                    min={2}
                    max={8}
                    step={0.125}
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

                <div className="p-4 rounded-lg border border-border bg-card/50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-muted-foreground">Monthly Payment:</span>
                    <span className="text-xl font-bold text-primary-foreground">${calculateMonthlyPayment()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-muted-foreground">VA Funding Fee:</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-3 w-3 ml-1 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs max-w-xs">
                              The VA funding fee is a one-time payment that helps offset the cost of the VA loan
                              program. Some veterans may be exempt from this fee.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <span className="text-primary-foreground font-medium">${calculateFundingFee()}</span>
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
              </TabsContent>
              <TabsContent value="advanced" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary-foreground">Property Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={propertyType === "single" ? "default" : "outline"}
                      onClick={() => setPropertyType("single")}
                      className="w-full"
                    >
                      <Home className="mr-2 h-4 w-4" />
                      Single Family
                    </Button>
                    <Button
                      variant={propertyType === "multi" ? "default" : "outline"}
                      onClick={() => setPropertyType("multi")}
                      className="w-full"
                    >
                      <Building className="mr-2 h-4 w-4" />
                      Multi-Unit (2-4)
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary-foreground">First Time Using VA Loan?</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={firstTimeUse ? "default" : "outline"}
                      onClick={() => setFirstTimeUse(true)}
                      className="w-full"
                    >
                      Yes
                    </Button>
                    <Button
                      variant={!firstTimeUse ? "default" : "outline"}
                      onClick={() => setFirstTimeUse(false)}
                      className="w-full"
                    >
                      No
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-primary-foreground">Down Payment</label>
                    <span className="text-sm text-primary-foreground">${downPayment.toLocaleString()}</span>
                  </div>
                  <Slider
                    value={[downPayment]}
                    min={0}
                    max={loanAmount * 0.2}
                    step={1000}
                    onValueChange={(value) => setDownPayment(value[0])}
                    className="[&>span]:bg-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span>{((downPayment / loanAmount) * 100).toFixed(1)}%</span>
                    <span>20%</span>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border bg-card/50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-muted-foreground">Funding Fee Percentage:</span>
                    <span className="text-primary-foreground font-medium">
                      {(calculateFundingFee() / (loanAmount - downPayment)) * 100}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    The funding fee percentage varies based on your down payment amount, whether it's your first VA
                    loan, and the type of property.
                  </p>
                </div>

                <Button className="w-full">
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate with Advanced Options
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-primary-foreground flex items-center">
            <FileText className="mr-2 h-5 w-5 text-primary" />
            VA Loan Investment Strategies
          </CardTitle>
          <CardDescription>How to leverage VA loans for real estate investing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="p-4 rounded-lg border border-border bg-card/50"
            >
              <div className="flex flex-col h-full">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Home className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium text-primary-foreground mb-2">House Hacking</h3>
                <p className="text-sm text-muted-foreground mb-4 flex-grow">
                  Purchase a multi-unit property with your VA loan, live in one unit, and rent out the others.
                </p>
                <Badge className="self-start mb-2">Beginner Friendly</Badge>
                <Button size="sm" className="w-full">
                  <ChevronRight className="mr-2 h-4 w-4" />
                  Learn More
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
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium text-primary-foreground mb-2">VA Loan Rotation</h3>
                <p className="text-sm text-muted-foreground mb-4 flex-grow">
                  Live in a property for 1 year, then rent it out and buy another with a new VA loan.
                </p>
                <Badge className="self-start mb-2">Intermediate</Badge>
                <Button size="sm" className="w-full">
                  <ChevronRight className="mr-2 h-4 w-4" />
                  Learn More
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
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium text-primary-foreground mb-2">Vacation Rental Strategy</h3>
                <p className="text-sm text-muted-foreground mb-4 flex-grow">
                  Buy a vacation property with your VA loan, live in it part-time, and rent it out when not in use.
                </p>
                <Badge className="self-start mb-2">Advanced</Badge>
                <Button size="sm" className="w-full">
                  <ChevronRight className="mr-2 h-4 w-4" />
                  Learn More
                </Button>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-primary-foreground flex items-center">
            <HelpCircle className="mr-2 h-5 w-5 text-primary" />
            Frequently Asked Questions
          </CardTitle>
          <CardDescription>Common questions about VA loans for real estate investing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-border bg-card/50">
              <h3 className="font-medium text-primary-foreground mb-1">
                Can I use a VA loan to purchase an investment property?
              </h3>
              <p className="text-sm text-muted-foreground">
                VA loans are primarily for primary residences. However, you can purchase a multi-unit property (up to 4
                units) with a VA loan if you live in one of the units. This allows you to use the VA loan for a property
                that generates rental income from the other units.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-card/50">
              <h3 className="font-medium text-primary-foreground mb-1">How many times can I use my VA loan benefit?</h3>
              <p className="text-sm text-muted-foreground">
                You can use your VA loan benefit multiple times. If you've paid off your previous VA loan and sold the
                property, you can have your full entitlement restored. You may also be able to have multiple VA loans at
                once if you have remaining entitlement.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-card/50">
              <h3 className="font-medium text-primary-foreground mb-1">
                What is the minimum credit score for a VA loan?
              </h3>
              <p className="text-sm text-muted-foreground">
                The VA doesn't set a minimum credit score requirement, but most lenders have their own requirements,
                typically around 620. Some lenders may approve loans with lower scores, especially if other aspects of
                your application are strong.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-card/50">
              <h3 className="font-medium text-primary-foreground mb-1">
                Can I use a VA loan for a short-term rental property?
              </h3>
              <p className="text-sm text-muted-foreground">
                Yes, but with conditions. The property must be your primary residence, meaning you must live in it for
                at least a portion of the year. You can rent it out when you're not using it, but you cannot purchase a
                property solely for short-term rental purposes with a VA loan.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
