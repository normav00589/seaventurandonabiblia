import { createFileRoute } from "@tanstack/react-router";
import heroAsset from "@/assets/hero-kit.webp.asset.json";
const heroImg = heroAsset.url;
import productAsset from "@/assets/product-mockup.webp.asset.json";
const productImg = productAsset.url;
import depoimentoRosangela from "@/assets/depoimento-rosangela.webp.asset.json";
import depoimentoRoberto from "@/assets/depoimento-roberto.webp.asset.json";
import depoimentoMarlene from "@/assets/depoimento-marlene.webp.asset.json";
import depoimentoThiago from "@/assets/depoimento-thiago.webp.asset.json";
import {
  Compass, ScrollText, Trophy, Star, BookOpen, Heart, Brain,
  Target, Sparkles, HandHeart, Award, Check, Shield, Download, Lock,
  ChevronDown, Printer, MapPin, Crown, Flame, Anchor, Sun,
  Palette, Search, Eye, Gift,
} from "lucide-react";
import { useState, useEffect } from "react";
import { FB_PIXEL_ID, FB_PIXEL_SNIPPET } from "@/lib/fb-pixel";
import { initTracker } from "@/lib/tracker";
import { SalesNotifications } from "@/components/SalesNotifications";
import { UrgencyBar } from "@/components/UrgencyBar";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "A Grande Caça ao Tesouro da Bíblia — Aventura Cristã Infantil" },
      { name: "description", content: "Transforme o aprendizado da Bíblia em uma aventura que seu filho vai pedir para continuar. Missões, personagens, medalhas e tesouros da Palavra de Deus." },
      { property: "og:title", content: "A Grande Caça ao Tesouro da Bíblia" },
      { property: "og:description", content: "Uma jornada divertida onde crianças exploram histórias bíblicas, conquistam medalhas e colecionam heróis da fé." },
      { property: "og:image", content: heroImg },
    ],
    links: [
      { rel: "preconnect", href: "https://connect.facebook.net", crossOrigin: "anonymous" },
    ],
    scripts: [
      // Snippet oficial do Facebook Pixel — fbevents.js carrega assíncrono, não bloqueia render.
      { children: FB_PIXEL_SNIPPET },
    ],
  }),
  component: SalesPage,
});

const characters = [
  { name: "Noé", icon: "🛟", color: "from-sky to-sky-dark" },
  { name: "Abraão", icon: "✨", color: "from-gold to-gold-dark" },
  { name: "José", icon: "👑", color: "from-adventure to-adventure-dark" },
  { name: "Moisés", icon: "📜", color: "from-wood to-wood-dark" },
  { name: "Josué", icon: "📯", color: "from-sky to-sky-dark" },
  { name: "Rute", icon: "🌾", color: "from-gold to-gold-dark" },
  { name: "Samuel", icon: "🕯️", color: "from-adventure to-adventure-dark" },
  { name: "Daniel", icon: "🦁", color: "from-wood to-wood-dark" },
  { name: "Davi", icon: "🎯", color: "from-sky to-sky-dark" },
  { name: "Ester", icon: "👸", color: "from-gold to-gold-dark" },
  { name: "Elias", icon: "🔥", color: "from-adventure to-adventure-dark" },
  { name: "Jonas", icon: "🐋", color: "from-wood to-wood-dark" },
];

const steps = [
  { n: 1, title: "Receba o material", desc: "Acesso imediato ao seu kit completo no e-mail.", icon: Download },
  { n: 2, title: "Imprima as páginas", desc: "Material pronto para imprimir em casa ou na gráfica.", icon: Printer },
  { n: 3, title: "Complete as missões", desc: "Desafios bíblicos divertidos a cada etapa.", icon: Target },
  { n: 4, title: "Colecione os personagens", desc: "Mais de 100 heróis da fé para descobrir.", icon: Star },
  { n: 5, title: "Ganhe medalhas", desc: "Recompensas que celebram cada conquista.", icon: Trophy },
  { n: 6, title: "Conclua a jornada", desc: "Desbloqueie o Certificado Final de Explorador.", icon: Award },
];

const benefits = [
  { icon: BookOpen, title: "Conhecimento Bíblico", color: "bg-sky" },
  { icon: Heart, title: "Valores Cristãos", color: "bg-destructive" },
  { icon: Brain, title: "Memória", color: "bg-adventure" },
  { icon: Target, title: "Concentração", color: "bg-gold-dark" },
  { icon: Sparkles, title: "Criatividade", color: "bg-sky-dark" },
  { icon: HandHeart, title: "Relacionamento com Deus", color: "bg-wood" },
  { icon: Trophy, title: "Persistência", color: "bg-gold" },
  { icon: Heart, title: "Empatia", color: "bg-adventure-dark" },
];

