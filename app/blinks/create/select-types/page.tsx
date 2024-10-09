const handleCreateBlink = () => {
  if (selectedType) {
    router.push(`/blinks/create?type=${selectedType}`)
  } else {
    toast({
      title: "No Blink Type Selected",
      description: "Please select a Blink type before proceeding.",
      variant: "destructive",
    })
  }
}