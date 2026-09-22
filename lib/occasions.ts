export type Occasion = {
  id: string;
  label: string;
  itemName: string;
  emoji: string;
  accent: string;
  defArticle: string;
  demArticle: string;
};

type OccasionGender = "f" | "m";

function articlesFor(gender: OccasionGender) {
  return gender === "f"
    ? { defArticle: "Las", demArticle: "Estas" }
    : { defArticle: "Los", demArticle: "Estos" };
}

type RawOccasion = Omit<Occasion, "defArticle" | "demArticle"> & {
  gender: OccasionGender;
  start: [number, number];
  end: [number, number];
};

const RAW_OCCASIONS: RawOccasion[] = [
  {
    id: "navidad",
    label: "Navidad",
    itemName: "luces navideñas",
    emoji: "🎄",
    accent: "#ef4444",
    gender: "f",
    start: [12, 20],
    end: [12, 31],
  },
  {
    id: "anio-nuevo",
    label: "Año Nuevo",
    itemName: "fuegos artificiales",
    emoji: "🎆",
    accent: "#38bdf8",
    gender: "m",
    start: [1, 1],
    end: [1, 6],
  },
  {
    id: "san-valentin",
    label: "Día de San Valentín",
    itemName: "rosas rojas",
    emoji: "❤️",
    accent: "#e11d48",
    gender: "f",
    start: [2, 10],
    end: [2, 16],
  },
  {
    id: "dia-del-amigo",
    label: "Día del Amigo",
    itemName: "abrazos sinceros",
    emoji: "🤗",
    accent: "#f97316",
    gender: "m",
    start: [7, 18],
    end: [7, 22],
  },
  {
    id: "amistad-internacional",
    label: "Día Internacional de la Amistad",
    itemName: "gestos de amistad",
    emoji: "🤝",
    accent: "#0ea5e9",
    gender: "m",
    start: [7, 28],
    end: [8, 1],
  },
  {
    id: "flores-amarillas",
    label: "Día de las Flores Amarillas",
    itemName: "flores amarillas",
    emoji: "🌼",
    accent: "#f59e0b",
    gender: "f",
    start: [9, 19],
    end: [9, 23],
  },
];

const OCCASIONS = RAW_OCCASIONS.map((o) => ({ ...o, ...articlesFor(o.gender) }));

const DEFAULT_OCCASION: Occasion = {
  id: "flores-amarillas",
  label: "Día de las Flores Amarillas",
  itemName: "flores amarillas",
  emoji: "🌼",
  accent: "#f59e0b",
  ...articlesFor("f"),
};

function inRange(month: number, day: number, start: [number, number], end: [number, number]) {
  const value = month * 100 + day;
  const startValue = start[0] * 100 + start[1];
  const endValue = end[0] * 100 + end[1];
  return value >= startValue && value <= endValue;
}

export function getCurrentOccasion(date: Date = new Date()): Occasion {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const match = OCCASIONS.find((o) => inRange(month, day, o.start, o.end));
  return match ?? DEFAULT_OCCASION;
}

export function getOccasionById(id: string | null | undefined): Occasion {
  const match = OCCASIONS.find((o) => o.id === id);
  return match ?? DEFAULT_OCCASION;
}
