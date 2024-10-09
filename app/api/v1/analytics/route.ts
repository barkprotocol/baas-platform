const fetchAnalyticsData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/v1/analytics')
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      setAnalyticsData(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch analytics data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }