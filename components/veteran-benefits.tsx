"use client"

import { motion } from "framer-motion"
import {
  Award,
  FileText,
  ExternalLink,
  ChevronRight,
  Home,
  Briefcase,
  GraduationCap,
  Heart,
  DollarSign,
  Building,
  Shield,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function VeteranBenefits() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="housing" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="housing">
            <Home className="mr-2 h-4 w-4" />
            Housing
          </TabsTrigger>
          <TabsTrigger value="education">
            <GraduationCap className="mr-2 h-4 w-4" />
            Education
          </TabsTrigger>
          <TabsTrigger value="business">
            <Briefcase className="mr-2 h-4 w-4" />
            Business
          </TabsTrigger>
          <TabsTrigger value="health">
            <Heart className="mr-2 h-4 w-4" />
            Health
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="housing" className="mt-0">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-primary-foreground flex items-center">
                  <Home className="mr-2 h-5 w-5 text-primary" />
                  Housing Benefits for Veterans
                </CardTitle>
                <CardDescription>Special programs and benefits for veteran housing needs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border border-border bg-card/50">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Shield className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-primary-foreground">VA Home Loans</h4>
                        <p className="text-sm text-muted-foreground">
                          No down payment, no PMI, competitive interest rates, and limited closing costs.
                        </p>
                        <Button size="sm" variant="outline" className="mt-2">
                          <ChevronRight className="mr-2 h-4 w-4" />
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-border bg-card/50">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Building className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-primary-foreground">Adapted Housing Grants</h4>
                        <p className="text-sm text-muted-foreground">
                          Financial assistance for veterans with service-connected disabilities to modify or purchase a
                          home.
                        </p>
                        <Button size="sm" variant="outline" className="mt-2">
                          <ChevronRight className="mr-2 h-4 w-4" />
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-border bg-card/50">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <DollarSign className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-primary-foreground">Property Tax Exemptions</h4>
                        <p className="text-sm text-muted-foreground">
                          Many states offer property tax exemptions or reductions for veterans.
                        </p>
                        <Button size="sm" variant="outline" className="mt-2">
                          <ChevronRight className="mr-2 h-4 w-4" />
                          Check Your State
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-border bg-card/50">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Home className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-primary-foreground">Native American Direct Loan</h4>
                        <p className="text-sm text-muted-foreground">
                          Special loans for Native American veterans to buy, build, or improve homes on Federal Trust
                          Land.
                        </p>
                        <Button size="sm" variant="outline" className="mt-2">
                          <ChevronRight className="mr-2 h-4 w-4" />
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="education" className="mt-0">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-primary-foreground flex items-center">
                  <GraduationCap className="mr-2 h-5 w-5 text-primary" />
                  Education Benefits for Veterans
                </CardTitle>
                <CardDescription>Programs to help veterans advance their education and careers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border border-border bg-card/50">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <GraduationCap className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-primary-foreground">Post-9/11 GI Bill</h4>
                        <p className="text-sm text-muted-foreground">
                          Covers tuition, housing, books, and supplies for college, graduate school, and training
                          programs.
                        </p>
                        <Button size="sm" variant="outline" className="mt-2">
                          <ChevronRight className="mr-2 h-4 w-4" />
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-border bg-card/50">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-primary-foreground">Veteran Readiness and Employment</h4>
                        <p className="text-sm text-muted-foreground">
                          Support for veterans with service-connected disabilities to prepare for and find suitable
                          jobs.
                        </p>
                        <Button size="sm" variant="outline" className="mt-2">
                          <ChevronRight className="mr-2 h-4 w-4" />
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-border bg-card/50">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Briefcase className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-primary-foreground">On-the-Job Training & Apprenticeships</h4>
                        <p className="text-sm text-muted-foreground">
                          Use your GI Bill benefits for on-the-job training and apprenticeship programs.
                        </p>
                        <Button size="sm" variant="outline" className="mt-2">
                          <ChevronRight className="mr-2 h-4 w-4" />
                          Find Programs
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-border bg-card/50">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <DollarSign className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-primary-foreground">Tuition Assistance Top-Up</h4>
                        <p className="text-sm text-muted-foreground">
                          Additional funding to supplement military tuition assistance programs.
                        </p>
                        <Button size="sm" variant="outline" className="mt-2">
                          <ChevronRight className="mr-2 h-4 w-4" />
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="business" className="mt-0">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-primary-foreground flex items-center">
                  <Briefcase className="mr-2 h-5 w-5 text-primary" />
                  Business Benefits for Veterans
                </CardTitle>
                <CardDescription>Programs to support veteran entrepreneurs and business owners</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border border-border bg-card/50">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <DollarSign className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-primary-foreground">SBA Veteran Business Loans</h4>
                        <p className="text-sm text-muted-foreground">
                          Special loan programs with reduced fees and favorable terms for veteran-owned businesses.
                        </p>
                        <Button size="sm" variant="outline" className="mt-2">
                          <ChevronRight className="mr-2 h-4 w-4" />
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-border bg-card/50">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-primary-foreground">Veteran-Owned Business Certification</h4>
                        <p className="text-sm text-muted-foreground">
                          Official certification that can help your business compete for government contracts.
                        </p>
                        <Button size="sm" variant="outline" className="mt-2">
                          <ChevronRight className="mr-2 h-4 w-4" />
                          Get Certified
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-border bg-card/50">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Briefcase className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-primary-foreground">Boots to Business Program</h4>
                        <p className="text-sm text-muted-foreground">
                          Entrepreneurship training program for transitioning service members and their spouses.
                        </p>
                        <Button size="sm" variant="outline" className="mt-2">
                          <ChevronRight className="mr-2 h-4 w-4" />
                          Enroll Now
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-border bg-card/50">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Award className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-primary-foreground">Federal Procurement Opportunities</h4>
                        <p className="text-sm text-muted-foreground">
                          Special consideration for veteran-owned businesses in government contracting.
                        </p>
                        <Button size="sm" variant="outline" className="mt-2">
                          <ChevronRight className="mr-2 h-4 w-4" />
                          Find Opportunities
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health" className="mt-0">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-primary-foreground flex items-center">
                  <Heart className="mr-2 h-5 w-5 text-primary" />
                  Health Benefits for Veterans
                </CardTitle>
                <CardDescription>Healthcare programs and services for veterans</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border border-border bg-card/50">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Heart className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-primary-foreground">VA Healthcare System</h4>
                        <p className="text-sm text-muted-foreground">
                          Comprehensive healthcare services including preventive care, hospital care, and specialty
                          services.
                        </p>
                        <Button size="sm" variant="outline" className="mt-2">
                          <ChevronRight className="mr-2 h-4 w-4" />
                          Enroll Now
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-border bg-card/50">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-primary-foreground">Disability Compensation</h4>
                        <p className="text-sm text-muted-foreground">
                          Tax-free monetary benefits for veterans with disabilities from service-related injuries or
                          diseases.
                        </p>
                        <Button size="sm" variant="outline" className="mt-2">
                          <ChevronRight className="mr-2 h-4 w-4" />
                          Check Eligibility
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-border bg-card/50">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Heart className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-primary-foreground">Mental Health Services</h4>
                        <p className="text-sm text-muted-foreground">
                          Specialized mental health services including PTSD treatment and counseling.
                        </p>
                        <Button size="sm" variant="outline" className="mt-2">
                          <ChevronRight className="mr-2 h-4 w-4" />
                          Get Support
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-border bg-card/50">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <DollarSign className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-primary-foreground">Life Insurance Programs</h4>
                        <p className="text-sm text-muted-foreground">
                          Various life insurance options for veterans, service members, and their families.
                        </p>
                        <Button size="sm" variant="outline" className="mt-2">
                          <ChevronRight className="mr-2 h-4 w-4" />
                          Explore Options
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-primary-foreground flex items-center">
            <ExternalLink className="mr-2 h-5 w-5 text-primary" />
            Additional Veteran Resources
          </CardTitle>
          <CardDescription>Links to official veteran benefit programs and services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="p-4 rounded-lg border border-border bg-card/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-primary-foreground">U.S. Department of Veterans Affairs</h3>
                  <p className="text-sm text-muted-foreground">
                    Official VA website with comprehensive benefit information
                  </p>
                </div>
              </div>
              <Button size="sm" className="w-full mt-3">
                <ExternalLink className="mr-2 h-4 w-4" />
                Visit Website
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="p-4 rounded-lg border border-border bg-card/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-primary-foreground">Small Business Administration</h3>
                  <p className="text-sm text-muted-foreground">
                    Resources for veteran entrepreneurs and business owners
                  </p>
                </div>
              </div>
              <Button size="sm" className="w-full mt-3">
                <ExternalLink className="mr-2 h-4 w-4" />
                Visit Website
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="p-4 rounded-lg border border-border bg-card/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Home className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-primary-foreground">VA Home Loans</h3>
                  <p className="text-sm text-muted-foreground">Official information about VA home loan programs</p>
                </div>
              </div>
              <Button size="sm" className="w-full mt-3">
                <ExternalLink className="mr-2 h-4 w-4" />
                Visit Website
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="p-4 rounded-lg border border-border bg-card/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-primary-foreground">GI Bill Benefits</h3>
                  <p className="text-sm text-muted-foreground">Education and training opportunities for veterans</p>
                </div>
              </div>
              <Button size="sm" className="w-full mt-3">
                <ExternalLink className="mr-2 h-4 w-4" />
                Visit Website
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
