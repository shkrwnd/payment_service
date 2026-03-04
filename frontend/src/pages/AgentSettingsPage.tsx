import React, { useState } from "react";
import {
  Shield, Pause, Play, Check, X, CreditCard, ShoppingCart,
  Shirt, Smartphone, Lock, Info, Clock, TrendingUp, Zap,
  Settings, Activity, Database, Plus, ChevronDown, ChevronUp,
  RefreshCw, Mail, Award, Sliders, MoreHorizontal, CheckCircle,
  XCircle, HelpCircle, Star, Baby, Plane, Dumbbell, BookOpen,
  Home, Car, Utensils, AlertTriangle,
} from "lucide-react";
import {
  Switch, Slider, Select, SelectContent, SelectItem, SelectTrigger,
  SelectValue, Card, CardContent, CardHeader, CardTitle, Badge,
  Separator, Button, Input,
} from "../components/ui";

// ─── Types ─────────────────────────────────────────────────────────────────────
type CategoryMode = "auto" | "ask" | "block";
type AgentMode    = "safe" | "balanced" | "handsoff";
type AdvancedTab  = "categories" | "limits" | "payment" | "privacy" | "activity";

// ─── Primitives ────────────────────────────────────────────────────────────────
const ModePill: React.FC<{ mode: CategoryMode; active: boolean; onClick: () => void }> = ({ mode, active, onClick }) => {
  const base = "px-2.5 py-1 text-xs font-medium rounded-md border transition-colors";
  const styles: Record<CategoryMode, string> = {
    auto:  active ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-transparent text-muted-foreground border-border hover:bg-muted",
    ask:   active ? "bg-amber-50 text-amber-700 border-amber-200"       : "bg-transparent text-muted-foreground border-border hover:bg-muted",
    block: active ? "bg-rose-50 text-rose-700 border-rose-200"          : "bg-transparent text-muted-foreground border-border hover:bg-muted",
  };
  return <button onClick={onClick} className={`${base} ${styles[mode]}`}>{mode.charAt(0).toUpperCase() + mode.slice(1)}</button>;
};

const StatusPill: React.FC<{ mode: CategoryMode }> = ({ mode }) => {
  const styles: Record<CategoryMode, string> = {
    auto:  "bg-emerald-50 text-emerald-700 border-emerald-200",
    ask:   "bg-amber-50 text-amber-700 border-amber-200",
    block: "bg-rose-50 text-rose-700 border-rose-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md border ${styles[mode]}`}>
      {mode.charAt(0).toUpperCase() + mode.slice(1)}
    </span>
  );
};

// Label above a settings group — like Linear
const GroupLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-1">{children}</p>
);

// Standard setting row: label+desc on left, control on right
const SettingRow: React.FC<{
  label: string;
  description?: string;
  children: React.ReactNode;
  last?: boolean;
}> = ({ label, description, children, last }) => (
  <div className={`flex items-center justify-between gap-6 py-4 ${!last ? "border-b border-border" : ""}`}>
    <div className="min-w-0">
      <p className="text-sm font-medium text-foreground">{label}</p>
      {description && <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{description}</p>}
    </div>
    <div className="shrink-0">{children}</div>
  </div>
);

