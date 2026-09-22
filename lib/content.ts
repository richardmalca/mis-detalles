export type ExperienceKind = "amor" | "amistad";

export type ExperienceContent = {
  intro: string;
  phrases: string[];
  finalTitle: string;
  finalMessage: string;
  formPrompt: string;
  badge: string;
  occasionLabel: string;
};

const BASE = {
  occasionLabel: "Día de las Flores Amarillas · 21 de marzo",
  formPrompt: "Si quieres, déjame algo aquí (solo se guarda, nadie más lo lee):",
};

function amor(name: string): Omit<ExperienceContent, "occasionLabel"> {
  return {
    badge: "🌼 para ti",
    intro:
      "No todos los cuerpos del universo fueron hechos para orbitar la misma estrella. Nosotros sí.",
    phrases: [
      "Dicen que dos cuerpos con suficiente masa terminan por atraerse, tarde o temprano.",
      "Que no importa la distancia: la gravedad siempre encuentra la forma de llegar.",
      "Yo no sé mucho de física, pero sé que desde que apareciste, cambió mi órbita entera.",
      "Hay flores que solo se abren un día al año, como si supieran que ese día es distinto.",
      "Hoy el campo se llena de flores amarillas, y aun así, pienso en ti antes que en cualquier flor.",
      "Si tuviera una sola estrella fugaz para pedir un deseo,",
      `pediría seguir cruzándome contigo, ${name}, en cada versión de este universo.`,
    ],
    finalTitle: `${name}, eres la razón por la que este universo tiene sentido.`,
    finalMessage:
      "Feliz Día de las Flores Amarillas. Que cada flor amarilla de hoy te recuerde lo especial que eres para mí.",
    formPrompt: BASE.formPrompt,
  };
}

function amistad(name: string): Omit<ExperienceContent, "occasionLabel"> {
  return {
    badge: "🌻 para ti",
    intro:
      "Hay personas que aparecen sin avisar, como una estrella fugaz que decides quedarte mirando.",
    phrases: [
      "No hacía falta que estuviéramos en el mismo lugar del universo para que esto funcionara.",
      "Bastó con cruzar órbitas una sola vez para que algo se quedara ahí, dando vueltas.",
      "Las amistades de verdad no se apagan: solo cambian de forma, como las constelaciones.",
      "Hoy es el día de las flores amarillas,",
      `y quiero que sepas, ${name}, que sigues siendo una de las luces que no dejo de mirar.`,
      "No todos los planetas giran cerca, pero los que importan, siempre encuentran la forma de volver.",
    ],
    finalTitle: `${name}, gracias por ser una de las constantes en mi universo.`,
    finalMessage:
      "Feliz Día de las Flores Amarillas. Aquí va tu flor amarilla, de un planeta al tuyo.",
    formPrompt: BASE.formPrompt,
  };
}

export function getExperienceContent(
  kind: ExperienceKind,
  name: string
): ExperienceContent {
  const safeName = name.trim() || "ti";
  const content = kind === "amistad" ? amistad(safeName) : amor(safeName);
  return { ...content, occasionLabel: BASE.occasionLabel };
}
