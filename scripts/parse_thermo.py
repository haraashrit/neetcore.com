import re
import pathlib
import json

md_path = pathlib.Path(r"C:\Users\LENOVO\Downloads\Thermodynamics_All_Questions_Pooled_Topicwise.md")
out_path = pathlib.Path(r"D:\New folder\neetcore.com\src\data\thermodynamics-questions.ts")

user_subtopics = [
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
]

# Map markdown heading normalized -> user subtopic
# markdown headings: e.g., "Thermodynamic Basics: Systems, Properties & Processes"
# We'll just use order, but also build map for safety
md_to_user = {}
# manual mapping - assume order same
text = md_path.read_text(encoding="utf-8")

# Find all ## sections
# Pattern: ## <title>\n ... until next ##
sections = re.split(r'\n##\s+', text)
# First section is title + intro, ignore
# sections[0] is header before first ##, sections[1..] are subtopics + questions
# But the initial subtopics list is also "## Subtopics created" which is not a real section
# Real question sections start at "## Thermodynamic Basics"

# Filter to keep only those that contain "### Question"
question_sections = []
for sec in sections:
    if "### Question" in sec:
        # title is first line
        title = sec.split("\n")[0].strip()
        question_sections.append((title, sec))

print(f"Found {len(question_sections)} sections with questions")

# Should be 14
for i, (title, sec) in enumerate(question_sections):
    print(i+1, title[:60])

# Define helper to clean and add LaTeX
def add_math(s: str) -> str:
    if not s:
        return s
    # Normalize whitespace
    s = re.sub(r'\s+', ' ', s).strip()
    # Remove some artifact markers like "N" at end (from PDF extraction)
    # Already handled elsewhere
    # Replace Δ/∆ with LaTeX
    # We will wrap ΔX directly as $\\Delta X$
    # Replace occurrences of ∆ or Δ followed by letters
    # Use placeholder: replace ∆H, ΔH, etc.
    # General: ∆ or Δ + optional space + letters (H, S, G, E, U, Cp, Cv, ng)
    # We'll do simple replacements first
    replacements = [
        (r'∆', r'\\Delta'),
        (r'Δ', r'\\Delta'),
        (r'→', r'\\rightarrow'),
        (r'→', r'\\rightarrow'),
        (r'   ', r'\\rightleftharpoons'),
        (r'   ', r'\\rightleftharpoons'),
        (r'⇌', r'\\rightleftharpoons'),
        (r'½', r'\\frac{1}{2}'),
        (r'¼', r'\\frac{1}{4}'),
        (r'¾', r'\\frac{3}{4}'),
        (r'–', r'-'), # en dash to hyphen for now, but later for ΔH–ΔU keep hyphen
        (r'—', r'-'),
    ]
    for pat, rep in replacements:
        s = s.replace(pat, rep)
    # Now wrap \Delta occurrences with $...$
    # Pattern: \Delta followed by optional space and letters/numbers
    # We want to turn "\Delta H" or "\DeltaH" into "$\\Delta H$"
    # But after replacement, we have "\Delta" literal
    s = re.sub(r'\\Delta\s*([A-Za-z_]+)', r'$\\Delta \1$', s)
    s = re.sub(r'\\Delta', r'$\\Delta$', s) # standalone
    # Wrap \rightarrow with $...$
    s = s.replace(r'\rightarrow', r'$\rightarrow$')
    s = s.replace(r'\rightleftharpoons', r'$\rightleftharpoons$')
    # Wrap fractions: \frac is already math, need $...$
    s = re.sub(r'\\frac\{[^}]+\}\{[^}]+\}', lambda m: f'${m.group(0)}$', s)
    # Handle Cp, Cv -> $C_p$ etc.
    s = re.sub(r'\bCp\b', r'$C_p$', s)
    s = re.sub(r'\bCv\b', r'$C_v$', s)
    s = re.sub(r'\bCp--Cv\b', r'$C_p - C_v$', s)
    s = re.sub(r'\bCp–Cv\b', r'$C_p - C_v$', s)
    # Also handle \Delta ng -> \Delta n_g
    s = s.replace(r'$\Delta ng$', r'$\Delta n_g$')
    s = s.replace(r'$\Delta ng$', r'$\Delta n_g$')
    # Clean double math wrappers like $$...$$ from previous
    s = re.sub(r'\$\$+', '$', s)
    # Remove stray trailing " N" artifacts that are at end of question (from PDF)
    # e.g., question ends with " N"
    if s.endswith(" N"):
        s = s[:-2].strip()
    # Fix duplicate $ issues: "$\Delta$" should be okay, but "$\Delta H$" repeated?
    # Ensure we don't have $ inside already $...$
    # Simplify: collapse "$ $" -> ""
    # Remove empty?
    # Keep as is
    return s.strip()

