export const revalidate = 86400;

import React from "react";
import { getPageBySlug, generatePageMetadata } from "@/lib/content";
import {
  Briefcase,
  Award,
  GraduationCap,
  Users,
  Film,
  FileText,
  Trophy,
  ExternalLink,
} from "lucide-react";
import * as icons from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata(
    "biography-rana_masud_film_director",
    "Biography & Career | Rana Masud",
    "Read the professional biography and career timeline of filmmaker, producer, and film teacher Rana Masud."
  );
}

// Default seed values from screenshots
const defaultRoleCards = [
  {
    image: "/content/biography-rana_masud_film_director/assets/Rana-Masud-Profile-3.png",
    role: "Film Director",
    company: "Ferywala Communications",
  },
  {
    image: "/content/biography-rana_masud_film_director/assets/Rana-Masud-Profile-1.png",
    role: "Film Producer",
    company: "Ferywala Communications",
  },
  {
    image: "/content/biography-rana_masud_film_director/assets/Rana-Masud-Profile-2.png",
    role: "Teacher",
    company: "Bangladesh Film Institute – BFI",
  },
];

const defaultAboutMe = {
  badge: "A FEW WORDS",
  title: "ABOUT ME AND MY WORK",
  subtitle: "RANA MASUD FILM DIRECTOR",
  text: "Born on September 21, 1979, Rana Masud is a renowned Bangladeshi film director, producer, screenplay writer, and academic. Over his illustrious career spanning more than two decades, he has established himself as a prominent voice in both commercial advertising and independent short films.",
};

const defaultTimeline = [
  {
    role: "Creative Director",
    period: "2002 - 2009",
    company: "Madonna Advertising Ltd. & Dhanshiri Communication Ltd.",
    description: "Rana Masud served Madonna Advertising Ltd. and Dhanshiri Communication Ltd. for years as a Creative Director. During my services in advertising agencies, I have specialized in conceptualization and idea generation of creative work as well as translating these ideas into creative materials. I have developed many creative for many brand promotions and behavioral changes on social causes.",
    icon: "Briefcase",
  },
  {
    role: "Managing Director",
    period: "2006 - Till Now",
    company: "Ferywala Communications",
    description: "Ferywala Communications, a prominent film production company in Bangladesh, is dedicated to advancing global cinema with a resolute commitment. The company excels in the craft of narrative through compelling visuals and sophisticated cinematic language. Spearheaded by the highly skilled and acclaimed advertisement filmmaker Rana Masud of Bangladesh, Ferywala Communications has established itself as an admirable force in the industry. The advertisements produced under the Ferywala Communications banner have received praise from both critics and audiences, contributing significantly to the company’s esteemed reputation. These successes have helped Ferywala Communications to earn a favorable reputation among its business clients as well. Rana Masud Film Director, Producer, and Teacher in Bangladesh.",
    icon: "Briefcase",
  },
  {
    role: "Film Director",
    period: "2006 - Till Now",
    company: "Independent & Agency Production",
    description: "Rana Masud is one of the pioneers who changed the face of Bangladeshi TV commercials. He possesses extensive expertise in brand promotion and behavior change communications, having acquired a wealth of knowledge and skills as a Film Director specializing in various forms of visual storytelling. He has proficiency extends to the development of impactful TV commercials, TV spots, PSAs (Public Service Announcements), video documentaries, and docu-dramas. Through he has experience, he has honed the ability to effectively convey messages and elicit desired responses from audiences, showcasing a nuanced understanding of both the creative and strategic aspects of visual communication. Some of his directed like Baby Zinc TV Spot for ICDDR-B, Arong Milk TV commercial for BRAC, and Joyeetar Joy Jaatra 26 episode Talk Show regarding Professional Women have widely been praised by many people in the advertising industry. He has Directed 300 Ad Films in Bangladesh. Rana Masud Film Director, Producer, and Teacher in Bangladesh.",
    icon: "Film",
  },
  {
    role: "Screenplay writer",
    period: "2002 - Till Now",
    company: "Independent Production",
    description: "Rana Masud wrote several screenplays from the beginning of his career. He received the Best Screenplay Award for The Residence (নিবাস) Short Film “Al-Nahj International Film Festival 2018 (Iraq)” and The Fragrance (আতর) Short Film “Festival Ouled Teima du Film International 2022 (Morocco)”. Rana Masud Film Director, Producer, and Teacher in Bangladesh.",
    icon: "FileText",
  },
  {
    role: "Producer",
    period: "2002 - Till Now",
    company: "Ferywala Communications",
    description: "Under the banner of Ferywala Communications, Rana Masud consistently produces a multitude of projects that receive acclaim from both critics and the broader audience. Rana Masud Film Director, Producer, and Teacher in Bangladesh.",
    icon: "Briefcase",
  },
  {
    role: "Teacher",
    period: "2002 - Till Now",
    company: "Bangladesh Film Institute (BFI)",
    description: "For the past eight years, I have been actively engaged as a teacher at the Bangladesh Film Institute (BFI). Within this educational role, I specialize in instructing Film Production Design and Shot Division, providing students with valuable insights and knowledge in these critical aspects of filmmaking. Rana Masud Film Director, Producer, and Teacher in Bangladesh.",
    icon: "GraduationCap",
  },
];

