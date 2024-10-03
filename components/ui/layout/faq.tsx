import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function FAQ() {
  return (
    <section id="faq" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
          <AccordionItem value="item-1">
            <AccordionTrigger>What is BARK BaaS?</AccordionTrigger>
            <AccordionContent>
              BARK BaaS (Blockchain as a Service) is a cutting-edge platform that leverages the power of Solana blockchain to provide fast, secure, and scalable solutions for businesses. Our mission is to simplify blockchain integration and empower companies to harness the full potential of decentralized technologies.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>How secure is the BARK BaaS platform?</AccordionTrigger>
            <AccordionContent>
              Our platform leverages the security features of the Solana blockchain and implements additional security measures to ensure the highest level of protection for your data and transactions. We use industry-standard encryption, regular security audits, and follow best practices in cybersecurity to safeguard your information.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Can I customize BARK BaaS solutions for my specific needs?</AccordionTrigger>
            <AccordionContent>
              Yes, our platform offers a high degree of customization to meet your specific business needs and requirements. You can tailor various aspects of the service to align with your unique use case and industry requirements. Our team is also available to assist with custom integrations and features.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>What kind of support does BARK BaaS offer?</AccordionTrigger>
            <AccordionContent>
              We provide comprehensive support including detailed documentation, video tutorials, and direct assistance from our expert team to ensure your success with our platform. Our support channels include email, live chat, and scheduled consultations for more complex inquiries. We're committed to helping you every step of the way.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>How does BARK BaaS handle scalability?</AccordionTrigger>
            <AccordionContent>
              BARK BaaS is built on the Solana blockchain, known for its high throughput and low latency. Our platform is designed to scale seamlessly with your business needs, handling thousands of transactions per second. Whether you're a startup or an enterprise, BARK BaaS can accommodate your growth without compromising on performance.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  )
}