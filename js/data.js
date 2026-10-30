// =============================================
//  AIMOVIES — КИНОНЫ МЭДЭЭЛЭЛ
//  Шинэ кино нэмэхдээ доорх нэг блокийг хуулж,
//  id-г нь давхцахгүй тоогоор солиорой.
//
//  poster  : босоо зураг (600×657 орчим), БИЧИГГҮЙ — нэрийг код өөрөө бичнэ
//  wide    : хэвтээ зураг (1080×448 орчим) — "AI бүтээлүүд" эгнээ, дэлгэрэнгүй цонх
//  hero    : (онцлох кинонд) том зураг, дүрс нь баруун талдаа
//  img     : (хуучин) poster/wide байхгүй үед ашиглах зураг
//  duration: минутаар
//  type    : "movie" = кино, "series" = сериал
//  rows    : аль эгнээнд харагдах вэ (доорх ROWS-ийн key)
//  featured: true бол дээд талын слайдад гарна
//  video   : Bunny Stream-ийн embed холбоос
// =============================================

const FILMS = [
  { id: 1, title: "Escape", poster: "escape-poster.jpg", wide: "escape-wide.jpg", hero: "escape-hero.jpg",
    year: 2024, rating: 7.8, quality: "HD", age: "12+", duration: 32, type: "movie",
    genres: ["Уран зөгнөлт", "Романтик"], rows: ["trending", "ai", "scifi"], featured: true,
    desc: "Ертөнцүүдийн цаана өрнөх үзэсгэлэнтэй, хүчтэй, сэтгэл шимшрүүлэм AI хайрын түүх." },

  { id: 2, title: "Jolmust", poster: "jolmust-poster.jpg", wide: "jolmust-wide.jpg", hero: "jolmust-hero.jpg",
    year: 2024, rating: 8.1, quality: "4K", age: "12+", duration: 73, type: "movie",
    genres: ["Уран зөгнөлт", "Адал явдал"], rows: ["trending", "ai", "scifi"], featured: true,
    desc: "Алтан хаалгаар орсон ганц аялагч алдагдсан ертөнцийн нууцыг тайлах ёстой болно." },

  { id: 3, title: "The Last Human", poster: "last-human-poster.jpg", wide: "last-human-wide.jpg", hero: "last-human-hero.jpg",
    year: 2023, rating: 8.0, quality: "HD", age: "12+", duration: 48, type: "movie",
    genres: ["Уран зөгнөлт", "Адал явдал"], rows: ["trending", "ai"], featured: true,
    desc: "Балгас болсон ширэнгэн ойд үлдсэн сүүлчийн хүн шинэ эзэдтэй нүүр тулна." },

  { id: 4, title: "The Devil in the Church", poster: "devil-poster.jpg", wide: "devil-wide.jpg", hero: "devil-hero.jpg",
    year: 2024, rating: 7.6, quality: "HD", age: "16+", duration: 64, type: "movie",
    genres: ["Аймшиг", "Нууцлаг"], rows: ["trending", "ai"],
    desc: "Эртний сүмд шөнө дунд гэрэл асах бүрт тосгоныхон нэг нэгээрээ алга болно." },

  { id: 5, title: "Seven Days", poster: "seven-days-poster.jpg", wide: "seven-days-wide.jpg", hero: "seven-days-hero.jpg",
    year: 2024, rating: 7.9, quality: "4K", age: "0+", duration: 8, type: "movie",
    genres: ["Уран зөгнөлт"], rows: ["trending", "ai", "scifi"], featured: true,
    desc: "Тэнгэрийн хаяанд гарч ирсэн хөлөг хүн төрөлхтөнд ердөө долоон хоног өгнө." },

  { id: 6, title: "The Light Within", poster: "light-within-poster.jpg", wide: "light-within-wide.jpg",
    year: 2024, rating: 8.3, quality: "HD", age: "0+", duration: 27, type: "movie",
    genres: ["Уран зөгнөлт", "Гэр бүл"], rows: ["trending", "ai"],
    desc: "Цасан шуурганд төөрсөн охиныг цагаан чоно гэрт нь хүргэхээр хамгаална." },

  // Таны нэмсэн кино (видеотой)
  { id: 7, title: "baju tumee", img: "baju-tumee.jpg",
    year: 2026, rating: 8.9, quality: "HD", age: "16+", duration: 10, type: "movie",
    genres: ["Хөгжим"], rows: ["trending"],
    video: "https://player.mediadelivery.net/embed/793457/46d5c4cb-4b76-4fb1-af6c-f988a2d8f808?autoplay=true&muted=false&preload=true",
    desc: "" }
];

// Нүүр хуудсан дээрх эгнээнүүд (дарааллаар нь)
//   layout: "poster" = босоо карт, "wide" = өргөн карт
//   label : өргөн карт дээрх жижиг бичиг
const ROWS = [
  { key: "trending", title: "Одоо эрэлттэй",   layout: "poster" },
  { key: "ai",       title: "AI бүтээлүүд",    layout: "wide", label: "AI бүтээл" },
  { key: "scifi",    title: "Сансрын ертөнц",  layout: "poster" }
];
