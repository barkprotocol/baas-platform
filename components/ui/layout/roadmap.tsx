import { Metadata } from 'next'
import { RoadmapTimeline } from '@/components/ui/roadmap-timeline'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const metadata: Metadata = {
  title: 'BARK Project Roadmap',
  description: 'Explore the future of BARK and Solana Blinks with our interactive roadmap.',
}

const roadmapData = [
  {
    phase: 'Phase 1: Foundation',
    timeline: 'Q1 2024',
    milestones: [
      { title: 'BARK Token Launch', status: 'completed' },
      { title: 'Solana Blink Prototype', status: 'completed' },
      { title: 'Community Building Initiatives', status: 'in-progress' },
    ],
  },
  {
    phase: 'Phase 2: Core Development',
    timeline: 'Q2 2024',
    milestones: [
      { title: 'Blink SDK Alpha Release', status: 'in-progress' },
      { title: 'BARK Staking Program', status: 'planned' },
      { title: 'Blink Marketplace Beta', status: 'planned' },
    ],
  },
  {
    phase: 'Phase 3: Ecosystem Expansion',
    timeline: 'Q3-Q4 2024',
    milestones: [
      { title: 'Cross-chain Blink Bridges', status: 'planned' },
      { title: 'BARK Governance Launch', status: 'planned' },
      { title: 'Blink-powered DeFi Integrations', status: 'planned' },
    ],
  },
  {
    phase: 'Phase 4: Mass Adoption',
    timeline: 'Q3-Q4 2025',
    milestones: [
      { title: 'Mobile Blink Wallet', status: 'planned' },
      { title: 'Enterprise Blink Solutions', status: 'planned' },
      { title: 'Global Blink Hackathon Series', status: 'planned' },
    ],
  },
]

export default function RoadmapPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-8">BARK Project Roadmap</h1>
      <p className="text-xl text-center text-muted-foreground mb-12">
        Charting the course for BARK and Solana Blinks innovation
      </p>

      <Tabs defaultValue="timeline" className="mb-12">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="timeline">Timeline View</TabsTrigger>
          <TabsTrigger value="cards">Card View</TabsTrigger>
        </TabsList>
        <TabsContent value="timeline" className="mt-6">
          <RoadmapTimeline data={roadmapData} />
        </TabsContent>
        <TabsContent value="cards" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {roadmapData.map((phase, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{phase.phase}</CardTitle>
                  <CardDescription>{phase.timeline}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {phase.milestones.map((milestone, mIndex) => (
                      <li key={mIndex} className="flex items-center">
                        <span className={`w-3 h-3 rounded-full mr-2 ${
                          milestone.status === 'completed' ? 'bg-green-500' :
                          milestone.status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-300'
                        }`}></span>
                        <span className={milestone.status === 'completed' ? 'line-through' : ''}>
                          {milestone.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Get Involved in BARK Protocol's Future</h2>
        <p className="text-muted-foreground mb-6">
          Join our community and help shape the future of Solana Blinks and the BARK Protocol ecosystem.
        </p>
        <div className="flex justify-center space-x-4">
          <Button>Join Discord</Button>
          <Button variant="outline">Read Whitepaper</Button>
        </div>
      </div>
    </div>
  )
}