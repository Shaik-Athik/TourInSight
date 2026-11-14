// JavaScript port of AI_recommendation/recommendation.py
// Same scoring: Rating*10 + (1 - cost/budget)*30 + (1 - distance/50)*20

export async function loadPlacesCsv() {
  const res = await fetch("/places.csv");
  if (!res.ok) throw new Error("Could not load places data");
  const text = await res.text();
  const [header, ...rows] = text.trim().split(/\r?\n/);
  const cols = header.split(",").map((c) => c.trim());
  return rows
    .filter(Boolean)
    .map((row) => {
      const values = row.split(",");
      const obj = {};
      cols.forEach((c, i) => (obj[c] = values[i]?.trim()));
      return {
        place: obj.Place,
        city: obj.City,
        category: obj.Category,
        cost: Number(obj.Cost),
        rating: Number(obj.Rating),
        distance: Number(obj.Distance),
      };
    });
}

export function recommendPlaces(places, city, interests, budget, days) {
  const wanted = interests.map((x) => x.trim().toLowerCase());

  const filtered = places.filter(
    (p) =>
      p.city.toLowerCase() === city.trim().toLowerCase() &&
      wanted.includes(p.category.toLowerCase()) &&
      p.cost <= budget
  );

  return filtered
    .map((p) => ({
      ...p,
      score: Number(
        (
          p.rating * 10 +
          (budget > 0 ? (1 - p.cost / budget) * 30 : 30) +
          (1 - p.distance / 50) * 20
        ).toFixed(2)
      ),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, days * 2);
}
