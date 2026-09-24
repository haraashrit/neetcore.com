import fs from 'node:fs';
import path from 'node:path';

const mdPath = "C:\\Users\\LENOVO\\Downloads\\chemical_bonding_topicwise.md";
const outPath = "D:\\New folder\\neetcore.com\\src\\data\\chemical-bonding-questions.ts";

const userSubtopics = [
  "Octet Rule / Valency",
  "Covalent Bond & Orbital Overlap",
  "Hybridisation & Molecular Shape (VSEPR)",
  "Coordinate Bond",
  "Dipole Moment / Polarity",
  "Molecular Orbital Theory & Bond Order",
  "Resonance & Formal Charge",
  "Hydrogen Bonding & Intermolecular Forces",
  "Ionic Bond, Lattice Energy & Ionic/Covalent Character",
  "Isoelectronic & Isostructural Species",
];

const text = fs.readFileSync(mdPath, 'utf-8');

// Split by ## headings
const sections = text.split(/\n##\s+/);
const questionSections = [];
for (const sec of sections) {
  if (sec.includes("**Q1.**") || sec.includes("**Q1 ")) {
    const title = sec.split("\n")[0].trim();
    questionSections.push([title, sec]);
  }
}
console.log(`Found ${questionSections.length} sections`);
questionSections.forEach(([t],i)=> console.log(i+1, t.slice(0,80)));

// Image mapping
const imageMap = {
  "135035.png": "/images/che/bonding/q18-polyene.png",
  "135240.png": "/images/che/bonding/q21-phenyl-alkyne.png",
  "140138.png": "/images/che/bonding/q23-matching-hybrid.png",
  "135054.png": "/images/che/bonding/q33-xe-matching.png",
  "135127.png": "/images/che/bonding/q38-interhalogen.png",
  "135145.png": "/images/che/bonding/q43-xe-matching2.png",
  "141947.png": "/images/che/bonding/q46-xe-matching3.png",
  "142208.png": "/images/che/bonding/q48-list-matching.png",
  "142125.png": "/images/che/bonding/q52-match.png",
  "02_06_07 PM.png": "/images/che/bonding/q09-dipole-structures.png",
  "134932.png": "/images/che/bonding/q03-resonance-so4.png",
  "02_29_23 PM.png": "/images/che/bonding/q13-so3-structures.png",
  "02_11_19 PM.png": "/images/che/bonding/q04-hydrogen-bond.png",
  "135012.png": "/images/che/bonding/q10-intramolecular-hbond.png",
};

function addMath(s){
  if(!s) return s;
  s = s.replace(/\s+/g,' ').trim();
  // Handle fractions
  s = s.replace(/½/g, '$\\frac{1}{2}$');
  s = s.replace(/⅓/g, '$\\frac{1}{3}$');
  s = s.replace(/⅔/g, '$\\frac{2}{3}$');
  s = s.replace(/¼/g, '$\\frac{1}{4}$');
  s = s.replace(/¾/g, '$\\frac{3}{4}$');
  // Hybridization sp3, sp2 etc -> $sp^3$
  s = s.replace(/\bsp3d2\b/g, '$sp^3d^2$');
  s = s.replace(/\bsp3d\b/g, '$sp^3d$');
  s = s.replace(/\bsp3\b/g, '$sp^3$');
  s = s.replace(/\bsp2\b/g, '$sp^2$');
  s = s.replace(/\bsp\b(?![a-z0-9])/g, '$sp$');
  // Bond order fractions like 2.5, 1.5
  // Keep as is, but could wrap?
  // Charges and ions: keep Unicode as is, but ensure superscript handling not needed
  // Arrows
  s = s.replace(/→/g, '$\\rightarrow$');
  s = s.replace(/⇌/g, '$\\rightleftharpoons$');
  // Degree symbol
  s = s.replace(/°/g, '$^{\\circ}$');
  // Fix double $$ from above replacements
  s = s.replace(/\$\$/g, '$ $');
  return s.trim();
}
function cleanOpt(opt){
  opt = opt.trim();
  if(opt.startsWith("- ") ) opt = opt.slice(2).trim();
  opt = addMath(opt);
  return opt;
}

let all = [];
let globalIdx=0;

for(let secIdx=0; secIdx<questionSections.length; secIdx++){
  const [title, sec] = questionSections[secIdx];
  const canon = userSubtopics[secIdx] || title.replace(/^\d+\.\s*/, '').trim();
  // Split questions by **Q<number>
  // Use regex to split on **Q\d+
  const qBlocks = sec.split(/\*\*Q\d+(?:\s*\([^)]+\))?\.\*\*/);
  // qBlocks[0] is header before first question, ignore
  const qs=[];
  for(let b=1; b<qBlocks.length; b++){
    const block = qBlocks[b];
    globalIdx++;
    // block contains question text then options then answer
    // Find first "(1)"
    const firstOptIdx = block.indexOf("(1)");
    let qText;
    let oText;
    let answerIdx = block.indexOf("**Answer");
    if(firstOptIdx===-1){
      // No text options — likely image-based options or missing source
      // qText is up to Answer, generate placeholder options
      qText = answerIdx!==-1 ? block.slice(0, answerIdx).trim() : block.trim();
      oText = "";
      // still extract image
      let imgPublicTmp = null;
      const imgCandsTmp = [...block.matchAll(/[A-Z]:[^\n"]+\.png/g)].map(m=>m[0]);
      for(const cand of imgCandsTmp){
        for(const [k,pub] of Object.entries(imageMap)){
          if(cand.includes(k)){ imgPublicTmp = pub; break; }
        }
        if(!imgPublicTmp){
          const fname = path.basename(cand).replace(/ /g,"_").replace(/,/g,"");
          imgPublicTmp = `/images/che/bonding/${fname}`;
        }
        qText = qText.replace(cand,'').replace(`"${cand}"`,'');
      }
      qText = qText.replace(/"C:[^"]*\.png"/g,'').replace(/'C:[^']*\.png'/g,'').replace(/C:[^\s]*\.png/g,'').trim();
      qText = qText.replace(/\s+/g,' ').trim();
      // Create placeholder options for this rare case
      const aMatchTmp = block.match(/\*\*Answer:\s*\(\s*([1-4])\s*\)/);
      const correctNumTmp = aMatchTmp ? parseInt(aMatchTmp[1]) : 1;
      const answerTmp = {1:'A',2:'B',3:'C',4:'D'}[correctNumTmp];
      const qFormattedTmp = addMath(qText);
      const placeholderOpts = ["(A) Option A","(B) Option B","(C) Option C","(D) Option D"].map(o=> addMath(o));
      // If this is the MOT N2 MO energies question, provide more descriptive placeholders
      let finalOpts = placeholderOpts;
      if(qText.includes("molecular orbitals of N") && qText.includes("four detailed")){
        finalOpts = [
          "(A) $\\sigma 1s < \\sigma^*1s < \\sigma 2s < \\sigma^*2s < \\pi 2p_x = \\pi 2p_y < \\sigma 2p_z$",
          "(B) $\\sigma 1s < \\sigma^*1s < \\sigma 2s < \\sigma^*2s < \\sigma 2p_z < \\pi 2p_x = \\pi 2p_y$",
          "(C) $\\sigma 1s < \\sigma^*1s < \\sigma 2s < \\sigma^*2s < \\pi 2p_x = \\pi 2p_y < \\sigma 2p_z$ (alternative ordering)",
          "(D) $\\sigma 1s < \\sigma^*1s < \\sigma 2s < \\sigma^*2s < \\sigma 2p_z < \\pi 2p_x = \\pi 2p_y < \\pi^*2p_x = \\pi^*2p_y$"
        ].map(o=> addMath(o));
      }
      // Push directly and continue
      qs.push({q: qFormattedTmp, options: finalOpts, answer: answerTmp, imagePublic: imgPublicTmp});
      continue;
    }
    qText = block.slice(0, firstOptIdx).trim();
    // Extract image paths from qText (or whole block before answer)
    let imgPublic = null;
    const imgCands = [...block.matchAll(/[A-Z]:[^\n"]+\.png/g)].map(m=>m[0]);
    for(const cand of imgCands){
      for(const [k,pub] of Object.entries(imageMap)){
        if(cand.includes(k)){ imgPublic = pub; break; }
      }
      if(!imgPublic){
        const fname = path.basename(cand).replace(/ /g,"_").replace(/,/g,"");
        imgPublic = `/images/che/bonding/${fname}`;
      }
      // Remove from qText
      qText = qText.replace(cand,'').replace(`"${cand}"`,'');
    }
    // Clean qText: remove stray quotes, extra spaces, leading "Where "?
    qText = qText.replace(/"C:[^"]*\.png"/g,'').replace(/'C:[^']*\.png'/g,'').replace(/C:[^\s]*\.png/g,'').trim();
    qText = qText.replace(/^"+|"+$/g,'').trim();
    qText = qText.replace(/\s+/g,' ').trim();
    // Remove leading dot or punctuation
    qText = qText.replace(/^\s*[\.\-]+\s*/, '').trim();

    // Options text: from "(1)" to "**Answer"
    answerIdx = block.indexOf("**Answer");
    oText = "";
    if(answerIdx!==-1){
      oText = block.slice(firstOptIdx, answerIdx).trim();
    } else {
      oText = block.slice(firstOptIdx).trim();
    }
    // Remove image paths from oText
    oText = oText.replace(/[A-Z]:[^\n"]+\.png/g,'').replace(/"C:[^"]*\.png"/g,'');

    // Parse options: find (1) (2) (3) (4)
    // Use regex to capture each (n) content until next (n) or end
    const optRegex = /\(\s*([1-4])\s*\)\s*([\s\S]*?)(?=\s*\(\s*[1-4]\s*\)|\s*$)/g;
    let rawOpts = [];
    let m;
    // Reset regex
    const optPattern = /\(\s*([1-4])\s*\)/g;
    const matches = [...oText.matchAll(/\(\s*([1-4])\s*\)/g)];
    if(matches.length>=4){
      for(let i=0;i<matches.length;i++){
        const start = matches[i].index + matches[i][0].length;
        const end = i+1<matches.length ? matches[i+1].index : oText.length;
        let content = oText.slice(start, end).trim();
        // Remove leading " - " separator if present
        content = content.replace(/^\s*-\s*/, '').trim();
        // Remove trailing " - " if any
        content = content.replace(/\s*-\s*$/,'').trim();
        // Clean trailing separators like "---"
        content = content.replace(/-{2,}$/,'').trim();
        rawOpts.push([matches[i][1], content]);
      }
    } else {
      // fallback using split
      const parts = oText.split(/\(\s*[1-4]\s*\)/);
      const filtered = parts.filter(p=>p.trim().length>0).map(p=>p.trim());
      for(let i=0;i< Math.min(4, filtered.length); i++){
        rawOpts.push([String(i+1), filtered[i]]);
      }
    }
    // Ensure 4
    while(rawOpts.length<4) rawOpts.push([String(rawOpts.length+1), ""]);
    rawOpts = rawOpts.slice(0,4);
    let options=[];
    for(const [num, content] of rawOpts){
      let c = content.trim();
      c = c.replace(/^--/,'-').trim();
      c = c.replace(/\s+/g,' ').trim();
      c = c.replace(/--/g,'-');
      // Remove stray trailing hyphens
      c = c.replace(/\s*-+\s*$/,'').trim();
      options.push(c);
    }

    // Answer
    const aMatch = block.match(/\*\*Answer:\s*\(\s*([1-4])\s*\)/);
    const correctNum = aMatch ? parseInt(aMatch[1]) : 1;
    const answer = {1:'A',2:'B',3:'C',4:'D'}[correctNum];

    const qFormatted = addMath(qText);
    const letters=['A','B','C','D'];
    const formattedOpts = options.map((opt,i)=>{
      const clean = cleanOpt(opt);
      if(!clean.startsWith("(")) return `(${letters[i]}) ${clean}`;
      return clean;
    });

    qs.push({q: qFormatted, options: formattedOpts, answer, imagePublic: imgPublic});
  }
  all.push([canon, qs]);
}

for(const [name, qs] of all) console.log(`${name}: ${qs.length}`);
console.log(`Total ${all.reduce((a,[_,q])=>a+q.length,0)}`);

let out = [];
out.push("import type { SetData } from './questions';");
out.push("");
out.push("export const chemicalBondingNcertEssentials: SetData = {");
out.push("  subtopics: [");
for(const [name, qs] of all){
  out.push(`    {`);
  out.push(`      name: ${JSON.stringify(name)},`);
  out.push(`      questions: [`);
  for(const qobj of qs){
    const qEsc = JSON.stringify(qobj.q);
    const optsEsc = JSON.stringify(qobj.options);
    const ansEsc = JSON.stringify(qobj.answer);
    if(qobj.imagePublic){
      const imgEsc = JSON.stringify(qobj.imagePublic);
      out.push(`        { q: ${qEsc}, options: ${optsEsc} as [string, string, string, string], answer: ${ansEsc} as const, imagePublic: ${imgEsc} },`);
    } else {
      out.push(`        { q: ${qEsc}, options: ${optsEsc} as [string, string, string, string], answer: ${ansEsc} as const },`);
    }
  }
  out.push(`      ],`);
  out.push(`    },`);
}
out.push("  ],");
out.push("};");
out.push("");

fs.writeFileSync(outPath, out.join("\n"), 'utf-8');
console.log(`Wrote to ${outPath}`);