const bonuses = [
  { n: 1, title: "Livro de Colorir Bíblico", value: "R$ 27", icon: Palette, tint: "from-adventure to-adventure-dark" },
  { n: 2, title: "30 Caça-Palavras Bíblicos", value: "R$ 19", icon: Search, tint: "from-sky to-sky-dark" },
  { n: 3, title: "Detetive Bíblico", value: "R$ 24", icon: Eye, tint: "from-wood to-wood-dark" },
  { n: 4, title: "100 Figurinhas Bíblicas", value: "R$ 27", icon: Star, tint: "from-gold to-gold-dark" },
  { n: 5, title: "Cartelas de Medalhas", value: "R$ 19", icon: Trophy, tint: "from-gold-dark to-wood" },
  { n: 6, title: "Certificado Oficial", value: "R$ 17", icon: Award, tint: "from-adventure-dark to-wood-dark" },
  { n: 7, title: "Atividades Extras para EBD", value: "R$ 37", icon: BookOpen, tint: "from-sky-dark to-wood-dark" },
];

const audience = [
  "Pais cristãos", "Avós", "Professores da EBD",
  "Ministérios infantis", "Homeschooling", "Igrejas",
];

const faqs = [
  { q: "O material é físico?", a: "Não. É um arquivo digital para download, entregue imediatamente após a compra." },
  { q: "Preciso imprimir?", a: "Sim, para aproveitar toda a experiência da caça ao tesouro com as crianças." },
  { q: "Qual a idade recomendada?", a: "De 5 a 12 anos. As atividades são adaptáveis para diferentes faixas." },
  { q: "Posso usar na igreja?", a: "Sim! É perfeito para EBD, ministérios infantis e eventos da igreja." },
  { q: "Recebo imediatamente?", a: "Sim, o acesso é liberado em segundos após a confirmação do pagamento." },
  { q: "Funciona para EBD?", a: "Sim, foi pensado especialmente para pais, avós e professores da EBD." },
  { q: "Preciso de conhecimento bíblico?", a: "Não. Todo o conteúdo é guiado passo a passo." },
  { q: "Tem garantia?", a: "Sim, 21 dias incondicionais. Se não gostar, devolvemos 100% do valor." },
];

const testimonials = [
  {
    name: "Rosângela, 52",
    role: "Avó do João, 7 anos",
    photo: depoimentoRosangela.url,
    text: "Confesso que comprei meio desconfiada, achei que ele não ia ter paciência. No primeiro dia, meu neto sentou comigo, fez a missão da Arca e ainda pediu pra ligar pro pai contando o que aprendeu. Chorei, viu?",
  },
  {
    name: "Roberto, 48",
    role: "Pai da Lívia e do Theo",
    photo: depoimentoRoberto.url,
    text: "Eu trabalho fora o dia todo e queria um momento de qualidade com meus filhos à noite. A Caça ao Tesouro virou nosso ritual depois do jantar. Hoje eles me lembram: 'Pai, e a missão de hoje?'",
  },
  {
    name: "Dona Marlene, 61",
    role: "Professora de EBD há 22 anos",
    photo: depoimentoMarlene.url,
    text: "Já testei muito material na igreja, mas esse foi o primeiro que prendeu as crianças do começo ao fim. As figurinhas e medalhas geraram um engajamento que eu nunca tinha visto. Recomendo de olhos fechados.",
  },
  {
    name: "Thiago, 34",
    role: "Pai de primeira viagem",
    photo: depoimentoThiago.url,
    text: "Não tenho muito conhecimento bíblico e tinha medo de ensinar errado. O material guia tudo passinho a passinho. Meu filho de 6 anos hoje sabe quem é Davi, Noé, Moisés... e o melhor: entende o porquê de cada história.",
  },
];

function SalesPage() {
  useEffect(() => { initTracker(); }, []);
  return (
    <div className="overflow-x-hidden pt-12 sm:pt-11">
      <UrgencyBar />
      {/* Fallback do Facebook Pixel para usuários sem JavaScript */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
      <SalesNotifications />
      <Hero />
      <Marquee />
      <Problem />
      
      <HowItWorks />
      <WhatsIncluded />
      <Characters />
      <Benefits />
      <Bonuses />
      
      <Testimonials />
      <Offer />
      <Guarantee />
      <FAQ />
      <Footer />
    </div>
  );
}

function CtaButton({ children, large = false, href = "#offer", external = false }: { children: React.ReactNode; large?: boolean; href?: string; external?: boolean }) {
  const isExternal = external || /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      data-cta="primary"
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`inline-flex items-center justify-center gap-3 bg-gold-gradient text-ink font-display tracking-wide
        rounded-full shadow-treasure border-4 border-wood-dark
        hover:-translate-y-1 active:translate-y-0 transition-all duration-200 animate-pop
        ${large ? "text-xl md:text-2xl px-10 py-5" : "text-base md:text-lg px-7 py-4"}`}
    >
      <Sparkles className="w-5 h-5" />
      {children}
      <Sparkles className="w-5 h-5" />
    </a>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-wood text-parchment font-heading font-bold uppercase tracking-widest text-xs md:text-sm shadow-card">
      <Compass className="w-4 h-4" />
      {children}
    </div>
  );
}

