import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export interface Milestone {
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'planned';
}

export interface RoadmapPhase {
  phase: string;
  timeline: string;
  milestones: Milestone[];
}

interface RoadmapTimelineProps {
  data: RoadmapPhase[];
}

export function RoadmapTimeline({ data }: RoadmapTimelineProps) {
  return (
    <div className="space-y-8">
      {data.map((phase, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{phase.phase}</CardTitle>
            <CardDescription>{phase.timeline}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {phase.milestones.map((milestone, mIndex) => (
                <li key={mIndex} className="flex items-start space-x-4">
                  <Badge variant={milestone.status === 'completed' ? 'default' : (milestone.status === 'in-progress' ? 'secondary' : 'outline')}>
                    {milestone.status === 'completed' ? 'Completed' : (milestone.status === 'in-progress' ? 'In Progress' : 'Planned')}
                  </Badge>
                  <div>
                    <h4 className="font-semibold">{milestone.title}</h4>
                    <p className="text-sm text-gray-500">{milestone.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}