import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Toaster } from "@/components/ui/sonner";
import {
  BookOpen,
  Brain,
  Check,
  ChevronRight,
  Code2,
  Copy,
  ExternalLink,
  FlaskConical,
  Globe,
  GraduationCap,
  Hammer,
  Lightbulb,
  List,
  Loader2,
  Rocket,
  Search,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { Mode } from "./backend";
import { useAddTopic, useProgress, useTopicHistory } from "./hooks/useQueries";
import {
  type StructuredResponse,
  generateResponse,
  responseToString,
} from "./lib/responseTemplates";

// ─── Types ────────────────────────────────────────────────────────────────────
interface CardDef {
  id: number;
  title: string;
  icon: React.ReactNode;
  color: string;
  iconBg: string;
  getContent: (r: StructuredResponse) => string | string[];
}

const CARDS: CardDef[] = [
  {
    id: 1,
    title: "Ultra-Short Answer",
    icon: <Zap className="w-4 h-4" />,
    color: "text-yellow-400",
    iconBg: "bg-yellow-400/10",
    getContent: (r) => r.ultraShort,
  },
  {
    id: 2,
    title: "Step-by-Step Explanation",
    icon: <List className="w-4 h-4" />,
    color: "text-blue-400",
    iconBg: "bg-blue-400/10",
    getContent: (r) => r.steps,
  },
  {
    id: 3,
    title: "Deep Insight",
    icon: <Brain className="w-4 h-4" />,
    color: "text-purple-400",
    iconBg: "bg-purple-400/10",
    getContent: (r) => r.deepInsight,
  },
  {
    id: 4,
    title: "Real-World Application",
    icon: <Globe className="w-4 h-4" />,
    color: "text-green-400",
    iconBg: "bg-green-400/10",
    getContent: (r) => r.realWorld,
  },
  {
    id: 5,
    title: "Memory Trick / Shortcut",
    icon: <Lightbulb className="w-4 h-4" />,
    color: "text-orange-400",
    iconBg: "bg-orange-400/10",
    getContent: (r) => r.memoryTrick,
  },
  {
    id: 6,
    title: "Ready-to-Use Output",
    icon: <Code2 className="w-4 h-4" />,
    color: "text-accent",
    iconBg: "bg-accent/10",
    getContent: (r) => r.readyOutput,
  },
];

const MODES = [
  {
    value: Mode.learn,
    label: "Learn",
    icon: <GraduationCap className="w-3.5 h-3.5" />,
  },
  {
    value: Mode.exam,
    label: "Exam",
    icon: <FlaskConical className="w-3.5 h-3.5" />,
  },
  {
    value: Mode.build,
    label: "Build",
    icon: <Hammer className="w-3.5 h-3.5" />,
  },
  { value: Mode.fast, label: "Fast", icon: <Rocket className="w-3.5 h-3.5" /> },
];

const RESOURCES = [
  {
    name: "MDN Web Docs",
    url: "https://developer.mozilla.org",
    desc: "Web API reference",
  },
  {
    name: "freeCodeCamp",
    url: "https://www.freecodecamp.org",
    desc: "Free coding courses",
  },
  {
    name: "MIT OpenCourseWare",
    url: "https://ocw.mit.edu",
    desc: "University-level courses",
  },
  {
    name: "Khan Academy",
    url: "https://www.khanacademy.org",
    desc: "Foundational learning",
  },
  { name: "GitHub", url: "https://github.com", desc: "Open source projects" },
];

const SUGGESTED_TOPICS = [
  "Machine Learning",
  "React",
  "Python",
  "JavaScript",
  "Blockchain",
  "Quantum Computing",
  "CSS",
];

// ─── CopyButton Component ─────────────────────────────────────────────────────
function CopyButton({ text }: { text: string | string[] }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const str = Array.isArray(text) ? text.join("\n") : text;
    await navigator.clipboard.writeText(str);
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="ml-auto p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
      aria-label="Copy content"
      data-ocid="response.copy_button"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-green-400" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
    </button>
  );
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────
function SkeletonCard({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3 shadow-card"
    >
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-md bg-muted animate-pulse" />
        <div className="w-6 h-3 rounded bg-muted animate-pulse" />
        <div className="w-32 h-3 rounded bg-muted animate-pulse" />
        <div className="ml-auto w-6 h-6 rounded bg-muted animate-pulse" />
      </div>
      <div className="space-y-2">
        <div className="h-2.5 rounded bg-muted animate-pulse w-full" />
        <div className="h-2.5 rounded bg-muted animate-pulse w-5/6" />
        <div className="h-2.5 rounded bg-muted animate-pulse w-4/6" />
      </div>
    </motion.div>
  );
}

// ─── Card Component ───────────────────────────────────────────────────────────
function ResponseCard({
  card,
  response,
  index,
}: { card: CardDef; response: StructuredResponse; index: number }) {
  const content = card.getContent(response);
  const isCode = card.id === 6;
  const isSteps = Array.isArray(content);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35 }}
      className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3 shadow-card hover:border-accent/30 transition-colors"
      data-ocid={`response.item.${card.id}`}
    >
      <div className="flex items-center gap-2">
        <span className={`${card.color} ${card.iconBg} p-1.5 rounded-md`}>
          {card.icon}
        </span>
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {card.id.toString().padStart(2, "0")}
        </span>
        <h3 className="text-sm font-semibold text-foreground">{card.title}</h3>
        <CopyButton text={content} />
      </div>

      {isCode ? (
        <pre className="text-xs font-mono bg-muted/60 border border-border rounded-lg p-3 overflow-x-auto text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {content as string}
        </pre>
      ) : isSteps ? (
        <ul className="space-y-1.5">
          {(content as string[]).map((step) => (
            <li
              key={step}
              className="text-xs text-muted-foreground leading-relaxed flex gap-2"
            >
              <ChevronRight className="w-3 h-3 mt-0.5 shrink-0 text-accent" />
              <span>{step.replace(/^(Step \d+:|\d+\.\s*|•\s*)/, "")}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-muted-foreground leading-relaxed">
          {content as string}
        </p>
      )}
    </motion.div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [topic, setTopic] = useState("");
  const [activeMode, setActiveMode] = useState<Mode>(Mode.learn);
  const [response, setResponse] = useState<StructuredResponse | null>(null);
  const [currentTopic, setCurrentTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: history = [] } = useTopicHistory();
  const { data: progress = BigInt(0) } = useProgress();
  const addTopic = useAddTopic();

  const handleSubmit = async () => {
    const trimmed = topic.trim();
    if (!trimmed) return;

    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 900));

    const generated = generateResponse(trimmed, activeMode);
    setResponse(generated);
    setCurrentTopic(trimmed);
    setIsGenerating(false);

    try {
      await addTopic.mutateAsync({
        text: trimmed,
        description: `Explored in ${activeMode} mode`,
        mode: activeMode,
        response: responseToString(generated),
      });
      toast.success(`"${trimmed}" saved to your history`);
    } catch {
      toast.error("Could not save to backend");
    }
  };

  const progressPct = Math.min(Number(progress) * 10, 100);
  const progressLabel = Number(progress);

  return (
    <div className="min-h-screen bg-background hero-gradient">
      <Toaster />

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center">
              <Star className="w-3.5 h-3.5 text-accent" />
            </div>
            <span className="font-bold text-sm tracking-wide text-foreground">
              Elite<span className="text-accent">AI</span>
            </span>
          </div>

          {/* Nav */}
          <nav
            className="hidden md:flex items-center gap-6"
            aria-label="Main navigation"
          >
            {["Dashboard", "Courses", "My Activity", "Pricing", "Help"].map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                  data-ocid={`nav.${item.toLowerCase().replace(" ", "_")}.link`}
                >
                  {item}
                </button>
              ),
            )}
          </nav>

          {/* Avatar */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center">
              <span className="text-xs font-bold text-accent">U</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="max-w-[1200px] mx-auto px-6 py-10">
        {/* Hero */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-foreground mb-2"
          >
            Elite AI{" "}
            <span className="text-accent text-accent-glow">
              Learning Assistant
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-sm text-muted-foreground max-w-lg mx-auto"
          >
            Transform any topic into structured mastery — Ultra-Short answers to
            Ready-to-Use outputs, powered by your chosen learning mode.
          </motion.p>
        </div>

        {/* Controls row */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col sm:flex-row gap-3 mb-3"
        >
          {/* Topic Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Enter a topic to master (e.g. Machine Learning, React, CSS…)"
              className="pl-9 h-10 bg-card border-border text-sm placeholder:text-muted-foreground focus-visible:ring-accent/50"
              data-ocid="topic.input"
            />
          </div>

          {/* Mode Switcher */}
          <fieldset
            className="flex gap-1 bg-muted/60 rounded-lg p-1 border-0"
            aria-label="Learning mode"
          >
            {MODES.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setActiveMode(m.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  activeMode === m.value
                    ? "bg-accent text-accent-foreground shadow-glow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-ocid={`mode.${m.value}.tab`}
              >
                {m.icon}
                {m.label}
              </button>
            ))}
          </fieldset>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={!topic.trim() || isGenerating || addTopic.isPending}
            className="h-10 px-5 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-sm"
            data-ocid="topic.submit_button"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Generate
              </>
            )}
          </Button>
        </motion.div>

        {/* Suggested topics */}
        <div className="flex gap-2 flex-wrap mb-8">
          {SUGGESTED_TOPICS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTopic(t)}
              className="text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground hover:border-accent/40 hover:text-accent transition-colors"
            >
              {t}
            </button>
          ))}
        </div>

        {/* Two-column layout */}
        <div className="flex gap-6 items-start">
          {/* ── Left: response cards ── */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-accent" />
                Structured AI Response
                {currentTopic && (
                  <Badge variant="secondary" className="text-xs">
                    {currentTopic}
                  </Badge>
                )}
              </h2>
              {response && !isGenerating && (
                <Badge className="bg-accent/15 text-accent border-accent/30 text-xs">
                  {activeMode.toUpperCase()} MODE
                </Badge>
              )}
            </div>

            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div
                  key="skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-4"
                  data-ocid="response.loading_state"
                >
                  {CARDS.map((card, i) => (
                    <SkeletonCard key={card.id} index={i} />
                  ))}
                </motion.div>
              ) : response ? (
                <motion.div
                  key={currentTopic + activeMode}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-4"
                >
                  {CARDS.map((card, i) => (
                    <ResponseCard
                      key={card.id}
                      card={card}
                      response={response}
                      index={i}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-xl border border-border border-dashed bg-card/40 p-12 text-center"
                  data-ocid="response.empty_state"
                >
                  <Zap className="w-8 h-8 text-accent/40 mx-auto mb-3" />
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Enter a topic to generate your structured response
                  </p>
                  <p className="text-xs text-muted-foreground/70">
                    Try: Machine Learning, React, Python, Blockchain…
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Right Sidebar ── */}
          <aside className="w-72 shrink-0 space-y-4">
            {/* Progress */}
            <div
              className="rounded-xl border border-border bg-card p-4"
              data-ocid="progress.card"
            >
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-accent" />
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Learning Progress
                </h3>
              </div>
              <div className="flex items-end justify-between mb-2">
                <span className="text-2xl font-bold text-foreground">
                  {progressLabel}
                </span>
                <span className="text-xs text-muted-foreground">
                  topics explored
                </span>
              </div>
              <Progress
                value={progressPct}
                className="h-1.5 bg-muted"
                data-ocid="progress.loading_state"
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                {progressPct < 20
                  ? "Just getting started 🌱"
                  : progressPct < 50
                    ? "Building momentum ⚡"
                    : progressPct < 80
                      ? "Making great progress 🚀"
                      : "Elite learner status 🏆"}
              </p>
            </div>

            {/* Recent Topics */}
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
                Recent Topics
              </h3>
              {history.length === 0 ? (
                <p
                  className="text-xs text-muted-foreground"
                  data-ocid="history.empty_state"
                >
                  No topics yet. Start exploring!
                </p>
              ) : (
                <ul className="space-y-2" data-ocid="history.list">
                  {history
                    .slice()
                    .reverse()
                    .slice(0, 8)
                    .map((t, i) => (
                      <li key={t.text}>
                        <button
                          type="button"
                          className="flex items-center gap-2 group cursor-pointer w-full text-left"
                          onClick={() => setTopic(t.text)}
                          data-ocid={`history.item.${i + 1}`}
                        >
                          <div className="w-1 h-1 rounded-full bg-accent shrink-0" />
                          <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors truncate">
                            {t.text}
                          </span>
                          <Badge
                            variant="outline"
                            className="ml-auto text-[10px] shrink-0 border-border text-muted-foreground"
                          >
                            {t.mode}
                          </Badge>
                        </button>
                      </li>
                    ))}
                </ul>
              )}
            </div>

            {/* Elite Resources */}
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
                Elite Resources
              </h3>
              <ul className="space-y-2.5">
                {RESOURCES.map((r, i) => (
                  <li key={r.name}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-2 group"
                      data-ocid={`resources.item.${i + 1}`}
                    >
                      <ExternalLink className="w-3 h-3 mt-0.5 text-accent shrink-0" />
                      <div>
                        <span className="text-xs font-medium text-foreground group-hover:text-accent transition-colors">
                          {r.name}
                        </span>
                        <p className="text-[10px] text-muted-foreground">
                          {r.desc}
                        </p>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border mt-16 py-6">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()}{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              Built with ❤️ using caffeine.ai
            </a>
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
