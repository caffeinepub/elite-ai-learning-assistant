import { Mode } from "../backend";

export interface StructuredResponse {
  ultraShort: string;
  steps: string[];
  deepInsight: string;
  realWorld: string;
  memoryTrick: string;
  readyOutput: string;
}

type TopicTemplates = Record<string, StructuredResponse>;

const templates: TopicTemplates = {
  "machine learning": {
    ultraShort:
      "Machine Learning is a branch of AI where systems learn patterns from data to make predictions — without being explicitly programmed for each task.",
    steps: [
      "1. Collect & clean data — quality data is the foundation.",
      "2. Choose a model type: Supervised (labeled data), Unsupervised (unlabeled), or Reinforcement (reward-based).",
      "3. Train the model: feed data, adjust weights via gradient descent.",
      "4. Evaluate performance with metrics (accuracy, F1-score, RMSE).",
      "5. Deploy, monitor, and retrain as new data arrives.",
    ],
    deepInsight:
      "Most people think ML is about the algorithm — it's actually about the data. A simple linear model on great data beats a neural network on bad data. Gradient descent doesn't find the global minimum; it finds a 'good enough' local minimum. Overfitting (memorizing) vs. underfitting (oversimplifying) is the central tension in every ML project.",
    realWorld:
      "Netflix uses collaborative filtering (unsupervised ML) to suggest shows. To build a spam filter: collect emails → label spam/not-spam → train a Naive Bayes classifier → evaluate on test set → deploy to production.",
    memoryTrick:
      "TIDE: Train → Iterate → Deploy → Evaluate. Remember: ML is just 'fancy curve fitting' — you're always trying to fit a function to data.",
    readyOutput:
      "```python\n# Minimal ML pipeline (scikit-learn)\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import accuracy_score\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)\nmodel = RandomForestClassifier(n_estimators=100)\nmodel.fit(X_train, y_train)\nprint(f'Accuracy: {accuracy_score(y_test, model.predict(X_test)):.2%}')\n```",
  },
  "quantum computing": {
    ultraShort:
      "Quantum computing uses qubits that can exist in superposition (0 and 1 simultaneously), enabling exponentially faster solutions to specific hard problems.",
    steps: [
      "1. Classical bit = 0 or 1. Qubit = |0⟩, |1⟩, or any superposition α|0⟩ + β|1⟩.",
      "2. Superposition lets one qubit represent multiple states at once — N qubits represent 2^N states.",
      "3. Entanglement links qubits: measuring one instantly determines its partner's state.",
      "4. Quantum gates (Hadamard, CNOT, Toffoli) manipulate qubits, unlike classical logic gates.",
      "5. Measurement collapses the superposition — algorithm design exploits interference to boost correct answers.",
    ],
    deepInsight:
      "Quantum computers aren't universally faster — they win at specific problems: factoring (Shor's Algorithm), search (Grover's Algorithm), optimization, and simulation. Classical computers remain better for most tasks. Decoherence (environmental interference destroying quantum states) is the #1 engineering challenge. Current 'NISQ' devices are noisy and limited — true quantum advantage at scale is still years away.",
    realWorld:
      "IBM Quantum lets you run real quantum circuits today. Pharmaceutical companies use quantum simulation to model molecular interactions. Cryptography faces disruption: RSA encryption can be broken by Shor's algorithm on a sufficiently powerful quantum computer.",
    memoryTrick:
      "SEE: Superposition + Entanglement = Exponential power. Think of superposition as a coin spinning (both heads and tails) — measurement makes it land.",
    readyOutput:
      "```python\n# Quantum circuit with Qiskit\nfrom qiskit import QuantumCircuit\n\nqc = QuantumCircuit(2, 2)\nqc.h(0)          # Hadamard: put qubit 0 in superposition\nqc.cx(0, 1)      # CNOT: entangle qubits\nqc.measure([0,1], [0,1])\nprint(qc.draw())\n```",
  },
  javascript: {
    ultraShort:
      "JavaScript is a single-threaded, event-driven language that runs in browsers and Node.js — its async model and prototypal inheritance make it uniquely powerful and uniquely confusing.",
    steps: [
      "1. Event Loop: JS runs one operation at a time. Async tasks (timers, I/O) are queued in the callback/microtask queue.",
      "2. Closures: Functions 'close over' their lexical scope — inner functions access outer variables even after the outer function returns.",
      "3. Async/Await: Syntactic sugar over Promises. async fn returns a Promise; await pauses execution until it resolves.",
      "4. Prototypal Inheritance: Objects inherit directly from other objects via the prototype chain (not classes — class syntax is sugar).",
      "5. 'this' context: Value of 'this' depends on how a function is called, not where it's defined (arrow functions fix this).",
    ],
    deepInsight:
      "The event loop is why JS can handle thousands of concurrent connections in Node.js despite being single-threaded. The microtask queue (Promises) has higher priority than the macrotask queue (setTimeout). 99% of JS bugs trace back to misunderstanding 'this', asynchronous timing, or mutation of shared state.",
    realWorld:
      "Use closures for private state (factory functions, module pattern). Use async/await for all API calls. Avoid callback hell — always return Promises. For performance-critical code, Web Workers offload computation from the main thread.",
    memoryTrick:
      "CAPE: Closure · Async/Await · Prototype · Event Loop — master these 4 and you master JS fundamentals. 'Hoisting' = declarations move to top; 'closure' = function remembers its birthplace.",
    readyOutput:
      "```javascript\n// Closure + async/await example\nfunction createCounter() {\n  let count = 0; // closed-over variable\n  return { increment: () => ++count, value: () => count };\n}\n\nasync function fetchData(url) {\n  try {\n    const res = await fetch(url);\n    if (!res.ok) throw new Error(res.statusText);\n    return await res.json();\n  } catch (err) {\n    console.error('Fetch failed:', err);\n  }\n}\n```",
  },
  react: {
    ultraShort:
      "React is a UI library that renders a virtual DOM diff to minimize real DOM updates — hooks replaced class lifecycle methods, making state and side effects composable.",
    steps: [
      "1. Components: Functions that return JSX. Props flow down (parent → child), state lives inside.",
      "2. Virtual DOM: React keeps a virtual copy; on state change, it diffs old vs. new and patches only what changed.",
      "3. useState: Declare state. setState triggers a re-render. Never mutate state directly.",
      "4. useEffect: Handle side effects (data fetching, subscriptions). Return cleanup function to avoid leaks.",
      "5. useMemo/useCallback: Memoize expensive values/functions to prevent unnecessary re-renders.",
    ],
    deepInsight:
      "React's reconciler (Fiber) assigns priority to updates — user input has higher priority than background data loading. Most performance bugs come from unnecessary re-renders; use React DevTools Profiler to find them. Derived state in useEffect is an anti-pattern — compute it inline instead. Context is not a replacement for a state manager; it re-renders all consumers on every change.",
    realWorld:
      "Build a data table: fetch with useQuery (React Query), display with virtualization (TanStack Virtual) for 10k+ rows, memoize row components with React.memo. Use Zustand or Jotai for global state — avoid Redux unless you need time-travel debugging.",
    memoryTrick:
      "SEPH: State · Effects · Props · Hooks. 'Lifting state up' = move state to nearest common ancestor. 'Controlled component' = React owns the value (not the DOM).",
    readyOutput:
      "```tsx\n// Custom hook pattern\nfunction useLocalStorage<T>(key: string, initial: T) {\n  const [value, setValue] = React.useState<T>(() => {\n    const stored = localStorage.getItem(key);\n    return stored ? JSON.parse(stored) : initial;\n  });\n  const set = (v: T) => {\n    setValue(v);\n    localStorage.setItem(key, JSON.stringify(v));\n  };\n  return [value, set] as const;\n}\n```",
  },
  python: {
    ultraShort:
      "Python's power comes from readability + rich standard library + ecosystem. Master comprehensions, generators, decorators, and type hints to write professional-grade Python.",
    steps: [
      "1. List Comprehensions: [expr for item in iterable if condition] — replace map/filter with readable one-liners.",
      "2. Generators: yield instead of return — create lazy sequences that don't load everything into memory.",
      "3. Decorators: Functions that wrap other functions — use for logging, auth, caching (@lru_cache, @property).",
      "4. Type Hints: Annotate params and returns (def fn(x: int) -> str) — enables mypy checking and IDE help.",
      "5. Context Managers: with statement guarantees cleanup (files, DB connections, locks).",
    ],
    deepInsight:
      "Python's GIL (Global Interpreter Lock) prevents true parallelism in threads for CPU-bound work — use multiprocessing or async for concurrency. Duck typing + dunder methods (__len__, __iter__, __enter__) are how Python achieves its 'protocol' system. The 'import' system and virtual environments are essential to understand before shipping any production code.",
    realWorld:
      "Automate a CSV report: read with pandas, clean with vectorized ops, export to Excel with openpyxl, email with smtplib — all in <50 lines. Use FastAPI for REST APIs — it's the fastest Python framework with automatic OpenAPI docs.",
    memoryTrick:
      "GDICT: Generator · Decorator · list comprehension · Iterator · Context manager · Type hints. Remember: 'Pythonic' = readable + explicit. If it feels clever, it's probably not Pythonic.",
    readyOutput:
      "```python\n# Decorator + generator + type hints\nfrom functools import wraps\nfrom typing import Generator\n\ndef timer(fn):\n    @wraps(fn)\n    def wrapper(*args, **kwargs):\n        import time; t = time.perf_counter()\n        result = fn(*args, **kwargs)\n        print(f'{fn.__name__} took {time.perf_counter()-t:.3f}s')\n        return result\n    return wrapper\n\n@timer\ndef fibonacci(n: int) -> Generator[int, None, None]:\n    a, b = 0, 1\n    for _ in range(n):\n        yield a\n        a, b = b, a + b\n```",
  },
  blockchain: {
    ultraShort:
      "Blockchain is an immutable, distributed ledger where transactions are grouped in cryptographically linked blocks — trust is enforced by math, not central authorities.",
    steps: [
      "1. Distributed Ledger: Identical copies of the ledger exist on thousands of nodes — no single point of failure.",
      "2. Blocks & Chains: Each block contains transactions + a hash of the previous block, creating an unbreakable chain.",
      "3. Consensus Mechanisms: PoW (Proof of Work) = computational puzzle; PoS (Proof of Stake) = economic stake.",
      "4. Smart Contracts: Self-executing code on the blockchain (Ethereum/Solidity) — no intermediary needed.",
      "5. Wallets & Keys: Public key = address (like email). Private key = password. Lose private key = lose funds forever.",
    ],
    deepInsight:
      "Blockchain's true innovation is solving the 'Byzantine Generals Problem' — achieving consensus among untrusted parties over a network. The blockchain trilemma: you can only optimize 2 of 3 (Decentralized, Secure, Scalable). L2 solutions (Lightning Network, Optimistic Rollups) add scalability on top of L1. NFTs are just a token ID pointing to a URI — the actual asset is usually stored off-chain (IPFS or centralized server).",
    realWorld:
      "Deploy a token in 10 minutes: use OpenZeppelin's ERC-20 template on Remix IDE, connect MetaMask to a testnet, deploy with 1 click. DeFi protocols (Uniswap, Aave) have processed trillions in volume with no central operator.",
    memoryTrick:
      "BCDCS: Block · Chain · Distributed · Consensus · Smart contracts. Remember: blockchain = append-only database with built-in audit trail. 'Immutable' means you can't edit history, only add to it.",
    readyOutput:
      '```solidity\n// Minimal ERC-20 token (Solidity)\n// SPDX-License-Identifier: MIT\npragma solidity ^0.8.0;\nimport "@openzeppelin/contracts/token/ERC20/ERC20.sol";\n\ncontract EliteToken is ERC20 {\n    constructor(uint256 initialSupply) ERC20("EliteToken", "ELT") {\n        _mint(msg.sender, initialSupply * 10 ** decimals());\n    }\n}\n```',
  },
  css: {
    ultraShort:
      "CSS controls presentation via cascading rules. Master the box model, flexbox, grid, and specificity to control any layout with precision.",
    steps: [
      "1. Box Model: Every element = content + padding + border + margin. box-sizing: border-box makes width include padding/border.",
      "2. Specificity: Inline > ID > Class > Element. Use BEM or utility classes (Tailwind) to avoid specificity wars.",
      "3. Flexbox: 1D layout. justify-content (main axis) + align-items (cross axis). Use for navbars, card rows, centered content.",
      "4. Grid: 2D layout. Define rows + columns with grid-template. Use fr units for responsive tracks.",
      "5. Custom Properties (variables): --color: teal; reuse with var(--color). Enables runtime theming.",
    ],
    deepInsight:
      "The 'cascade' in CSS means later rules win — unless specificity or !important overrides. Stacking contexts (created by transform, opacity, z-index) explain why z-index 9999 sometimes doesn't work. CSS Subgrid solves the hardest layout problem: aligning grandchildren to a grandparent grid. Container queries are more powerful than media queries for component-level responsive design.",
    realWorld:
      "Responsive card grid: grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) — no media queries needed. Use clamp(1rem, 2.5vw, 1.5rem) for fluid typography that scales with viewport.",
    memoryTrick:
      "BFGS: Box model · Flexbox · Grid · Specificity. Remember: Flexbox = one direction (row or column). Grid = two directions. When in doubt, use Grid — it can do everything Flexbox can.",
    readyOutput:
      "```css\n/* Responsive grid + fluid type + dark mode */\n.card-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));\n  gap: clamp(1rem, 2vw, 1.5rem);\n}\n\n:root { --text: #0f0f0f; }\n@media (prefers-color-scheme: dark) {\n  :root { --text: #f0f0f0; }\n}\n```",
  },
};

