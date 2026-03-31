async function fetchExercises() {
  const res = await fetch("https://wger.de/api/v2/exerciseinfo/?limit=100");
  const data = await res.json();

  const englishExercises = data.results.map(ex => {
    const englishTranslation = ex.translations.find(t => t.language === 2); // 2 = English

    if (!englishTranslation) return null;

    return {
      name: englishTranslation.name,
      category: ex.category.name,
      equipment: ex.equipment.map(eq => eq.name).join(", ") || "Bodyweight"
    };
  });

  // remove nulls
  return englishExercises.filter(Boolean);
}