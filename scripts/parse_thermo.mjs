import fs from 'node:fs';
import path from 'node:path';

const mdPath = "C:\\Users\\LENOVO\\Downloads\\Thermodynamics_All_Questions_Pooled_Topicwise.md";
const outPath = "D:\\New folder\\neetcore.com\\src\\data\\thermodynamics-questions.ts";

const userSubtopics = [
    "Thermodynamic Basics: Systems, Properties & Processes",
    "First Law of Thermodynamics: Heat, Work & Internal Energy",
    "Enthalpy and ΔH–ΔU Relations",
    "Work Done in Thermodynamic Processes",
    "Entropy and Second/Third Law of Thermodynamics",
    "Gibbs Free Energy, Spontaneity & Equilibrium",
    "Thermochemistry: Exothermic/Endothermic Reactions",
    "Kirchhoff’s Equation & Temperature Dependence of ΔH",
    "Enthalpy of Formation",
    "Enthalpy of Combustion",
    "Enthalpy of Hydrogenation, Atomisation & Transition",
    "Bond Energy / Bond Enthalpy",
    "Hess’s Law and Indirect Enthalpy Calculations",
    "Heat Capacity and the Cp–Cv Relation",
];

const text = fs.readFileSync(mdPath, 'utf-8');

const sections = text.split(/\n##\s+/);
const questionSections = [];
for (const sec of sections) {
  if (sec.includes("### Question")) {
    const title = sec.split("\n")[0].trim();
    questionSections.push([title, sec]);
  }
}
console.log(`Found ${questionSections.length} sections`);
questionSections.forEach(([t],i)=> console.log(i+1, t.slice(0,60)));

function addMath(s){
  if(!s) return s;
  s = s.replace(/\s+/g,' ').trim();
  // Replace symbols
  s = s.replace(/∆/g, '\\Delta');
  s = s.replace(/Δ/g, '\\Delta');
  s = s.replace(/→/g, '\\rightarrow');
  s = s.replace(/→/g, '\\rightarrow');
  s = s.replace(/   /g, '\\rightleftharpoons');
  s = s.replace(/   /g, '\\rightleftharpoons');
  s = s.replace(/⇌/g, '\\rightleftharpoons');
  s = s.replace(/½/g, '\\frac{1}{2}');
  s = s.replace(/¼/g, '\\frac{1}{4}');
  s = s.replace(/¾/g, '\\frac{3}{4}');
  // Wrap Delta, arrows, fractions - single pass each
  s = s.replace(/\\Delta\s*([A-Za-z_]+)?/g, (m, g1)=> g1 ? `$\\Delta ${g1}$` : `$\\Delta$`);
  s = s.replace(/\\rightarrow/g, '$\\rightarrow$');
  s = s.replace(/\\rightleftharpoons/g, '$\\rightleftharpoons$');
  // Wrap fractions
  s = s.replace(/\\frac\{[^}]+\}\{[^}]+\}/g, (m)=> `$${m}$`);
  // Fix adjacent math segments that now have "$$" between them - insert space instead of collapsing
  s = s.replace(/\$\$/g, '$ $');
  // Clean up any "$ $" double spaces
  s = s.replace(/\$ \$/g, '$ $');
  s = s.replace(/\bCp\b/g, '$C_p$');
  s = s.replace(/\bCv\b/g, '$C_v$');
  s = s.replace(/\$\\Delta n_g\$/g, '$\\Delta n_g$');
  if(s.endsWith(" N")) s = s.slice(0,-2).trim();
  return s.trim();
}
function cleanOpt(opt){
  opt = opt.trim();
  // Only strip leading dash if it's a separator " - " not a negative sign
  // Negative is "--" or "-500" without space; separator is "- " with space
  if(opt.startsWith("- ") ) opt = opt.slice(2).trim();
  opt = addMath(opt);
  return opt;
}

const imageMap = {
  "110944.png": "/images/che/thermo/q56-reversible-expansion.png",
  "111003.png": "/images/che/thermo/q57-pv-plots.png",
  "01_06_01 PM.png": "/images/che/thermo/q58-pv-curve.png",
  "111102.png": "/images/che/thermo/q82-a-to-b-path.png",
};

