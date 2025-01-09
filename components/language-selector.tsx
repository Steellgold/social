"use client";

import { useTranslations } from "next-intl";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { useLanguageStore } from "@/lib/hooks/use-lang";
import { useRouter } from "next/navigation";
import { ISOLang } from "@/lib/types/lang";
import { useState } from "react";

const EmojiesByLang: Record<ISOLang, string> = {
  en: "🇺🇸", // Anglais (États-Unis)
  fr: "🇫🇷", // Français (France)
  es: "🇪🇸", // Espagnol (Espagne)
  de: "🇩🇪", // Allemand (Allemagne) 
  kr: "🇰🇷", // Coréen (Corée du Sud)
  aa: "🇩🇯", // Afar (Djibouti)
  ab: "🇬🇪", // Abkhaze (Géorgie)
  ae: "🇮🇷", // Avestique (Iran)
  af: "🇿🇦", // Afrikaans (Afrique du Sud)
  ak: "🇬🇭", // Akan (Ghana)
  am: "🇪🇹", // Amharique (Éthiopie)
  an: "🇪🇸", // Aragonais (Espagne)
  ar: "🇸🇦", // Arabe (Arabie Saoudite)
  as: "🇮🇳", // Assamais (Inde)
  av: "🇷🇺", // Avar (Russie)
  ay: "🇧🇴", // Aymara (Bolivie)
  az: "🇦🇿", // Azerbaïdjanais (Azerbaïdjan)
  ba: "🇷🇺", // Bachkir (Russie)
  be: "🇧🇾", // Biélorusse (Biélorussie)
  bg: "🇧🇬", // Bulgare (Bulgarie)
  bh: "🇮🇳", // Bihari (Inde)
  bi: "🇻🇺", // Bislama (Vanuatu)
  bm: "🇲🇱", // Bambara (Mali)
  bn: "🇧🇩", // Bengali (Bangladesh)
  bo: "🇨🇳", // Tibétain (Chine)
  br: "🇫🇷", // Breton (France)
  bs: "🇧🇦", // Bosniaque (Bosnie-Herzégovine)
  ca: "🇦🇩", // Catalan (Andorre)
  ce: "🇷🇺", // Tchétchène (Russie)
  ch: "🇬🇺", // Chamorro (Guam)
  co: "🇫🇷", // Corse (France)
  cr: "🇨🇦", // Cree (Canada)
  cs: "🇨🇿", // Tchèque (République tchèque)
  cu: "🇧🇬", // Vieux slave (Bulgarie)
  cv: "🇷🇺", // Tchouvache (Russie)
  cy: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", // Gallois (Pays de Galles)
  da: "🇩🇰", // Danois (Danemark)
  dv: "🇲🇻", // Maldivien (Maldives)
  dz: "🇧🇹", // Dzongkha (Bhoutan)
  ee: "🇬🇭", // Éwé (Ghana)
  el: "🇬🇷", // Grec (Grèce)
  eo: "🌍", // Espéranto (International)
  et: "🇪🇪", // Estonien (Estonie)
  eu: "🇪🇸", // Basque (Espagne)
  fa: "🇮🇷", // Persan (Iran)
  ff: "🇸🇳", // Peul (Sénégal)
  fi: "🇫🇮", // Finnois (Finlande)
  fj: "🇫🇯", // Fidjien (Fidji)
  fo: "🇫🇴", // Féroïen (Îles Féroé)
  fy: "🇳🇱", // Frison (Pays-Bas)
  ga: "🇮🇪", // Irlandais (Irlande)
  gd: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", // Gaélique écossais (Écosse)
  gl: "🇪🇸", // Galicien (Espagne)
  gn: "🇵🇾", // Guarani (Paraguay)
  gu: "🇮🇳", // Gujarati (Inde)
  gv: "🇮🇲", // Mannois (Île de Man)
  ha: "🇳🇬", // Haoussa (Nigeria)
  he: "🇮🇱", // Hébreu (Israël)
  hi: "🇮🇳", // Hindi (Inde)
  ho: "🇵🇬", // Hiri motu (Papouasie-Nouvelle-Guinée)
  hr: "🇭🇷", // Croate (Croatie)
  ht: "🇭🇹", // Créole haïtien (Haïti)
  hu: "🇭🇺", // Hongrois (Hongrie)
  hy: "🇦🇲", // Arménien (Arménie)
  hz: "🇳🇦", // Herero (Namibie)
  ia: "🌍", // Interlingua (International)
  id: "🇮🇩", // Indonésien (Indonésie)
  ie: "🌍", // Interlingue (International)
  ig: "🇳🇬", // Igbo (Nigeria)
  ii: "🇨🇳", // Yi (Chine)
  ik: "🇺🇸", // Inupiaq (États-Unis/Alaska)
  io: "🌍", // Ido (International)
  is: "🇮🇸", // Islandais (Islande)
  it: "🇮🇹", // Italien (Italie)
  iu: "🇨🇦", // Inuktitut (Canada)
  ja: "🇯🇵", // Japonais (Japon)
  jv: "🇮🇩", // Javanais (Indonésie)
  ka: "🇬🇪", // Géorgien (Géorgie)
  kg: "🇨🇩", // Kongo (RD Congo)
  ki: "🇰🇪", // Kikuyu (Kenya)
  kj: "🇳🇦", // Kuanyama (Namibie)
  kk: "🇰🇿", // Kazakh (Kazakhstan)
  kl: "🇬🇱", // Groenlandais (Groenland)
  km: "🇰🇭", // Khmer (Cambodge)
  kn: "🇮🇳", // Kannada (Inde)
  ko: "🇰🇷", // Coréen (Corée du Sud)
  ks: "🇮🇳", // Cachemiri (Inde)
  ku: "🇮🇶", // Kurde (Irak)
  kv: "🇷🇺", // Komi (Russie)
  kw: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", // Cornique (Angleterre)
  ky: "🇰🇬", // Kirghize (Kirghizistan)
  la: "🇻🇦", // Latin (Vatican)
  lb: "🇱🇺", // Luxembourgeois (Luxembourg)
  lg: "🇺🇬", // Ganda (Ouganda)
  li: "🇳🇱", // Limbourgeois (Pays-Bas)
  ln: "🇨🇩", // Lingala (RD Congo)
  lo: "🇱🇦", // Lao (Laos)
  lt: "🇱🇹", // Lituanien (Lituanie)
  lu: "🇨🇩", // Luba-katanga (RD Congo)
  lv: "🇱🇻", // Letton (Lettonie)
  mg: "🇲🇬", // Malgache (Madagascar)
  mh: "🇲🇭", // Marshallais (Îles Marshall)
  mi: "🇳🇿", // Maori (Nouvelle-Zélande)
  mk: "🇲🇰", // Macédonien (Macédoine du Nord)
  ml: "🇮🇳", // Malayalam (Inde)
  mn: "🇲🇳", // Mongol (Mongolie)
  mr: "🇮🇳", // Marathi (Inde)
  ms: "🇲🇾", // Malais (Malaisie)
  mt: "🇲🇹", // Maltais (Malte)
  my: "🇲🇲", // Birman (Myanmar)
  na: "🇳🇷", // Nauruan (Nauru)
  nb: "🇳🇴", // Norvégien bokmål (Norvège)
  nd: "🇿🇼", // Ndébélé du Nord (Zimbabwe)
  ne: "🇳🇵", // Népalais (Népal)
  ng: "🇳🇦", // Ndonga (Namibie)
  nl: "🇳🇱", // Néerlandais (Pays-Bas)
  nn: "🇳🇴", // Norvégien nynorsk (Norvège)
  no: "🇳🇴", // Norvégien (Norvège)
  nr: "🇿🇦", // Ndébélé du Sud (Afrique du Sud)
  nv: "🇺🇸", // Navajo (États-Unis)
  ny: "🇲🇼", // Chichewa (Malawi)
  oc: "🇫🇷", // Occitan (France)
  oj: "🇨🇦", // Ojibwa (Canada)
  om: "🇪🇹", // Oromo (Éthiopie)
  or: "🇮🇳", // Odia (Inde)
  os: "🇬🇪", // Ossète (Géorgie)
  pa: "🇮🇳", // Pendjabi (Inde)
  pi: "🇮🇳", // Pali (Inde)
  pl: "🇵🇱", // Polonais (Pologne)
  ps: "🇦🇫", // Pachto (Afghanistan)
  pt: "🇵🇹", // Portugais (Portugal)
  qu: "🇵🇪", // Quechua (Pérou)
  rm: "🇨🇭", // Romanche (Suisse)
  rn: "🇧🇮", // Kirundi (Burundi)
  ro: "🇷🇴", // Roumain (Roumanie)
  ru: "🇷🇺", // Russe (Russie)
  rw: "🇷🇼", // Kinyarwanda (Rwanda)
  sa: "🇮🇳", // Sanskrit (Inde)
  sc: "🇮🇹", // Sarde (Italie)
  sd: "🇵🇰", // Sindhi (Pakistan)
  se: "🇳🇴", // Same du Nord (Norvège)
  sg: "🇨🇫", // Sango (République centrafricaine)
  si: "🇱🇰", // Cingalais (Sri Lanka)
  sk: "🇸🇰", // Slovaque (Slovaquie)
  sl: "🇸🇮", // Slovène (Slovénie)
  sm: "🇼🇸", // Samoan (Samoa)
  sn: "🇿🇼", // Shona (Zimbabwe)
  so: "🇸🇴", // Somali (Somalie)
  sq: "🇦🇱", // Albanais (Albanie)
  sr: "🇷🇸", // Serbe (Serbie)
  ss: "🇸🇿", // Swati (Eswatini)
  st: "🇱🇸", // Sotho du Sud (Lesotho)
  su: "🇮🇩", // Soundanais (Indonésie)
  sv: "🇸🇪", // Suédois (Suède)
  sw: "🇹🇿", // Swahili (Tanzanie)
  ta: "🇮🇳", // Tamoul (Inde)
  te: "🇮🇳", // Telugu (Inde)
  tg: "🇹🇯", // Tadjik (Tadjikistan)
  th: "🇹🇭", // Thaï (Thaïlande)
  ti: "🇪🇷", // Tigrinya (Érythrée)
  tk: "🇹🇲", // Turkmène (Turkménistan)
  tl: "🇵🇭", // Tagalog (Philippines)
  tn: "🇧🇼", // Tswana (Botswana)
  to: "🇹🇴", // Tongien (Tonga)
  tr: "🇹🇷", // Turc (Turquie)
  ts: "🇿🇦", // Tsonga (Afrique du Sud)
  tt: "🇷🇺", // Tatar (Russie)
  tw: "🇬🇭", // Twi (Ghana)
  ty: "🇵🇫", // Tahitien (Polynésie française)
  ug: "🇨🇳", // Ouïghour (Chine)
  uk: "🇺🇦", // Ukrainien (Ukraine)
  ur: "🇵🇰", // Ourdou (Pakistan)
  uz: "🇺🇿", // Ouzbek (Ouzbékistan)
  ve: "🇿🇦", // Venda (Afrique du Sud)
  vi: "🇻🇳", // Vietnamien (Vietnam)
  vo: "🌍", // Volapük (International)
  wa: "🇧🇪", // Wallon (Belgique)
  wo: "🇸🇳", // Wolof (Sénégal)
  xh: "🇿🇦", // Xhosa (Afrique du Sud)
  yi: "🇮🇱", // Yiddish (Israël)
  yo: "🇳🇬", // Yoruba (Nigeria)
  za: "🇨🇳", // Zhuang (Chine)
  zh: "🇨🇳", // Chinois (Chine)
  zu: "🇿🇦", // Zoulou (Afrique du Sud)
};

export const LanguageSelector = () => {
  const t = useTranslations("LanguageSelector");
  const { lang, setLang } = useLanguageStore();
  const router = useRouter();
  const [isTriggered, setIsTriggered] = useState(false);

  return (
    <Select 
      onValueChange={(e: ISOLang) => {
        setLang(e);
        router.refresh();
      }}
      value={lang}
      open={isTriggered}
      onOpenChange={(e) => setIsTriggered(e)}
    >
      <SelectTrigger showArrow={false}>
        <SelectValue placeholder={t("Placeholder")}>
          {EmojiesByLang[lang]}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{t("Label")}</SelectLabel>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="fr">Français</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}