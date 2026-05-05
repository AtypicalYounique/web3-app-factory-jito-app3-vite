import React, { useMemo, useState, useRef } from "react";
import "./styles.css";
import { BRAND } from "./brand";

const BANK = [
  // ── BEGINNER ── 5 fun · 5 product · 2 industry
  { id:"b1", topic:"company-fun-facts", level:"beginner",
    q:"Who are the two co-founders of Jito Labs?",
    options:["Lucas Bruder and Zano Sherwani","Anatoly Yakovenko and Raj Gokal","Mert Mumtaz and Soumya Mehta","Stani Kulechov and Jordan Lazaro"],
    answer:0,
    explain:"Lucas Bruder (CEO) and Zano Sherwani (CTO) co-founded Jito Labs. Sherwani's LinkedIn lists his start at JITO Labs in September 2021." },
  { id:"b2", topic:"company-fun-facts", level:"beginner",
    q:"In which year did Jito Labs close its seed round?",
    options:["The seed round closed in 2019","The seed round closed in 2020","The seed round closed in 2021","The seed round closed in 2023"],
    answer:2,
    explain:"Per CypherHunter, Jito Labs raised a $2.1M seed round on December 3, 2021, the year the company was founded." },
  { id:"b3", topic:"company-fun-facts", level:"beginner",
    q:"Per the Series A press release, where was Jito Labs based?",
    options:["Based in New York, New York, United States","Based in San Francisco, California, USA","Based in Austin, Texas, in the United States","Based in Singapore in Southeast Asia, Asia"],
    answer:2,
    explain:"The August 2022 Series A press release on Chainwire is datelined Austin, TX, United States." },
  { id:"b4", topic:"company-fun-facts", level:"beginner",
    q:"What is the primary domain used by Jito Labs documentation?",
    options:["The primary docs domain is jito.wtf","The primary docs domain is jito.com","The primary docs domain is jito.dev","The primary docs domain is jito.org"],
    answer:0,
    explain:"Jito Labs and the Jito Foundation publish their documentation under jito.wtf (e.g. docs.jito.wtf), as listed on their LinkedIn and docs site." },
  { id:"b5", topic:"company-fun-facts", level:"beginner",
    q:"What is the name of the Jito governance token?",
    options:["The governance token's ticker is JTO","The governance token's ticker is JIT","The governance token's ticker is JLP","The governance token's ticker is JSO"],
    answer:0,
    explain:"JTO is the Jito Foundation's governance token, launched via airdrop on December 7, 2023, on Solana." },
  { id:"b6", topic:"company-products", level:"beginner",
    q:"What is JitoSOL?",
    options:["A Solana governance voting receipt token","A Solana liquid staking token from Jito","A wrapped SOL bridge representation token","A perpetuals collateral token from a DEX"],
    answer:1,
    explain:"JitoSOL is the Jito Network's Solana liquid staking token: staked SOL with MEV-boosted yield via a public stake pool." },
  { id:"b7", topic:"company-products", level:"beginner",
    q:"What are 'Jito Bundles'?",
    options:["A set of NFTs auctioned by Jito validators","Sets of Solana txns executed atomically","A subscription package for RPC node access","A bonded set of validator stake delegations"],
    answer:1,
    explain:"Bundles are sequentially and atomically executed sets of Solana transactions, used heavily by searchers via Jito's Block Engine." },
  { id:"b8", topic:"company-products", level:"beginner",
    q:"What does Jito's Block Engine primarily do?",
    options:["Indexes Solana program accounts for explorers","Issues SPL stablecoins from staked SOL pools","Picks searcher bundles and streams to vals.","Runs a zk prover compressing Solana state"],
    answer:2,
    explain:"The Block Engine simulates incoming searcher bundles, picks the best, and streams them to Jito-Solana validators for inclusion." },
  { id:"b9", topic:"company-products", level:"beginner",
    q:"What is StakeNet in the Jito ecosystem?",
    options:["A bridge moving JitoSOL across L2 networks","A high-throughput Layer 2 scaler on Solana","An on-chain delegation framework for JitoSOL","A wallet brand promoted via Jito Foundation"],
    answer:2,
    explain:"StakeNet is Jito's on-chain delegation framework, used to allocate stake to validators in the JitoSOL pool." },
  { id:"b10", topic:"company-products", level:"beginner",
    q:"What is Jito Restaking?",
    options:["A native Solana staking program for validators","A protocol using staked assets for added security","A bridge moving staked SOL over to Ethereum","A token unlock and vesting plan for JTO holders"],
    answer:1,
    explain:"Jito Restaking lets staked assets be used as collateral securing additional networks (NCNs) on Solana, a Solana analog to EigenLayer." },
  { id:"b11", topic:"industry", level:"beginner",
    q:"What does 'MEV' generally refer to on Solana?",
    options:["Multi-execution validator client throughput","Maximal Extractable Value from txn ordering","Mainnet error variance across Solana epochs","Mining-energy variance for validator hardware"],
    answer:1,
    explain:"MEV stands for Maximal Extractable Value, the surplus available from including or ordering transactions in a block." },
  { id:"b12", topic:"industry", level:"beginner",
    q:"What is a 'liquid staking token' in plain terms?",
    options:["A token earning yield via centralized lending","A token tracking staked assets and stays liquid","A token that wraps Bitcoin onto Solana for use","A token issued only to professional validators"],
    answer:1,
    explain:"A liquid staking token represents staked assets but remains transferable and usable in DeFi, instead of being locked at the validator." },

  // ── INTERMEDIATE ── 5 fun · 5 product · 2 industry
  { id:"i1", topic:"company-fun-facts", level:"intermediate",
    q:"Who co-led Jito Labs' August 2022 Series A round?",
    options:["The round was co-led by a16z crypto and Paradigm","The round was co-led by Sequoia Cap. and Coinbase","Co-led by Multicoin Capital and Framework Vent.","The round was co-led by Tiger Global and Pantera"],
    answer:2,
    explain:"The Series A was co-led by Multicoin Capital and Framework Ventures, per Jito Labs' August 11, 2022 press release on Chainwire." },
  { id:"i2", topic:"company-fun-facts", level:"intermediate",
    q:"How large was the Jito Labs Series A round?",
    options:["The Series A raised about 5 million dollars","The Series A raised about 10 million dollars","The Series A raised about 25 million dollars","The Series A raised about 100 million dollars"],
    answer:1,
    explain:"Jito Labs raised a $10M Series A, bringing total financing to roughly $12.1M including the prior $2.1M seed." },
  { id:"i3", topic:"company-fun-facts", level:"intermediate",
    q:"When did the JTO token airdrop go live?",
    options:["The JTO airdrop went live in December 2022","The JTO airdrop went live in March 2023 mid","The JTO airdrop went live in December 2023","The JTO airdrop went live in March 2024 first"],
    answer:2,
    explain:"The JTO airdrop went live on December 7, 2023 at 4pm UTC, with 90M tokens distributed in the initial tranche." },
  { id:"i4", topic:"company-fun-facts", level:"intermediate",
    q:"How many JTO tokens were in the initial airdrop tranche?",
    options:["About ten million JTO tokens were distributed","About ninety million JTO tokens were distributed","Around five hundred million JTO tokens issued","Around one billion JTO tokens went out at once"],
    answer:1,
    explain:"Roughly 90 million JTO (out of a 1 billion total supply) was distributed in the December 2023 community airdrop tranche." },
  { id:"i5", topic:"company-fun-facts", level:"intermediate",
    q:"Per public statements, what fraction of Solana validators run Jito's client?",
    options:["Public posts cite roughly 10% of active vals","Public posts cite roughly 40% of active vals","Public posts cite roughly 70% of active vals","Public posts cite roughly 97% of active vals"],
    answer:3,
    explain:"Public statements cite Jito's software running on roughly 97% of Solana's active validators by stake-weighted adoption." },
  { id:"i6", topic:"company-products", level:"intermediate",
    q:"What does Jito's Relayer do for incoming transactions?",
    options:["Mints JTO tokens for active stake delegations","Briefly delays user txns for bundle formation","Issues USDC rewards on behalf of validators","Stores searcher private keys for bundle signing"],
    answer:1,
    explain:"The Relayer briefly delays incoming user transactions (about 200ms) so searchers have a window to package them into bundles." },
  { id:"i7", topic:"company-products", level:"intermediate",
    q:"Which entity publishes the Jito-Solana validator client?",
    options:["Anza, the spinout from Solana Foundation team","Jito Labs, the team behind the Jito MEV stack","Helius, the Solana RPC and developer infra firm","Solana Foundation, the non-profit running Solana"],
    answer:1,
    explain:"Jito Labs publishes the Jito-Solana validator client, an MEV-aware fork of the Solana validator." },
  { id:"i8", topic:"company-products", level:"intermediate",
    q:"What does Jito's Searcher API let users do?",
    options:["Read searcher emails to detect MEV opportunity","Submit bundles programmatically to Block Engine","Mint NFT receipts for past Jito bundle inclusions","Issue USDC stablecoins backed by tip revenue pool"],
    answer:1,
    explain:"The Searcher API (with public examples in jito-labs/searcher-examples) lets searchers submit bundles programmatically to the Block Engine." },
  { id:"i9", topic:"company-products", level:"intermediate",
    q:"Per public TipRouter docs, what fee does TipRouter take on tip revenue?",
    options:["Approximately one half of one percent of revenue","Approximately one percent of total tip revenue","Approximately three percent of total tip revenue","Approximately ten percent of total tip revenue"],
    answer:2,
    explain:"Public TipRouter docs describe a 3% fee on tip revenue, with portions distributed to vault operators and other participants." },
  { id:"i10", topic:"company-products", level:"intermediate",
    q:"How many mainnet Block Engine regional endpoints does Jito list?",
    options:["About three regional Block Engine endpoints","About five regional Block Engine endpoints","About eight regional Block Engine endpoints","About fifteen regional Block Engine endpoints"],
    answer:2,
    explain:"docs.jito.wtf lists eight mainnet Block Engine regions: Amsterdam, Dublin, Frankfurt, London, New York, Salt Lake City, Singapore, Tokyo." },
  { id:"i11", topic:"industry", level:"intermediate",
    q:"What is a 'searcher' in the context of Solana MEV?",
    options:["A retail user looking for hot new tokens to buy","An entity submitting bundles to capture MEV val.","An auditor reviewing validator client releases","A foundation grantee funded for dev tooling work"],
    answer:1,
    explain:"Searchers are entities that submit bundles to capture MEV opportunities, paying tips to validators when bundles land." },
  { id:"i12", topic:"industry", level:"intermediate",
    q:"What does 'restaking' add for a liquid staking token holder?",
    options:["A small amount of free Bitcoin via an airdrop","Added yield by extending stake to other networks","Total removal of slashing and credit-related risk","Access to a wallet app and a custom browser ext."],
    answer:1,
    explain:"Restaking offers extra yield by extending staked collateral to secure additional networks, at the cost of additional risk surface." },

  // ── EXPERT ── 4 fun · 4 product · 4 industry
  { id:"e1", topic:"company-fun-facts", level:"expert",
    q:"Per public sources, JitoSOL has stood out among Solana LSTs as which?",
    options:["The smallest LST measured by total value locked","The largest LST on Solana by total value locked","A non-LST token that does not earn staking yield","A wrapped Bitcoin variant on the Solana network"],
    answer:1,
    explain:"As of mid-2025, JitoSOL was the largest LST on Solana, with roughly 17.5M SOL (about $2.5B TVL) reported." },
  { id:"e2", topic:"company-fun-facts", level:"expert",
    q:"Per CryptoRank's 2024 reporting, Jito's annualized MEV revenue reached?",
    options:["Approximately 5 million USD on annualized base","Approximately 50 million USD on annualized base","Approximately 500 million USD on annualized base","Approximately 5 billion USD on annualized basis"],
    answer:2,
    explain:"April 2024 CryptoRank coverage cited Jito Labs hitting roughly $500M in annualized MEV revenue captured through the Block Engine." },
  { id:"e3", topic:"company-fun-facts", level:"expert",
    q:"What is BAM (Block Assembly Marketplace) in Jito's roadmap?",
    options:["A liquid staking pool competitor for native SOL","A TEE-based txn scheduling product on Solana","A meme coin launchpad run by Jito Foundation","A new Layer 2 rollup proposed by Jito Labs team"],
    answer:1,
    explain:"BAM is Jito's next-gen transaction scheduling product using TEE technology to separate transaction ordering from block validation." },
  { id:"e4", topic:"company-fun-facts", level:"expert",
    q:"Andrew Thurman, a Jito Foundation contributor, proposed what in 2025?",
    options:["A new Solana validator client written all in Rust","A buyback model for the JTO governance token sys","A complete shutdown of the Block Engine entirely","A merger of Jito Labs with the Helius RPC company"],
    answer:1,
    explain:"In March 2025, Andrew Thurman proposed a new JTO tokenomics model including a potential token buyback plan, per panewslab coverage." },
  { id:"e5", topic:"company-products", level:"expert",
    q:"Why did Jito remove the public mempool from Block Engine flow?",
    options:["Validators voted to discourage sandwich attacks","A US regulator ordered the public mempool removal","The mempool fee market collapsed and went to zero","Solana Foundation banned all third-party mempools"],
    answer:0,
    explain:"Jito removed the mempool with broad validator support to discourage sandwich-style MEV that hurt user UX, accepting reduced revenue." },
  { id:"e6", topic:"company-products", level:"expert",
    q:"Why does Block Engine briefly delay txns for around 200ms?",
    options:["Random jitter introduced as anti-spam protection","To allow searcher bundle formation around user","To reduce Solana priority-fee gas costs at scale","An upstream validator constraint limits forwarding"],
    answer:1,
    explain:"The 200ms relayer delay creates a window in which searchers can package incoming user txns into bundles before forwarding." },
  { id:"e7", topic:"company-products", level:"expert",
    q:"In TipRouter's published distribution, what share goes to vault operators?",
    options:["The full 100% of incoming MEV tip revenue base","Around 0.15% of tip revenue, as one piece of dist","Only governance tokens, never SOL-based rewards","Nothing at all, vault operators do not earn tips"],
    answer:1,
    explain:"Public TipRouter materials describe roughly 0.15% of tip revenue flowing to SOL vault operators as one piece of the distribution." },
  { id:"e8", topic:"company-products", level:"expert",
    q:"Why is StakeNet relevant when discussing JitoSOL operator quality?",
    options:["StakeNet itself runs validators in the JitoSOL pool","It provides on-chain logic allocating stake to ops","StakeNet issues NFT certificates for top validators","StakeNet audits centralized exchanges custodying SOL"],
    answer:1,
    explain:"StakeNet is the on-chain delegation framework that drives stake allocation, the lens by which operator quality maps to pool yield." },
  { id:"e9", topic:"industry", level:"expert",
    q:"How is per-NCN risk best described relative to base staking risk?",
    options:["Per-NCN risk equals base Solana staking risk fully","Per-NCN risk stacks additively on base staking ris","Per-NCN risk is structurally lower than base staki","Per-NCN risk is illegal in most major jurisdictions"],
    answer:1,
    explain:"NCN risk is additive on top of base staking: each opted-into NCN carries its own contract, operator, and slashing-equivalent risks." },
  { id:"e10", topic:"industry", level:"expert",
    q:"Why does validator hardware quality matter for Solana stake pools?",
    options:["Dedicated hardware is required for foundation grants","Skip rate from hardware quality affects pool yield","Tax treatment of validator income depends on hardware","Solana rules require bare metal and disallow any cloud"],
    answer:1,
    explain:"Skip rate depends heavily on single-thread CPU, NVMe IOPS, and network quality, and skip rate is a primary driver of pool yield and inclusion." },
  { id:"e11", topic:"industry", level:"expert",
    q:"In what way is MEV uplift over base validator yield variable?",
    options:["It isn't variable, MEV adds a fixed rate per epoch","It depends on network activity, vol, and engine flow","It is always exactly five percent on top of yield","It is set quarterly via JTO governance vote on chain"],
    answer:1,
    explain:"MEV revenue is a function of network activity and trading flow. Calm weeks compress the spread, volatile weeks expand it." },
  { id:"e12", topic:"industry", level:"expert",
    q:"What is the dominant operational risk for a fund holding a Solana LST?",
    options:["Pure spot price volatility relative to native SOL","Secondary market liquidity at the fund's exit size","Solana mainnet block-size limits on stake-pool growth","DNS issues affecting public-facing dashboards alone"],
    answer:1,
    explain:"At fund size, the dominant operational risk is exiting the LST into SOL on a stress day at acceptable slippage, not the headline yield." },
];

