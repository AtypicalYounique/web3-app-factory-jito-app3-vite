import React, { useMemo, useState, useRef } from "react";
import "./styles.css";
import { BRAND } from "./brand";

const BANK = [
  // ── BEGINNER ──
  { id:"b1", topic:"company", level:"beginner",
    q:"What is JitoSOL?",
    options:["A Solana governance voting receipt token","A Solana liquid staking token from Jito Network","A wrapped SOL bridge representation token","A perpetuals collateral token from a Jito DEX"],
    answer:1,
    explain:"JitoSOL is the Jito Network's Solana liquid staking token: staked SOL with MEV-boosted yield, public stake pool with around 160 validators." },
  { id:"b2", topic:"company", level:"beginner",
    q:"Which chain is Jito Network primarily built on?",
    options:["Bitcoin base layer","Ethereum mainnet","Solana mainnet-beta","Aptos mainnet"],
    answer:2,
    explain:"Jito's stack (Jito-Solana validator client, Block Engine, JitoSOL, Jito Restaking) is Solana-native." },
  { id:"b3", topic:"mev", level:"beginner",
    q:"What does 'MEV' generally refer to on Solana?",
    options:["Multi-execution validator client throughput","Maximal Extractable Value from transaction ordering","Mainnet error variance across Solana epochs","Mining-energy variance for validator hardware"],
    answer:1,
    explain:"MEV = Maximal Extractable Value, the surplus available from including/ordering transactions. Jito captures and routes a portion of it back to validators and JitoSOL holders." },
  { id:"b4", topic:"product", level:"beginner",
    q:"What are 'Jito Bundles'?",
    options:["A set of NFTs auctioned together by Jito validators","Sets of Solana transactions executed sequentially and atomically","A subscription package for Solana RPC and indexer node access","A bonded set of validator stake delegations consolidated into one"],
    answer:1,
    explain:"Bundles are sequentially and atomically executed sets of Solana transactions, used heavily by searchers." },
  { id:"b5", topic:"product", level:"beginner",
    q:"What does Jito's Block Engine do?",
    options:["Indexes Solana program accounts for explorer search","Issues SPL stablecoins minted against staked SOL deposits","Simulates searcher bundles and streams the best to validators","Runs a zk prover that compresses Solana account state"],
    answer:2,
    explain:"The Block Engine simulates incoming bundles, picks the best, and streams them to Jito-Solana validators for inclusion." },
  { id:"b6", topic:"company", level:"beginner",
    q:"Who runs validators in the JitoSOL stake pool?",
    options:["A diverse public set of independent validators (~160)","Only Jito Labs core engineering staff and contractors","A single foundation with rotating board-appointed nodes","Anonymous miners selected via a sealed-bid auction"],
    answer:0,
    explain:"JitoSOL routes stake to a public set of independent Solana validators that meet performance criteria, publicly described as around 160." },
  { id:"b7", topic:"market", level:"beginner",
    q:"Who typically holds JitoSOL?",
    options:["Solely retail wallets bridged in from Ethereum L2s","Retail, DAO treasuries, funds, and integrating dApps","Only Solana validators meeting Jito performance criteria","Only banks that have signed a Jito Labs partnership deal"],
    answer:1,
    explain:"JitoSOL is widely held: retail, DAO treasuries, crypto-native funds, and dApps integrating staked SOL as collateral." },
  { id:"b8", topic:"product", level:"beginner",
    q:"What is StakeNet in the Jito ecosystem?",
    options:["A bridge moving JitoSOL between Solana and Ethereum","A high-throughput Layer 2 scaling network on top of Solana","An on-chain delegation framework for the JitoSOL pool","A wallet brand promoted through Jito Foundation grants"],
    answer:2,
    explain:"StakeNet is Jito's on-chain delegation framework, used to allocate stake to validators in the JitoSOL pool." },
  { id:"b9", topic:"restaking", level:"beginner",
    q:"What is Jito Restaking?",
    options:["A native Solana staking program run by validators","A protocol using staked assets to secure additional networks","A bridge moving staked SOL exposure over to Ethereum","A token unlock and vesting schedule for the JTO airdrop"],
    answer:1,
    explain:"Jito Restaking lets staked assets be used as collateral securing additional networks (NCNs) on Solana, a Solana analog to the EigenLayer concept." },
  { id:"b10", topic:"product", level:"beginner",
    q:"What is TipRouter?",
    options:["A Solana NCN distributing Jito MEV tips through restaking","A meme coin associated with the Jito Network's airdrop","A non-custodial wallet maintained by Jito Foundation","A block explorer showing Jito Bundle inclusion history"],
    answer:0,
    explain:"TipRouter is an NCN that routes/distributes Jito MEV tips throughout the Solana ecosystem in a more decentralized, verifiable way." },
  { id:"b11", topic:"market", level:"beginner",
    q:"Why might an institution prefer JitoSOL over native staking?",
    options:["Because the JitoSOL stake pool is centrally custodied","For liquid transferable exposure with MEV-boosted yield","Because liquid staking removes all slashing and credit risk","Because JitoSOL pays staking yield in USDC stablecoins"],
    answer:1,
    explain:"JitoSOL gives a transferable token (liquidity) plus MEV-boosted yield while keeping staking exposure, useful for treasury and integration use cases." },
  { id:"b12", topic:"company", level:"beginner",
    q:"Is Jito-Solana the same as JitoSOL?",
    options:["Yes, Jito-Solana is just a marketing alias for JitoSOL","Yes, both refer to the JitoSOL stake pool's token","No, Jito-Solana is the validator client, JitoSOL is the LST","No, they are competing forks of the Solana validator"],
    answer:2,
    explain:"Jito-Solana is the MEV-aware Solana validator client. JitoSOL is the liquid staking token. They are part of the same network but distinct products." },

  // ── INTERMEDIATE ──
  { id:"i1", topic:"product", level:"intermediate",
    q:"What does Jito's Relayer do?",
    options:["Mints JTO governance tokens for active stake delegations","Briefly delays user transactions to allow bundle formation","Issues USDC-denominated rewards on behalf of validators","Stores searcher private keys for automated bundle signing"],
    answer:1,
    explain:"The Relayer delays incoming user transactions about 200ms to give searchers a chance to package them into bundles for MEV value capture." },
  { id:"i2", topic:"mev", level:"intermediate",
    q:"Why was the Jito mempool removed at one point?",
    options:["Validators voted to remove it to discourage sandwich attacks","A regulatory order from a US authority forced its removal","The mempool's fee market collapsed and revenue went to zero","Solana Foundation policy disallowed any third-party mempool"],
    answer:0,
    explain:"Jito removed the mempool with broad validator support to discourage sandwich-style MEV that hurt user UX, accepting reduced revenue for ecosystem health." },
  { id:"i3", topic:"company", level:"intermediate",
    q:"Roughly how many validators are in the JitoSOL stake pool, per public sources?",
    options:["Approximately twenty-five validators in total","Approximately one hundred sixty validators in total","Approximately twelve hundred validators in total","Approximately ten thousand validators in total"],
    answer:1,
    explain:"Public sources describe a JitoSOL stake pool of roughly 160 validators." },
  { id:"i4", topic:"restaking", level:"intermediate",
    q:"What is an NCN in Jito Restaking?",
    options:["Network Consensus Node: a Solana validator running Jito-Solana","Node Consensus Network: a network secured by restaked collateral","Non-Custodial Notary: a Solana signing service for institutions","New Coin Notice: a JTO governance proposal listing process"],
    answer:1,
    explain:"An NCN (Node Consensus Network) is a service or network secured by restaked collateral on Solana, with operators providing validation." },
  { id:"i5", topic:"restaking", level:"intermediate",
    q:"According to public docs, what fee does TipRouter take on tip revenue?",
    options:["Approximately one half of one percent of tip revenue","Approximately one percent of total tip revenue collected","Approximately three percent of total tip revenue collected","Approximately ten percent of total tip revenue collected"],
    answer:2,
    explain:"Public TipRouter docs describe a 3% fee on tip revenue, with portions distributed to vault operators." },
  { id:"i6", topic:"restaking", level:"intermediate",
    q:"What does TipRouter route to vault operators in its public design?",
    options:["The full 100% of incoming MEV tip revenue per epoch","Around 0.15% of tip revenue, as one piece of distribution","Only governance tokens, never any SOL-denominated rewards","Nothing, operators of SOL vaults do not earn from tips"],
    answer:1,
    explain:"Public materials describe a structure where 0.15% of tip revenue flows to SOL vault operators as part of the distribution." },
  { id:"i7", topic:"product", level:"intermediate",
    q:"What is a 'searcher' in the Jito context?",
    options:["A retail user looking for new Solana tokens to buy","An entity submitting bundles to capture MEV opportunities","An auditor reviewing Jito Labs validator client releases","A foundation grantee funded for Solana developer tooling"],
    answer:1,
    explain:"Searchers submit bundles to the Block Engine via Jito's Searcher API, attempting to capture MEV opportunities." },
  { id:"i8", topic:"company", level:"intermediate",
    q:"Where do Jito validator MEV tips ultimately accrue economic benefit?",
    options:["Exclusively to Jito Labs corporate treasury accounts","To random wallets selected by a TipRouter lottery process","To validators and indirectly to JitoSOL stake pool holders","To the Solana Foundation's general operations treasury fund"],
    answer:2,
    explain:"Tips flow to validators running Jito-Solana; JitoSOL holders benefit indirectly via the stake pool's MEV-boosted yield." },
  { id:"i9", topic:"market", level:"intermediate",
    q:"What is a key difference between JitoSOL and Marinade's mSOL?",
    options:["JitoSOL is on Ethereum, mSOL is on Solana mainnet-beta","JitoSOL leans on MEV uplift; mSOL is a different LST design","mSOL is a bridged wrapper of JitoSOL with no separate pool","There is no meaningful difference, they share a stake pool"],
    answer:1,
    explain:"Both are Solana LSTs, but JitoSOL's value proposition leans on MEV uplift via the Block Engine; mSOL is a separate liquid staking design from Marinade." },
  { id:"i10", topic:"product", level:"intermediate",
    q:"What does Jito's Searcher API do?",
    options:["Reads searcher email accounts to detect MEV opportunities","Lets searchers programmatically submit bundles to the engine","Mints NFTs commemorating successful Jito bundle inclusions","Issues USDC-pegged stablecoins backed by captured MEV tips"],
    answer:1,
    explain:"The Searcher API (with public examples in jito-labs/searcher-examples) lets searchers programmatically submit bundles." },
  { id:"i11", topic:"company", level:"intermediate",
    q:"What entity publishes the Jito-Solana validator client?",
    options:["Anza, a spinout from the Solana Foundation engineering team","Jito Labs, the team behind the Jito Network MEV stack","Helius, a Solana-native RPC and developer infra provider","Solana Foundation, the non-profit stewarding the protocol"],
    answer:1,
    explain:"Jito Labs publishes the Jito-Solana validator client, an MEV-aware fork of the Solana validator." },
  { id:"i12", topic:"restaking", level:"intermediate",
    q:"What does 'restaking' add for an LST holder, in plain terms?",
    options:["A small amount of free Bitcoin via a cross-chain airdrop","Additional yield by extending stake to secure further networks","Total removal of all slashing, credit, and protocol-level risk","Access to a new wallet app and a custom Jito browser extension"],
    answer:1,
    explain:"Restaking offers additional yield by extending staked collateral to secure additional networks (NCNs), at the cost of additional risk surface." },

  // ── EXPERT ──
  { id:"e1", topic:"company", level:"expert",
    q:"Why does the JitoSOL pool's validator-set composition matter for institutional holders?",
    options:["It does not, pool composition is purely a marketing detail","Operator concentration and skip-rate distribution affect risk","Validators in the pool unilaterally set the JitoSOL/SOL price","Pool composition only matters for the Solana Foundation budget"],
    answer:1,
    explain:"At size, operator concentration drives correlated failure risk and skip-rate distribution drives realized yield. Both matter to institutional sizing." },
  { id:"e2", topic:"mev", level:"expert",
    q:"In what way is MEV uplift over native staking variable?",
    options:["It is not variable, Jito documents a fixed staking yield bonus","It depends on Solana network activity, volatility, and engine flow","It is always exactly five percent on top of base validator yield","It is set quarterly by Jito Labs through a JTO governance vote"],
    answer:1,
    explain:"MEV revenue is a function of network activity and trading flow. Calm weeks compress the spread, volatile weeks expand it." },
  { id:"e3", topic:"restaking", level:"expert",
    q:"What is a key risk introduced when an LST holder layers on Jito Restaking?",
    options:["The underlying JitoSOL token is burned and replaced with JTO","Vault smart-contract risk and per-NCN slashing-equivalent terms","Mandatory KYC enforced by Jito Foundation on every vault user","No new risk, restaking is purely additive to base staking yield"],
    answer:1,
    explain:"Restaking adds a separate risk surface: vault contract risk and any per-NCN slashing-equivalent conditions you opt into." },
  { id:"e4", topic:"market", level:"expert",
    q:"For a fund evaluating JitoSOL exposure, which is the most operational risk?",
    options:["Pure JitoSOL spot price volatility relative to native SOL","Secondary-market liquidity for JitoSOL/SOL at the fund's exit size","Solana mainnet block-size limits constraining stake-pool growth","DNS issues affecting the Jito Network public-facing dashboard"],
    answer:1,
    explain:"At fund size, the dominant operational risk is exiting JitoSOL into SOL on a stress day at acceptable slippage, not the headline yield." },
  { id:"e5", topic:"product", level:"expert",
    q:"What's the architectural reason Block Engine relays delay txns ~200ms?",
    options:["Random jitter introduced for anti-spam protections at the relayer","To allow searcher bundle formation around incoming user flow","To reduce Solana priority-fee gas costs for end users at scale","An upstream Solana validator constraint limits forwarding speed"],
    answer:1,
    explain:"The 200ms relayer delay creates a window in which searchers can package incoming user txns into bundles before forwarding." },
  { id:"e6", topic:"company", level:"expert",
    q:"Why do operators in the JitoSOL pool care about hardware quality?",
    options:["Because dedicated hardware is required for Jito Foundation grants","Skip rate driven by hardware quality affects pool yield and inclusion","Tax treatment of validator income depends on owning hardware directly","Solana Foundation rules require bare metal and disallow any cloud use"],
    answer:1,
    explain:"Skip rate depends heavily on single-thread CPU, NVMe IOPS, and network quality, and skip rate is one of the primary signals influencing pool yield and inclusion." },
  { id:"e7", topic:"restaking", level:"expert",
    q:"How is TipRouter's distribution model relevant to operator economics?",
    options:["It is irrelevant, operator marginal revenue is set entirely by base","The published 3%/0.15% structure changes how operators model revenue","It sets Solana priority-fee gas levels that operators must pay per slot","It sets validator vote weights used in Jito-Solana consensus tie-breaks"],
    answer:1,
    explain:"Operators that don't model TipRouter into marginal revenue under-count both the upside (vault op share) and the risk surface (NCN responsibilities)." },
  { id:"e8", topic:"mev", level:"expert",
    q:"What's a reasonable framing of MEV-boost yield variance for treasuries?",
    options:["Treat the published headline yield as a guaranteed forward rate","Size on calm-week yield and treat volatile-week yield as upside","Ignore base validator staking yield and model only MEV tip revenue","Only count compounded yield net of every potential slashing event"],
    answer:1,
    explain:"Conservative treasuries usually size on calm-week yield assumptions and treat volatile-week MEV as upside, not budget." },
  { id:"e9", topic:"market", level:"expert",
    q:"For an integrating dApp adding JitoSOL, what UX concern is non-trivial?",
    options:["No real UX concerns, JitoSOL behaves identically to native SOL","Communicating the JitoSOL/SOL exchange rate and depeg risk to users","Choosing a Jito brand color palette that matches the dApp's theme","Sizing the JitoSOL logo correctly across mobile and desktop layouts"],
    answer:1,
    explain:"LSTs are a UX problem as much as a financial product. Communicating the JitoSOL/SOL ratio and depeg dynamics to users matters as much as the integration code." },
  { id:"e10", topic:"product", level:"expert",
    q:"Why is StakeNet relevant when discussing JitoSOL operator quality?",
    options:["Because StakeNet itself runs Solana validators in the JitoSOL pool","It provides on-chain delegation logic that allocates stake to operators","Because StakeNet issues NFT certificates for top-performing validators","Because StakeNet audits centralized exchanges that custody JitoSOL"],
    answer:1,
    explain:"StakeNet is the on-chain delegation framework that drives stake allocation logic, the lens through which operator quality translates into pool-level yield." },
  { id:"e11", topic:"restaking", level:"expert",
    q:"What's the cleanest way to describe NCN risk vs. base staking risk?",
    options:["NCN risk and base Solana staking risk are economically identical","Per-NCN risk stacks additively on top of base Solana staking risk","NCN risk is structurally always lower than base Solana staking risk","NCN participation is illegal in most major regulatory jurisdictions"],
    answer:1,
    explain:"NCN risk is additive on top of base staking: each opted-into NCN carries its own contract, operator, and (where relevant) slashing-equivalent risks." },
  { id:"e12", topic:"company", level:"expert",
    q:"When does a Solana validator setup become obviously hardware-bound?",
    options:["Never, modern Solana validators are network-bound, not hardware","When skip rate climbs and CPU/IOPS saturate during leader windows","Only on testnet clusters running pre-release Jito-Solana validator builds","Only at midnight UTC, when Solana epoch boundaries place extra load"],
    answer:1,
    explain:"Persistent skip rate combined with CPU/IOPS saturation during leader windows is the textbook signature of a hardware-bound validator, the case where dedicated infra usually shows up well." },
];

const TOPIC_LABEL = {
  company: "Jito stack & company",
  product: "Block Engine, Bundles, StakeNet",
  mev: "MEV mechanics",
  restaking: "Restaking, NCNs, TipRouter",
  market: "Market & buyer context",
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