const defaultAwards = {
  international: [
    "Grand Prize Award at Festival Ouled Teima du Film International 2019 (Morocco) for The Residence (নিবাস) Short Film.",
    "Best Director & Screenplay Award at Festival Ouled Teima du Film International 2022 (Morocco) for The Fragrance (আতর) Short Film.",
  ],
  national: [
    "Best Short Film Award at Sylhet Agricultural University Film Society 2018",
    "Best Director Award at Sat Rong Short Film Festival 2021",
    "Best Director Paeace Film Award 2023",
  ],
};

const defaultAffiliations = {
  memberships: [
    "Honorable Member of Bangladesh Short Film Forum",
    "Honorable Member of Bangladesh Film Institute Alumni Association",
    "Honorable Member of Film 4 Peace Foundation",
    "Honorary Member of the theater, Office and Publicity Secretary.",
    "Honorable Member of AD Club",
    "Honorable Member of Theatre artist association of Dhaka (TAAD)",
  ],
  jury: [
    "Honorable Member of Peace Film Festival",
    "Held in Dhaka from 29 October, 2023- 31 October, 2023, organized by Film 4 Peace Foundation",
  ],
  participant: [],
};

const defaultNotableWork = {
  nonFiction: "Directed Talk Show (26 episodes) regarding Professional Women “Joyita Joy Jatra” broadcasted on NTV.",
  socialFilms: [
    "Dengue ( UNICEF )",
    "BCCP(Pride and Glory, Thank You, Akti Desh Akti Poriber)",
    "BCCP (PPR)",
    "BRAC (Aloran,Jagoran)",
    "Pacific Bhutta",
    "SMC Blue Star",
    "RAMMRU PSA",
    "Baby Zinc(Teaser, Emotional)",
    "Aman Group Corporate Documentary",
    "Documentary film for Save labor Migration(RUMMRU) and Brac Education Program",
    "Docudrama “Guptodhan” for BRAC",
    "DIIT",
    "Plan Bangladesh (oney hunt)",
    "Plan Bangladesh (mother)",
    "SPEMP(world bank project)",
    "CIDD ( UNISEF)",
    "Electricity Savings Campaign(3 TVCs)",
    "Smiling Sun Clinic (USAID)",
    "Amtranet Group Documentary",
    "World Bank (SPEMP)",
    "ICDDRB (Baby Zinc)",
    "Joyeeta (Ministry of Women and Children Affairs)",
    "NSI",
  ],
  adFilms: [
    "SKB Pressure Cooker",
    "SKB Cookware",
    "SKB Gas Burner",
    "2 Fun Wafer",
    "Alibaba Door & Home Solution",
    "2 Fun Noodles",
    "Zam Zam Tower",
    "ERD",
    "High Speedy Hair Color",
    "Partex Cable",
    "Florida Orange",
    "SKB Cookware",
    "SKB Pipe",
    "SKB Sink",
    "Runner Knight Rider Bike",
    "Sunflower OIl",
    "Danish Muster Oil",
    "Danish Dry Cake",
    "EGP",
    "Jute",
    "Monalica Tiles",
    "Zelta Mobile Phone",
    "Jeera Pani",
    "Bexi Fabrics",
    "Infinity Mega Mall",
    "Jute TVCs",
    "Fresh Premium Tea",
    "Danish Simla Tea",
    "Fresh Insta milk Powder",
    "Apollo Hospital Dhaka",
    "Banglalink",
    "Vision 21 Purbachal City",
    "Goalini Condensed Milk",
    "Doreo Biscuit",
    "Modhumoti Bank Ltd.",
    "Danish Candy",
    "Danish Full Cream Milk Powder",
    "Goalini Full Cream Milk Powder",
    "Meena Bazar",
    "Danish Spice Powder",
    "Islami Bank mKash",
    "O La La Potato Biscuit",
    "Star Bond Adhesive",
    "Partex Door",
    "Partex Furniture",
    "Danish Toast Biscuit",
    "Comfort Sea Star",
    "RC Cola",
    "Daffodil Int. School",
    "Icy Drinks",
    "DADA Mineral Water",
    "Global Money Transfer",
    "RUCHI-Pickle",
    "Chutny, Budam, Chips",
    "Lal Teer",
    "Arong Milk",
    "Myntra",
    "Westecs",
    "RAK Ceramics",
    "Mutual Trust Bank ( Remittance. SME Loan)",
    "Vim Dish Wash",
  ],
  films: [
    { name: "The Battles of Belonia (Documentary Film)", designation: "Director", year: "2021", link: "https://www.imdb.com/title/tt30252213/?ref_=ext_shr_lnk" },
    { name: "The Fragrance (Short Film)", designation: "Director", year: "2020", link: "https://www.imdb.com/title/tt30203183/?ref_=ext_shr_lnk" },
    { name: "Rupsha Nodir Banke (Film)", designation: "Assistant Director", year: "2018", link: "https://www.imdb.com/title/tt6955290/?ref_=ext_shr_lnk" },
    { name: "The Residence (Short Film)", designation: "Director", year: "2018", link: "https://www.imdb.com/title/tt30022600/?ref_=ext_shr_lnk" },
    { name: "Simantorekha (Film)", designation: "Assistant Director", year: "2017", link: "https://www.imdb.com/title/tt6454720/?ref_=ext_shr_lnk" },
    { name: "Jibondhuli (Film)", designation: "Assistant Director", year: "2014", link: "https://www.imdb.com/title/tt5341362/?ref_=ext_shr_lnk" },
    { name: "Rabeya (Film)", designation: "Actor", year: "2008", link: "https://www.imdb.com/title/tt6451346/?ref_=ext_shr_lnk" },
    { name: "Lalsalu (Film)", designation: "Actor", year: "2001", link: "https://www.imdb.com/title/tt0374812/?ref_=ext_shr_lnk" },
  ],
};