const TOPIC_LABEL = {
  "company-fun-facts": "Jito company & culture",
  "company-products": "Jito products & stack",
  "industry": "Solana & MEV fundamentals",
};

function shuffle(a) { const x = [...a]; for (let i = x.length-1; i>0; i--) { const j = Math.floor(Math.random()*(i+1)); [x[i],x[j]]=[x[j],x[i]]; } return x; }
function sample(a, n) { return shuffle(a).slice(0, n); }

// shuffleQuestions: per-session re-positioning of correct answer to fight position bias.
// Uses existing schema field `answer` (numeric idx). Anti-cluster: avoid same position twice
// in a row (last-2 lookback). Balance: prefer least-used position so far.
// Apply once at quiz init, NOT per render.
function shuffleQuestions(questions) {
  const positionCounts = [0, 0, 0, 0]; // A, B, C, D
  const recentPositions = [];
  return questions.map(q => {
    const correctText = q.options[q.answer];
    const wrongTexts = q.options
      .filter((_, i) => i !== q.answer)
      .sort(() => Math.random() - 0.5);
    const blocked = recentPositions.slice(-2);
    const candidates = [0, 1, 2, 3]
      .filter(p => !blocked.includes(p))
      .sort((a, b) => positionCounts[a] - positionCounts[b] || Math.random() - 0.5);
    const targetPos = candidates.length > 0
      ? candidates[0]
      : [0, 1, 2, 3].sort((a, b) => positionCounts[a] - positionCounts[b] || Math.random() - 0.5)[0];
    positionCounts[targetPos]++;
    recentPositions.push(targetPos);
    const newOptions = [...wrongTexts];
    newOptions.splice(targetPos, 0, correctText);
    return { ...q, options: newOptions, answer: targetPos };
  });
}