let all = [];
let globalIdx=0;
for(let secIdx=0; secIdx<questionSections.length; secIdx++){
  const [title, sec] = questionSections[secIdx];
  const canon = userSubtopics[secIdx] || title;
  const qBlocks = sec.split(/###\s+Question\s+\d+/);
  const qs=[];
  for(let b=1;b<qBlocks.length;b++){
    const block = qBlocks[b];
    globalIdx++;
    let qMatch = block.match(/\*\*Question\*\*\s*([\s\S]*?)\s*\*\*Options\*\*/);
    let qText = qMatch ? qMatch[1].trim() : "";
    let imgPublic = null;
    const imgCands = [...block.matchAll(/[A-Z]:\\[^\n"]+\.png/g)].map(m=>m[0]);
    for(const cand of imgCands){
      for(const [k,pub] of Object.entries(imageMap)){
        if(cand.includes(k)){ imgPublic = pub; break; }
      }
      if(!imgPublic){
        const fname = path.basename(cand).replace(/ /g,"_").replace(/,/g,"");
        imgPublic = `/images/che/thermo/${fname}`;
      }
      qText = qText.replace(cand,'').replace(`"${cand}"`,'');
    }
    qText = qText.replace(/"C:\\[^"]+\.png"/g,'').replace(/'C:\\[^']+\.png'/g,'').replace(/C:\\[^\s]+\.png/g,'').trim().replace(/^"+|"+$/g,'');
    qText = qText.replace(/\s+/g,' ').trim();

    let oMatch = block.match(/\*\*Options\*\*\s*([\s\S]*?)\s*\*\*Correct Option/);
    let oText = oMatch ? oMatch[1].trim() : "";
    oText = oText.replace(/[A-Z]:\\[^\n"]+\.png/g,'').replace(/"C:\\[^"]+\.png"/g,'');

    // Parse options
    const optRegex = /\(\s*([1-4])\s*\)\s*([\s\S]*?)(?=(?:-\s*\(\s*[1-4]\s*\)|$))/g;
    // Simpler: find all (n) segments by locating positions of " - (n)" or "(n)"
    // Let's use manual split approach: find all occurrences of "(1)" etc.
    let rawOpts = [];
    const optIter = [...oText.matchAll(/\(\s*([1-4])\s*\)\s*([\s\S]*?)(?=\s*-\s*\(\s*[1-4]\s*\)|\s*\*\*Correct|\s*$)/g)];
    // Fallback if regex above fails
    if(optIter.length!==4){
      // Try split by "- ("
      const parts = oText.split(/\s*-\s*\(\s*[1-4]\s*\)\s*/);
      // parts[0] may be empty or content before first?
      // The pattern "- (1) content - (2) content" => split gives ["", "content ", "content " ...]
      const filtered = parts.filter(p=>p.trim().length>0).map(p=> p.replace(/^--/,'-').trim());
       if(filtered.length===4){
         for(let i=0;i<4;i++) rawOpts.push([String(i+1), filtered[i]]);
       } else {
         console.log(`Warning Q${globalIdx} opts len ${optIter.length} oText: ${oText.slice(0,150)}`);
         // try another method: find by scanning
         const matches = [...oText.matchAll(/\(\s*([1-4])\s*\)/g)];
         for(let i=0;i<matches.length;i++){
           const start = matches[i].index + matches[i][0].length;
           const end = i+1<matches.length ? matches[i+1].index : oText.length;
           const content = oText.slice(start,end).replace(/^\s*-\s*/,'').replace(/^--/,'-').trim();
           rawOpts.push([matches[i][1], content]);
         }
      }
    } else {
      rawOpts = optIter.map(m=>[m[1], m[2]]);
    }
    if(rawOpts.length!==4){
      // last fallback: use optIter
      rawOpts = optIter.map(m=>[m[1], m[2]]);
    }
    let options=[];
    for(const [num, content] of rawOpts){
      let c = content.trim().replace(/^--/,'-').trim();
      // Do not strip single leading dash that is negative sign; only strip separator artefact " - " already removed
      c = c.replace(/\s+/g,' ').trim();
      // Convert remaining "--" inside to "-" (preserve negative)
      c = c.replace(/--/g,'-');
      options.push(c);
    }
    while(options.length<4) options.push("");
    options = options.slice(0,4);

    const cMatch = block.match(/\*\*Correct Option:\*\*\s*\(\s*([1-4])\s*\)/);
    const correctNum = cMatch ? parseInt(cMatch[1]) : 1;
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
out.push("export const thermodynamicsNcertEssentials: SetData = {");
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
