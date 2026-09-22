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

const STORY_COUNT = 60;

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

type StorySlots = {
  openers: string[];
  developments: string[];
  realizations: string[];
  flowerLines: string[];
  promiseLines: ((name: string) => string)[];
  closingLines: string[];
};

function buildStory(slots: StorySlots, index: number, name: string): string[] {
  const i = index % STORY_COUNT;
  return [
    slots.openers[i % slots.openers.length],
    slots.developments[(i * 7 + 3) % slots.developments.length],
    slots.realizations[(i * 13 + 5) % slots.realizations.length],
    slots.flowerLines[(i * 11 + 2) % slots.flowerLines.length],
    slots.promiseLines[(i * 17 + 1) % slots.promiseLines.length](name),
    slots.closingLines[(i * 19 + 4) % slots.closingLines.length],
  ];
}

const AMOR_SLOTS: StorySlots = {
  openers: [
    "Hay una versión de esta historia que empieza el día que dejé de prestarle atención al ruido de todo lo demás.",
    "Si tuviera que ponerle un título a esto, sería algo simple: el día que todo cambió sin avisar.",
    "Nunca planeé que esto se convirtiera en algo tan importante, y sin embargo aquí estamos.",
    "Hay historias que empiezan con un impacto y otras que empiezan con calma; la nuestra fue de las segundas.",
    "Si alguien me preguntara cómo empezó todo, tendría que admitir que no fue nada espectacular, y aun así lo cambió todo.",
    "Esta historia no tiene un inicio dramático, solo un momento sencillo que resultó ser el más importante.",
    "Hubo un día ordinario que, sin que lo supiera entonces, terminó siendo el más significativo de todos.",
    "No hubo señales ni anuncios, solo apareciste, y de alguna forma todo empezó a tener más sentido.",
    "A veces las historias más importantes no empiezan con fuegos artificiales, sino con una conversación cualquiera.",
    "Si esta historia tuviera una primera línea, sería: nunca esperé que algo tan simple se sintiera tan importante.",
    "Hay días que se archivan sin más, y hay un día que decidí guardar para siempre en la memoria.",
    "Todo empezó de una forma tan natural que ni me di cuenta de cuándo dejó de ser casualidad.",
    "No fue amor a primera vista, fue algo más lento y más real: curiosidad que se convirtió en costumbre.",
    "Si buscara el primer capítulo de esto, lo encontraría en algo tan pequeño como una conversación que no quería terminar.",
    "Esta historia empieza como muchas otras: sin planearlo, sin buscarlo, y terminando siendo de las mejores.",
  ],
  developments: [
    "Con el tiempo, entendí que no se trataba de un momento aislado, sino de una costumbre que se fue formando poco a poco.",
    "Cada conversación fue sumando algo: una risa, un silencio cómodo, una confianza que no esperaba encontrar tan rápido.",
    "Aprendí a reconocer tu forma de escribir, tu forma de callar y hasta tu forma de cambiar de tema cuando algo te incomoda.",
    "Sin darme cuenta, empecé a guardar los mejores momentos del día para contártelos a ti primero.",
    "Los días comunes empezaron a sentirse distintos, no porque cambiara algo afuera, sino porque cambió algo en cómo los vivía.",
    "Fui aprendiendo que no hacía falta que todo fuera perfecto para sentir que estábamos construyendo algo real.",
    "Descubrí que contigo hasta los problemas se sentían más manejables, como si compartir el peso los hiciera más livianos.",
    "Empecé a notar que buscaba tu opinión antes que la de nadie más, sin siquiera pensarlo.",
    "Con el tiempo entendí que esto no era una fase, sino algo que seguía creciendo sin pedir permiso.",
    "Aprendí a valorar tanto los planes grandes como las tardes sin planes, siempre que fueran contigo.",
    "Fui descubriendo, casi sin querer, todas las pequeñas cosas que hacen que quererte sea tan fácil.",
    "Los mensajes cortos se volvieron conversaciones largas, y las conversaciones largas se volvieron parte de mi rutina favorita.",
    "Aprendí que no hacía falta tener siempre algo importante que decir; contigo hasta el silencio se sentía bien.",
    "Empecé a entender que esto no se trataba de encontrar perfección, sino de encontrar a alguien con quien todo fluye distinto.",
    "Con cada semana que pasaba, la certeza de que esto era real se hacía más grande.",
  ],
  realizations: [
    "Fue entonces cuando entendí que esto no era una casualidad más, sino algo que valía la pena cuidar de verdad.",
    "En algún punto dejé de preguntarme si esto iba a durar y empecé a simplemente disfrutarlo como venía.",
    "Ahí comprendí que el amor de verdad no se anuncia con ruido, se construye en silencio, todos los días.",
    "Fue en ese momento que supe que no quería que esto fuera solo una etapa más.",
    "Entendí que no necesitaba certezas absolutas sobre el futuro para sentirme seguro de esto, hoy.",
    "Comprendí que lo que sentía no era dependencia, era simplemente ganas genuinas de que estuvieras bien.",
    "Fue ahí cuando decidí dejar de analizar tanto y simplemente disfrutar lo que estábamos construyendo.",
    "Supe entonces que no hacía falta que todo fuera perfecto para que se sintiera correcto.",
    "En ese momento entendí que había encontrado algo que no quería dar por sentado.",
    "Comprendí que el cariño de verdad no compite ni exige, solo suma, y contigo todo sumaba.",
    "Fue entonces que dejé de buscar razones lógicas y simplemente acepté que esto se sentía bien.",
    "Entendí que no necesitaba grandes certezas, solo la certeza pequeña y constante de que quería seguir intentándolo.",
    "Ahí comprendí que ya no se trataba de una posibilidad, sino de algo que ya era parte de mi vida.",
    "Fue en ese punto donde entendí que ya no imaginaba mis planes futuros sin incluirte en ellos.",
    "Comprendí, sin mucho drama, que esto era simplemente lo que se siente cuando algo está bien.",
  ],
  flowerLines: [
    "Las flores amarillas de hoy representan justamente eso: una promesa de quedarse, de iluminar y de acompañar.",
    "Hoy, en el día de las flores amarillas, quiero que sepas que cada pétalo representa un motivo distinto para agradecerte.",
    "Dicen que estas flores simbolizan lealtad y calidez, y no se me ocurre mejor forma de describir lo que siento.",
    "Las flores amarillas de este día son solo un símbolo pequeño de algo que siento todos los días, no solo hoy.",
    "Hoy el amarillo de estas flores me recordó exactamente a la calidez que trajiste a mi vida.",
    "Elegí estas flores amarillas porque representan justo lo que quiero decirte sin necesitar muchas palabras.",
    "En el día de las flores amarillas, quise encontrar una forma de decir gracias que se sintiera tan sincera como se siente esto.",
    "Estas flores amarillas no alcanzan para explicar todo lo que significas, pero son un buen punto de partida.",
    "Hoy quise regalarte algo simple: unas flores amarillas y una historia real detrás de ellas.",
    "El amarillo de estas flores me pareció el color correcto para representar lo que siento cuando pienso en ti.",
    "Estas flores representan una promesa silenciosa: la de seguir eligiéndote, día tras día.",
    "En este día de las flores amarillas, quise que supieras que sigues siendo mi motivo favorito para celebrar algo.",
    "Cada pétalo amarillo de hoy representa una razón distinta por la que esto sigue valiendo la pena.",
    "Hoy elegí estas flores porque su color me recuerda a la calidez que solo tú sabes dar.",
    "Las flores amarillas de este día llevan un mensaje simple: gracias por seguir aquí.",
  ],
  promiseLines: [
    (n) => `Por eso hoy, ${n}, quiero prometerte que voy a seguir eligiéndote, incluso en los días difíciles.`,
    (n) => `Así que, ${n}, quiero que sepas que pienso seguir construyendo esto contigo, un día a la vez.`,
    (n) => `Hoy quiero decirte, ${n}, que no tengo intención de dejar de intentarlo.`,
    (n) => `Por eso, ${n}, prometo seguir apareciendo, incluso cuando las cosas no sean perfectas.`,
    (n) => `Así que quiero prometerte, ${n}, que voy a seguir cuidando esto con la misma intención de siempre.`,
    (n) => `Hoy, ${n}, quiero dejar claro que esto no es una etapa, es una decisión que sigo tomando cada día.`,
    (n) => `Por eso prometo, ${n}, seguir eligiendo caminar a tu lado sin importar lo que venga.`,
    (n) => `Así que quiero decirte, ${n}, que pienso seguir aquí, exactamente como hasta ahora.`,
    (n) => `Hoy, ${n}, quiero prometerte que voy a seguir aprendiendo a quererte mejor cada día.`,
    (n) => `Por eso, ${n}, quiero que sepas que esto para mí no tiene fecha de caducidad.`,
    (n) => `Así que prometo, ${n}, seguir buscando maneras de demostrarte lo que significas.`,
    (n) => `Hoy quiero dejarte claro, ${n}, que pienso quedarme, incluso cuando no sea el día más fácil.`,
    (n) => `Por eso, ${n}, quiero prometerte que esto seguirá siendo real mucho después de hoy.`,
    (n) => `Así que, ${n}, quiero que sepas que sigo escogiendo esto, sin dudarlo.`,
    (n) => `Hoy, ${n}, prometo seguir cuidando esto con la misma intención con la que empezó.`,
  ],
  closingLines: [
    "Porque lo mejor de esta historia no fue cómo empezó, sino todo lo que sigue viniendo después.",
    "Y aunque no sé cómo sigue esta historia, sé exactamente con quién quiero seguir escribiéndola.",
    "Porque contigo, hasta lo simple se siente como suficiente.",
    "Y esta historia, aunque simple, sigue siendo mi favorita hasta ahora.",
    "Porque no necesito que todo sea perfecto para saber que esto vale la pena.",
    "Y aunque el futuro no está escrito, sé que quiero seguir escribiéndolo contigo.",
    "Porque contigo hasta los días ordinarios terminan siendo los mejores.",
    "Y esta historia, como todas las buenas, sigue teniendo más capítulos por delante.",
    "Porque lo que más valoro no es el inicio, sino todo lo que seguimos construyendo.",
    "Y aunque no tengo todas las respuestas, sé que quiero seguir buscándolas contigo.",
    "Porque contigo cerca, hasta lo incierto se siente menos complicado.",
    "Y esta historia, con todo y sus capítulos simples, sigue siendo la que más me gusta contar.",
    "Porque no hace falta que sea perfecta para que sea real.",
    "Y aunque el tiempo siga pasando, esto es algo que no pienso dar por sentado.",
    "Porque contigo, hasta las historias simples se sienten importantes.",
  ],
};

