import type { SetData } from './questions';

export const chemicalBondingRace : SetData = {
  subtopics: [
    {
      name: "Octet Rule / Valency",
      questions: [
      ],
    },
    {
      name: "Covalent Bond & Orbital Overlap",
      questions: [
        { q: "The molecule which contain σ bonds, π bonds and lone pairs in 1 : 1 : 1 ratio :-", options: ["(A) C₂N₂ (Cyanogen)","(B) C₆H₆ (Benzene)","(C) C(CN)₄ (Tetracyano methane)","(D) C₃O₂ (Carbon suboxide)"] as [string, string, string, string], answer: "D" as const },
        { q: "In CO₂, SO₂, SiO₂ each central atom is covalently bonded with :-", options: ["(A) 2,2,4 oxygen atoms respectively","(B) 2,2,2 oxygen atoms respectively","(C) 2,4,4 oxygen atoms respectively","(D) 4,4,4 oxygen atoms respectively"] as [string, string, string, string], answer: "A" as const },
        { q: "Correct order of overlapping strength is:-", options: ["(A) 2s–2s > 2p–2p > 2s–2p","(B) 1s–1s > 2p–2p > 2s–2p","(C) 1s–1s < 2s–2s < 3s–3s","(D) 3s–3s > 3s–3p > 3p–3p"] as [string, string, string, string], answer: "B" as const },
        { q: "Which compound is formed in 2nd excited state?", options: ["(A) PCl₅","(B) SH₆","(C) SO₃","(D) IF₇"] as [string, string, string, string], answer: "C" as const },
        { q: "Which of the following element never form compound in ground state ?", options: ["(A) N","(B) B","(C) C","(D) P"] as [string, string, string, string], answer: "B" as const },
        { q: "Which of the following molecule has both pπ-pπ and pπ-dπ bonds", options: ["(A) XeO₂F₂","(B) SO₂Cl₂","(C) SO₃","(D) XeO₃"] as [string, string, string, string], answer: "C" as const },
        { q: "Which of the following is not correctly matched between given species and type of overlapping ?", options: ["(A) XeO₃ : Three (dπ–pπ) bonds","(B) H₂SO₄: Two (dπ–pπ) bonds","(C) SO₂ : Two (dπ–pπ) bonds","(D) HClO₄ : Three (dπ–pπ) bonds"] as [string, string, string, string], answer: "C" as const },
      ],
    },
    {
      name: "Hybridisation & Molecular Shape (VSEPR)",
      questions: [
        { q: "Two hybrid orbitals have a bond angle of 120º. The percentage of p character in the hybrid orbital is nearly:-", options: ["(A) 25%","(B) 33%","(C) 50%","(D) 66%"] as [string, string, string, string], answer: "D" as const },
        { q: "A molecule XY₂ contains two σ, two π bond and one lone pair of electron in the valence shell of X. The arrangement of lone pair as well as bond pair is :", options: ["(A) Square pyramidal","(B) Linear","(C) Trigonal planar","(D) Unpredictable"] as [string, string, string, string], answer: "C" as const },
        { q: "Which of the following statement is correct, if %s-character of a hybrid orbital decreases", options: ["(A) The bond angle decreases","(B) The bond strength increases","(C) The bond length decreases","(D) Size of orbital decreases"] as [string, string, string, string], answer: "A" as const },
        { q: "Incorrect order of bond angle is :-", options: ["(A) NH₃ > PH₃ > AsH₃","(B) H₂O > H₂S > H₂Se","(C) BCl₃ > AlCl₃ > GaCl₃","(D) NO₂⁺ > NO₂ > NO₂⁻"] as [string, string, string, string], answer: "C" as const },
        { q: "Correct order of bond angle is :-", options: ["(A) CH₃⁺ > CH₃⁻ > CH₄","(B) BeCl₂ > BF₃ < CF₄","(C) NH₄⁺ > NH₃ > NH₂⁻","(D) OF₂ > OCl₂ > OBr₂"] as [string, string, string, string], answer: "C" as const },
        { q: "Which of the following set does not have $sp$³d hybridization ?", options: ["(A) PF₅ & BrF₃","(B) ICl₂⁺ & XeF₆","(C) XeF₂ & I₃⁻","(D) AsF₄⁻ & SCl₄"] as [string, string, string, string], answer: "B" as const },
        { q: "Select in which both have see-saw shape ?", options: ["(A) XeO₂F₂, SiF₄","(B) XeO₂F₂, SF₄","(C) TeCl₄, ICl₄⁻","(D) BrO₃F, XeOF₂"] as [string, string, string, string], answer: "B" as const },
        { q: "Which of the following molecule is planar as well as polar ?", options: ["(A) PCl₃","(B) H₂O₂","(C) ClF₃","(D) XeO₃F₂"] as [string, string, string, string], answer: "C" as const },
        { q: "Total no. of vacant orbitals in valence shell of sulphur when it undergoes formation of SF₄:-", options: ["(A) 5","(B) 4","(C) 3","(D) 2"] as [string, string, string, string], answer: "B" as const },
        { q: "Which of the following pair have same hybridisation ?", options: ["(A) ClO₄⁻ & ClO₂⁻","(B) SF₄ & CCl₄","(C) BF₃ & NF₃","(D) CO₂ & SO₂"] as [string, string, string, string], answer: "A" as const },
        { q: "Which orbital is not involved in the formation of PCl₅ molecule ?", options: ["(A) s","(B) d(z²)","(C) d(x²–y²)","(D) pz"] as [string, string, string, string], answer: "C" as const },
        { q: "Shape of molecule having 4-bond pair and one lone pair is :-", options: ["(A) Trigonal bipyramidal","(B) T-Shape","(C) Folded square","(D) Square planar"] as [string, string, string, string], answer: "C" as const },
        { q: "In which pair both are not isostructural ?", options: ["(A) BH₄⁻ & AlH₄⁻","(B) NH₄⁺ & PH₄⁺","(C) PCl₆⁻ & SiF₆²⁻","(D) BCl₄⁻ & ICl₄⁻"] as [string, string, string, string], answer: "D" as const },
        { q: "The incorrect order of bond angle :-", options: ["(A) CO₂ > CO₃²⁻ > CH₃⁻","(B) NO₂⁺ > NO₃⁻ > NO₂⁻","(C) XeF₂ > XeO₃ > XeO₄","(D) PH₃ > AsH₃ > SbH₃"] as [string, string, string, string], answer: "C" as const },
        { q: "Which of the following molecule has two lone pairs and bond angle < 109$^{\\circ}$28' ?", options: ["(A) SF₂","(B) KrF₄","(C) ICl₄⁻","(D) All of these"] as [string, string, string, string], answer: "D" as const },
        { q: "Which of the following conversions involve change in both hybridisation & shape :-", options: ["(A) CH₄ $\\rightarrow$ C₂H₆","(B) NH₃ $\\rightarrow$ NH₄⁺","(C) BF₃ $\\rightarrow$ BF₄⁻","(D) H₂O $\\rightarrow$ H₃O⁺"] as [string, string, string, string], answer: "C" as const },
        { q: "In which of the following compound all the bond angles are equal :-", options: ["(A) SF₄","(B) CCl₄","(C) CHCl₃","(D) XeF₆"] as [string, string, string, string], answer: "B" as const },
        { q: "In which hybridisation, resulting all orbitals are NOT equivalent ?", options: ["(A) $sp$³","(B) $sp$³d","(C) $sp$³d²","(D) $sp$²"] as [string, string, string, string], answer: "B" as const },
      ],
    },
    {
      name: "Coordinate Bond",
      questions: [
        { q: "Dative Bond is present in :-", options: ["(A) KI₃","(B) KNO₂","(C) KHF₂","(D) All"] as [string, string, string, string], answer: "A" as const },
      ],
    },
    {
      name: "Dipole Moment / Polarity",
      questions: [
        { q: "In which type of molecule, the dipole moment may be nonzero (L $\\rightarrow$ Lone pair) ?", options: ["(A) AB₂L₂","(B) AB₂L₃","(C) AB₄L₂","(D) AB₄"] as [string, string, string, string], answer: "A" as const },
        { q: "Which of the following specie is non polar with presence of polar bond and lone pair of electron on central atom.", options: ["(A) CO₂","(B) SO₃","(C) XeF₄","(D) CF₄"] as [string, string, string, string], answer: "C" as const },
      ],
    },
    {
      name: "Molecular Orbital Theory & Bond Order",
      questions: [
        { q: "Which of the following statement is not correct from the point of view of molecular orbital theory?", options: ["(A) Be₂ is not a stable molecule","(B) He₂ is not stable but He₂⁺ is expected to exist","(C) Bond strength of N₂ is maximum amongst the homonuclear diatomic molecules","(D) The order of energies of molecular orbitals in F₂ molecule is π2px = π2py < σ2pz"] as [string, string, string, string], answer: "D" as const },
      ],
    },
    {
      name: "Resonance & Formal Charge",
      questions: [
        { q: "Which of the following do not exhibit resonance ?", options: ["(A) CO₃²⁻","(B) ClO₃⁻","(C) PH₃","(D) SO₃²⁻"] as [string, string, string, string], answer: "C" as const },
      ],
    },
    {
      name: "Hydrogen Bonding & Intermolecular Forces",
      questions: [
        { q: "Intramolecular hydrogen bonding is not present in :-", options: ["(A) p-fluoro phenol","(B) Chloral hydrate","(C) o-nitro phenol","(D) o-fluoro phenol"] as [string, string, string, string], answer: "A" as const },
        { q: "London Dispersion force is mainly present between :-", options: ["(A) Polar + Polar molecules","(B) Nonpolar + Non-polar molecules","(C) Polar + Nonpolar molecules","(D) Ionic"] as [string, string, string, string], answer: "B" as const },
        { q: "Among the following vanderwaal force is maximum in :-", options: ["(A) HBr","(B) H₂","(C) HCl","(D) HI"] as [string, string, string, string], answer: "D" as const },
        { q: "The incorrect statement regarding chloral hydrate CCl₃CH(OH)₂ is :-", options: ["(A) It exhibits intramolecular hydrogen bonding","(B) It has 9 lone pair and 9 bond pair","(C) It is stable inspite of coexistence of two-OH groups on a carbon atom","(D) Compound is non-planar and polar"] as [string, string, string, string], answer: "A" as const },
      ],
    },
    {
      name: "Ionic Bond, Lattice Energy & Ionic/Covalent Character",
      questions: [
        { q: "The correct order of decreasing lattice energy is :-", options: ["(A) CaO > MgBr₂ > CsI","(B) MgBr₂ > CaO > CsI","(C) CsI > MgBr₂ > CaO","(D) CsI > CaO > MgBr₂"] as [string, string, string, string], answer: "A" as const },
        { q: "In which of the following set do all the three compounds have bonds that are mainly ionic?", options: ["(A) NaCl, NCl₃, CCl₄","(B) CsBr, BaBr₂, SrO","(C) CsF, BF₃, NH₃","(D) Al₂O₃, CaO, SO₂"] as [string, string, string, string], answer: "B" as const },
        { q: "Which of the following order is incorrect ?", options: ["(A) Ionic character = MCl < MCl₂ < MCl₃","(B) Polarizibility = F⁻ < Cl⁻ < Br⁻ < I⁻","(C) Polarising power = Na⁺ < Ca²⁺ < Mg²⁺ < Al³⁺","(D) Covalent character = LiF < LiCl < LiBr < LiI"] as [string, string, string, string], answer: "A" as const },
        { q: "Which of the following order is not correct ?", options: ["(A) CrO < Cr₂O₃ < CrO₃ (covalent character)","(B) ZnO > ZnS (ionic character)","(C) BeCl₂ > MgCl₂ > CaCl₂ > SrCl₂ > BaCl₂ (ionic character)","(D) KCl < AgCl (covalent character)"] as [string, string, string, string], answer: "C" as const },
        { q: "Which of the following order is incorrect for thermal stability ?", options: ["(A) BeO > MgO > CaO","(B) NH₃ < H₂O < HF","(C) HF < HCl < HBr < HI","(D) Li₂SO₄ < Na₂SO₄ < K₂SO₄ < Rb₂SO₄ < Cs₂SO₄"] as [string, string, string, string], answer: "C" as const },
        { q: "Which of the following solubility order is not correct ?", options: ["(A) MgF₂ < CaF₂ < SrF₂ < BaF₂","(B) Be(OH)₂ < Mg(OH)₂ < Ca(OH)₂ < Sr(OH)₂","(C) Li₂O < Na₂O < K₂O < Rb₂O < Cs₂O","(D) CsF < CsCl < CsBr < CsI"] as [string, string, string, string], answer: "D" as const },
        { q: "Which of the following compound has ionic bond, π-bond, co-ordinate bond and covalent bond ?", options: ["(A) Na₂CO₃","(B) NaNO₃","(C) KNO₂","(D) NH₄Cl"] as [string, string, string, string], answer: "B" as const },
        { q: "Which has highest lattice energy ?", options: ["(A) Al₂O₃","(B) TiC","(C) CaF₂","(D) NaF"] as [string, string, string, string], answer: "B" as const },
        { q: "Which of the following will be most covalent?", options: ["(A) NaCl","(B) Na₂S","(C) MgCl₂","(D) MgS"] as [string, string, string, string], answer: "D" as const },
        { q: "Which of the following compound on thermal decomposition yields a basic as well as acidic oxides?", options: ["(A) Ca(OH)₂","(B) Ba(OH)₂","(C) K₂CO₃","(D) MgCO₃"] as [string, string, string, string], answer: "D" as const },
        { q: "Ionic mobility of Li⁺(aq) is less than Na⁺(aq) and K⁺(aq) because :-", options: ["(A) ionisation potential of lithium is low","(B) charge density of Li⁺ is low","(C) high hydration tendency of Li⁺","(D) Li⁺ keeps two electrons"] as [string, string, string, string], answer: "C" as const },
        { q: "Which of the metal carbonates is thermally most stable ?", options: ["(A) MgCO₃","(B) BaCO₃","(C) SrCO₃","(D) K₂CO₃"] as [string, string, string, string], answer: "D" as const },
        { q: "Which of the following halides has the maximum covalent character?", options: ["(A) LiI","(B) NaI","(C) KI","(D) CsI"] as [string, string, string, string], answer: "A" as const },
        { q: "Magnesium oxide can be obtained by heating :-", options: ["(A) MgCO₃","(B) Mg(NO₃)₂","(C) Mg(OH)₂","(D) All"] as [string, string, string, string], answer: "D" as const },
        { q: "Which of the following compound gives paramagnetic gas on heating ?", options: ["(A) LiNO₃","(B) NaHCO₃","(C) K₂SO₄","(D) All of these"] as [string, string, string, string], answer: "A" as const },
        { q: "Which of the following can not be explained on the basis of polarisation ?", options: ["(A) Ag₂S is much less soluble than Ag₂O","(B) BeCO₃ is thermally less stable than BaCO₃","(C) BaCO₃ is less soluble than MgCO₃","(D) Melting point of AlCl₃ is much less than that of NaCl."] as [string, string, string, string], answer: "C" as const },
      ],
    },
    {
      name: "Isoelectronic & Isostructural Species",
      questions: [
      ],
    },
  ],
};
