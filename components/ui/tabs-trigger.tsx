<TabsTrigger 
  key={tab}
  value={tab}
  className="px-6 py-2 rounded-full text-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 hover:bg-sand-300 dark:hover:bg-sand-700 text-lg whitespace-nowrap"
>
  <span className="relative z-10">{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
  {activeTab === tab && (
    <motion.div
      className="absolute inset-0 bg-primary rounded-md"
      layoutId="activeTabBackground"
      initial={false}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    />
  )}
</TabsTrigger>