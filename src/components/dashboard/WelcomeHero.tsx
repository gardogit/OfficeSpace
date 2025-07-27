import React, { useState, useEffect, memo } from "react";
import { UserProfile, Event } from "../../types";
import { Card } from "../ui/Card";

export interface WelcomeHeroProps {
  user: UserProfile;
  upcomingEvents?: Event[];
  className?: string;
}

interface SmartMessage {
  id: string;
  text: string;
  type: "reminder" | "event" | "follow-up" | "deadline";
  cta?: string;
  priority: "high" | "medium" | "low";
}

const WelcomeHeroComponent: React.FC<WelcomeHeroProps> = ({
  user,
  upcomingEvents = [],
  className = "",
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [smartMessages, setSmartMessages] = useState<SmartMessage[]>([]);

  // Generate smart messages - In a real app, these would come from an AI/API
  useEffect(() => {
    const messages: SmartMessage[] = [
      {
        id: "msg-1",
        text: "Recuerda revisar la propuesta del cliente que quedó pendiente ayer.",
        type: "reminder",
        cta: "Ver propuesta",
        priority: "high",
      },
      {
        id: "msg-2",
        text: "El equipo de diseño está esperando tu feedback sobre los mockups.",
        type: "follow-up",
        cta: "Ver diseños",
        priority: "medium",
      },
      {
        id: "msg-3",
        text: "La documentación técnica vence mañana, ¿ya tienes todo listo?",
        type: "deadline",
        cta: "Revisar docs",
        priority: "high",
      },
      {
        id: "msg-4",
        text: "Tienes una reunión con el cliente en 2 horas.",
        type: "event",
        cta: "Ver calendario",
        priority: "medium",
      },
    ];

    // Add upcoming events as messages
    if (upcomingEvents.length > 0) {
      const nextEvent = upcomingEvents
        .filter((event) => new Date(event.startDate) > new Date())
        .sort(
          (a, b) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        )[0];

      if (nextEvent) {
        const eventTime = new Date(nextEvent.startDate);
        const now = new Date();
        const hoursUntil = Math.round(
          (eventTime.getTime() - now.getTime()) / (1000 * 60 * 60)
        );

        if (hoursUntil <= 24) {
          messages.push({
            id: `event-${nextEvent.id}`,
            text:
              hoursUntil <= 2
                ? `Tu reunión "${nextEvent.title}" es en ${hoursUntil} horas.`
                : `No olvides que tienes "${nextEvent.title}" programado para hoy.`,
            type: "event",
            cta: "Ver detalles",
            priority: hoursUntil <= 2 ? "high" : "medium",
          });
        }
      }
    }

    setSmartMessages(messages);
  }, [upcomingEvents]);

  // Typing effect for messages
  useEffect(() => {
    if (smartMessages.length === 0) return;

    const currentMessage = smartMessages[currentMessageIndex];
    if (!currentMessage) return;

    setIsTyping(true);
    setDisplayedText("");

    let charIndex = 0;
    const typingInterval = setInterval(() => {
      if (charIndex < currentMessage.text.length) {
        setDisplayedText(currentMessage.text.slice(0, charIndex + 1));
        charIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 30); // Typing speed

    return () => clearInterval(typingInterval);
  }, [currentMessageIndex, smartMessages]);

  // Auto-rotate messages every 5 seconds
  useEffect(() => {
    if (smartMessages.length <= 1) return;

    const rotateInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % smartMessages.length);
    }, 5000);

    return () => clearInterval(rotateInterval);
  }, [smartMessages.length]);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return "¡Buenos días";
    } else if (hour < 18) {
      return "¡Buenas tardes";
    } else {
      return "¡Buenas noches";
    }
  };

  const handlePreviousMessage = () => {
    setCurrentMessageIndex((prev) =>
      prev === 0 ? smartMessages.length - 1 : prev - 1
    );
  };

  const handleNextMessage = () => {
    setCurrentMessageIndex((prev) => (prev + 1) % smartMessages.length);
  };

  const firstName = user.name.split(" ")[0];
  const currentMessage = smartMessages[currentMessageIndex];

  return (
    <div className={`${className}`}>
      <Card className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200 dark:border-primary-800 px-4 py-2">
        <div className="p-2">
          {/* Single Column Layout */}
          <div className="space-y-4">
            {/* Greeting with Navigation Controls */}
            <div className="flex items-center justify-between">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                {getGreeting()}, {firstName}!
              </h1>

              {/* Navigation Controls - Only show if multiple messages */}
              {smartMessages.length > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePreviousMessage}
                    className="flex items-center gap-1 px-2 py-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 text-sm"
                    aria-label="Mensaje anterior"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    <span className="hidden sm:inline">Anterior</span>
                  </button>

                  <button
                    onClick={handleNextMessage}
                    className="flex items-center gap-1 px-2 py-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 text-sm"
                    aria-label="Siguiente mensaje"
                  >
                    <span className="hidden sm:inline">Siguiente</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Smart Message with Typing Effect */}
            {currentMessage && (
              <div>
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-2 sm:p-4 border border-white/20 dark:border-gray-700/50">
                  <div className="flex items-start sm:gap-3 gap-2">
                    {/* AI Indicator */}
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                    </div>

                    {/* Message Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {displayedText}
                        {isTyping && (
                          <span className="inline-block w-0.5 h-4 bg-primary-500 ml-1 animate-pulse" />
                        )}
                        {/* CTA Button inline - Only show when typing is complete */}
                        {!isTyping && currentMessage.cta && (
                          <span className="inline-block ml-2">
                            <button className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors duration-200 whitespace-nowrap">
                              {currentMessage.cta}
                            </button>
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

// Memoize component to prevent unnecessary re-renders
export const WelcomeHero = memo(
  WelcomeHeroComponent,
  (prevProps, nextProps) => {
    return (
      prevProps.user.id === nextProps.user.id &&
      prevProps.upcomingEvents?.length === nextProps.upcomingEvents?.length &&
      prevProps.className === nextProps.className
    );
  }
);

WelcomeHero.displayName = "WelcomeHero";

export default WelcomeHero;
