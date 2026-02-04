#!/usr/bin/env node

/**
 * Earnings Tweet Generator for @NFTLunatic
 *
 * Generates tweet drafts when a company reports earnings.
 * Uses free financial data APIs + your writing style.
 *
 * Usage:
 *   node scripts/earnings-tweets.js TSLA
 *   node scripts/earnings-tweets.js DUOL --save
 *   node scripts/earnings-tweets.js HIMS --metrics "revenue=400M,eps=0.25,guidance=up"
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// ============================================
// YOUR WATCHLIST - Add tickers you care about
// ============================================
const WATCHLIST = {
  TSLA: { name: 'Tesla', sector: 'EV / AI / Robotics / Energy', thesis: 'AI & robotics leader, not just a car company' },
  DUOL: { name: 'Duolingo', sector: 'EdTech', thesis: 'Dominating language learning with massive TAM' },
  HIMS: { name: 'Hims & Hers', sector: 'Telehealth', thesis: 'Disrupting healthcare with subscriptions + telehealth' },
  LMND: { name: 'Lemonade', sector: 'InsurTech', thesis: 'AI-first insurance disrupting $5T industry' },
  ROOT: { name: 'Root Insurance', sector: 'InsurTech', thesis: 'Founder-led, profitable, massive TAM at dirt cheap valuation' },
  ZETA: { name: 'Zeta Global', sector: 'AdTech / AI', thesis: 'AI + data flywheel moat, steady profitable growth' },
  PATH: { name: 'UiPath', sector: 'Automation', thesis: 'RPA leader with strong FCF generation' },
  NXT: { name: 'Nextracker', sector: 'Solar', thesis: 'Leader in utility-scale solar with multibillion backlog' },
  BTC: { name: 'Bitcoin', sector: 'Crypto', thesis: 'Digital gold, fixed supply of 21M' },
  TAO: { name: 'Bittensor', sector: 'AI x Crypto', thesis: 'Decentralized AI infrastructure' },
  XMR: { name: 'Monero', sector: 'Privacy Crypto', thesis: 'The only true privacy coin' },
  ICP: { name: 'Internet Computer', sector: 'Web3', thesis: 'Full stack decentralization' },
};

// ============================================
// TWEET TEMPLATES - Based on your style
// ============================================
function generateEarningsTweets(ticker, company, metrics) {
  const tweets = [];
  const sym = `$${ticker}`;

  // --- BEAT/MISS REACTION ---
  if (metrics.beat) {
    tweets.push({
      type: 'earnings-beat',
      text: `${sym} just crushed earnings.

Revenue: ${metrics.revenue || 'strong'}
EPS: ${metrics.eps || 'beat estimates'}
${metrics.extraMetric ? metrics.extraMetric + '\n' : ''}
The market is slowly waking up to what we already knew. This company is executing.`
    });

    tweets.push({
      type: 'earnings-beat-short',
      text: `${sym} earnings = beat across the board.

Revenue beat. EPS beat.${metrics.guidanceUp ? ' Guidance raised.' : ''}

Still undervalued. Still early.`
    });
  }

  if (metrics.beat === false) {
    tweets.push({
      type: 'earnings-miss',
      text: `${sym} missed this quarter.

But the thesis hasn't changed: ${company.thesis}.

Short-term noise. I'm adding on this dip.`
    });
  }

  // --- METRICS BREAKDOWN ---
  if (metrics.revenue || metrics.eps || metrics.fcf) {
    const lines = [];
    if (metrics.revenue) lines.push(`Revenue: ${metrics.revenue}`);
    if (metrics.revenueGrowth) lines.push(`Revenue Growth: ${metrics.revenueGrowth}`);
    if (metrics.eps) lines.push(`EPS: ${metrics.eps}`);
    if (metrics.fcf) lines.push(`FCF: ${metrics.fcf}`);
    if (metrics.fcfMargin) lines.push(`FCF Margin: ${metrics.fcfMargin}`);
    if (metrics.netIncome) lines.push(`Net Income: ${metrics.netIncome}`);
    if (metrics.subscribers) lines.push(`Subscribers: ${metrics.subscribers}`);
    if (metrics.guidance) lines.push(`Guidance: ${metrics.guidance}`);

    tweets.push({
      type: 'metrics-breakdown',
      text: `${sym} ${metrics.quarter ? (metrics.quarter.startsWith('Q') ? metrics.quarter : 'Q' + metrics.quarter) : ''} Earnings Breakdown:

${lines.join('\n')}

${metrics.beat ? 'Executing on all cylinders.' : 'Mixed quarter but long-term thesis intact.'}`
    });
  }

  // --- VALUATION ANGLE ---
  if (metrics.ps || metrics.pe || metrics.pfcf) {
    const valLines = [];
    if (metrics.ps) valLines.push(`P/S: ${metrics.ps}`);
    if (metrics.pe) valLines.push(`P/E: ${metrics.pe}`);
    if (metrics.pfcf) valLines.push(`P/FCF: ${metrics.pfcf}`);

    tweets.push({
      type: 'valuation',
      text: `${sym} after earnings:

${valLines.join('\n')}
${metrics.revenueGrowth ? `Revenue Growth: ${metrics.revenueGrowth}\n` : ''}
${company.thesis}.

How is this not on everyone's radar?`
    });
  }

  // --- CHECKLIST STYLE (your signature format) ---
  {
    const checks = [];
    if (metrics.revenueGrowth) checks.push(`Revenue growing ${metrics.revenueGrowth}`);
    if (metrics.profitable) checks.push('Profitable');
    if (metrics.fcfPositive) checks.push('FCF positive');
    if (metrics.beat) checks.push('Beat earnings estimates');
    if (metrics.guidanceUp) checks.push('Raised guidance');
    if (metrics.moat) checks.push(`Strong moat: ${metrics.moat}`);
    if (metrics.founderLed) checks.push('Founder led');
    if (metrics.tam) checks.push(`Massive TAM: ${metrics.tam}`);

    if (checks.length >= 3) {
      tweets.push({
        type: 'checklist',
        text: `${sym} after earnings:

${checks.map(c => `${c} ✅`).join('\n')}

Still early. Still cheap.`
      });
    }
  }

  // --- CONVICTION / THESIS ---
  tweets.push({
    type: 'thesis',
    text: `${sym} is not just ${'aeiou'.includes(company.sector[0].toLowerCase()) ? 'an' : 'a'} ${company.sector.split('/')[0].trim().toLowerCase()} company.

${company.thesis}.

Every earnings report confirms this.${metrics.beat ? ' Another beat.' : ''} The compounding is just getting started.`
  });

  // --- HOT TAKE ---
  tweets.push({
    type: 'hot-take',
    text: `${sym} will be worth 3-5x from here in 5 years.

${company.thesis}.

Most people will realize when it's too late.`
  });

  // --- DIP BUY ---
  if (metrics.dip) {
    tweets.push({
      type: 'buy-the-dip',
      text: `${sym} selling off after earnings?

Revenue ${metrics.revenueGrowth ? 'growing ' + metrics.revenueGrowth : 'growing'}. ${metrics.profitable ? 'Profitable. ' : ''}${metrics.fcfPositive ? 'FCF positive. ' : ''}

The market is giving you a gift. I'm buying more.`
    });
  }

  // --- COMPARISON ---
  if (metrics.ps && parseFloat(metrics.ps) < 5) {
    tweets.push({
      type: 'too-cheap',
      text: `${sym} trading at ${metrics.ps} P/S${metrics.pe ? ` and ${metrics.pe} P/E` : ''}.

${company.thesis}.

This is simply too cheap to ignore.`
    });
  }

  return tweets;
}

// ============================================
// PARSE CLI METRICS
// ============================================
function parseMetrics(metricsStr) {
  const metrics = {};
  if (!metricsStr) return metrics;

  metricsStr.split(',').forEach(pair => {
    const [key, value] = pair.split('=').map(s => s.trim());
    if (value === 'true') metrics[key] = true;
    else if (value === 'false') metrics[key] = false;
    else metrics[key] = value;
  });

  return metrics;
}

// ============================================
// INTERACTIVE MODE - Ask for metrics
// ============================================
function promptMetrics(ticker, company) {
  const readline = require('readline');
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  const ask = (question) => new Promise(resolve => {
    rl.question(question, answer => resolve(answer.trim()));
  });

  return (async () => {
    console.log(`\nEnter earnings data for $${ticker} (${company.name}):`);
    console.log('(Press Enter to skip any field)\n');

    const metrics = {};

    const quarter = await ask('Quarter (e.g. Q4 2025): ');
    if (quarter) metrics.quarter = quarter;

    const revenue = await ask('Revenue: ');
    if (revenue) metrics.revenue = revenue;

    const revenueGrowth = await ask('Revenue Growth YoY: ');
    if (revenueGrowth) metrics.revenueGrowth = revenueGrowth;

    const eps = await ask('EPS: ');
    if (eps) metrics.eps = eps;

    const fcf = await ask('Free Cash Flow: ');
    if (fcf) metrics.fcf = fcf;

    const fcfMargin = await ask('FCF Margin: ');
    if (fcfMargin) metrics.fcfMargin = fcfMargin;

    const netIncome = await ask('Net Income: ');
    if (netIncome) metrics.netIncome = netIncome;

    const subscribers = await ask('Subscribers/Users (if applicable): ');
    if (subscribers) metrics.subscribers = subscribers;

    const guidance = await ask('Guidance (e.g. "raised to $2B"): ');
    if (guidance) { metrics.guidance = guidance; metrics.guidanceUp = true; }

    const ps = await ask('P/S ratio: ');
    if (ps) metrics.ps = ps;

    const pe = await ask('P/E ratio: ');
    if (pe) metrics.pe = pe;

    const pfcf = await ask('P/FCF ratio: ');
    if (pfcf) metrics.pfcf = pfcf;

    const beat = await ask('Did they beat estimates? (yes/no): ');
    if (beat.toLowerCase() === 'yes') metrics.beat = true;
    else if (beat.toLowerCase() === 'no') metrics.beat = false;

    const profitable = await ask('Is the company profitable? (yes/no): ');
    if (profitable.toLowerCase() === 'yes') { metrics.profitable = true; metrics.fcfPositive = true; }

    const founderLed = await ask('Founder led? (yes/no): ');
    if (founderLed.toLowerCase() === 'yes') metrics.founderLed = true;

    const dip = await ask('Is the stock dipping after earnings? (yes/no): ');
    if (dip.toLowerCase() === 'yes') metrics.dip = true;

    rl.close();
    return metrics;
  })();
}

// ============================================
// SAVE TWEETS TO FILE
// ============================================
function saveTweets(ticker, tweets) {
  const dir = path.join(__dirname, '../data/earnings');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const date = new Date().toISOString().split('T')[0];
  const filename = `${ticker}-${date}.txt`;
  const filepath = path.join(dir, filename);

  let content = `# $${ticker} Earnings Tweet Drafts - ${date}\n`;
  content += `# Generated for @NFTLunatic\n\n`;

  tweets.forEach((tweet, i) => {
    content += `--- Tweet ${i + 1} (${tweet.type}) ---\n`;
    content += tweet.text + '\n';
    content += `[${tweet.text.length}/280 chars]\n\n`;
  });

  // Also save Buffer-ready format (just the tweets, one per line)
  const bufferFile = path.join(dir, `${ticker}-${date}-buffer.csv`);
  let bufferContent = 'Text\n';
  tweets.forEach(tweet => {
    if (tweet.text.length <= 280) {
      bufferContent += `"${tweet.text.replace(/"/g, '""')}"\n`;
    }
  });

  fs.writeFileSync(filepath, content);
  fs.writeFileSync(bufferFile, bufferContent);

  return { filepath, bufferFile };
}

// ============================================
// MAIN
// ============================================
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Earnings Tweet Generator for @NFTLunatic

Usage:
  node scripts/earnings-tweets.js TSLA                      Interactive mode
  node scripts/earnings-tweets.js DUOL --save               Interactive + save to file
  node scripts/earnings-tweets.js HIMS --metrics "..."      Quick mode with metrics

Metrics format (comma-separated key=value):
  revenue=400M,revenueGrowth=25%,eps=0.25,beat=true,ps=8.5,pe=30,pfcf=25,
  fcf=50M,fcfMargin=12%,profitable=true,founderLed=true,guidanceUp=true,
  dip=true,quarter=Q4,guidance=raised to $2B,tam=$500B,moat=AI+data flywheel

Watchlist: ${Object.keys(WATCHLIST).join(', ')}

Examples:
  node scripts/earnings-tweets.js DUOL --metrics "revenue=200M,revenueGrowth=40%,eps=1.50,beat=true,ps=8.7,pfcf=23,profitable=true,quarter=Q4"
  node scripts/earnings-tweets.js TSLA --metrics "revenue=25B,revenueGrowth=15%,beat=true,dip=true" --save
`);
    return;
  }

  const ticker = args[0].toUpperCase().replace('$', '');
  const shouldSave = args.includes('--save');

  // Look up company info
  const company = WATCHLIST[ticker] || {
    name: ticker,
    sector: 'Unknown',
    thesis: `${ticker} is positioned for significant growth`
  };

  console.log(`\n${'='.repeat(50)}`);
  console.log(`Earnings Tweet Generator - $${ticker} (${company.name})`);
  console.log(`${'='.repeat(50)}`);

  // Get metrics
  let metrics;
  const metricsIdx = args.indexOf('--metrics');
  if (metricsIdx !== -1 && args[metricsIdx + 1]) {
    metrics = parseMetrics(args[metricsIdx + 1]);
  } else {
    metrics = await promptMetrics(ticker, company);
  }

  // Generate tweets
  const tweets = generateEarningsTweets(ticker, company, metrics);

  // Display tweets
  console.log(`\nGenerated ${tweets.length} tweet drafts:\n`);

  tweets.forEach((tweet, i) => {
    const charStatus = tweet.text.length <= 280 ? '✅' : '⚠️  TOO LONG';
    console.log(`--- Draft ${i + 1} [${tweet.type}] ${charStatus} (${tweet.text.length}/280) ---`);
    console.log(tweet.text);
    console.log('');
  });

  // Save if requested
  if (shouldSave) {
    const { filepath, bufferFile } = saveTweets(ticker, tweets);
    console.log(`\nSaved to:`);
    console.log(`  Drafts: ${filepath}`);
    console.log(`  Buffer CSV: ${bufferFile}`);
  }
}

main().catch(console.error);
