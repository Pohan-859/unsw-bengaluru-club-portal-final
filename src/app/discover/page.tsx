"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, RefreshCcw } from "lucide-react";

type Club = {
  id: string;
  name: string;
  category: string;
  description: string;
};

export default function DiscoverPage() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    interest: "",
    frequency: "",
    goal: "",
    commitment: "",
  });
  const [recommendedClubs, setRecommendedClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(false);

  const steps = [
    {
      id: "interest",
      question: "What is your main interest area?",
      options: ["Business & Finance", "Technology", "Sports & Wellbeing", "Culture & Community", "Academic"],
    },
    {
      id: "frequency",
      question: "How often do you want to meet?",
      options: ["Weekly", "Fortnightly", "Monthly"],
    },
    {
      id: "goal",
      question: "What is your main goal?",
      options: ["Learn Skills", "Meet People", "Leadership", "Fun & Hobbies"],
    },
    {
      id: "commitment",
      question: "What is your commitment level?",
      options: ["High", "Medium", "Low"],
    },
  ];

  const handleSelect = (value: string) => {
    const currentStepId = steps[step - 1].id;
    setAnswers({ ...answers, [currentStepId]: value });
    if (step < steps.length) {
      setStep(step + 1);
    } else {
      fetchRecommendations(value);
    }
  };

  const fetchRecommendations = async (finalAnswer: string) => {
    setLoading(true);
    setStep(steps.length + 1);
    
    // In a real app, we'd send the full answers object to an API that does smart filtering.
    // For this prototype, we'll fetch clubs and filter by category matching the interest.
    const finalAnswers = { ...answers, commitment: finalAnswer };
    
    try {
      const res = await fetch("/api/clubs");
      if (res.ok) {
        const data = await res.json();
        // Handle if data is wrapped in { clubs: [] }
        const clubs: Club[] = Array.isArray(data) ? data : data.clubs || [];
        
        let matched = clubs.filter(c => 
          c.category.toLowerCase().includes(finalAnswers.interest.toLowerCase().split(' ')[0])
        );
        // Fallback if no match
        if (matched.length === 0) matched = clubs.slice(0, 3);
        setRecommendedClubs(matched.slice(0, 4));
      }
    } catch (error) {
      console.error("Failed to fetch clubs:", error);
    }
    setLoading(false);
  };

  const resetQuiz = () => {
    setStep(1);
    setAnswers({ interest: "", frequency: "", goal: "", commitment: "" });
    setRecommendedClubs([]);
  };

  const progress = (step / (steps.length + 1)) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-[60vh] flex flex-col">
      <h1 className="text-4xl font-display font-bold text-unsw-charcoal mb-8 uppercase tracking-wider">
        Club Matchmaker
      </h1>

      {/* Progress Bar */}
      <div className="w-full h-4 bg-paper border-2 border-unsw-charcoal mb-8 relative overflow-hidden">
        <div 
          className="h-full bg-unsw-yellow transition-all duration-500 ease-out border-r-2 border-unsw-charcoal"
          style={{ width: `${progress}%` }}
        />
      </div>

      {step <= steps.length ? (
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-2xl font-display font-bold text-unsw-charcoal mb-6">
            <span className="text-muted mr-2">Q{step}.</span>
            {steps[step - 1].question}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {steps[step - 1].options.map((option) => (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className="p-4 text-left border-2 border-unsw-charcoal bg-paper shadow-brutal hover:-translate-y-1 hover:bg-unsw-yellow transition-all font-body font-medium text-lg flex justify-between items-center group"
              >
                {option}
                <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-display font-bold text-unsw-charcoal">
              Recommended For You
            </h2>
            <button 
              onClick={resetQuiz}
              className="flex items-center gap-2 text-sm font-mono font-bold uppercase border-2 border-unsw-charcoal p-2 hover:bg-unsw-yellow shadow-brutal transition-colors"
            >
              <RefreshCcw className="w-4 h-4" /> Retake Quiz
            </button>
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="w-16 h-16 bg-unsw-yellow border-4 border-unsw-charcoal shadow-brutal animate-pulse" />
            </div>
          ) : recommendedClubs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendedClubs.map((club) => (
                <div key={club.id} className="border-2 border-unsw-charcoal bg-paper p-6 shadow-brutal flex flex-col h-full">
                  <div className="inline-block bg-unsw-yellow px-2 py-1 border-2 border-unsw-charcoal text-xs font-mono font-bold uppercase mb-4 self-start">
                    {club.category}
                  </div>
                  <h3 className="text-xl font-display font-bold mb-2">{club.name}</h3>
                  <p className="font-body mb-6 flex-1 line-clamp-3 text-muted">{club.description}</p>
                  <Link 
                    href={`/clubs/${club.id}`}
                    className="inline-flex justify-center items-center gap-2 bg-unsw-charcoal text-paper py-3 px-4 font-mono font-bold uppercase hover:bg-unsw-yellow hover:text-unsw-charcoal border-2 border-transparent hover:border-unsw-charcoal transition-colors"
                  >
                    View Club <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-unsw-charcoal bg-paper shadow-brutal">
              <p className="font-mono text-lg mb-4">No perfect matches found.</p>
              <Link href="/directory" className="inline-block bg-unsw-yellow border-2 border-unsw-charcoal px-6 py-3 font-mono font-bold uppercase shadow-brutal hover:-translate-y-1 transition-transform">
                Browse Directory
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
