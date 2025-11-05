import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FAQSchema } from "@/components/seo/FAQSchema";

interface QAItem {
  question: string;
  answer: string;
}

interface ProductQAProps {
  productName: string;
  productType?: string;
}

export const ProductQA = ({ productName, productType }: ProductQAProps) => {
  // Common Q&A for all products
  const commonQA: QAItem[] = [
    {
      question: `What material is the ${productName} made of?`,
      answer: "Our bangle organizers are made from premium clear acrylic material that is durable, scratch-resistant, and provides dust-proof protection for your bangles."
    },
    {
      question: `How many bangles can the ${productName} hold?`,
      answer: "Capacity depends on the rod count and size. Our 4-rod boxes typically hold 30-50 bangles depending on bangle thickness. Each rod is removable for easy access."
    },
    {
      question: "Does this protect gold bangles?",
      answer: "Yes! Our organizers feature tangle-free storage with soft rod surfaces that protect gold, silver, and delicate bangles from scratches and damage."
    },
    {
      question: "Is this stackable?",
      answer: "Yes, our bangle boxes are designed to be stackable, making them perfect for space-saving storage in wardrobes, closets, or vanity areas."
    },
    {
      question: "Can I travel with this organizer?",
      answer: "Absolutely! The secure lid and compact design make it ideal for travel. Your bangles stay organized and protected during transport."
    },
    {
      question: "How do I clean the organizer?",
      answer: "Simply wipe with a soft, damp cloth. The clear acrylic surface is easy to clean and maintain. Avoid harsh chemicals."
    },
    {
      question: "What's your shipping policy?",
      answer: "We ship to Canada, USA, and UK. Standard delivery takes 5-7 business days."
    },
    {
      question: "Do you have a return policy?",
      answer: "Yes, we offer 30-day returns on unused products in original packaging. Contact us at hello@sisterstoragesolutions.com for returns."
    }
  ];

  return (
    <div className="mt-12">
      <FAQSchema faqs={commonQA} />
      
      <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
      
      <Accordion type="single" collapsible className="w-full">
        {commonQA.map((qa, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">
              {qa.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {qa.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