export default async function BiographyPage() {
  const pageData = await getPageBySlug("biography-rana_masud_film_director");

  const fm = pageData?.frontmatter || {};

  // Extract variables, falling back to comprehensive screenshot seeds
  const roleCards = fm.roleCards || defaultRoleCards;
  const aboutMe = fm.aboutMe || defaultAboutMe;
  const timeline = fm.professionalTimeline || defaultTimeline;
  
  const awards = {
    international: fm.awards?.international || defaultAwards.international,
    national: fm.awards?.national || defaultAwards.national,
  };

  const affiliations = {
    memberships: fm.affiliations?.memberships || defaultAffiliations.memberships,
    jury: fm.affiliations?.jury || defaultAffiliations.jury,
    participant: fm.affiliations?.participant || defaultAffiliations.participant,
  };

  const notableWork = {
    nonFiction: fm.notableWork?.nonFiction || defaultNotableWork.nonFiction,
    socialFilms: fm.notableWork?.socialFilms || defaultNotableWork.socialFilms,
    adFilms: fm.notableWork?.adFilms || defaultNotableWork.adFilms,
    films: fm.notableWork?.films || defaultNotableWork.films,
  };

  const headerTitle = fm.headerTitle || "Biography";
  const headerSubtitle = fm.headerSubtitle || "Film Director • Producer • Teacher";

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col gap-16 text-left">
      {/* Page Banner Header */}
      <section className="text-center max-w-3xl mx-auto -mb-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-wider text-white uppercase font-sans">
          {headerTitle}
        </h1>
        <div className="h-0.5 w-12 bg-gold-accent mx-auto mt-4 mb-3" />
        <p className="text-xs md:text-sm text-gold-accent/80 tracking-widest uppercase font-extrabold">
          {headerSubtitle}
        </p>
      </section>

      {/* 1. Header Role Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {roleCards.map((card: any, idx: number) => (
          <div
            key={idx}
            className="glass-card aspect-[3/4] p-5 flex flex-col justify-between border border-white/5 hover:border-gold-accent/30 hover:shadow-lg hover:shadow-gold-accent/5 transition-all duration-300 group overflow-hidden rounded-2xl bg-white/[0.01]"
          >
            <div className="relative w-full h-[75%] rounded-xl overflow-hidden bg-black/20 border border-white/5">
              {card.image ? (
                <img
                  src={card.image}
                  alt={card.role}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/20">
                  <Film className="h-10 w-10 animate-pulse" />
                </div>
              )}
            </div>
            
            <div className="bg-white/[0.03] backdrop-blur border border-white/5 rounded-lg p-3 text-center mt-4">
              <h3 className="text-white font-extrabold text-sm md:text-base tracking-wide uppercase">
                {card.role}
              </h3>
              <p className="text-gold-accent/80 font-bold text-[10px] md:text-xs mt-1">
                {card.company}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* 2. About Me Block */}
      <section className="max-w-4xl mx-auto text-center flex flex-col gap-6 bg-gradient-to-b from-white/[0.02] to-transparent p-8 md:p-12 rounded-3xl border border-white/5">
        <p className="text-xs font-bold text-gold-accent tracking-widest uppercase">{aboutMe.badge}</p>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-wide">{aboutMe.title}</h1>
        <h4 className="text-sm font-semibold text-white/40 tracking-widest uppercase -mt-2">{aboutMe.subtitle}</h4>
        <div className="h-0.5 w-16 bg-gold-accent mx-auto my-2" />
        <p className="text-white/70 leading-relaxed text-sm md:text-base max-w-3xl mx-auto italic font-sans">
          {aboutMe.text}
        </p>
      </section>

      {/* 3. Professional Life Timeline */}
      <section className="flex flex-col gap-10">
        <div className="border-b border-white/10 pb-4">
          <h2 className="text-2xl font-extrabold text-white tracking-wider flex items-center gap-3">
            <Briefcase className="text-gold-accent h-6 w-6" />
            Professional Career
          </h2>
          <p className="text-xs text-white/40 mt-1">Timeline of creative leadership, milestones, and experience.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {timeline.map((item: any, index: number) => {
            const IconComponent = (icons as any)[item.icon] || Briefcase;
            return (
              <div
                key={index}
                className="glass-card p-6 flex gap-5 border border-white/5 hover:border-gold-accent/20 transition-all rounded-xl bg-white/[0.01]"
              >
                <div className="w-10 h-10 rounded-lg bg-gold-accent/10 border border-gold-accent/20 flex items-center justify-center text-gold-accent shrink-0 mt-1">
                  <IconComponent className="h-5 w-5" />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-lg font-bold text-white leading-snug">{item.role}</h3>
                    <span className="text-[10px] font-extrabold text-gold-accent/80 tracking-wider bg-gold-accent/5 px-2 py-0.5 rounded border border-gold-accent/10 shrink-0">
                      {item.period}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-white/40">{item.company}</p>
                  <p className="text-white/60 text-xs leading-relaxed mt-2 font-sans">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Awards & Affiliations Workspace */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Awards Block */}
        <div className="flex flex-col gap-6">
          <div className="border-b border-white/10 pb-3">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Trophy className="text-gold-accent h-5 w-5" />
              Honors & Awards
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {/* International */}
            <div className="glass-card p-5 border border-white/5 rounded-xl bg-white/[0.01]">
              <h4 className="text-xs font-bold text-gold-accent uppercase tracking-widest mb-3">
                International Film Awards
              </h4>
              <ul className="flex flex-col gap-3.5">
                {awards.international.map((award: string, idx: number) => (
                  <li key={idx} className="text-xs text-white/70 leading-relaxed flex items-start gap-2">
                    <span className="text-gold-accent font-bold mt-0.5">•</span>
                    <span>{award}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* National */}
            <div className="glass-card p-5 border border-white/5 rounded-xl bg-white/[0.01]">
              <h4 className="text-xs font-bold text-gold-accent uppercase tracking-widest mb-3">
                National Film Awards
              </h4>
              <ul className="flex flex-col gap-3.5">
                {awards.national.map((award: string, idx: number) => (
                  <li key={idx} className="text-xs text-white/70 leading-relaxed flex items-start gap-2">
                    <span className="text-gold-accent font-bold mt-0.5">•</span>
                    <span>{award}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Affiliations & Memberships */}
        <div className="flex flex-col gap-6">
          <div className="border-b border-white/10 pb-3">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Users className="text-gold-accent h-5 w-5" />
              Affiliations & Jury
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {/* Memberships */}
            <div className="glass-card p-5 border border-white/5 rounded-xl bg-white/[0.01] flex-1">
              <h4 className="text-xs font-bold text-gold-accent uppercase tracking-widest mb-3">
                Professional Memberships
              </h4>
              <ul className="flex flex-col gap-3">
                {affiliations.memberships.map((member: string, idx: number) => (
                  <li key={idx} className="text-xs text-white/75 flex items-start gap-2 leading-relaxed">
                    <span className="text-white/20 font-bold mt-0.5">•</span>
                    {member}
                  </li>
                ))}
              </ul>
            </div>

            {/* Jury & Participant */}
            {(affiliations.jury.length > 0 || affiliations.participant.length > 0) && (
              <div className="glass-card p-5 border border-white/5 rounded-xl bg-white/[0.01]">
                {affiliations.jury.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-xs font-bold text-gold-accent uppercase tracking-widest mb-2">
                      Jury Board Service
                    </h4>
                    <ul className="flex flex-col gap-2">
                      {affiliations.jury.map((j: string, idx: number) => (
                        <li key={idx} className="text-xs text-white/70 flex items-start gap-2">
                          <span className="text-gold-accent/50 font-bold">•</span>
                          {j}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {affiliations.participant.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-gold-accent uppercase tracking-widest mb-2">
                      Event Participant
                    </h4>
                    <ul className="flex flex-col gap-2">
                      {affiliations.participant.map((p: string, idx: number) => (
                        <li key={idx} className="text-xs text-white/70 flex items-start gap-2">
                          <span className="text-white/20 font-bold">•</span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. Notable Work (Ads & Documentaries) */}
      <section className="flex flex-col gap-10">
        <div className="border-b border-white/10 pb-4">
          <h2 className="text-2xl font-extrabold text-white tracking-wider flex items-center gap-3">
            <Film className="text-gold-accent h-6 w-6" />
            Notable Productions
          </h2>
          <p className="text-xs text-white/40 mt-1">Commercial TVCs, non-fiction talk shows, and public documentaries.</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Non-Fiction Box */}
          {notableWork.nonFiction && (
            <div className="glass-card p-6 border border-white/5 rounded-xl bg-white/[0.01]">
              <h3 className="text-xs font-bold text-gold-accent uppercase tracking-widest mb-2">Non-Fiction</h3>
              <p className="text-sm text-white/80 leading-relaxed font-sans">{notableWork.nonFiction}</p>
            </div>
          )}

          {/* Social Film & Documentaries */}
          <div className="glass-card p-6 border border-white/5 rounded-xl bg-white/[0.01]">
            <h3 className="text-xs font-bold text-gold-accent uppercase tracking-widest mb-4">
              Social Film & Documentary
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {notableWork.socialFilms.map((tag: string, idx: number) => (
                <span
                  key={idx}
                  className="bg-white/[0.02] border border-white/5 hover:border-gold-accent/20 transition-colors text-white/80 text-xs px-3.5 py-1.5 rounded-md font-sans"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* AD Films */}
          <div className="glass-card p-6 border border-white/5 rounded-xl bg-white/[0.01]">
            <h3 className="text-xs font-bold text-gold-accent uppercase tracking-widest mb-4">AD Films</h3>
            <div className="flex flex-wrap gap-2">
              {notableWork.adFilms.map((tag: string, idx: number) => (
                <span
                  key={idx}
                  className="bg-white/[0.02] border border-white/5 hover:border-gold-accent/15 transition-colors text-white/70 text-[11px] px-3 py-1.5 rounded-md font-sans"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Feature Film Index Table */}
      <section className="flex flex-col gap-6">
        <div className="border-b border-white/10 pb-3">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <FileText className="text-gold-accent h-5 w-5" />
            Feature Film Index
          </h2>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/5 bg-black/20">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="p-4 font-bold text-gold-accent uppercase tracking-wider">Film Name</th>
                <th className="p-4 font-bold text-gold-accent uppercase tracking-wider">Designation</th>
                <th className="p-4 font-bold text-gold-accent uppercase tracking-wider text-right">Year</th>
              </tr>
            </thead>
            <tbody>
              {notableWork.films.map((film: any, idx: number) => (
                <tr
                  key={idx}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="p-4 font-bold text-white">
                    {film.link ? (
                      <a
                        href={film.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gold-accent transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        {film.name}
                        <ExternalLink className="h-3 w-3 text-white/30 shrink-0" />
                      </a>
                    ) : (
                      film.name
                    )}
                  </td>
                  <td className="p-4 text-white/70 font-semibold">{film.designation}</td>
                  <td className="p-4 text-white/50 font-semibold text-right">{film.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