def clean_option_text(opt: str) -> str:
    # Remove leading numbering handled outside, just clean math
    opt = opt.strip()
    # Remove leading dash if any
    if opt.startswith("-"):
        opt = opt[1:].strip()
    # Apply math formatting
    opt = add_math(opt)
    # Ensure options have parentheses style? Keep as is
    return opt

# Image mapping
image_map = {
    "110944.png": "/images/che/thermo/q56-reversible-expansion.png",
    "111003.png": "/images/che/thermo/q57-pv-plots.png",
    "01_06_01 PM.png": "/images/che/thermo/q58-pv-curve.png",
    "111102.png": "/images/che/thermo/q82-a-to-b-path.png",
}
# Also handle the ChatGPT Image with commas
# We'll map by substring

# Parse questions
all_questions_by_section = []
global_q_index = 0

for sec_idx, (title, sec) in enumerate(question_sections):
    # Determine user subtopic name - map by index order (should match)
    if sec_idx < len(user_subtopics):
        canon_name = user_subtopics[sec_idx]
    else:
        canon_name = title
    # Split by ### Question
    q_blocks = re.split(r'###\s+Question\s+\d+', sec)
    # First block is heading, ignore
    qs = []
    for block in q_blocks[1:]:
        global_q_index += 1
        # Extract question text between **Question** and **Options**
        # Use regex
        q_match = re.search(r'\*\*Question\*\*\s*(.*?)\s*\*\*Options\*\*', block, re.DOTALL)
        q_text = q_match.group(1).strip() if q_match else ""
        # Remove image paths from q_text
        img_public = None
        img_candidates = re.findall(r'[A-Z]:\\[^\n"]+\.png', block)
        for cand in img_candidates:
            # Determine public path
            for key, pub in image_map.items():
                if key in cand:
                    img_public = pub
                    break
            if not img_public:
                # fallback generic
                fname = pathlib.Path(cand).name.replace(" ", "_").replace(",", "")
                img_public = f"/images/che/thermo/{fname}"
            # Remove this path from q_text
            q_text = q_text.replace(cand, "")
            q_text = q_text.replace(f'"{cand}"', "")
            q_text = q_text.replace(cand.replace("\\", "/"), "")
        # Also handle quoted path with quotes
        q_text = re.sub(r'"C:\\[^"]+\.png"', '', q_text).strip()
        q_text = re.sub(r"'C:\\[^']+\.png'", '', q_text).strip()
        q_text = re.sub(r'C:\\[^\s]+\.png', '', q_text).strip()
        # Clean up stray quotes
        q_text = q_text.strip().strip('"').strip("'")
        q_text = re.sub(r'\s+', ' ', q_text).strip()
        # Extract options block between **Options** and **Correct Option**
        o_match = re.search(r'\*\*Options\*\*\s*(.*?)\s*\*\*Correct Option', block, re.DOTALL)
        o_text = o_match.group(1).strip() if o_match else ""
        # Remove image path from o_text if any (unlikely)
        o_text = re.sub(r'[A-Z]:\\[^\n"]+\.png', '', o_text)
        o_text = re.sub(r'"C:\\[^"]+\.png"', '', o_text)
        # Now split options into 4
        # Options are like "- (1) ... - (2) ... - (3) ... - (4) ..."
        # Use regex to find each (1)..(4)
        opt_pattern = re.compile(r'\(\s*([1-4])\s*\)\s*(.*?)(?=(?:-\s*\(\s*[1-4]\s*\)|\Z))', re.DOTALL)
        raw_opts = opt_pattern.findall(o_text)
        # If not 4, try alternative split by " - "
        if len(raw_opts) != 4:
            # Try split by pattern "- ("
            parts = re.split(r'-\s*\(\s*[1-4]\s*\)', o_text)
            # parts[0] is empty before first, then 4 parts?
            # This fallback may produce 4
            raw_opts2 = []
            # Use findall again with simpler
            for m in re.finditer(r'\(\s*[1-4]\s*\)', o_text):
                pass
            print(f"Warning Q{global_q_index} opts len {len(raw_opts)} o_text: {o_text[:120]}")
            # Try to extract manually
            # Split by "- ("
            splits = re.split(r'\s*-\s*\(\s*[1-4]\s*\)\s*', o_text)
            # splits will have 5 elements (first empty)
            # The first split before first option is empty or dash
            # Clean
            splits = [s for s in splits if s.strip()]
            # If we have 4, use them
            if len(splits) == 4:
                raw_opts = [(str(i+1), splits[i]) for i in range(4)]
        # Ensure 4
        options = []
        for num, content in raw_opts:
            content = content.strip()
            # Remove leading "-"
            content = content.lstrip("-").strip()
            # Remove trailing hyphens/separators like "------------------------------------------------------------------------"
            content = re.sub(r'-{2,}', '', content).strip()
            # Remove trailing " Re-NEET (UG) 2022" etc? Keep as is but clean
            options.append(content)
        # If still not 4, pad
        while len(options) < 4:
            options.append("")
        options = options[:4]
        # Map correct
        c_match = re.search(r'\*\*Correct Option:\*\*\s*\(\s*([1-4])\s*\)', block)
        correct_num = int(c_match.group(1)) if c_match else 1
        answer_letter = {1:'A',2:'B',3:'C',4:'D'}[correct_num]
        # Format question and options with math
        q_formatted = add_math(q_text)
        # If q_text already contains chemical equation, ensure it's not over-wrapped
        # Add prefix? Keep as is
        # For options, format each and add (A) prefix for display consistency
        formatted_opts = []
        letters = ['A','B','C','D']
        for i, opt in enumerate(options):
            opt_clean = clean_option_text(opt)
            # Add letter prefix like "(A) " if not already
            if not opt_clean.startswith("("):
                opt_clean = f"({letters[i]}) {opt_clean}"
            else:
                # Ensure letter matches (convert (1) to (A))
                # Already handled? Options content doesn't include numbering after split, so we add prefix
                pass
            # If opt already has letter, don't duplicate
            formatted_opts.append(opt_clean)
        # Ensure options length 4 and are tuple
        qs.append({
            "q": q_formatted,
            "options": formatted_opts,
            "answer": answer_letter,
            "imagePublic": img_public
        })
    all_questions_by_section.append((canon_name, qs))

