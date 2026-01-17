import { motion } from 'framer-motion';
import MobileLayout from '@/components/layout/MobileLayout';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqData = [
  {
    question: 'Is my information private?',
    answer:
      'Your privacy is our priority and is solely used for the Brain Care Score. All data is securely stored, and we never sell or share your personal information.',
  },
  {
    question: 'What do the scores mean?',
    answer:
      "Your score reflects how your recent habits may be affecting your brain—higher means you're doing great, lower means there's room to improve. It's not a diagnosis, but a guide to help you stay on track.",
  },
  {
    question: 'Can I share this with my doctor?',
    answer:
      'Yes, definitely. You can show your score history and habits during check-ups. It can be a helpful conversation starter about your overall well-being.',
  },
  {
    question: "What if I'm not feeling well?",
    answer:
      "If you're feeling unwell or noticing unusual symptoms, it's best to check in with a healthcare professional. The app gives you helpful tips, but it doesn't replace medical care.",
  },
  {
    question: 'Why did my score go down?',
    answer:
      "A drop in score might mean your recent habits are less supportive of brain health. Don't worry—it's a chance to learn and improve. Check the app for small, simple changes you can make today.",
  },
];

const FAQ = () => {
  return (
    <MobileLayout>
      <div className="px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-primary mb-2">
            Frequently Asked Questions (FAQ)
          </h1>
          <p className="text-muted-foreground mb-6">
            Find the answers to some of the most frequently asked questions about Brain Care SG on this page.
          </p>

          <Accordion type="single" collapsible className="space-y-3">
            {faqData.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-xl border border-border overflow-hidden shadow-card"
              >
                <AccordionTrigger className="px-4 py-4 text-left font-semibold text-primary hover:no-underline hover:bg-secondary/50 transition-colors">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-muted-foreground leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </MobileLayout>
  );
};

export default FAQ;
