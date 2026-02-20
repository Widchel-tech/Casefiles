// Add new cases by duplicating the object structure below.
// Scenes are decision-tree nodes keyed by "id". Choices point to nextSceneId.

window.CASES = [
  {
    id: "FBI-HOM-27-118",
    title: "CASE #001 — Homicide: Night Shift",
    classification: "HOMICIDE",
    location: "Kankakee County, IL",
    jurisdiction: "Federal nexus established via interstate procurement + digital evidence.",
    threatLevel: "MODERATE",
    requiredRank: "ANALYST",
    suspects: [
      { id:"S1", name:"Marcus Webb Jr.", summary:"Victim’s son. Financial stressors. Inconsistent alibi." },
      { id:"S2", name:"Nina Calder", summary:"Lab tech. Access to secure areas. Reports escalating conflict." },
      { id:"S3", name:"Evan Rourke", summary:"Contracted maintenance. After-hours presence. Prior theft charge." }
    ],
    tools: [
      { id:"T1", name:"Evidence Log", reqRank:"ANALYST", desc:"Log items into chain-of-custody. Improper logging reduces admissibility." },
      { id:"T2", name:"Warrant Request", reqRank:"AGENT", desc:"Request warrant for searches. Warrantless actions increase Procedural Risk." },
      { id:"T3", name:"Cell Tower Pull", reqRank:"SENIOR_AGENT", desc:"Request tower dump + device location corroboration." }
    ],
    startSceneId: "SCENE_1",
    scenes: [
      {
        id: "SCENE_1",
        title: "ARRIVAL // INITIAL RESPONSE",
        text:
          "Dispatch routes you to a restricted hospital laboratory after a night-shift technician reports a body and an unusual chemical odor. Patrol has secured the outer corridor, but the lab door is sealed with temporary tape and a handwritten warning. Inside the glass, stainless counters reflect emergency lights in slow pulses. A coffee cup sits near a workstation—untouched, lid half-open—beside a clipboard of access logs. The victim lies near the sinks. No dramatics, no chaos—just an engineered stillness. You are not here to guess. You are here to preserve facts, build admissible evidence, and protect the case from procedural collapse.",
        choices: [
          {
            label: "Establish scene control, call CSU, begin chain-of-custody log.",
            hint: "Best practice. Preserves admissibility.",
            effects: { score:+3, risk:+0, conviction:+5, addClues:["Scene secured", "CSU requested"] },
            nextSceneId: "SCENE_2"
          },
          {
            label: "Enter immediately to search the workstation for leads.",
            hint: "Fast, but contamination risk.",
            effects: { score:+1, risk:+2, conviction:-3, addClues:["Potential contamination"] },
            nextSceneId: "SCENE_2"
          },
          {
            label: "Interview the reporting technician before entering.",
            hint: "May preserve memory, but delays documentation.",
            effects: { score:+2, risk:+1, conviction:+0, addClues:["Initial witness statement"] },
            nextSceneId: "SCENE_2"
          }
        ]
      },

      {
        id: "SCENE_2",
        title: "EVIDENCE // FIRST PASS",
        text:
          "With the lab stabilized, you begin a controlled first pass: photograph, mark, document. The coffee cup is positioned too neatly for panic; the access log shows a gap in expected entries. A wall terminal displays a security prompt, recently used. A faint residue is visible around the sink drain—chemical or cleaning agent, unclear. You can move fast, but speed is not the standard. The standard is what survives scrutiny in court.",
        choices: [
          {
            label: "Bag the coffee cup as priority evidence and log it immediately.",
            hint: "Potential prints/DNA. Strong chain-of-custody.",
            effects: { score:+3, risk:+0, conviction:+6, addClues:["Coffee cup collected (logged)"] },
            nextSceneId: "SCENE_3"
          },
          {
            label: "Scrape sink residue for lab analysis and document sampling method.",
            hint: "Forensics-driven approach.",
            effects: { score:+2, risk:+0, conviction:+4, addClues:["Sink residue sample (logged)"] },
            nextSceneId: "SCENE_3"
          },
          {
            label: "Access the wall terminal without warrant ‘to save time’.",
            hint: "May create suppression issues later.",
            effects: { score:+2, risk:+3, conviction:-6, addClues:["Terminal accessed without warrant"] },
            nextSceneId: "SCENE_3"
          }
        ]
      },

      {
        id: "SCENE_3",
        title: "INTERVIEW // INITIAL CONTACT",
        text:
          "You sit the reporting technician in a quiet corridor. They describe arriving early, noticing the lab lights on, and smelling something ‘sharp’—like bitter almonds—but they hesitate when pressed, worried about saying the wrong thing. Their hands tremble, but their timeline is consistent. They mention seeing a familiar figure moving away from the lab entrance—someone who ‘didn’t belong there’ at that hour.",
        choices: [
          {
            label: "Collect a detailed timeline, then ask for a description of the figure.",
            hint: "Structured interview. Builds reliable statement.",
            effects: { score:+3, risk:+0, conviction:+4, addClues:["Witness: unknown figure described"] },
            nextSceneId: "SCENE_4"
          },
          {
            label: "Push aggressively for a name and threaten disciplinary action.",
            hint: "May reduce cooperation.",
            effects: { score:-1, risk:+1, conviction:-2, addClues:["Witness intimidated"] },
            nextSceneId: "SCENE_4"
          }
        ]
      },

      {
        id: "SCENE_4",
        title: "SUSPECTS // FIRST CONTACT",
        text:
          "Three names rise quickly: the victim’s son with a known financial dispute, a lab tech with access and a recent workplace conflict, and a contracted maintenance worker seen on camera near restricted doors in prior weeks. None are convictions. They’re directions. The case will live or die on what you can prove, and whether you collect it legally.",
        choices: [
          {
            label: "Bring in Marcus Webb Jr. for a voluntary interview.",
            hint: "Start with motive pressure + contradictions.",
            effects: { score:+2, risk:+0, conviction:+2, addClues:["Interview scheduled: Webb Jr."] },
            nextSceneId: "SCENE_5"
          },
          {
            label: "Request a warrant for digital comms + access logs (if rank allows).",
            hint: "Best legal pathway.",
            effects: { score:+3, risk:+0, conviction:+5, addClues:["Warrant requested"] },
            nextSceneId: "SCENE_6",
            requireRank: "AGENT"
          },
          {
            label: "Skip warrants and pull digital logs through ‘a friend in IT’.",
            hint: "Fast but dangerous in court.",
            effects: { score:+2, risk:+4, conviction:-8, addClues:["Digital logs obtained unlawfully"] },
            nextSceneId: "SCENE_6"
          }
        ]
      },

      {
        id: "SCENE_5",
        title: "INTERROGATION // WEBB JR.",
        text:
          "Webb Jr. sits down with controlled posture and rehearsed calm. He claims he hasn’t been near the hospital all week. His answers are polished, but the gaps show when you slow the pace. When asked about money, his jaw tightens—then he pivots to ‘family misunderstandings.’ He watches your hands more than your face, tracking what you’ve got.",
        choices: [
          {
            label: "Present logged evidence you have and ask for explanation.",
            hint: "Evidence-based confrontation.",
            effects: { score:+3, risk:+0, conviction:+5, addClues:["Webb Jr. narrative tested"] },
            nextSceneId: "SCENE_7",
            requireClues: ["Coffee cup collected (logged)"]
          },
          {
            label: "Push without evidence, attempt to force a confession.",
            hint: "Likely shutdown or lawyer request.",
            effects: { score:-2, risk:+2, conviction:-4, addClues:["Lawyer requested"] },
            nextSceneId: "SCENE_7"
          }
        ]
      },

      {
        id: "SCENE_6",
        title: "DIGITAL // ACCESS & TIMELINE",
        text:
          "The lab access log shows a credential used outside normal hours, but the entry method suggests badge-clone or tailgating. A terminal session was initiated near the time of death. A single email thread suggests escalating demands for money—yet motive isn’t proof. Proof is timestamps, admissible logs, and verified identity.",
        choices: [
          {
            label: "Corroborate access event with camera footage and metadata.",
            hint: "Builds prosecution-grade timeline.",
            effects: { score:+3, risk:+0, conviction:+5, addClues:["Access event corroboration started"] },
            nextSceneId: "SCENE_7"
          },
          {
            label: "Immediately arrest based on motive + suspicious access.",
            hint: "Premature arrest can collapse.",
            effects: { score:-3, risk:+3, conviction:-6, addClues:["Premature arrest attempt"] },
            nextSceneId: "SCENE_8"
          }
        ]
      },

      {
        id: "SCENE_7",
        title: "FORENSICS // RESULTS",
        text:
          "Forensics returns partials: the coffee cup holds multiple prints consistent with handling and preparation, but one clear print belongs to a person who denies being present. Residue analysis indicates a toxic compound consistent with deliberate introduction, not accidental exposure. A controlled act. A controlled scene.",
        choices: [
          {
            label: "Build final accusation package: prints + residue + timeline.",
            hint: "Requires at least 3 major clues.",
            effects: { score:+4, risk:+0, conviction:+8, addClues:["Forensics: prints", "Forensics: residue toxic"] },
            nextSceneId: "SCENE_9"
          },
          {
            label: "Ignore forensics and focus on ‘gut’ suspect.",
            hint: "Weak case theory.",
            effects: { score:-3, risk:+1, conviction:-7, addClues:["Case theory weakened"] },
            nextSceneId: "SCENE_9"
          }
        ]
      },

      {
        id: "SCENE_8",
        title: "CONSEQUENCES // PROCEDURAL HEAT",
        text:
          "The arrest triggers immediate scrutiny. Counsel challenges probable cause. If you cannot show legally obtained evidence supporting the arrest, the case begins bleeding credibility. Pressure isn’t just on the suspect—it's on your procedure.",
        choices: [
          {
            label: "Correct course: document, seek warrant, rebuild admissible chain.",
            hint: "Damage control.",
            effects: { score:+1, risk:-1, conviction:+2, addClues:["Procedure corrected"] },
            nextSceneId: "SCENE_9"
          },
          {
            label: "Double down. Continue without approvals.",
            hint: "High risk of COMPROMISED ending.",
            effects: { score:+0, risk:+3, conviction:-6, addClues:["Procedure disregarded"] },
            nextSceneId: "SCENE_9"
          }
        ]
      },

      {
        id: "SCENE_9",
        title: "ACCUSATION // THRESHOLD",
        text:
          "You prepare the accusation. The standard isn’t certainty—it’s admissible evidence that survives cross-examination. If you have at least three major clues obtained properly, the prosecution has a path. If you cut corners, the truth can still lose.",
        choices: [
          {
            label: "Accuse Marcus Webb Jr.",
            hint: "Must be supported by 3+ major clues and low procedural risk.",
            effects: { score:+0, risk:+0, conviction:+0 },
            nextSceneId: "END"
          },
          {
            label: "Accuse Nina Calder.",
            hint: "Alternate theory; requires evidence support.",
            effects: { score:+0, risk:+0, conviction:+0 },
            nextSceneId: "END"
          },
          {
            label: "Accuse Evan Rourke.",
            hint: "Alternate theory; requires evidence support.",
            effects: { score:+0, risk:+0, conviction:+0 },
            nextSceneId: "END"
          }
        ]
      },

      {
        id: "END",
        title: "CASE STATUS // FINAL",
        text:
          "Final review initiated. The case outcome will be determined by evidence strength, legality, and conviction probability.",
        choices: []
      }
    ]
  }
];
