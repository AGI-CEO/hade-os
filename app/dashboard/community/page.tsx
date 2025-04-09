import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ForumsList } from "@/components/forums-list"
import { PortfolioSharing } from "@/components/portfolio-sharing"
import { MentorshipProgram } from "@/components/mentorship-program"
import { MeetupsEvents } from "@/components/meetups-events"
import { CommunityActivity } from "@/components/community-activity"
import { UserSpotlight } from "@/components/user-spotlight"
import { Loader } from "lucide-react"

export default function CommunityPage() {
  return (
    <div className="container mx-auto p-6 space-y-8 pb-20">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary glow-text">Community</h1>
        <p className="text-muted-foreground">
          Connect with fellow investors, share insights, and grow together in our vibrant community.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-2 bg-card/50 backdrop-blur border-primary/20 shadow-glow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-primary">Community Activity</CardTitle>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                Live Updates
              </Badge>
            </div>
            <CardDescription>Recent discussions, shared portfolios, and community events</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense
              fallback={
                <div className="flex justify-center p-8">
                  <Loader className="animate-spin" />
                </div>
              }
            >
              <CommunityActivity />
            </Suspense>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-primary/20 shadow-glow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl text-primary">User Spotlight</CardTitle>
            <CardDescription>Community members making an impact</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense
              fallback={
                <div className="flex justify-center p-8">
                  <Loader className="animate-spin" />
                </div>
              }
            >
              <UserSpotlight />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="forums" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8 bg-background/50 backdrop-blur">
          <TabsTrigger value="forums" className="data-[state=active]:text-primary data-[state=active]:shadow-glow-sm">
            Forums
          </TabsTrigger>
          <TabsTrigger
            value="portfolios"
            className="data-[state=active]:text-primary data-[state=active]:shadow-glow-sm"
          >
            Portfolio Sharing
          </TabsTrigger>
          <TabsTrigger
            value="mentorship"
            className="data-[state=active]:text-primary data-[state=active]:shadow-glow-sm"
          >
            Mentorship
          </TabsTrigger>
          <TabsTrigger value="meetups" className="data-[state=active]:text-primary data-[state=active]:shadow-glow-sm">
            Meetups & Events
          </TabsTrigger>
        </TabsList>

        <TabsContent value="forums" className="space-y-6">
          <Suspense
            fallback={
              <div className="flex justify-center p-8">
                <Loader className="animate-spin" />
              </div>
            }
          >
            <ForumsList />
          </Suspense>
        </TabsContent>

        <TabsContent value="portfolios" className="space-y-6">
          <Suspense
            fallback={
              <div className="flex justify-center p-8">
                <Loader className="animate-spin" />
              </div>
            }
          >
            <PortfolioSharing />
          </Suspense>
        </TabsContent>

        <TabsContent value="mentorship" className="space-y-6">
          <Suspense
            fallback={
              <div className="flex justify-center p-8">
                <Loader className="animate-spin" />
              </div>
            }
          >
            <MentorshipProgram />
          </Suspense>
        </TabsContent>

        <TabsContent value="meetups" className="space-y-6">
          <Suspense
            fallback={
              <div className="flex justify-center p-8">
                <Loader className="animate-spin" />
              </div>
            }
          >
            <MeetupsEvents />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
