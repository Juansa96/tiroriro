import inakiRocioPhoto from "@/assets/team/inaki-rocio.jpeg";
import juanBeaPhoto from "@/assets/team/juan-bea.jpeg";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const COUPLES = [
  {
    photo: juanBeaPhoto,
    photoAlt: "Iñaki y Rocío, pareja fundadora de Tiroriro",
    members: [
      {
        name: "Rocío",
        role: "LA CREATIVA",
        desc: "Rocío podría rediseñar un cabecero, elegir telas para tres pedidos y pensar en la próxima colección al mismo tiempo — sin parpadear — porque si pudiera vivir exclusivamente de imaginar cómo quedan las cosas, lo haría sin dudarlo un segundo.",
      },
      {
        name: "Iñaki",
        role: "EL LOGÍSTICO",
        desc: "Iñaki podría organizar una mudanza intercontinental con tres post-its y una hoja de excel — y llegaría todo antes de tiempo — es quien se asegura de que cada pedido salga, vuele y aterrice donde tiene que aterrizar, en el día exacto y sin un solo arañazo.",
      },
    ],
  },
  {
    photo: inakiRocioPhoto,
    photoAlt: "Juan y Beatriz, pareja fundadora de Tiroriro",
    members: [
      {
        name: "Beatriz",
        role: "LA ESTRATEGA",
        desc: "Bea convierte una idea en una lista de tareas antes de que termines la frase — necesita que las cosas pasen, que se decidan y que se acaben — y si le preguntas si prefiere una idea perfecta en tres semanas o una buena idea mañana, ya sabes la respuesta.",
      },
      {
        name: "Juan",
        role: "EL TECNOLÓGICO",
        desc: "Juan es el responsable de que puedas leer esto — de que la web funcione, de que el presupuesto se calcule bien y de que los datos digan lo que tienen que decir — probablemente el único del equipo que sabe cuántas personas han llegado hasta esta frase.",
      },
    ],
  },
];

const POLL_OPTIONS = [
  { id: "inaki-rocio", label: "Iñaki y Rocío", emoji: "❤️" },
  { id: "juan-bea", label: "Juan y Bea", emoji: "❤️" },
];

const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
};

const COOKIE_KEY = "tiroriro-poll-voter";
const VOTE_KEY = "tiroriro-poll-vote";

const ensureVoterCookie = (): string => {
  let cookie = localStorage.getItem(COOKIE_KEY);
  if (!cookie) {
    cookie =
      (crypto.randomUUID?.() ??
        `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`) +
      "-" +
      Math.random().toString(36).slice(2, 8);
    localStorage.setItem(COOKIE_KEY, cookie);
  }
  return cookie;
};

const readStoredVote = (month: string): string | null => {
  try {
    const stored = localStorage.getItem(VOTE_KEY);
    if (!stored) return null;
    const data = JSON.parse(stored);
    if (data.month === month && typeof data.option === "string") {
      return data.option;
    }
  } catch {
    localStorage.removeItem(VOTE_KEY);
  }
  return null;
};

const TeamSection = () => {
  const [voted, setVoted] = useState<string | null>(null);
  const [votes, setVotes] = useState({ "inaki-rocio": 0, "juan-bea": 0 });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const currentMonth = getCurrentMonth();
    ensureVoterCookie();

    const storedVote = readStoredVote(currentMonth);
    if (storedVote) {
      setVoted(storedVote);
    }

    // Cargar conteos reales del servidor
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("team-poll-vote", {
          body: { action: "counts" },
        });
        if (!cancelled && !error && data?.counts) {
          setVotes(data.counts);
        }
      } catch (err) {
        console.error("No se pudieron cargar los votos", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleVote = async (id: string) => {
    if (voted || submitting) return;
    const cookie = ensureVoterCookie();
    const month = getCurrentMonth();
    setSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke("team-poll-vote", {
        body: { action: "vote", option_id: id, voter_cookie: cookie },
      });
      if (error) throw error;
      if (data?.voted) setVoted(data.voted);
      if (data?.counts) setVotes(data.counts);
      if (data?.voted) {
        localStorage.setItem(VOTE_KEY, JSON.stringify({ month, option: data.voted }));
      }
    } catch (err) {
      console.error("Error al votar", err);
      localStorage.removeItem(VOTE_KEY);
    } finally {
      setSubmitting(false);
    }
  };

  const total = votes["inaki-rocio"] + votes["juan-bea"];

  return (
    <section id="equipo" className="py-20 md:py-32 px-6 bg-secondary">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-5xl font-light text-foreground">Quiénes somos</h2>
          <span className="section-line" />
          <p className="mt-6 text-muted-foreground font-light max-w-xl mx-auto italic text-base">
            "2 amigas, 2 casas, 2 bebés recién nacidos y un montón de cosas por encajar — así nació Tiroriro: porque ninguna encontraba lo que de verdad quería para su casa."
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-10 max-w-6xl mx-auto">
          {COUPLES.map((couple) => (
            <div key={couple.photoAlt} className="flex flex-col">
              <img
                src={couple.photo}
                alt={couple.photoAlt}
                className="w-full aspect-[4/3] object-cover rounded-sm"
                loading="lazy"
                decoding="async"
              />
              <div className="mt-8 space-y-8">
                {couple.members.map((m) => (
                  <div key={m.name}>
                    <h3 className="font-serif text-2xl font-medium text-foreground">{m.name}</h3>
                    <p className="mt-1 text-xs tracking-ultra-wide uppercase text-muted-foreground">{m.role}</p>
                    <p className="mt-3 text-base text-muted-foreground font-light leading-relaxed">
                      "{m.desc}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <Link
            to="/productos"
            className="btn-sweep btn-unir btn-unir-outline inline-flex items-center justify-center px-8 py-3 text-xs uppercase tracking-[0.24em]"
          >
            <span>Ver productos</span>
          </Link>
        </div>

        <div className="mt-20 text-center max-w-2xl mx-auto">
          <h3 className="font-serif text-2xl md:text-3xl font-medium text-foreground">¿A quién le dais el like este mes?</h3>
          <p className="mt-3 text-base text-muted-foreground font-light">
            Encuesta mensual — el matrimonio que pierda invita a comer al otro.<br />
            <span className="italic">Los resultados se resetean el primero de cada mes. La presión es real.</span>
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-12">
            {POLL_OPTIONS.map((opt) => {
              const count = votes[opt.id as keyof typeof votes];
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={opt.id} className="flex flex-col items-center gap-3">
                  <span className="font-serif text-lg font-medium text-foreground">{opt.label}</span>
                  <button
                    onClick={() => handleVote(opt.id)}
                    disabled={!!voted}
                    className={`w-14 h-14 rounded-full border-2 flex items-center justify-center text-2xl transition-all duration-200 ${
                      voted === opt.id
                        ? "border-accent-warm bg-accent-warm/10 scale-110"
                        : voted
                        ? "border-border opacity-40 cursor-not-allowed"
                        : "border-border hover:border-accent-warm hover:scale-105 cursor-pointer"
                    }`}
                  >
                    {opt.emoji}
                  </button>
                  {voted && (
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-base font-light text-foreground">{pct}%</span>
                      <span className="text-sm text-muted-foreground font-light">{count} {count === 1 ? "voto" : "votos"}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {voted && (
            <p className="mt-8 text-base text-muted-foreground font-light italic animate-fade-in-up">
              {voted === "inaki-rocio" && "Iñaki ya está buscando restaurante. Rocío ya tiene la decoración de la mesa pensada."}
              {voted === "juan-bea" && "Bea ya tiene el excel de la comanda. Juan ya ha calculado la propina exacta."}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
