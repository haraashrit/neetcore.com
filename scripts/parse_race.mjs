import fs from 'node:fs';
import path from 'node:path';

const mdPath = "C:\\Users\\LENOVO\\Downloads\\chemical_bonding_race_topicwise.md";
const outPath = "D:\\New folder\\neetcore.com\\src\\data\\chemical-bonding-race-questions.ts";

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

// Map RACE section titles to canonical
// RACE file headings are like "1. COVALENT BOND & ORBITAL OVERLAP"
// We'll map by keyword
function mapToCanonical(title){
  const t = title.toUpperCase();
  if(t.includes("COVALENT BOND")) return "Covalent Bond & Orbital Overlap";
  if(t.includes("HYBRIDISATION")) return "Hybridisation & Molecular Shape (VSEPR)";
  if(t.includes("COORDINATE")) return "Coordinate Bond";
  if(t.includes("DIPOLE")) return "Dipole Moment / Polarity";
  if(t.includes("MOLECULAR ORBITAL")) return "Molecular Orbital Theory & Bond Order";
  if(t.includes("RESONANCE")) return "Resonance & Formal Charge";
  if(t.includes("HYDROGEN BONDING") || t.includes("WEAK FORCES")) return "Hydrogen Bonding & Intermolecular Forces";
  if(t.includes("IONIC BOND")) return "Ionic Bond, Lattice Energy & Ionic/Covalent Character";
  if(t.includes("OCTET")) return "Octet Rule / Valency";
  if(t.includes("ISOELECTRONIC")) return "Isoelectronic & Isostructural Species";
  return title.trim();
}

const text = fs.readFileSync(mdPath, 'utf-8');
const sections = text.split(/\n##\s+/);
const questionSections = [];
for(const sec of sections){
  if(sec.includes("**Q1.**")){
    const title = sec.split("\n")[0].trim();
    questionSections.push([title, sec]);
  }
}
console.log(`Found ${questionSections.length} sections`);
questionSections.forEach(([t],i)=> console.log(i+1, t.slice(0,80)));

function addMath(s){
  if(!s) return s;
  s = s.replace(/\s+/g,' ').trim();
  s = s.replace(/½/g, '$\\frac{1}{2}$');
  s = s.replace(/⅓/g, '$\\frac{1}{3}$');
  s = s.replace(/⅔/g, '$\\frac{2}{3}$');
  s = s.replace(/¼/g, '$\\frac{1}{4}$');
  s = s.replace(/¾/g, '$\\frac{3}{4}$');
  s = s.replace(/\bsp3d2\b/g, '$sp^3d^2$');
  s = s.replace(/\bsp3d\b/g, '$sp^3d$');
  s = s.replace(/\bsp3\b/g, '$sp^3$');
  s = s.replace(/\bsp2\b/g, '$sp^2$');
  s = s.replace(/\bsp\b(?![a-z0-9])/g, '$sp$');
  s = s.replace(/→/g, '$\\rightarrow$');
  s = s.replace(/⇌/g, '$\\rightleftharpoons$');
  s = s.replace(/°/g, '$^{\\circ}$');
  s = s.replace(/\$\$/g, '$ $');
  return s.trim();
}
function cleanOpt(opt){
  opt = opt.trim();
  if(opt.startsWith("- ")) opt = opt.slice(2).trim();
  opt = addMath(opt);
  return opt;
}

let all = [];
let globalIdx=0;

for(let secIdx=0; secIdx<questionSections.length; secIdx++){
  const [title, sec] = questionSections[secIdx];
  const canon = mapToCanonical(title);
  const qBlocks = sec.split(/\*\*Q\d+(?:\s*\([^)]+\))?\.\*\*/);
  const qs=[];
  for(let b=1; b<qBlocks.length; b++){
    const block = qBlocks[b];
    globalIdx++;
    const firstOptIdx = block.indexOf("(1)");
    let qText;
    let oText;
    let answerIdx = block.indexOf("**Answer");
    if(firstOptIdx===-1){
      qText = answerIdx!==-1 ? block.slice(0, answerIdx).trim() : block.trim();
      oText = "";
      // still need to handle image? none in race
      qText = qText.replace(/\s+/g,' ').trim();
      const aMatchTmp = block.match(/\*\*Answer:\s*\(\s*([1-4])\s*\)/);
      const correctNumTmp = aMatchTmp ? parseInt(aMatchTmp[1]) : 1;
      const answerTmp = {1:'A',2:'B',3:'C',4:'D'}[correctNumTmp];
      const qFormattedTmp = addMath(qText);
      const placeholderOpts = ["(A) Option A","(B) Option B","(C) Option C","(D) Option D"].map(o=> addMath(o));
      qs.push({q: qFormattedTmp, options: placeholderOpts, answer: answerTmp, imagePublic: null});
      continue;
    }
    qText = block.slice(0, firstOptIdx).trim();
    qText = qText.replace(/\s+/g,' ').trim();
    qText = qText.replace(/^\s*[\.\-]+\s*/, '').trim();
    answerIdx = block.indexOf("**Answer");
    oText = "";
    if(answerIdx!==-1){
      oText = block.slice(firstOptIdx, answerIdx).trim();
    } else {
      oText = block.slice(firstOptIdx).trim();
    }
    const matches = [...oText.matchAll(/\(\s*([1-4])\s*\)/g)];
    let rawOpts=[];
    if(matches.length>=4){
      for(let i=0;i<matches.length;i++){
        const start = matches[i].index + matches[i][0].length;
        const end = i+1<matches.length ? matches[i+1].index : oText.length;
        let content = oText.slice(start, end).trim();
        content = content.replace(/^\s*-\s*/, '').trim();
        content = content.replace(/\s*-\s*$/,'').trim();
        rawOpts.push([matches[i][1], content]);
      }
    } else {
      const parts = oText.split(/\(\s*[1-4]\s*\)/);
      const filtered = parts.filter(p=>p.trim().length>0).map(p=>p.trim());
      for(let i=0;i< Math.min(4, filtered.length); i++){
        rawOpts.push([String(i+1), filtered[i]]);
      }
    }
    while(rawOpts.length<4) rawOpts.push([String(rawOpts.length+1), ""]);
    rawOpts = rawOpts.slice(0,4);
    let options=[];
    for(const [num, content] of rawOpts){
      let c = content.trim().replace(/^--/,'-').trim();
      c = c.replace(/\s+/g,' ').trim();
      c = c.replace(/--/g,'-');
      c = c.replace(/\s*-+\s*$/,'').trim();
      options.push(c);
    }
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
    qs.push({q: qFormatted, options: formattedOpts, answer, imagePublic: null});
  }
  all.push([canon, qs]);
}

for(const [name, qs] of all) console.log(`${name}: ${qs.length}`);
console.log(`Total ${all.reduce((a,[_,q])=>a+q.length,0)}`);

// Build full 10-subtopic structure with empty for missing
const fullMap = new Map(all);
const fullAll = userSubtopics.map(name => {
  const qs = fullMap.get(name) || [];
  return [name, qs];
});

let out = [];
out.push("import type { SetData } from './questions';");
out.push("");
out.push("export const chemicalBondingRace : SetData = {");
out.push("  subtopics: [");
for(const [name, qs] of fullAll){
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