function pickQuestions(level, n) {
  if (level === "mixed") {
    const b = BANK.filter(q => q.level === "beginner");
    const i = BANK.filter(q => q.level === "intermediate");
    const e = BANK.filter(q => q.level === "expert");
    const each = Math.ceil(n / 3);
    return shuffleQuestions(shuffle([...sample(b, each), ...sample(i, each), ...sample(e, n - 2*each)]).slice(0, n));
  }
  const pool = BANK.filter(q => q.level === level);
  return shuffleQuestions(sample(pool, Math.min(n, pool.length)));
}

function App() {
  const [length, setLength] = useState(10);
  const [level, setLevel] = useState("beginner");
  const [stage, setStage] = useState("setup");
  const [qs, setQs] = useState([]);
  const [idx, setIdx] = useState(0);
  const [picks, setPicks] = useState({});
  const [revealed, setRevealed] = useState({});
  const [toast, setToast] = useState(false);

  const start = () => {
    const lvl = length === 30 ? (level === "expert" ? "expert" : "mixed") : level;
    const set = pickQuestions(lvl, length);
    setQs(set); setIdx(0); setPicks({}); setRevealed({}); setStage("run");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const choose = (qid, ci) => {
    if (revealed[qid] !== undefined) return;
    setPicks(p => ({ ...p, [qid]: ci }));
    setRevealed(r => ({ ...r, [qid]: ci }));
  };
  const next = () => { if (idx + 1 < qs.length) setIdx(idx + 1); else setStage("done"); };

  const correctCount = useMemo(() => qs.reduce((acc,q)=> acc + (picks[q.id] === q.answer ? 1 : 0), 0), [qs, picks]);
  const topicBreakdown = useMemo(() => {
    const m = {};
    for (const q of qs) {
      const t = q.topic;
      if (!m[t]) m[t] = { correct: 0, total: 0 };
      m[t].total++;
      if (picks[q.id] === q.answer) m[t].correct++;
    }
    return m;
  }, [qs, picks]);

  const summary = useMemo(() => {
    const lines = [];
    lines.push("Jito Network Quiz: JitoSOL, MEV & Solana Restaking");
    lines.push(`Length: ${qs.length}, Level: ${length === 30 && level !== 'expert' ? 'mixed' : level}`);
    lines.push(`Score: ${correctCount} / ${qs.length}`);
    lines.push("");
    lines.push("Topic breakdown:");
    Object.entries(topicBreakdown).forEach(([t, v]) => {
      lines.push(`  • ${TOPIC_LABEL[t] || t}: ${v.correct}/${v.total}`);
    });
    return lines.join("\n");
  }, [qs.length, correctCount, topicBreakdown, level, length]);

  const onCopy = async () => {
    try { await navigator.clipboard.writeText(summary); setToast(true); setTimeout(()=>setToast(false), 1600); }
    catch { const ta=document.createElement("textarea"); ta.value=summary; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta); setToast(true); setTimeout(()=>setToast(false),1600); }
  };

  const restart = () => { setStage("setup"); setQs([]); setIdx(0); setPicks({}); setRevealed({}); window.scrollTo({top:0, behavior:"smooth"}); };

  const Pills = ({ value, set, options }: { value: string; set: (v: string) => void; options: string[] }) => (
    <div className="pillgroup">
      {options.map(o => (
        <button key={o.value} className={"pill " + (value === o.value ? "active" : "")} onClick={() => set(o.value)} type="button">{o.label}</button>
      ))}
    <footer className="attribution">{BRAND.attribution}</footer>
    </div>
  );

  if (stage === "setup") {
    return (
      <div className="wrap">
      <header className="brand-bar">
        <a
          href={BRAND.homepage}
          target="_blank"
          rel="noopener noreferrer"
          className="brand-logo"
          aria-label={BRAND.company}
          dangerouslySetInnerHTML={{ __html: BRAND.logoSvg }}
        />
        <span className="brand-chip">Independent tool</span>
      </header>
        <div className="eyebrow">A quiz · Jito · For DevRel, partners, community education</div>
        <h1>Jito Network Quiz: JitoSOL, MEV & Solana Restaking</h1>
        <p className="lede">A friendly check on how well you understand the Jito stack: JitoSOL, the Block Engine, Bundles, StakeNet, Jito Restaking, NCNs, and TipRouter, drawn from publicly available sources.</p>

        <div className="card">
          <label>Length</label>
          <Pills value={length} set={setLength} options={[{value:10,label:"10 questions"},{value:20,label:"20 questions"},{value:30,label:"30 questions"}]} />
          <div style={{ height: 14 }} />
          <label>Difficulty</label>
          <Pills value={level} set={setLevel} options={[{value:"beginner",label:"Beginner"},{value:"intermediate",label:"Intermediate"},{value:"expert",label:"Expert"}]} />
          <div style={{ marginTop: 14 }}><button className="btn" onClick={start}>Start quiz</button></div>
        </div>

        <div className="footer-note">Public sources: Jito and Jito-Labs documentation, Helius blog (Solana MEV: An Introduction), Kiln (Discover Jito Restaking), Pier Two (TipRouter), QuickNode (Jito Bundles), OKX (Jito Stake Pool overview), Phemex (JITOSOL guide). No data is collected or stored.</div>
      <footer className="attribution">{BRAND.attribution}</footer>
      </div>
    );
  }

  if (stage === "run") {
    const q = qs[idx];
    const chosen = picks[q.id];
    const reveal = revealed[q.id] !== undefined;
    return (
      <div className="wrap">
      <header className="brand-bar">
        <a
          href={BRAND.homepage}
          target="_blank"
          rel="noopener noreferrer"
          className="brand-logo"
          aria-label={BRAND.company}
          dangerouslySetInnerHTML={{ __html: BRAND.logoSvg }}
        />
        <span className="brand-chip">Independent tool</span>
      </header>
        <div className="progress"><div style={{ width: `${((idx)/qs.length)*100}%` }} /></div>
        <div className="eyebrow">Question {idx+1} of {qs.length} · {TOPIC_LABEL[q.topic]} · {q.level}</div>
        <div className="card qcard">
          <h2 style={{ fontSize: 18, lineHeight: 1.4, marginBottom: 14 }}>{q.q}</h2>
          {q.options.map((opt, i) => {
            let cls = "opt";
            if (reveal) {
              if (i === q.answer) cls += " correct";
              else if (i === chosen) cls += " wrong";
            } else if (i === chosen) cls += " picked";
            return <button key={i} className={cls} onClick={() => choose(q.id, i)}>{String.fromCharCode(65+i)}. {opt}</button>;
          })}
          {reveal && <div className="explain"><strong>{chosen === q.answer ? "Correct." : "Not quite."}</strong> {q.explain}</div>}
          {reveal && <div style={{ marginTop: 14 }}><button className="btn" onClick={next}>{idx + 1 < qs.length ? "Next question" : "See results"}</button></div>}
        </div>
        <div style={{ display:"flex", gap: 10 }}><button className="btn secondary" onClick={restart}>Restart</button></div>
      <footer className="attribution">{BRAND.attribution}</footer>
      </div>
    );
  }

  const pct = Math.round((correctCount / qs.length) * 100);
  const headline =
    pct >= 90 ? "Genuinely sharp on the Jito stack." :
    pct >= 70 ? "Solid working understanding." :
    pct >= 50 ? "Reasonable grasp. Some good rabbit holes ahead." :
    "Plenty of room to learn. This stuff rewards curiosity.";

  const topicsSorted = Object.entries(topicBreakdown).map(([t, v]) => ({ t, ...v, pct: v.correct / v.total }));
  topicsSorted.sort((a,b) => b.pct - a.pct);
  const strong = topicsSorted.slice(0, 2).filter(x => x.pct >= 0.5).map(x => TOPIC_LABEL[x.t] || x.t);
  const weak = topicsSorted.slice(-2).filter(x => x.pct < 0.7).map(x => TOPIC_LABEL[x.t] || x.t);

  return (
    <div className="wrap">
      <header className="brand-bar">
        <a
          href={BRAND.homepage}
          target="_blank"
          rel="noopener noreferrer"
          className="brand-logo"
          aria-label={BRAND.company}
          dangerouslySetInnerHTML={{ __html: BRAND.logoSvg }}
        />
        <span className="brand-chip">Independent tool</span>
      </header>
      <div className="eyebrow">Results</div>
      <h1>{correctCount} / {qs.length} correct · {pct}%</h1>
      <p className="lede">{headline}</p>
      <div className="card">
        <h2>Topic breakdown</h2>
        {Object.entries(topicBreakdown).map(([t, v]) => (
          <div className="topic-row" key={t}>
            <span style={{ color: "#cdd3df" }}>{TOPIC_LABEL[t] || t}</span>
            <span style={{ color: "#fff", fontVariantNumeric: "tabular-nums" }}>{v.correct}/{v.total}</span>
          </div>
        ))}
      </div>
      <div className="card">
        <h2>What you understand well</h2>
        <div style={{ color: "#cdd3df", fontSize: 14, lineHeight: 1.55 }}>{strong.length ? strong.join(" · ") : "Nothing dominant yet. Try a longer quiz at a higher level."}</div>
      </div>
      <div className="card">
        <h2>What's worth learning next</h2>
        <div style={{ color: "#cdd3df", fontSize: 14, lineHeight: 1.55 }}>{weak.length ? weak.join(" · ") : "All topics roughly even. The expert tier will pressure-test the edges."}</div>
      </div>
      <div className="card">
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn" onClick={onCopy}>Copy results</button>
          <button className="btn secondary" onClick={restart}>Take another quiz</button>
        </div>
      </div>
      <div className="footer-note">Jito-specific detail comes from public Jito documentation and reputable third-party explainers. No private data, no API keys.</div>
      <div className={"toast " + (toast ? "show" : "")}>Results copied to clipboard</div>
    <footer className="attribution">{BRAND.attribution}</footer>
    </div>
  );
}

export default App;
