import { useState } from "react";
import { ChevronDown } from "lucide-react";
import SectionHeading from "./SectionHeading";
import ScrollReveal from "./ScrollReveal";
import { CONTACT_EMAIL } from "../lib/brand";

const faqs = [
  {
    question: "What does Future-Link Services do?",
    answer:
      "We're a hub for skills, business, and opportunity across Ghana — workforce development and job readiness, skills-to-income training, SME and business support, community initiatives, and smart event check-in. In short, we help people and organisations grow, earn, and run better events.",
  },
  {
    question: "Who do you work with?",
    answer:
      "Individuals looking to build skills or find work, small and medium businesses that need support to grow, community groups, and event organisers running conferences, AGMs, and networking events.",
  },
  {
    question: "What are your skills and workforce programmes?",
    answer:
      "We run practical training that leads to income — from job readiness and CV coaching to hands-on skills-to-income tracks and trade pathways — connecting participants to real opportunities rather than just certificates.",
  },
  {
    question: "How does your event check-in work?",
    answer:
      "For events we handle the full experience: online registration, fast-lane QR check-in, instant name-badge printing, a live attendance dashboard, and end-of-day reports — so entry is quick and organisers get clean data.",
  },
  {
    question: "How do I get started or request a quote?",
    answer:
      "Tell us what you need — training, business support, a community project, or an event — and we'll tailor a plan. Reach out through the contact section or email our team and we'll take it from there.",
  },
];

function FaqItem({ faq, isOpen, onToggle }) {
  return (
    <div className={`faq-item ${isOpen ? "faq-item--open" : ""}`}>
      <button type="button" className="faq-question" onClick={onToggle} aria-expanded={isOpen}>
        <span>{faq.question}</span>
        <ChevronDown className="faq-icon h-5 w-5 shrink-0" aria-hidden="true" />
      </button>
      <div className="faq-answer-wrap">
        <div className="faq-answer-inner">
          <p className="faq-answer">{faq.answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="border-t border-blue-100 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-5">
        <SectionHeading
          label="FAQ"
          title="Frequently asked questions"
          description="Quick answers about Future-Link's services — skills, business support, community work, and event check-in."
        />

        <ScrollReveal delay={120} className="mt-10 space-y-3">
          {faqs.map((faq, index) => (
            <FaqItem
              key={faq.question}
              faq={faq}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </ScrollReveal>

        <ScrollReveal delay={200} className="mt-10 text-center">
          <p className="text-sm text-slate-600">
            Still have a question?{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-navy underline underline-offset-4">
              Email our team
            </a>
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