// ─── Mock data ─────────────────────────────────────────────────────────────────
const ACTIVITY_LOG = [
  { id: 1, merchant: "Whole Foods Market", amount: 67.34, category: "groceries", mode: "auto"  as CategoryMode, card: "Chase ···· 4821", time: "Today, 2:14 PM",       rule: "Groceries auto-approved under $100 · Preferred merchant · Chase Sapphire used for everyday spend.", alternatives: ["Trader Joe's ($71.20)", "Safeway ($69.80)"] },
  { id: 2, merchant: "Apple Store",        amount: 129.0, category: "electronics",mode: "ask"   as CategoryMode, card: "Pending approval",time: "Today, 11:03 AM",      rule: "Electronics require approval · Amount ($129) above auto-threshold ($30) · New merchant this month.", alternatives: ["Amazon ($124.99)", "Best Buy ($129.00)"] },
  { id: 3, merchant: "Spotify Premium",    amount: 10.99, category: "subscriptions",mode:"ask"  as CategoryMode, card: "Apple Card ···· 3940", time: "Yesterday, 8:30 AM", rule: "Subscription renewal flagged · Risk trigger: recurring charge · You confirmed.", alternatives: [] },
  { id: 4, merchant: "Target",             amount: 43.21, category: "home",       mode: "auto"  as CategoryMode, card: "Chase ···· 4821", time: "Yesterday, 3:45 PM",  rule: "Trusted merchant · Under $50 threshold · Home category approved.", alternatives: ["Amazon ($45.99)", "Walmart ($42.10)"] },
  { id: 5, merchant: "Luxury Brand Co",    amount: 450.0, category: "clothes",    mode: "block" as CategoryMode, card: "—",             time: "Mar 2, 4:22 PM",       rule: "Blocked: Clothes set to Ask · Amount exceeds $150 monthly cap · Unrecognized merchant.", alternatives: [] },
];

