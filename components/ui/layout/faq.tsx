export function FAQ() {
    return (
      <section id="faq" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <FAQItem
              question="What is BARK BaaS?"
              answer="BARK BaaS is a Blockchain as a Service platform that provides easy-to-use tools and infrastructure for businesses to integrate Solana blockchain technology into their operations."
            />
            <FAQItem
              question="How secure is the platform?"
              answer="Our platform leverages the security features of the Solana blockchain and implements additional security measures to ensure the highest level of protection for your data and transactions."
            />
            <FAQItem
              question="Can I customize the solutions?"
              answer="Yes, our platform offers a high degree of customization to meet your specific business needs and requirements."
            />
            <FAQItem
              question="What kind of support do you offer?"
              answer="We provide comprehensive support including documentation, tutorials, and direct assistance from our expert team to ensure your success with our platform."
            />
          </div>
        </div>
      </section>
    )
  }
  
  function FAQItem({ question, answer }: { question: string; answer: string }) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold">{question}</h3>
        <p className="text-muted-foreground">{answer}</p>
      </div>
    )
  }