const AMISTAD_SLOTS: StorySlots = {
  openers: [
    "Hay una versión de esta historia que empieza el día que dejamos de ser desconocidos casi sin darnos cuenta.",
    "Si tuviera que ponerle un título a esta amistad, sería algo simple: la persona que se quedó sin que se lo pidiera.",
    "Nunca planeamos que esto durara tanto, y sin embargo seguimos aquí.",
    "Hay amistades que empiezan con una gran anécdota y otras que simplemente empiezan a existir; la nuestra fue de las segundas.",
    "Si alguien me preguntara cómo empezó esta amistad, tendría que admitir que no recuerdo un momento exacto, solo que un día ya estabas ahí.",
    "Esta historia no tiene un inicio dramático, solo una coincidencia que resultó ser de las mejores.",
    "Hubo un día cualquiera que, sin saberlo entonces, terminó siendo el inicio de algo que sigue hasta hoy.",
    "No hubo ceremonia ni anuncio, simplemente empezamos a hablar seguido, y ahí quedó.",
    "A veces las mejores amistades no empiezan con una gran historia, sino con una conversación cualquiera que no quiso terminar.",
    "Si esta historia tuviera una primera línea, sería: nunca esperé que alguien tan casual se volviera tan importante.",
    "Hay personas que se archivan como conocidos, y hay alguien que decidí guardar como algo más.",
    "Todo empezó de forma tan natural que ni me di cuenta de cuándo dejamos de ser casi desconocidos.",
    "No fue amistad instantánea, fue algo más lento y más real: curiosidad que se convirtió en costumbre.",
    "Si buscara el primer capítulo de esta amistad, lo encontraría en algo tan pequeño como una conversación que no quería terminar.",
    "Esta historia empieza como muchas otras: sin planearlo, sin buscarlo, y terminando siendo una de las mejores.",
  ],
  developments: [
    "Con el tiempo, entendí que no se trataba de una coincidencia aislada, sino de una costumbre que se fue formando poco a poco.",
    "Cada conversación fue sumando algo: una broma interna, un consejo sincero, una confianza que no esperaba encontrar tan rápido.",
    "Aprendí a reconocer tu forma de bromear, tu forma de callar y hasta tu forma de cambiar de tema cuando algo te incomoda.",
    "Sin darme cuenta, empecé a guardar las mejores anécdotas del día para contártelas a ti primero.",
    "Los días comunes empezaron a sentirse distintos gracias a los mensajes que intercambiábamos sin ningún motivo especial.",
    "Fui aprendiendo que no hacía falta que nos viéramos seguido para sentir que la amistad seguía intacta.",
    "Descubrí que contigo hasta los problemas se sentían más manejables, como si compartirlos los hiciera más livianos.",
    "Empecé a notar que buscaba tu opinión antes que la de nadie más para ciertas decisiones.",
    "Con el tiempo entendí que esto no era una etapa pasajera, sino algo que seguía creciendo sin pedir permiso.",
    "Aprendí a valorar tanto los planes grandes como las tardes sin planes, siempre que fueran contigo.",
    "Fui descubriendo, casi sin querer, todas las pequeñas cosas que hacen que esta amistad sea tan fácil de mantener.",
    "Los mensajes cortos se volvieron conversaciones largas, y las conversaciones largas se volvieron parte de mi rutina favorita.",
    "Aprendí que no hacía falta tener siempre algo importante que decir; contigo hasta el silencio se sentía como compañía.",
    "Empecé a entender que esto no se trataba de tener todo en común, sino de tener a alguien con quien todo fluye distinto.",
    "Con cada año que pasaba, la certeza de que esta amistad iba a durar se hacía más grande.",
  ],
  realizations: [
    "Fue entonces cuando entendí que esto no era una coincidencia más, sino algo que valía la pena cuidar de verdad.",
    "En algún punto dejé de preguntarme si esto iba a durar y empecé a simplemente disfrutarlo como venía.",
    "Ahí comprendí que la amistad de verdad no se anuncia con ruido, se construye en silencio, con el tiempo.",
    "Fue en ese momento que supe que no quería que esto fuera solo una etapa más de mi vida.",
    "Entendí que no necesitaba vernos todo el tiempo para sentirme seguro de esta amistad.",
    "Comprendí que lo que sentía no era costumbre, era simplemente ganas genuinas de que estuvieras bien.",
    "Fue ahí cuando decidí dejar de analizar tanto y simplemente disfrutar lo que estábamos construyendo.",
    "Supe entonces que no hacía falta que todo fuera perfecto para que esta amistad se sintiera correcta.",
    "En ese momento entendí que había encontrado algo que no quería dar por sentado.",
    "Comprendí que la amistad de verdad no compite ni exige, solo suma, y contigo todo sumaba.",
    "Fue entonces que dejé de buscar razones lógicas y simplemente acepté que esto se sentía bien.",
    "Entendí que no necesitaba grandes certezas, solo la certeza pequeña y constante de que quería seguir cerca.",
    "Ahí comprendí que ya no se trataba de una posibilidad, sino de algo que ya era parte de mi vida.",
    "Fue en ese punto donde entendí que ya no imaginaba ciertos momentos importantes sin incluirte en ellos.",
    "Comprendí, sin mucho drama, que esto era simplemente lo que se siente cuando una amistad está bien construida.",
  ],
  flowerLines: [
    "Las flores amarillas de hoy representan justamente eso: lealtad, calidez y una amistad que permanece.",
    "Hoy, en el día de las flores amarillas, quiero que sepas que cada pétalo representa un motivo distinto para agradecerte.",
    "Dicen que estas flores simbolizan lealtad incondicional, y no se me ocurre mejor forma de describir esta amistad.",
    "Las flores amarillas de este día son solo un símbolo pequeño de algo que valoro todos los días, no solo hoy.",
    "Hoy el amarillo de estas flores me recordó exactamente a la calidez que trajiste a mi vida como amigo.",
    "Elegí estas flores amarillas porque representan justo lo que quiero decirte sin necesitar muchas palabras.",
    "En el día de las flores amarillas, quise encontrar una forma de decir gracias que se sintiera tan sincera como esta amistad.",
    "Estas flores amarillas no alcanzan para explicar todo lo que significa esta amistad, pero son un buen punto de partida.",
    "Hoy quise regalarte algo simple: unas flores amarillas y una historia real detrás de ellas.",
    "El amarillo de estas flores me pareció el color correcto para representar el valor de esta amistad.",
    "Estas flores representan una promesa silenciosa: la de seguir estando presente, pase lo que pase.",
    "En este día de las flores amarillas, quise que supieras que sigues siendo una de las personas que más aprecio.",
    "Cada pétalo amarillo de hoy representa una razón distinta por la que esta amistad sigue valiendo la pena.",
    "Hoy elegí estas flores porque su color me recuerda a la calidez que solo un buen amigo sabe dar.",
    "Las flores amarillas de este día llevan un mensaje simple: gracias por seguir aquí.",
  ],
  promiseLines: [
    (n) => `Por eso hoy, ${n}, quiero prometerte que voy a seguir estando presente, incluso en los días difíciles.`,
    (n) => `Así que, ${n}, quiero que sepas que pienso seguir cuidando esta amistad, un día a la vez.`,
    (n) => `Hoy quiero decirte, ${n}, que no tengo intención de dejar de estar cerca.`,
    (n) => `Por eso, ${n}, prometo seguir apareciendo, incluso cuando las cosas se compliquen.`,
    (n) => `Así que quiero prometerte, ${n}, que voy a seguir valorando esto con la misma intención de siempre.`,
    (n) => `Hoy, ${n}, quiero dejar claro que esta amistad no es una etapa, es una decisión que sigo tomando.`,
    (n) => `Por eso prometo, ${n}, seguir eligiendo esta amistad sin importar lo que venga.`,
    (n) => `Así que quiero decirte, ${n}, que pienso seguir aquí, exactamente como hasta ahora.`,
    (n) => `Hoy, ${n}, quiero prometerte que voy a seguir siendo alguien con quien puedas contar.`,
    (n) => `Por eso, ${n}, quiero que sepas que esta amistad para mí no tiene fecha de caducidad.`,
    (n) => `Así que prometo, ${n}, seguir buscando maneras de demostrarte lo que significas.`,
    (n) => `Hoy quiero dejarte claro, ${n}, que pienso quedarme, incluso cuando no sea fácil.`,
    (n) => `Por eso, ${n}, quiero prometerte que esta amistad seguirá siendo real mucho después de hoy.`,
    (n) => `Así que, ${n}, quiero que sepas que sigo escogiendo esta amistad, sin dudarlo.`,
    (n) => `Hoy, ${n}, prometo seguir cuidando esto con la misma intención con la que empezó.`,
  ],
  closingLines: [
    "Porque lo mejor de esta amistad no fue cómo empezó, sino todo lo que sigue viniendo después.",
    "Y aunque no sé cómo sigue esta historia, sé exactamente con quién quiero seguir escribiéndola.",
    "Porque contigo, hasta lo simple se siente como suficiente.",
    "Y esta amistad, aunque simple en su origen, sigue siendo una de mis favoritas.",
    "Porque no necesito que todo sea perfecto para saber que esta amistad vale la pena.",
    "Y aunque el futuro no está escrito, sé que quiero seguir compartiéndolo contigo.",
    "Porque contigo hasta los días ordinarios terminan siendo de los mejores.",
    "Y esta historia, como todas las buenas amistades, sigue teniendo más capítulos por delante.",
    "Porque lo que más valoro no es el inicio, sino todo lo que seguimos construyendo.",
    "Y aunque no tengo todas las respuestas, sé que me gusta tenerte cerca para buscarlas.",
    "Porque contigo cerca, hasta lo incierto se siente menos complicado.",
    "Y esta amistad, con todo y sus capítulos simples, sigue siendo de las que más valoro.",
    "Porque no hace falta que sea perfecta para que sea real.",
    "Y aunque el tiempo siga pasando, esto es algo que no pienso dar por sentado.",
    "Porque contigo, hasta las historias simples se sienten importantes.",
  ],
};

function amor(name: string): Omit<ExperienceContent, "occasionLabel"> {
  const index = hashString(name.toLowerCase()) % STORY_COUNT;
  return {
    badge: "🌼 para ti",
    intro:
      "Si alguna vez te has preguntado cómo comenzó todo, esta es la historia de cómo cambiaste mi cielo.",
    phrases: buildStory(AMOR_SLOTS, index, name),
    finalTitle: `${name}, gracias por ser mi hogar y mi lugar favorito.`,
    finalMessage:
      "Que estas flores amarillas te recuerden siempre lo inmensamente especial que eres en mi vida.",
    formPrompt: BASE.formPrompt,
  };
}

function amistad(name: string): Omit<ExperienceContent, "occasionLabel"> {
  const index = hashString(name.toLowerCase()) % STORY_COUNT;
  return {
    badge: "🌻 para ti",
    intro:
      "Hay personas que no llegan por casualidad a nuestras vidas; llegan para quedarse como un refugio.",
    phrases: buildStory(AMISTAD_SLOTS, index, name),
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