// ─── Page ──────────────────────────────────────────────────────────────────────
export const AgentSettingsPage: React.FC = () => {
  const [viewMode,    setViewMode]    = useState<"basic" | "advanced">("basic");
  const [isPaused,    setIsPaused]    = useState(false);
  const [advancedTab, setAdvancedTab] = useState<AdvancedTab>("categories");

  const [maxPurchase,  setMaxPurchase]  = useState(50);
  const [monthlyBudget,setMonthlyBudget]= useState(250);
  const [askToggle,    setAskToggle]    = useState(true);
  const [askAmount,    setAskAmount]    = useState(30);
  const [agentMode,    setAgentMode]    = useState<AgentMode>("balanced");

  const [categories, setCategories] = useState<Record<string, CategoryMode>>({
    groceries: "auto", clothes: "ask", electronics: "ask", travel: "ask",
    dining: "auto", subscriptions: "ask", kids: "auto", fitness: "block",
    books: "auto", home: "ask", automotive: "block", beauty: "ask",
  });
  const setCat = (k: string, m: CategoryMode) => setCategories(p => ({ ...p, [k]: m }));

  const [stores, setStores] = useState<Record<string, boolean>>({
    amazon: true, walmart: true, target: true, costco: false, wholefoods: true,
  });
  const toggleStore = (k: string) => setStores(p => ({ ...p, [k]: !p[k] }));

  const [cards, setCards] = useState([
    { id: "1", name: "Chase Sapphire Reserve", last4: "4821", type: "visa", enabled: true,  label: "3× travel & dining" },
    { id: "2", name: "Apple Card",             last4: "3940", type: "mc",   enabled: true,  label: "Daily cash back" },
    { id: "3", name: "Citi Double Cash",       last4: "2217", type: "mc",   enabled: false, label: "2% on everything" },
  ]);
  const toggleCard = (id: string) => setCards(p => p.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c));

  const [preferBrands, setPreferBrands] = useState(["Whole Foods", "Apple", "Patagonia"]);
  const [avoidBrands,  setAvoidBrands]  = useState(["Fast Fashion Co"]);
  const [newPrefer, setNewPrefer] = useState("");
  const [newAvoid,  setNewAvoid]  = useState("");

  const [caps, setCaps] = useState<Record<string, number>>({
    groceries: 300, clothes: 150, electronics: 200, travel: 500,
    dining: 100, subscriptions: 50, kids: 150, books: 40, home: 200,
  });

  const [risks, setRisks] = useState({
    newMerchant: true, foreignCurrency: true,
    subscriptions: true, doublePrice: true, newCard: false,
  });
  const [privacy, setPrivacy] = useState({
    purchaseHistory: true, emailReceipts: true, loyalty: false, learning: true,
  });

  const [expandedId, setExpandedId] = useState<number | null>(null);

  const budgetUsed = 847.32;
  const budgetPct  = Math.round((budgetUsed / monthlyBudget) * 100);

  const CATEGORY_LIST = [
    { key: "groceries",     label: "Groceries & Household",   Icon: ShoppingCart },
    { key: "travel",        label: "Travel & Hotels",          Icon: Plane        },
    { key: "dining",        label: "Dining & Restaurants",     Icon: Utensils     },
    { key: "clothes",       label: "Clothes & Fashion",        Icon: Shirt        },
    { key: "electronics",   label: "Electronics & Gadgets",    Icon: Smartphone   },
    { key: "subscriptions", label: "Subscriptions",            Icon: RefreshCw    },
    { key: "kids",          label: "Kids & Family",            Icon: Baby         },
    { key: "fitness",       label: "Fitness & Sports",         Icon: Dumbbell     },
    { key: "books",         label: "Books & Media",            Icon: BookOpen     },
    { key: "home",          label: "Home & Garden",            Icon: Home         },
    { key: "automotive",    label: "Automotive",               Icon: Car          },
    { key: "beauty",        label: "Beauty & Personal Care",   Icon: Star         },
  ];

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif&display=swap');`}</style>

      {/* ── PAGE HEADER ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}
          >
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold text-foreground tracking-tight">NavAI Agent</h1>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${
                isPaused
                  ? "bg-rose-50 text-rose-600 border-rose-200"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isPaused ? "bg-rose-500" : "bg-emerald-500"}`} />
                {isPaused ? "Paused" : "Active"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">v2.1 · Spending permissions</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-border bg-background p-0.5">
            {(["basic", "advanced"] as const).map(m => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  viewMode === m
                    ? "bg-muted text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m === "basic" ? "Basic" : "Advanced"}
              </button>
            ))}
          </div>
          <Button
            size="sm"
            onClick={() => setIsPaused(!isPaused)}
            className={`gap-1.5 text-xs font-medium ${
              isPaused
                ? "bg-foreground text-background hover:bg-foreground/90"
                : "bg-rose-600 text-white hover:bg-rose-700"
            }`}
          >
            {isPaused ? <Play size={12} /> : <Pause size={12} />}
            {isPaused ? "Resume" : "Pause all"}
          </Button>
        </div>
      </div>

      {/* ── STAT ROW ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Monthly spend",  value: `$${budgetUsed.toLocaleString()}`, sub: `${budgetPct}% of $${monthlyBudget}`, dot: "bg-primary"        },
          { label: "Auto-purchased", value: "12",                               sub: "no approval needed",                  dot: "bg-emerald-500"    },
          { label: "Approved",       value: "3",                                sub: "you confirmed",                       dot: "bg-amber-500"      },
          { label: "Blocked",        value: "1",                                sub: "by your rules",                       dot: "bg-rose-500"       },
        ].map(({ label, value, sub, dot }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-1.5 mb-3">
              <span className={`w-2 h-2 rounded-full ${dot}`} />
              <span className="text-xs font-medium text-muted-foreground">{label}</span>
            </div>
            <p className="text-2xl font-semibold tracking-tight text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{sub}</p>
            {label === "Monthly spend" && (
              <div className="mt-3 h-0.5 rounded-full bg-muted overflow-hidden">
                <div className={`h-full rounded-full ${budgetPct > 90 ? "bg-rose-500" : "bg-primary"}`}
                  style={{ width: `${Math.min(budgetPct, 100)}%` }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── PAUSED BANNER ───────────────────────────────────────────────────── */}
      {isPaused && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 mb-6">
          <AlertTriangle size={14} className="text-rose-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-rose-800">All agent purchases are paused</p>
            <p className="text-xs text-rose-500 mt-0.5">The agent cannot buy anything until you resume.</p>
          </div>
          <Button size="sm" onClick={() => setIsPaused(false)}
            className="text-xs bg-rose-600 text-white hover:bg-rose-700 gap-1">
            <Play size={11} /> Resume
          </Button>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          BASIC MODE
      ════════════════════════════════════════════════════════════════════════ */}
      {viewMode === "basic" && (
        <div className="space-y-6">

          {/* SPENDING GUARDRAILS */}
          <div>
            <GroupLabel>Spending guardrails</GroupLabel>
            <Card>
              <CardContent className="p-0 divide-y divide-border">

                {/* Max per purchase */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">Max per purchase</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Auto-buy limit per transaction</p>
                    </div>
                    <span className="text-sm font-semibold text-primary tabular-nums">${maxPurchase}</span>
                  </div>
                  <Slider min={10} max={200} step={5} value={[maxPurchase]}
                    onValueChange={([v]) => setMaxPurchase(v)}
                    className="[&_[role=slider]]:border-primary [&_[role=slider]]:bg-primary [&_.bg-primary]:bg-primary" />
                  <div className="flex justify-between mt-3">
                    {[25, 50, 100, 200].map(v => (
                      <button key={v} onClick={() => setMaxPurchase(v)}
                        className={`text-xs px-2 py-1 rounded-md transition-colors ${
                          maxPurchase === v ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
                        }`}>
                        ${v}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Monthly budget */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">Monthly budget</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Total agent spend per month</p>
                    </div>
                    <span className="text-sm font-semibold text-primary tabular-nums">${monthlyBudget}</span>
                  </div>
                  <Slider min={50} max={2000} step={50} value={[monthlyBudget]}
                    onValueChange={([v]) => setMonthlyBudget(v)}
                    className="[&_[role=slider]]:border-primary [&_[role=slider]]:bg-primary [&_.bg-primary]:bg-primary" />
                  <div className="flex justify-between mt-3">
                    {[100, 250, 500, 1000].map(v => (
                      <button key={v} onClick={() => setMonthlyBudget(v)}
                        className={`text-xs px-2 py-1 rounded-md transition-colors ${
                          monthlyBudget === v ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
                        }`}>
                        ${v}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ask threshold */}
                <div className="p-5 flex items-center justify-between gap-6">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      Ask me before anything over{" "}
                      {askToggle && <span className="text-primary">${askAmount}</span>}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">Overrides auto-buy for large purchases</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {askToggle && (
                      <Input type="number" value={askAmount} min={1}
                        onChange={e => setAskAmount(+e.target.value)}
                        className="w-16 h-8 text-center text-sm font-medium" />
                    )}
                    <Switch checked={askToggle} onCheckedChange={setAskToggle}
                      className="data-[state=checked]:bg-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* WHERE IT CAN SHOP */}
          <div>
            <GroupLabel>Where it can shop</GroupLabel>
            <Card>
              <CardContent className="p-0">
                {[
                  { key: "groceries",   label: "Groceries & Household", Icon: ShoppingCart },
                  { key: "clothes",     label: "Clothes & Shoes",        Icon: Shirt        },
                  { key: "electronics", label: "Electronics & Gadgets",  Icon: Smartphone   },
                  { key: "home",        label: "Everything else",         Icon: MoreHorizontal },
                ].map(({ key, label, Icon }, i, arr) => (
                  <div key={key}
                    className={`flex items-center justify-between gap-4 px-5 py-3.5 ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon size={14} className="text-muted-foreground shrink-0" />
                      <span className="text-sm text-foreground truncate">{label}</span>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      {(["auto", "ask", "block"] as CategoryMode[]).map(m => (
                        <ModePill key={m} mode={m} active={categories[key] === m} onClick={() => setCat(key, m)} />
                      ))}
                    </div>
                  </div>
                ))}

                <div className="px-5 py-4 border-t border-border">
                  <p className="text-xs font-medium text-muted-foreground mb-3">Trusted stores</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: "amazon",     label: "Amazon"      },
                      { key: "walmart",    label: "Walmart"     },
                      { key: "target",     label: "Target"      },
                      { key: "costco",     label: "Costco"      },
                      { key: "wholefoods", label: "Whole Foods" },
                    ].map(({ key, label }) => (
                      <button key={key} onClick={() => toggleStore(key)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                          stores[key]
                            ? "bg-primary/10 text-primary border-primary/20"
                            : "bg-background text-muted-foreground border-border hover:bg-muted"
                        }`}>
                        {stores[key] && <Check size={11} />}
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* HOW AUTOMATIC */}
          <div>
            <GroupLabel>Automation level</GroupLabel>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { key: "safe"     as AgentMode, label: "Safe",      desc: "Asks before every purchase",                Icon: Shield,   ring: "ring-emerald-400", activeBg: "bg-emerald-50",  activeText: "text-emerald-700", iconColor: "text-emerald-600" },
                { key: "balanced" as AgentMode, label: "Balanced",  desc: "Auto for small amounts & trusted stores",  Icon: Settings, ring: "ring-primary/40",  activeBg: "bg-primary/5",   activeText: "text-primary",    iconColor: "text-primary"     },
                { key: "handsoff" as AgentMode, label: "Hands-off", desc: "Buys automatically within your limits",    Icon: Zap,      ring: "ring-amber-400",   activeBg: "bg-amber-50",    activeText: "text-amber-700",  iconColor: "text-amber-600"   },
              ].map(({ key, label, desc, Icon, ring, activeBg, activeText, iconColor }) => {
                const active = agentMode === key;
                return (
                  <button key={key} onClick={() => setAgentMode(key)}
                    className={`text-left p-4 rounded-xl border transition-all ${
                      active ? `${activeBg} border-transparent ring-2 ${ring}` : "bg-card border-border hover:bg-muted/40"
                    }`}>
                    <div className="flex items-center justify-between mb-3">
                      <Icon size={15} className={active ? iconColor : "text-muted-foreground"} />
                      {active && <Check size={13} className={iconColor} />}
                    </div>
                    <p className={`text-sm font-semibold mb-1 ${active ? activeText : "text-foreground"}`}>{label}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* PAYMENT METHODS */}
          <div>
            <GroupLabel>Payment methods</GroupLabel>
            <Card>
              <CardContent className="p-0 divide-y divide-border">
                {cards.map(card => (
                  <div key={card.id}
                    className={`flex items-center justify-between gap-4 px-5 py-4 transition-colors ${!card.enabled ? "opacity-50" : ""}`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-7 rounded-md flex items-center justify-center shrink-0 ${
                        card.type === "visa" ? "bg-blue-600" : "bg-violet-600"
                      }`}>
                        <CreditCard size={12} className="text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{card.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-muted-foreground">···· {card.last4}</span>
                          {card.enabled && (
                            <span className="text-xs text-muted-foreground">· {card.label}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Switch checked={card.enabled} onCheckedChange={() => toggleCard(card.id)}
                      className="data-[state=checked]:bg-primary shrink-0" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          ADVANCED MODE
      ════════════════════════════════════════════════════════════════════════ */}
      {viewMode === "advanced" && (
        <div className="flex gap-5 items-start">

          {/* Sidebar nav */}
          <nav className="w-40 shrink-0 sticky top-4">
            <div className="space-y-0.5">
              {[
                { key: "categories" as AdvancedTab, label: "Categories", Icon: ShoppingCart },
                { key: "limits"     as AdvancedTab, label: "Limits",     Icon: Sliders      },
                { key: "payment"    as AdvancedTab, label: "Payment",    Icon: CreditCard   },
                { key: "privacy"    as AdvancedTab, label: "Privacy",    Icon: Lock         },
                { key: "activity"   as AdvancedTab, label: "Activity",   Icon: Activity     },
              ].map(({ key, label, Icon }) => (
                <button key={key} onClick={() => setAdvancedTab(key)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                    advancedTab === key
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}>
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>
          </nav>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-5">

            {/* ── CATEGORIES ─────────────────────────────────────────────── */}
            {advancedTab === "categories" && (
              <>
                <div>
                  <GroupLabel>Category rules</GroupLabel>
                  <Card>
                    <CardContent className="p-0 divide-y divide-border">
                      {CATEGORY_LIST.map(({ key, label, Icon }) => (
                        <div key={key} className="flex items-center justify-between gap-4 px-5 py-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon size={13} className="text-muted-foreground shrink-0" />
                            <span className="text-sm text-foreground truncate">{label}</span>
                          </div>
                          <div className="flex gap-1.5 shrink-0">
                            {(["auto", "ask", "block"] as CategoryMode[]).map(m => (
                              <ModePill key={m} mode={m} active={categories[key] === m} onClick={() => setCat(key, m)} />
                            ))}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <GroupLabel>Brand preferences</GroupLabel>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Prefer */}
                    <Card>
                      <CardHeader className="px-5 py-4 border-b border-border">
                        <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                          <Check size={12} /> Preferred brands
                        </p>
                      </CardHeader>
                      <CardContent className="p-3 space-y-2">
                        {preferBrands.map(brand => (
                          <div key={brand} className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/50 border border-border">
                            <span className="text-xs font-medium text-foreground">{brand}</span>
                            <button onClick={() => setPreferBrands(p => p.filter(b => b !== brand))}
                              className="text-muted-foreground hover:text-foreground transition-colors">
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                        <div className="flex gap-2 pt-1">
                          <Input placeholder="Add brand…" value={newPrefer} onChange={e => setNewPrefer(e.target.value)}
                            onKeyDown={e => { if (e.key === "Enter" && newPrefer.trim()) { setPreferBrands(p => [...p, newPrefer.trim()]); setNewPrefer(""); } }}
                            className="h-8 text-xs" />
                          <Button size="sm" onClick={() => { if (newPrefer.trim()) { setPreferBrands(p => [...p, newPrefer.trim()]); setNewPrefer(""); } }}
                            className="h-8 px-2.5 bg-foreground text-background hover:bg-foreground/90">
                            <Plus size={13} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Avoid */}
                    <Card>
                      <CardHeader className="px-5 py-4 border-b border-border">
                        <p className="text-xs font-semibold text-rose-600 flex items-center gap-1.5">
                          <X size={12} /> Brands to avoid
                        </p>
                      </CardHeader>
                      <CardContent className="p-3 space-y-2">
                        {avoidBrands.map(brand => (
                          <div key={brand} className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/50 border border-border">
                            <span className="text-xs font-medium text-foreground">{brand}</span>
                            <button onClick={() => setAvoidBrands(p => p.filter(b => b !== brand))}
                              className="text-muted-foreground hover:text-foreground transition-colors">
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                        <div className="flex gap-2 pt-1">
                          <Input placeholder="Add brand…" value={newAvoid} onChange={e => setNewAvoid(e.target.value)}
                            onKeyDown={e => { if (e.key === "Enter" && newAvoid.trim()) { setAvoidBrands(p => [...p, newAvoid.trim()]); setNewAvoid(""); } }}
                            className="h-8 text-xs" />
                          <Button size="sm" onClick={() => { if (newAvoid.trim()) { setAvoidBrands(p => [...p, newAvoid.trim()]); setNewAvoid(""); } }}
                            className="h-8 px-2.5 bg-foreground text-background hover:bg-foreground/90">
                            <Plus size={13} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </>
            )}

            {/* ── LIMITS ─────────────────────────────────────────────────── */}
            {advancedTab === "limits" && (
              <>
                <div>
                  <GroupLabel>Monthly caps by category</GroupLabel>
                  <Card>
                    <CardContent className="p-0 divide-y divide-border">
                      {Object.entries(caps).map(([cat, cap]) => (
                        <div key={cat} className="flex items-center justify-between gap-4 px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <StatusPill mode={categories[cat] || "ask"} />
                            <span className="text-sm text-foreground capitalize">{cat}</span>
                          </div>
                          <div className="flex items-center rounded-lg border border-border overflow-hidden shrink-0">
                            <span className="px-2.5 text-xs text-muted-foreground border-r border-border py-1.5">$</span>
                            <input type="number" value={cap} min={0}
                              onChange={e => setCaps(p => ({ ...p, [cat]: +e.target.value }))}
                              className="w-20 text-xs py-1.5 px-2 text-foreground bg-background focus:outline-none" />
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <GroupLabel>Risk triggers</GroupLabel>
                  <Card>
                    <CardContent className="p-0 divide-y divide-border">
                      {[
                        { key: "newMerchant",     label: "New or unfamiliar merchant",        desc: "First time buying from this store"                  },
                        { key: "foreignCurrency", label: "Foreign currency transaction",       desc: "Purchase outside your home country"                 },
                        { key: "subscriptions",   label: "Subscription or recurring charge",   desc: "Any auto-renewing purchase"                         },
                        { key: "doublePrice",     label: "Price is 2× your typical amount",    desc: "Significantly above your usual spend per category"  },
                        { key: "newCard",         label: "Require approval for a new card",    desc: "Before the agent uses a card for the first time"    },
                      ].map(({ key, label, desc }, i, arr) => (
                        <SettingRow key={key} label={label} description={desc} last={i === arr.length - 1}>
                          <Switch
                            checked={risks[key as keyof typeof risks]}
                            onCheckedChange={v => setRisks(p => ({ ...p, [key]: v }))}
                            className="data-[state=checked]:bg-primary"
                          />
                        </SettingRow>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </>
            )}

            {/* ── PAYMENT ────────────────────────────────────────────────── */}
            {advancedTab === "payment" && (
              <div>
                <GroupLabel>Card routing</GroupLabel>
                <div className="space-y-3">
                  {cards.map(card => (
                    <Card key={card.id}>
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-7 rounded-md flex items-center justify-center ${
                              card.type === "visa" ? "bg-blue-600" : "bg-violet-600"
                            }`}>
                              <CreditCard size={12} className="text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{card.name}</p>
                              <p className="text-xs text-muted-foreground">···· {card.last4}</p>
                            </div>
                          </div>
                          <Switch checked={card.enabled} onCheckedChange={() => toggleCard(card.id)}
                            className="data-[state=checked]:bg-primary" />
                        </div>
                        {card.enabled && (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-border">
                            {[
                              { label: "Use for",       options: ["All categories", "Groceries & Dining", "Travel only"]   },
                              { label: "Max/purchase",  options: ["$50", "$100", "$200", "No limit"]                       },
                              { label: "Max/day",       options: ["$100", "$200", "$500", "No limit"]                      },
                            ].map(({ label, options }) => (
                              <div key={label}>
                                <p className="text-xs font-medium text-muted-foreground mb-1.5">{label}</p>
                                <Select defaultValue={options[0]}>
                                  <SelectTrigger className="h-8 text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {options.map(o => <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>)}
                                  </SelectContent>
                                </Select>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}

                  <div className="flex items-start gap-2.5 rounded-xl border border-border bg-muted/30 px-4 py-3">
                    <Info size={13} className="text-muted-foreground mt-0.5 shrink-0" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      <span className="font-medium text-foreground">Tip:</span> Chase Sapphire earns 3× points on dining &amp; travel. Routing those categories here maximizes your rewards.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ── PRIVACY ────────────────────────────────────────────────── */}
            {advancedTab === "privacy" && (
              <div>
                <GroupLabel>Data sources</GroupLabel>
                <Card>
                  <CardContent className="p-0 divide-y divide-border">
                    {[
                      { key: "purchaseHistory", Icon: Clock,     label: "Read purchase history",       desc: "Helps understand your spending patterns over time"         },
                      { key: "emailReceipts",   Icon: Mail,      label: "Read email receipts",         desc: "Receipts only — no personal emails are read"              },
                      { key: "loyalty",         Icon: Award,     label: "Use loyalty program data",    desc: "Maximize points and rewards from your memberships"         },
                      { key: "learning",        Icon: RefreshCw, label: "Learn from my overrides",     desc: "Update rules automatically when you correct agent choices" },
                    ].map(({ key, Icon, label, desc }, i, arr) => (
                      <div key={key} className={`flex items-center justify-between gap-6 px-5 py-4 ${i < arr.length - 1 ? "" : ""}`}>
                        <div className="flex items-start gap-3 min-w-0">
                          <Icon size={14} className="text-muted-foreground mt-0.5 shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-foreground">{label}</p>
                            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
                          </div>
                        </div>
                        <Switch
                          checked={privacy[key as keyof typeof privacy]}
                          onCheckedChange={v => setPrivacy(p => ({ ...p, [key]: v }))}
                          className="data-[state=checked]:bg-primary shrink-0"
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <div className="mt-4 px-1">
                  <button onClick={() => {}}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors">
                    <RefreshCw size={12} /> Reset all learned preferences
                  </button>
                </div>
              </div>
            )}

            {/* ── ACTIVITY ───────────────────────────────────────────────── */}
            {advancedTab === "activity" && (
              <div>
                <div className="flex items-center justify-between mb-3 px-1">
                  <GroupLabel>Recent activity</GroupLabel>
                  <div className="flex items-center gap-1.5 mb-3">
                    {["All", "Auto", "Asked", "Blocked"].map(f => (
                      <button key={f}
                        className="px-2.5 py-1 text-xs rounded-md border border-border text-muted-foreground hover:bg-muted transition-colors">
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <Card>
                  <CardContent className="p-0 divide-y divide-border">
                    {ACTIVITY_LOG.map(item => (
                      <div key={item.id}>
                        <button
                          className="w-full flex items-start gap-4 px-5 py-4 hover:bg-muted/40 transition-colors text-left"
                          onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                        >
                          <div className="mt-0.5 shrink-0">
                            {item.mode === "auto"  && <CheckCircle size={15} className="text-emerald-500" />}
                            {item.mode === "ask"   && <HelpCircle  size={15} className="text-amber-500"   />}
                            {item.mode === "block" && <XCircle     size={15} className="text-rose-500"    />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-sm font-medium text-foreground truncate">{item.merchant}</span>
                              <StatusPill mode={item.mode} />
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                              <span>{item.time}</span>
                              <span>·</span>
                              <span className="capitalize">{item.category}</span>
                              {item.card !== "—" && <><span>·</span><span>{item.card}</span></>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`text-sm font-semibold tabular-nums ${item.mode === "block" ? "text-muted-foreground line-through" : "text-foreground"}`}>
                              ${item.amount.toFixed(2)}
                            </span>
                            {expandedId === item.id ? <ChevronUp size={13} className="text-muted-foreground" /> : <ChevronDown size={13} className="text-muted-foreground" />}
                          </div>
                        </button>

                        {expandedId === item.id && (
                          <div className="px-5 pb-4 ml-10 space-y-3">
                            <div className="rounded-lg border border-border bg-muted/30 p-3.5">
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Why this decision</p>
                              <p className="text-xs text-foreground leading-relaxed">{item.rule}</p>
                              {item.alternatives.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-border">
                                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Alternatives considered</p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {item.alternatives.map(alt => (
                                      <span key={alt} className="text-xs px-2 py-0.5 rounded-md bg-background border border-border text-muted-foreground">
                                        {alt}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button className="text-xs px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-rose-600 hover:border-rose-200 transition-colors">
                                Never buy this again
                              </button>
                              <button className="text-xs px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-emerald-600 hover:border-emerald-200 transition-colors">
                                Always okay
                              </button>
                              <button className="text-xs px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors">
                                Lower limit
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AgentSettingsPage;
