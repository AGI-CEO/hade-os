"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Award, Trophy, Target, Star, Zap, Gift, Users, Sparkles, ArrowUp, Flame, Rocket, Crown } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { UserAchievements } from "@/components/user-achievements"
import { ActiveChallenges } from "@/components/active-challenges"
import { QuestLeaderboard } from "@/components/quest-leaderboard"
import { RewardShop } from "@/components/reward-shop"

export default function QuestsPage() {
  const [showLevelUp, setShowLevelUp] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary-foreground glow-text">Quests</h1>
        <p className="text-muted-foreground">
          Complete challenges, earn rewards, and level up your real estate journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/50 border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Zap className="h-8 w-8 text-primary glow-icon" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Level</p>
              <h2 className="text-2xl font-bold text-primary-foreground glow-text">Level 5</h2>
              <p className="text-sm text-muted-foreground">Real Estate Investor</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-muted-foreground">Experience</p>
              <p className="text-sm font-medium text-primary-foreground">250/300 XP</p>
            </div>
            <Progress value={83} className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-amber-500" />
            <div className="flex justify-between mt-2">
              <p className="text-xs text-muted-foreground">Level 5</p>
              <p className="text-xs text-muted-foreground">Level 6</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Trophy className="h-8 w-8 text-amber-500 glow-icon" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Quest Points</p>
              <h2 className="text-2xl font-bold text-amber-500 glow-text">1,250</h2>
              <Button size="sm" variant="outline" className="mt-1" onClick={() => setShowLevelUp(true)}>
                <Gift className="mr-2 h-4 w-4" />
                Redeem Rewards
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="achievements" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="achievements">
            <Award className="mr-2 h-4 w-4" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="challenges">
            <Target className="mr-2 h-4 w-4" />
            Challenges
          </TabsTrigger>
          <TabsTrigger value="leaderboard">
            <Trophy className="mr-2 h-4 w-4" />
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="rewards">
            <Gift className="mr-2 h-4 w-4" />
            Rewards
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="achievements" className="mt-0">
                <UserAchievements />
              </TabsContent>
            </motion.div>

            <motion.div
              key="challenges"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="challenges" className="mt-0">
                <ActiveChallenges />
              </TabsContent>
            </motion.div>

            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="leaderboard" className="mt-0">
                <QuestLeaderboard />
              </TabsContent>
            </motion.div>

            <motion.div
              key="rewards"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="rewards" className="mt-0">
                <RewardShop />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </div>
      </Tabs>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-primary-foreground flex items-center">
            <Rocket className="mr-2 h-5 w-5 text-primary" />
            Your Quest Journey
          </CardTitle>
          <CardDescription>Track your progress and upcoming milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>

            <div className="space-y-8">
              <div className="relative pl-14">
                <div className="absolute left-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Star className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-primary-foreground">First Property Milestone</h3>
                  <p className="text-sm text-muted-foreground mb-2">Purchased your first investment property</p>
                  <Badge className="bg-green-500">Completed</Badge>
                  <p className="text-xs text-muted-foreground mt-2">Earned: 100 XP, 250 Quest Points</p>
                </div>
              </div>

              <div className="relative pl-14">
                <div className="absolute left-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-primary-foreground">Tenant Master</h3>
                  <p className="text-sm text-muted-foreground mb-2">Successfully manage 5 tenants</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Progress: 3/5 tenants</span>
                      <span className="text-primary-foreground">60%</span>
                    </div>
                    <Progress value={60} className="h-1.5 [&>div]:bg-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Reward: 150 XP, 300 Quest Points</p>
                </div>
              </div>

              <div className="relative pl-14">
                <div className="absolute left-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Flame className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-primary-foreground">Cash Flow King</h3>
                  <p className="text-sm text-muted-foreground mb-2">Achieve $3,000 monthly cash flow</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Progress: $1,900/$3,000</span>
                      <span className="text-primary-foreground">63%</span>
                    </div>
                    <Progress value={63} className="h-1.5 [&>div]:bg-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Reward: 200 XP, 500 Quest Points</p>
                </div>
              </div>

              <div className="relative pl-14">
                <div className="absolute left-0 w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center">
                  <Crown className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-muted-foreground">Portfolio Pro</h3>
                  <p className="text-sm text-muted-foreground mb-2">Own 5 properties simultaneously</p>
                  <Badge variant="outline">Locked</Badge>
                  <p className="text-xs text-muted-foreground mt-2">Reward: 300 XP, 750 Quest Points</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>{showLevelUp && <LevelUpModal onClose={() => setShowLevelUp(false)} />}</AnimatePresence>
    </div>
  )
}

function LevelUpModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md overflow-hidden"
      >
        <div className="relative p-6 flex flex-col items-center">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(circle at center, rgba(0, 255, 255, 0.15) 0%, rgba(0, 0, 0, 0) 70%)",
            }}
          />

          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-4"
          >
            <Sparkles className="h-12 w-12 text-primary glow-icon" />
          </motion.div>

          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-primary-foreground glow-text mb-2"
          >
            Level Up!
          </motion.h2>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-muted-foreground mb-6"
          >
            You're making great progress on your real estate journey! You're close to reaching Level 6.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="w-full space-y-4 mb-6"
          >
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Experience</span>
                <span className="text-primary-foreground">250/300 XP</span>
              </div>
              <Progress value={83} className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-amber-500" />
            </div>

            <div className="p-3 rounded-lg border border-border bg-card/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <ArrowUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-primary-foreground">Level 6 Rewards</h4>
                  <p className="text-xs text-muted-foreground">Unlock new challenges and rewards</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex gap-3"
          >
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button>
              <Gift className="mr-2 h-4 w-4" />
              View Rewards
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}
