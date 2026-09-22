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
  occasionLabel: "Día de las Flores Amarillas",
  formPrompt: "Déjame unas palabras con cariño:",
};

function amor(name: string): Omit<ExperienceContent, "occasionLabel"> {
  return {
    badge: "🌼 para ti",
    intro:
      "Si alguna vez te has preguntado cómo comenzó todo, esta es la historia de cómo cambiaste mi cielo.",
    phrases: [
      "Capítulo I: En medio de un mundo ruidoso y apresurado, cruzamos miradas por primera vez.",
      "Capítulo II: No necesité mucho tiempo para entender que tu presencia traía consigo una calma que no conocía.",
      "Capítulo III: Con cada conversación, con cada risa y cada silencio compartido, fuiste encendiendo rincones de mi vida.",
      "Capítulo IV: Dicen que las flores amarillas representan la promesa de quedarse, de iluminar y de acompañar siempre.",
      `Capítulo V: Por eso hoy no quería darte un simple detalle, ${name}; quería regalarte una promesa sincera.`,
      "Capítulo VI: Que no importa cuántos años pasen ni lo grande que sea el mundo: siempre elegiré caminar a tu lado.",
    ],
    finalTitle: `${name}, gracias por ser mi hogar y mi lugar favorito.`,
    finalMessage:
      "Que estas flores amarillas te recuerden siempre lo inmensamente especial que eres en mi vida.",
    formPrompt: BASE.formPrompt,
  };
}

function amistad(name: string): Omit<ExperienceContent, "occasionLabel"> {
  return {
    badge: "🌻 para ti",
    intro:
      "Hay personas que no llegan por casualidad a nuestras vidas; llegan para quedarse como un refugio.",
    phrases: [
      "Capítulo I: La vida nos puso en el mismo camino casi sin darnos cuenta, en el momento exacto.",
      "Capítulo II: Entre tantas idas y vueltas, descubrí en ti a alguien con quien siempre se puede ser transparente.",
      "Capítulo III: Alguien que celebra mis alegrías, que sostiene mis días difíciles y que nunca pide nada a cambio.",
      "Capítulo IV: Las flores amarillas hoy simbolizan esa luz incondicional, la lealtad y los lazos que nunca se rompen.",
      `Capítulo V: Y cuando pienso en gratitud sincera y complicidad verdadera, siempre pienso en ti, ${name}.`,
      "Capítulo VI: Gracias por cada risa compartida y por demostrarme el valor de una amistad que permanece.",
    ],
    finalTitle: `${name}, personas como tú hacen que este viaje valga la pena.`,
    finalMessage:
      "Que la vida te devuelva siempre toda la luz, alegría y bondad que entregas a los demás.",
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
