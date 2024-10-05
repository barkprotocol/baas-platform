'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"

export default function GetStarted() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    experience: ''
  })
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRadioChange = (value: string, name: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 3) {
      setStep(step + 1)
    } else {
      // Here you would typically send the data to your backend
      console.log('Form submitted:', formData)
      toast({
        title: "Getting Started",
        description: "Your information has been submitted successfully. We'll be in touch soon!",
        duration: 5000,
      })
    }
  }

  const steps = [
    { title: 'Personal Info', description: 'Tell us about yourself' },
    { title: 'Project Details', description: 'What are you building?' },
    { title: 'Experience', description: 'Your blockchain experience' },
  ]

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Get Started with BARK BaaS</CardTitle>
          <CardDescription>Complete the following steps to set up your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <div className="flex justify-between">
              {steps.map((s, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step > index ? 'bg-primary text-[#D0BFB4]' : 'bg-secondary text-[#D0BFB4]'}`}>
                    {step > index ? <CheckCircle className="w-5 h-5" /> : index + 1}
                  </div>
                  <p className="text-sm mt-2">{s.title}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 h-2 bg-secondary rounded-full">
              <motion.div 
                className="h-full bg-primary rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${(step / 3) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-4">
                <Label>Project Type</Label>
                <RadioGroup value={formData.projectType} onValueChange={(value) => handleRadioChange(value, 'projectType')}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dapp" id="dapp" />
                    <Label htmlFor="dapp">Decentralized Application (DApp)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="defi" id="defi" />
                    <Label htmlFor="defi">DeFi Protocol</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nft" id="nft" />
                    <Label htmlFor="nft">NFT Project</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-4">
                <Label>Blockchain Experience</Label>
                <RadioGroup value={formData.experience} onValueChange={(value) => handleRadioChange(value, 'experience')}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="beginner" id="beginner" />
                    <Label htmlFor="beginner">Beginner</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="intermediate" id="intermediate" />
                    <Label htmlFor="intermediate">Intermediate</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="advanced" id="advanced" />
                    <Label htmlFor="advanced">Advanced</Label>
                  </div>
                </RadioGroup>
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" onClick={handleSubmit} className="w-full">
            {step === 3 ? 'Submit' : 'Next'} <ArrowRight className="ml-2 h-4 w-4 text-[#D0BFB4]" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}