/* ---------------- HERO ---------------- */
function Hero() {
  return (
    <header className="relative bg-sky-gradient overflow-hidden pt-6 pb-20 md:pb-32">
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-slate-900/30 pointer-events-none" />
      {/* Cloud-like glow accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
        <div className="absolute top-40 -right-20 w-96 h-96 bg-white/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-white/10 rounded-full blur-3xl" />
      </div>
      {/* Stars */}
      <Star className="absolute top-12 right-1/4 w-6 h-6 text-gold fill-gold animate-sparkle" />
      <Star className="absolute top-40 left-1/3 w-4 h-4 text-gold fill-gold animate-sparkle" style={{ animationDelay: "1.2s" }} />
      <Star className="absolute bottom-40 right-10 w-8 h-8 text-gold fill-gold animate-sparkle" style={{ animationDelay: "0.6s" }} />

      <nav className="relative max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-display text-lg md:text-xl">
          <div className="w-10 h-10 rounded-full bg-gold border-4 border-wood-dark flex items-center justify-center">
            <Compass className="w-5 h-5 text-wood-dark animate-spin-slow" />
          </div>
          <span className="hidden sm:inline drop-shadow-lg">Caça ao Tesouro Bíblico</span>
        </div>
        <a href="#offer" className="hidden md:inline-flex bg-white/20 backdrop-blur border-2 border-white/40 text-white font-heading font-bold px-5 py-2 rounded-full hover:bg-white/30 transition">
          Quero o meu →
        </a>
      </nav>

      <div className="relative max-w-3xl mx-auto px-4 mt-10 md:mt-16 text-center">
        <div className="inline-flex items-center gap-2 bg-gold text-wood-dark font-heading font-bold uppercase text-xs px-4 py-2 rounded-full border-2 border-wood-dark shadow-card mb-6">
          <Crown className="w-4 h-4" /> Aventura Cristã Colecionável
        </div>
        <h1 className="text-stroke-sky font-display sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-3xl">
          Transforme a Bíblia em uma <span className="block hl-gold">AVENTURA</span>
          <span className="block">que seu filho vai <span className="hl-underline">pedir para continuar</span>.</span>
        </h1>
        <p className="mt-6 text-white/95 font-heading text-lg md:text-xl max-w-xl mx-auto drop-shadow">
          Uma jornada divertida onde crianças exploram histórias bíblicas, conquistam medalhas, colecionam heróis da fé e descobrem os maiores tesouros da Palavra de Deus.
        </p>

        <div className="relative mt-8 mx-auto max-w-2xl">
          <div className="absolute -inset-6 bg-gold/30 rounded-[3rem] blur-3xl" />
          <div className="relative rounded-[2rem] overflow-hidden border-8 border-gold shadow-treasure rotate-1">
            <img src={heroImg} alt="Crianças explorando a caça ao tesouro da Bíblia" className="w-full h-auto" width={1536} height={1152} />
          </div>
          <div className="absolute -top-4 -left-4 md:-top-6 md:-left-6 w-20 h-20 md:w-24 md:h-24 rounded-full bg-gold border-4 border-wood-dark flex flex-col items-center justify-center font-display text-wood-dark text-center shadow-card animate-float-tilt">
            <span className="text-xl md:text-2xl leading-none">+100</span>
            <span className="text-[10px] uppercase">Heróis</span>
          </div>
          <div className="absolute -bottom-4 -right-3 md:-bottom-6 md:-right-4 px-3 py-2 md:px-4 md:py-3 rounded-2xl bg-adventure border-4 border-wood-dark text-white font-display shadow-card animate-float">
            <div className="flex items-center gap-2 text-sm"><Trophy className="w-5 h-5" /> Medalhas</div>
          </div>
        </div>

        {/* Preço clean entre imagem e botão */}
        <div className="mt-6 flex flex-col items-center gap-1.5">
          <div className="inline-flex items-center gap-2 bg-white/85 backdrop-blur border border-gold rounded-full px-5 py-1.5 shadow-sm">
            <span className="text-adventure-dark font-heading text-xs font-bold uppercase tracking-wider">Promoção Relâmpago</span>
            <span className="w-1.5 h-1.5 rounded-full bg-adventure animate-pulse" />
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-white/70 font-heading text-lg line-through decoration-2">De R$ 47,00</span>
            <span className="text-gold font-display text-3xl md:text-4xl font-bold drop-shadow-md">por R$ 9,90</span>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <CtaButton large>QUERO COMEÇAR A AVENTURA</CtaButton>
        </div>

        <ul className="mt-8 grid sm:grid-cols-2 gap-2 max-w-xl mx-auto text-left">
          {[
            "Aprendizado bíblico divertido",
            "Mais de 100 personagens",
            "Missões e desafios interativos",
            "Medalhas e recompensas",
            "Pronto para imprimir",
          ].map((b) => (
            <li key={b} className="flex items-center gap-2 text-white font-heading font-semibold">
              <span className="w-6 h-6 rounded-full bg-adventure border-2 border-white flex items-center justify-center flex-shrink-0">
                <Check className="w-3.5 h-3.5 text-white" strokeWidth={4} />
              </span>
              {b}
            </li>
          ))}
        </ul>
      </div>


      {/* Trail decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-6 dashed-trail opacity-60" />
    </header>
  );
}

function Marquee() {
  const items = ["📖 Bíblia", "🗺️ Aventura", "🏆 Medalhas", "⭐ Coleção", "🧭 Missões", "🎖️ Certificado", "📜 Pergaminhos", "✨ Tesouros"];
  return (
    <div className="bg-wood text-parchment py-4 border-y-4 border-wood-dark overflow-hidden">
      <div className="flex gap-10 animate-[spin-slow_30s_linear_infinite] whitespace-nowrap font-display text-xl tracking-wider"
        style={{ animation: "none" }}>
        <div className="flex gap-10 px-4 whitespace-nowrap">
          {[...items, ...items, ...items].map((t, i) => (
            <span key={i} className="flex items-center gap-2">{t} <span className="text-gold">◆</span></span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- PROBLEM ---------------- */
function Problem() {
  return (
    <section className="relative py-20 md:py-28 bg-parchment-gradient">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <SectionLabel>O Problema</SectionLabel>
        <h2 className="mt-6 text-stroke-wood font-display text-3xl md:text-5xl">
          Seu filho <span className="hl-underline">conhece</span> os personagens da Bíblia... ou apenas <span className="hl-underline">ouviu falar</span> deles?
        </h2>
        <p className="mt-8 text-lg md:text-xl text-ink/85 font-heading max-w-2xl mx-auto">
          Muitas crianças passam <strong>horas diante das telas</strong> todos os dias. Enquanto isso, histórias incríveis como <em>Noé, Abraão, José, Moisés e Daniel</em> acabam sendo esquecidas ou vistas apenas superficialmente.
        </p>

        <div className="mt-10 grid sm:grid-cols-2 gap-4 text-left">
          {[
            "Falta de interesse pela Bíblia",
            "Pouca retenção do conteúdo",
            "Dificuldade em criar hábitos espirituais",
            "Menos conexão com os ensinamentos cristãos",
          ].map((p) => (
            <div key={p} className="flex items-start gap-3 bg-white/70 backdrop-blur border-2 border-wood/30 rounded-2xl p-4 shadow-card">
              <span className="w-8 h-8 rounded-full bg-destructive text-white flex items-center justify-center font-display flex-shrink-0">!</span>
              <p className="font-heading font-semibold text-ink">{p}</p>
            </div>
          ))}
        </div>

        <p className="mt-12 font-display text-2xl md:text-3xl text-stroke-wood">
          E se existisse uma forma <span className="hl-marker">divertida</span> de mudar isso?
        </p>
      </div>
    </section>
  );
}

/* ---------------- SOLUTION ---------------- */

/* ---------------- HOW IT WORKS ---------------- */
function HowItWorks() {
  return (
    <section className="relative py-20 md:py-28 bg-parchment-gradient">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <SectionLabel>Como Funciona</SectionLabel>
        <h2 className="mt-6 text-stroke-wood font-display text-3xl md:text-5xl">A Trilha da <span className="hl-gold">Aventura</span></h2>
        <p className="mt-4 font-heading text-lg text-ink/80 max-w-2xl mx-auto">
          Siga o mapa, complete cada etapa e desbloqueie <span className="hl-underline">tesouros bíblicos</span>.
        </p>

        <div className="relative mt-16">
          {/* Trail */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-2 dashed-trail" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 relative">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.n} className={`relative flex flex-col items-center ${i % 2 === 0 ? "lg:translate-y-0" : "lg:translate-y-8"}`}>
                  <div className="relative w-24 h-24 rounded-full bg-gold-gradient border-4 border-wood-dark shadow-treasure flex items-center justify-center">
                    <Icon className="w-10 h-10 text-wood-dark" />
                    <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-wood-dark text-gold font-display text-lg flex items-center justify-center border-4 border-parchment">
                      {s.n}
                    </div>
                  </div>
                  <h3 className="mt-4 font-display text-lg text-ink">{s.title}</h3>
                  <p className="mt-1 text-sm font-heading text-ink/75">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- INCLUDED ---------------- */
function WhatsIncluded() {
  const items = [
    { title: "Missão Inicial", icon: Compass },
    { title: "Passaporte do Explorador", icon: MapPin },
    { title: "Coleção de Personagens", icon: Crown },
    { title: "Histórias Bíblicas", icon: BookOpen },
    { title: "Atividades", icon: Sparkles },
    { title: "Desafios", icon: Target },
    { title: "Sistema de Medalhas", icon: Trophy },
    { title: "Certificado Final", icon: Award },
  ];
  return (
    <section data-funnel-step="kit" className="relative py-16 md:py-24 bg-wood text-parchment overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, var(--gold) 1.5px, transparent 2px)", backgroundSize: "30px 30px" }} />
      <div className="relative max-w-6xl mx-auto px-4">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gold text-wood-dark font-heading font-bold uppercase tracking-widest text-xs md:text-sm shadow-card">
            <ScrollText className="w-4 h-4" /> O Que Está Incluso
          </div>
          <h2 className="mt-5 font-display text-3xl md:text-5xl text-stroke-wood">
            Tudo no seu <span className="hl-gold">Kit Completo</span>
          </h2>
        </div>

        <div className="mt-10 grid lg:grid-cols-5 gap-6 lg:gap-8 items-center">
          {/* Imagem do kit */}
          <div className="lg:col-span-2 relative">
            <div className="absolute -inset-4 bg-gold/30 rounded-[2.5rem] blur-2xl" />
            <div className="relative rounded-[1.75rem] overflow-hidden border-[6px] border-gold shadow-treasure -rotate-2">
              <img
                src={productImg}
                alt="Kit completo da Caça ao Tesouro da Bíblia"
                className="w-full h-auto"
                loading="lazy"
                width={1280}
                height={1024}
              />
            </div>
            <div className="absolute -top-3 -right-3 bg-gold text-wood-dark font-display text-xs md:text-sm px-3 py-1.5 rounded-full border-2 border-wood-dark shadow-card rotate-6">
              8 itens
            </div>
          </div>

          {/* Lista compacta */}
          <div className="lg:col-span-3 grid grid-cols-2 gap-3 md:gap-4">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex items-center gap-3 bg-parchment text-ink rounded-xl p-3 md:p-4 border-[3px] border-gold shadow-card"
                >
                  <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gold-gradient border-2 border-wood-dark flex items-center justify-center">
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-wood-dark" />
                  </div>
                  <h3 className="font-display text-sm md:text-base leading-tight">{item.title}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- CHARACTERS ---------------- */
function Characters() {
  return (
    <section className="relative py-20 md:py-28 bg-parchment-gradient overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <SectionLabel>Coleção de Heróis</SectionLabel>
        <h2 className="mt-6 text-stroke-wood font-display text-3xl md:text-5xl">
          Colecione os <span className="hl-gold">Heróis da Fé</span>
        </h2>
        <p className="mt-4 font-heading text-lg text-ink/80 max-w-2xl mx-auto">
          Mais de <span className="hl-marker font-bold">100 personagens</span> para descobrir, conhecer e colecionar.
        </p>

        <div className="mt-12 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-5">
          {characters.map((c, i) => (
            <div key={c.name} className="group flex flex-col items-center" style={{ transform: `rotate(${(i % 3 - 1) * 2}deg)` }}>
              <div className={`relative w-full aspect-square rounded-full bg-gradient-to-br ${c.color} border-4 border-gold shadow-card flex items-center justify-center text-5xl md:text-6xl group-hover:scale-105 transition`}>
                <span>{c.icon}</span>
                <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-gold border-2 border-wood-dark flex items-center justify-center">
                  <Star className="w-3.5 h-3.5 text-wood-dark fill-wood-dark" />
                </div>
              </div>
              <div className="mt-3 px-3 py-1 bg-parchment border-2 border-wood-dark rounded-full font-display text-sm text-ink shadow-card">
                {c.name}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-adventure text-white font-heading font-bold border-4 border-adventure-dark shadow-card">
          <Sparkles className="w-5 h-5" /> + de 90 outros heróis para descobrir!
        </div>
      </div>
    </section>
  );
}

/* ---------------- BENEFITS ---------------- */
function Benefits() {
  return (
    <section className="relative py-20 md:py-28 bg-sky-gradient overflow-hidden">
      <Sun className="absolute top-10 right-10 w-24 h-24 text-gold animate-spin-slow opacity-80" />
      <div className="max-w-6xl mx-auto px-4 text-center">
        <SectionLabel>Benefícios</SectionLabel>
        <h2 className="mt-6 text-stroke-sky font-display text-3xl md:text-5xl">
          O que seu filho <span className="hl-gold">desenvolve</span> <span className="block">durante a jornada?</span>
        </h2>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-5">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.title} className="bg-parchment rounded-3xl p-6 border-4 border-gold shadow-card hover:-translate-y-2 transition">
                <div className={`w-16 h-16 mx-auto rounded-2xl ${b.color} border-2 border-wood-dark flex items-center justify-center shadow-card`}>
                  <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="mt-4 font-display text-lg text-ink leading-tight">{b.title}</h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- BONUSES ---------------- */
function Bonuses() {
  const total = bonuses.reduce((sum, b) => sum + parseInt(b.value.replace(/\D/g, ""), 10), 0);
  return (
    <section data-funnel-step="bonus" className="relative py-20 md:py-28 bg-parchment-gradient overflow-hidden">
      <Sparkles className="absolute top-10 left-6 w-7 h-7 text-gold animate-sparkle" />
      <Sparkles className="absolute bottom-16 right-8 w-9 h-9 text-gold animate-sparkle" />

      <div className="max-w-6xl mx-auto px-4 text-center">
        <SectionLabel>Bônus Exclusivos</SectionLabel>
        <h2 className="mt-6 text-stroke-wood font-display text-3xl md:text-5xl">
          <span className="hl-gold">7 Tesouros Extras</span> na Sua Aventura
        </h2>
        <p className="mt-4 font-heading text-ink/80 text-base md:text-lg max-w-2xl mx-auto">
          Cada bônus foi pensado para tornar a jornada ainda mais divertida — e tudo já vem incluso no Plano Premium.
        </p>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {bonuses.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={b.n}
                className="group relative bg-white rounded-2xl border-[3px] border-gold shadow-card p-4 md:p-5 flex flex-col items-center text-center hover:-translate-y-1 transition"
                style={{ transform: `rotate(${i % 2 === 0 ? -0.6 : 0.6}deg)` }}
              >
                <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-adventure text-white font-display text-sm flex items-center justify-center border-2 border-white shadow-card z-10">
                  {b.n}
                </div>
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${b.tint} border-[3px] border-wood-dark flex items-center justify-center shadow-card mb-3`}>
                  <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" strokeWidth={2.5} />
                </div>
                <div className="font-display text-[10px] md:text-xs uppercase tracking-widest text-adventure-dark">Bônus {b.n}</div>
                <h3 className="font-display text-sm md:text-base text-ink mt-1 leading-tight">{b.title}</h3>
                <div className="mt-3 font-display text-base md:text-lg text-destructive line-through">{b.value}</div>
              </div>
            );
          })}

          {/* Total card */}
          <div className="col-span-2 md:col-span-3 lg:col-span-4 mt-2 bg-adventure-gradient rounded-2xl border-[3px] border-wood-dark shadow-treasure p-5 md:p-6 flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6">
            <Gift className="w-10 h-10 md:w-12 md:h-12 text-gold" />
            <div className="text-white">
              <div className="font-heading text-sm md:text-base uppercase tracking-widest">Valor total dos bônus</div>
              <div className="font-display text-3xl md:text-4xl">
                <span className="line-through opacity-70">R$ {total},00</span>{" "}
                <span className="hl-gold">GRÁTIS HOJE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- FOR WHO ---------------- */

/* ---------------- TESTIMONIALS ---------------- */
function Testimonials() {
  return (
    <section data-funnel-step="testimonials" className="relative py-20 md:py-28 bg-parchment-gradient">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <SectionLabel>Depoimentos</SectionLabel>
        <h2 className="mt-6 text-stroke-wood font-display text-3xl md:text-5xl">Famílias que já vivem a <span className="hl-gold">aventura</span></h2>

        <div className="mt-12 grid sm:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <div key={t.name} className="bg-white rounded-3xl p-6 border-4 border-gold shadow-card text-left"
              style={{ transform: `rotate(${(i % 2 === 0 ? -1 : 1) * 1.2}deg)` }}>
              <div className="flex gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} className="w-5 h-5 text-gold fill-gold" />
                ))}
              </div>
              <p className="font-heading text-ink/85 italic">"{t.text}"</p>
              <div className="mt-5 flex items-center gap-3">
                <img
                  src={t.photo}
                  alt={`Foto de ${t.name}`}
                  loading="lazy"
                  className="w-14 h-14 rounded-full object-cover border-2 border-wood-dark shadow-card"
                />
                <div>
                  <div className="font-display text-ink">{t.name}</div>
                  <div className="text-sm font-heading text-ink/60">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- GUARANTEE ---------------- */
function Guarantee() {
  return (
    <section className="relative py-16 sm:py-20 md:py-24 bg-sky-gradient overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 pt-10 sm:pt-4">
        <div className="relative bg-parchment rounded-[1.5rem] sm:rounded-[2.5rem] border-4 sm:border-8 border-gold shadow-treasure px-5 py-10 sm:p-10 md:p-12 text-center">
          <div className="absolute -top-10 sm:-top-12 left-1/2 -translate-x-1/2 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gold-gradient border-4 border-wood-dark flex items-center justify-center shadow-treasure animate-pop">
            <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-wood-dark" />
          </div>
          <div className="mt-6 sm:mt-4">
            <SectionLabel>Garantia Blindada</SectionLabel>
          </div>
          <h2 className="mt-5 text-stroke-wood font-display text-2xl sm:text-3xl md:text-5xl break-words"><span className="hl-marker">21 dias</span> incondicionais</h2>
          <p className="mt-5 font-heading text-base sm:text-lg md:text-xl text-ink/85 max-w-2xl mx-auto">
            Se por qualquer motivo você ou seu filho não amar a Caça ao Tesouro da Bíblia, basta enviar um e-mail em até <strong>21 dias</strong> e devolvemos <strong>100% do seu investimento</strong>.
          </p>
          <p className="mt-4 font-display text-xl sm:text-2xl text-adventure-dark">Risco zero. Aventura garantida.</p>
        </div>
      </div>
    </section>
  );
}

/* ---------------- OFFER ---------------- */
function Offer() {
  return (
    <section id="offer" data-funnel-step="offer" className="relative py-20 md:py-28 bg-adventure-gradient overflow-hidden">
      <Star className="absolute top-10 left-10 w-8 h-8 text-gold fill-gold animate-sparkle" />
      <Star className="absolute bottom-20 right-20 w-10 h-10 text-gold fill-gold animate-sparkle" />

      <div className="max-w-3xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gold text-wood-dark font-heading font-bold uppercase tracking-widest text-xs md:text-sm shadow-card">
          <Flame className="w-4 h-4" /> Oferta Especial de Lançamento
        </div>
        <h2 className="mt-6 font-display text-3xl md:text-5xl text-stroke-wood">
          Escolha seu <span className="hl-gold">Plano</span> e Comece <span className="hl-marker">Hoje</span>
        </h2>
        <p className="mt-4 font-heading text-base md:text-lg text-white/95 max-w-xl mx-auto">
          Dois planos pensados para sua família. Comece pelo essencial ou leve a aventura completa.
        </p>

        <div className="mt-10 grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {/* Plano Básico */}
          <div className="relative bg-parchment rounded-[1.5rem] md:rounded-[2rem] border-4 md:border-8 border-wood/40 shadow-treasure p-6 md:p-8 flex flex-col">
            <div className="inline-flex self-center items-center gap-2 px-4 py-1.5 rounded-full bg-wood text-parchment font-heading font-bold uppercase tracking-widest text-xs">
              Plano Básico
            </div>
            <div className="mt-4 text-center">
              <div className="font-heading text-ink/60 line-through text-base">De R$ 27,00</div>
              <div className="mt-1 font-display text-5xl md:text-6xl text-wood-dark">R$ 9,90</div>
              <div className="mt-1 font-heading text-sm text-ink/70">pagamento único</div>
            </div>

            <div className="my-5 h-1 dashed-trail" />

            <ul className="text-left space-y-2 flex-1">
              {[
                "A Grande Caça ao Tesouro da Bíblia",
                "100 Figurinhas Bíblicas",
                "Acesso Imediato",
              ].map((i) => (
                <li key={i} className="flex items-start gap-2 font-heading font-semibold text-ink text-sm md:text-base">
                  <Check className="w-5 h-5 text-adventure shrink-0 mt-0.5" strokeWidth={4} /> {i}
                </li>
              ))}
              {[
                "Livro de Colorir Bíblico",
                "30 Caça-Palavras Bíblicos",
                "Detetive Bíblico",
                "Cartelas de Medalhas",
                "Certificado Oficial",
                "Atividades Extras para EBD",
              ].map((i) => (
                <li key={i} className="flex items-start gap-2 font-heading text-ink/40 line-through text-sm md:text-base">
                  <span className="w-5 h-5 shrink-0 mt-0.5 inline-flex items-center justify-center">✕</span> {i}
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <a href="https://pay.cakto.com.br/s2jguhd_917342" target="_blank" rel="noopener noreferrer" className="block w-full text-center px-6 py-4 rounded-full bg-wood text-parchment font-heading font-bold uppercase tracking-wide text-sm md:text-base shadow-card hover:scale-[1.02] transition-transform">
                Quero o Plano Básico
              </a>
            </div>
          </div>

          {/* Plano Premium */}
          <div className="relative bg-parchment rounded-[1.5rem] md:rounded-[2rem] border-4 md:border-8 border-gold shadow-treasure p-6 md:p-8 flex flex-col md:scale-[1.03]">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-adventure text-white font-heading font-bold uppercase tracking-widest text-[10px] md:text-xs shadow-card whitespace-nowrap">
              <Star className="w-3 h-3 fill-gold text-gold" /> Mais Escolhido
            </div>
            <div className="inline-flex self-center items-center gap-2 px-4 py-1.5 rounded-full bg-gold text-wood-dark font-heading font-bold uppercase tracking-widest text-xs mt-2">
              Plano Premium
            </div>
            <div className="mt-4 text-center">
              <div className="font-heading text-ink/60 line-through text-base">De R$ 97,00</div>
              <div className="mt-1 font-display text-5xl md:text-6xl text-adventure-dark">R$ 17,90</div>
              <div className="mt-1 font-heading text-sm text-ink/70">ou 12x de <strong className="text-ink">R$ 1,79</strong></div>
            </div>

            <div className="my-5 h-1 dashed-trail" />

            <ul className="text-left space-y-2 flex-1">
              {[
                "A Grande Caça ao Tesouro da Bíblia",
                "100 Figurinhas Bíblicas",
                "Livro de Colorir Bíblico",
                "30 Caça-Palavras Bíblicos",
                "Detetive Bíblico",
                "Cartelas de Medalhas",
                "Certificado Oficial",
                "Atividades Extras para EBD",
                "Acesso Imediato + Atualizações",
              ].map((i) => (
                <li key={i} className="flex items-start gap-2 font-heading font-semibold text-ink text-sm md:text-base">
                  <Check className="w-5 h-5 text-adventure shrink-0 mt-0.5" strokeWidth={4} /> {i}
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <CtaButton large href="https://pay.cakto.com.br/5e9jtks">QUERO O PLANO PREMIUM</CtaButton>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3 text-xs md:text-sm">
          <span className="inline-flex items-center gap-1 bg-wood text-parchment px-3 py-2 rounded-full font-heading font-bold"><Lock className="w-4 h-4" /> Compra Segura</span>
          <span className="inline-flex items-center gap-1 bg-adventure text-white px-3 py-2 rounded-full font-heading font-bold"><Shield className="w-4 h-4" /> Garantia 21 Dias</span>
          <span className="inline-flex items-center gap-1 bg-sky-dark text-white px-3 py-2 rounded-full font-heading font-bold"><Download className="w-4 h-4" /> Acesso Imediato</span>
        </div>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="relative py-20 md:py-28 bg-parchment-gradient">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center">
          <SectionLabel>Perguntas Frequentes</SectionLabel>
        <h2 className="mt-6 text-stroke-wood font-display text-3xl md:text-5xl">Dúvidas dos <span className="hl-gold">Exploradores</span></h2>
        </div>

        <div className="mt-12 space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="bg-white border-4 border-gold rounded-2xl shadow-card overflow-hidden">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-display text-base md:text-lg text-ink"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-gold-gradient border-2 border-wood-dark flex items-center justify-center text-sm flex-shrink-0">{i + 1}</span>
                    {f.q}
                  </span>
                  <ChevronDown className={`w-6 h-6 text-wood-dark transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pl-16 font-heading text-ink/85">{f.a}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FOOTER ---------------- */
function Footer() {
  return (
    <footer className="relative bg-wood text-parchment py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, var(--gold) 2px, transparent 2.5px)", backgroundSize: "26px 26px" }} />

      <div className="relative max-w-3xl mx-auto px-4 text-center">
        <Anchor className="w-12 h-12 mx-auto text-gold animate-float" />
        <h2 className="mt-6 font-display text-3xl md:text-5xl text-stroke-wood">
          A maior <span className="hl-gold">aventura</span> que uma criança pode viver não está em um videogame.
        </h2>
        <p className="mt-6 font-display text-2xl md:text-3xl text-gold">
          Está em descobrir os tesouros da Palavra de Deus.
        </p>

        <div className="mt-10">
          <CtaButton large>COMEÇAR MINHA JORNADA AGORA</CtaButton>
        </div>

        <div className="mt-16 pt-8 border-t-2 border-parchment/20 font-heading text-sm text-parchment/70">
          <div className="flex items-center justify-center gap-2 font-display text-lg text-gold">
            <Compass className="w-5 h-5 animate-spin-slow" />
            Caça ao Tesouro Bíblico
          </div>
          <p className="mt-4">© {new Date().getFullYear()} A Grande Caça ao Tesouro da Bíblia. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