function getTemplate(topic: string): StructuredResponse {
  const key = topic.toLowerCase().trim();
  if (templates[key]) return templates[key];
  for (const k of Object.keys(templates)) {
    if (key.includes(k) || k.includes(key)) return templates[k];
  }
  const T = topic;
  return {
    ultraShort: `${T} is a foundational concept that enables powerful capabilities in modern software development. Understanding it deeply will accelerate your growth as a developer.`,
    steps: [
      `1. Define the core problem ${T} solves — understand the 'why' before the 'how'.`,
      `2. Study the fundamental principles and mental models behind ${T}.`,
      "3. Implement a minimal working example from scratch.",
      "4. Explore edge cases, limitations, and best practices.",
      `5. Build a real project that uses ${T} in a production-like context.`,
    ],
    deepInsight: `Most developers learn ${T} by copying examples without understanding the underlying model. The key insight: ${T} solves a specific category of problem elegantly — but it's the wrong tool outside that context. Expert practitioners know both when to use ${T} and when to reach for something else.`,
    realWorld: `Apply ${T} in a side project within 48 hours of learning it. Theory without application decays in 72 hours. Join communities (Discord, Reddit, GitHub Discussions) around ${T} — real-world patterns emerge from professional conversations, not tutorials.`,
    memoryTrick: `To remember ${T}: create a one-sentence definition, one concrete example, and one anti-pattern. Write them down. Teach it to someone else within a week — teaching is the highest form of understanding.`,
    readyOutput: `# ${T} — Quick Reference\n\n## Core Concept\nDefines the problem domain and solution approach.\n\n## Key Commands / Patterns\n- Pattern 1: [most common usage]\n- Pattern 2: [intermediate technique]\n- Pattern 3: [advanced application]\n\n## Resources\n- Official docs: search "${T} official documentation"\n- Practice: build a small project using ${T} this week`,
  };
}

