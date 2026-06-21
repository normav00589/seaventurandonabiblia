import wppAnaPaula from "@/assets/wpp-ana-paula.webp.asset.json";
import wppTiaSimone from "@/assets/wpp-tia-simone.webp.asset.json";
import wppDonaRosangela from "@/assets/wpp-dona-rosangela.webp.asset.json";
import wppJuliana from "@/assets/wpp-juliana.webp.asset.json";

const items = [
  { name: "Ana Paula", image: wppAnaPaula.url },
  { name: "Tia Simone", image: wppTiaSimone.url },
  { name: "Dona Rosângela", image: wppDonaRosangela.url },
  { name: "Juliana", image: wppJuliana.url },
];

export default function Testimonials() {
  return (
    <section data-funnel-step="testimonials" className="relative py-16 md:py-24 bg-parchment-gradient">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold text-wood-dark font-heading font-bold uppercase tracking-widest text-xs shadow-card">
          Depoimentos reais
        </div>
        <h2 className="mt-6 font-display text-3xl md:text-5xl text-wood-dark">
          Mensagens de quem já <span className="text-adventure">recebeu</span>
        </h2>
        <p className="mt-3 font-heading text-ink/70 max-w-xl mx-auto">
          Prints reais de conversas no WhatsApp depois da entrega do material.
        </p>

        <div className="mt-10 -mx-4 px-4 overflow-x-auto snap-x snap-mandatory flex gap-5 scrollbar-hide pb-6">
          {items.map((t) => (
            <figure
              key={t.name}
              className="snap-center shrink-0 w-[78%] sm:w-[46%] md:w-[30%] bg-white rounded-3xl p-3 border-4 border-gold shadow-card"
            >
              <img
                src={t.image}
                alt={`Depoimento de ${t.name} no WhatsApp`}
                loading="lazy"
                decoding="async"
                width={560}
                height={994}
                className="w-full h-auto rounded-2xl object-cover"
              />
              <figcaption className="mt-3 mb-1 font-display text-ink">{t.name}</figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-2 text-xs font-heading text-ink/50">← arraste para ver mais →</p>
      </div>
    </section>
  );
}