# Verify counts
for name, qs in all_questions_by_section:
    print(f"{name}: {len(qs)}")

total = sum(len(qs) for _, qs in all_questions_by_section)
print(f"Total {total}")

# Generate TS file
import textwrap

output = []
output.append("import type { SetData } from './questions';")
output.append("")
output.append("export const thermodynamicsNcertEssentials: SetData = {")
output.append("  subtopics: [")

for name, qs in all_questions_by_section:
    # Escape name for TS string: use json dumps for name
    output.append(f"    {{")
    output.append(f"      name: {json.dumps(name, ensure_ascii=False)},")
    output.append(f"      questions: [")
    for qobj in qs:
        q_escaped = json.dumps(qobj['q'], ensure_ascii=False)
        opts_escaped = json.dumps(qobj['options'], ensure_ascii=False)
        ans_escaped = json.dumps(qobj['answer'])
        if qobj['imagePublic']:
            img_escaped = json.dumps(qobj['imagePublic'])
            output.append(f"        {{ q: {q_escaped}, options: {opts_escaped} as [string, string, string, string], answer: {ans_escaped} as const, imagePublic: {img_escaped} }},")
        else:
            output.append(f"        {{ q: {q_escaped}, options: {opts_escaped} as [string, string, string, string], answer: {ans_escaped} as const }},")
    output.append(f"      ],")
    output.append(f"    }},")

output.append("  ],")
output.append("};")
output.append("")

out_path.write_text("\n".join(output), encoding="utf-8")
print(f"Wrote to {out_path}")