export function generateResponse(
  topic: string,
  mode: Mode,
): StructuredResponse {
  const base = getTemplate(topic);

  if (mode === Mode.fast) {
    return {
      ultraShort: base.ultraShort,
      steps: base.steps.slice(0, 3),
      deepInsight: `${base.deepInsight.split(".")[0]}.`,
      realWorld: `${base.realWorld.split(".")[0]}.`,
      memoryTrick: `${base.memoryTrick.split(".")[0]}.`,
      readyOutput: base.readyOutput,
    };
  }

  if (mode === Mode.exam) {
    return {
      ultraShort: `✅ KEY ANSWER: ${base.ultraShort}`,
      steps: base.steps.map((s) => `• ${s.replace(/^\d+\.\s*/, "")}`),
      deepInsight: `⚠️ HIGH-PROB INSIGHT: ${base.deepInsight.split(".")[0]}.`,
      realWorld: `📝 EXAM SCENARIO: ${base.realWorld.split(".")[0]}.`,
      memoryTrick: `🧠 MNEMONIC: ${base.memoryTrick}`,
      readyOutput: base.readyOutput,
    };
  }

  if (mode === Mode.build) {
    return {
      ultraShort: `🔨 BUILD GOAL: ${base.ultraShort}`,
      steps: base.steps.map(
        (s, i) => `Step ${i + 1}: ${s.replace(/^\d+\.\s*/, "")}`,
      ),
      deepInsight: `🏗️ ARCHITECTURE NOTE: ${base.deepInsight}`,
      realWorld: `🚀 PROJECT SPEC: ${base.realWorld}`,
      memoryTrick: `⚡ DEV SHORTCUT: ${base.memoryTrick}`,
      readyOutput: base.readyOutput,
    };
  }

  return base;
}

export function responseToString(r: StructuredResponse): string {
  return [
    `ULTRA-SHORT: ${r.ultraShort}`,
    `STEPS: ${r.steps.join(" | ")}`,
    `INSIGHT: ${r.deepInsight}`,
    `REAL-WORLD: ${r.realWorld}`,
    `MEMORY: ${r.memoryTrick}`,
    `OUTPUT: ${r.readyOutput}`,
  ].join("\n");
}
