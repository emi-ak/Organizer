const todayISO = new Date().toISOString().slice(0, 10);

const defaultData = {
  categories: [
    { id: crypto.randomUUID(), name: "Volunteering", goal: 120, activities: [
      { id: crypto.randomUUID(), name: "Community health volunteering", date: todayISO, hours: 12, notes: "Helped with patient-facing community support." }
    ]},
    { id: crypto.randomUUID(), name: "Shadowing", goal: 50, activities: [] },
    { id: crypto.randomUUID(), name: "Research", goal: 300, activities: [] },
    { id: crypto.randomUUID(), name: "Clinical Experience", goal: 150, activities: [] },
    { id: crypto.randomUUID(), name: "Leadership", goal: 100, activities: [] }
  ],
  timeline: [
    { id: crypto.randomUUID(), title: "MCAT content review", date: "2026-09-01", type: "MCAT", notes: "Build weekly study schedule." },
    { id: crypto.randomUUID(), title: "Join one extracurricular project", date: "2026-10-01", type: "Extracurriculars", notes: "Choose something meaningful and consistent." },
    { id: crypto.randomUUID(), title: "Ask for letters of recommendation", date: "2027-02-01", type: "Application", notes: "Prepare CV and activity list." }
  ],
  modules: [
    {
      id: crypto.randomUUID(),
      name: "Cell Biology",
      term: "Term 1",
      year: "Year 1",
      assignments: [
        { id: crypto.randomUUID(), name: "Lab report", mark: 72, weight: 30, date: todayISO },
        { id: crypto.randomUUID(), name: "Final exam", mark: 68, weight: 70, date: todayISO }
      ]
    }
  ],
  vision: [],
  affirmations: [
    { id: crypto.randomUUID(), date: todayISO, text: "Come to me, all you who are weary and burdened, and I will give you rest. ~ Matthew 11:28" },
    { id: crypto.randomUUID(), date: todayISO, text: "God has not given me a spirit of fear, but of power, love, and self-control. ~ 2 Timothy 1:7" },
    { id: crypto.randomUUID(), date: todayISO, text: "Commit your work to the Lord, and your plans will be established. ~ Proverbs 16:3" }
  ],
  resources: [
    { id: crypto.randomUUID(), title: "AMCAS Applicant Guide", url: "https://students-residents.aamc.org/applying-medical-school-amcas/applying-medical-school-amcas", notes: "Primary application information." }
  ],
  goals: [
    { id: crypto.randomUUID(), text: "Update CV this month", dueDate: todayISO, category: "Career", importance: "Medium", done: false },
    { id: crypto.randomUUID(), text: "Find one research opportunity", dueDate: todayISO, category: "Research", importance: "High", done: false }
  ]
};
