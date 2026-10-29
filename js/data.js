// =============================================
//  AIMOVIES — КИНОНЫ МЭДЭЭЛЭЛ
//  Шинэ кино нэмэхдээ доорх нэг блокийг хуулж,
//  id-г нь давхцахгүй тоогоор солиорой.
//
//  img     : images/ хавтас дахь картын зураг
//  hero    : (заавал биш) дээд талын том зургийн файл
//  type    : "movie" = кино, "series" = сериал
//  rows    : аль эгнээнд харагдах вэ
//            "new" = Шинээр нэмэгдсэн, "mongol" = Монгол кино,
//            "ai" = AI бүтээлүүд, "popular" = Алдартай кино
//  featured: true бол дээд талын слайдад гарна
//  video   : (дараа нь) Bunny Stream-ийн embed холбоос
// =============================================

const FILMS = [
  // ---------- Шинээр нэмэгдсэн ----------
    { id: 1, title: "хэрүүл", img: "baju-tumee.jpg", hero: "baju-tumee.jpg",
    year: 2026, rating: 8.9, quality: "4K", age: "16+", duration: 128, type: "movie",
    genres: ["Түүхэн", "Тулаант"], rows: ["new"], featured: true,
        video: "https://player.mediadelivery.net/embed/793457/46d5c4cb-4b76-4fb1-af6c-f988a2d8f808?autoplay=true&muted=false&preload=true",
    desc: "Эртний тал нутгийн нууц, баатарлаг тэмцлийн тухай сэтгэл хөдөлгөм түүх." },
  { id: 2, title: "Хүлэг", img: "khuleg.jpg",
    year: 2025, rating: 8.1, quality: "HD", age: "16+", duration: 116, type: "movie",
    genres: ["Түүхэн", "Драм"], rows: ["new"], featured: true,
    desc: "Хаант улсын сүүлчийн элч цусаар тамгалсан захидлыг хүргэхийн тулд бүтэн шөнө давхина." },
  { id: 3, title: "Сүүлчийн өвөл", img: "suulchiin-ovol.jpg",
    year: 2024, rating: 8.3, quality: "4K", age: "12+", duration: 109, type: "movie",
    genres: ["Драм", "Адал явдал"], rows: ["new"], featured: true,
    desc: "Зуднаар тасарсан малчин ганцаараа сүргээ аварч, хаврыг хүлээх ёстой болно." },
  { id: 4, title: "Хар сарны дороо", img: "khar-sarny-door.jpg",
    year: 2025, rating: 7.8, quality: "HD", age: "16+", duration: 48, type: "series", seasons: 1,
    genres: ["Нууцлаг", "Триллер"], rows: ["new"],
    desc: "Хар сар гарах шөнө бүр хотод нэг хүн сураггүй болдог. Залуу мөрдөгч бүсгүй үнэнийг хайна." },
  { id: 5, title: "Мөнх тэнгэр", img: "monkh-tenger.jpg",
    year: 2026, rating: 8.6, quality: "4K", age: "12+", duration: 121, type: "movie",
    genres: ["Адал явдал", "Түүхэн"], rows: ["new"], featured: true,
    desc: "Бүргэдчин аав, хүү хоёр ууланд алдагдсан эртний тамгыг олохоор аянд гарна." },
  { id: 6, title: "Нууцын хот", img: "nuutsyn-khot.jpg",
    year: 2024, rating: 7.9, quality: "HD", age: "12+", duration: 52, type: "series", seasons: 2,
    genres: ["Түүхэн", "Нууцлаг"], rows: ["new"],
    desc: "Элсэнд дарагдсан ордон хотыг малтсан археологичид мянган жилийн өмнөх хуйвалдааныг илрүүлнэ." },

  // ---------- Монгол кино ----------
  { id: 7, title: "Иргэд", img: "irged.jpg",
    year: 2023, rating: 8.2, quality: "HD", age: "16+", duration: 112, type: "movie",
    genres: ["Драм"], rows: ["mongol"],
    desc: "Нэг хорооллын таван айлын амьдрал нэгэн галын шөнө огтлолцоно." },
  { id: 8, title: "Ээж", img: "eej.jpg",
    year: 2024, rating: 8.7, quality: "HD", age: "0+", duration: 98, type: "movie",
    genres: ["Драм", "Гэр бүл"], rows: ["mongol", "popular"],
    desc: "Хотод ажиллаж буй охин ээжийнхээ өвчний тухай сонсоод олон жилийн дараа нутагтаа буцна." },
  { id: 9, title: "Хотын гэрэл", img: "khotyn-gerel.jpg",
    year: 2023, rating: 8.1, quality: "4K", age: "12+", duration: 104, type: "movie",
    genres: ["Драм"], rows: ["mongol"],
    desc: "Хөдөөнөөс ирсэн залуу нийслэлийн гэрлийн дунд өөрийн замаа хайна." },
  { id: 10, title: "Бидний өдөр", img: "bidnii-udur.jpg",
    year: 2025, rating: 7.8, quality: "HD", age: "12+", duration: 101, type: "movie",
    genres: ["Романтик"], rows: ["mongol"],
    desc: "Тохиолдлоор танилцсан хоёр залуу нэг л өдрийг хамт өнгөрөөхөөр тохирно." },
  { id: 11, title: "Уулын дуу", img: "uulyn-duu.jpg",
    year: 2024, rating: 8.4, quality: "4K", age: "0+", duration: 95, type: "movie",
    genres: ["Гэр бүл", "Адал явдал"], rows: ["mongol"],
    desc: "Морин хуурч өвгөн ач хүүдээ уулын нууцлаг аялгууг өвлүүлэхээр шийднэ." },
  { id: 12, title: "Хараа", img: "kharaa.jpg",
    year: 2023, rating: 7.6, quality: "HD", age: "16+", duration: 107, type: "movie",
    genres: ["Триллер"], rows: ["mongol"],
    desc: "Хараагаа алдсан гэрэл зурагчин хүн амины хэргийн цорын ганц гэрч болно." },

  // ---------- AI бүтээлүүд ----------
  { id: 13, title: "Тэнгэрийн сүм", img: "tengeriin-sum.jpg",
    year: 2025, rating: 8.5, quality: "4K", age: "12+", duration: 118, type: "movie",
    genres: ["Уран зөгнөлт"], rows: ["ai"], featured: true,
    desc: "Үүлэн дээр хөвөх сүмд шавь болсон хүү тэнгэр, газрын хоорондох гүүрийг хамгаална." },
  { id: 14, title: "Хиймэл ертөнц", img: "khiimel-yertunts.jpg",
    year: 2024, rating: 7.9, quality: "HD", age: "12+", duration: 45, type: "series", seasons: 1,
    genres: ["Уран зөгнөлт"], rows: ["ai"], featured: true,
    desc: "Виртуал хотод амьдардаг хүмүүс бодит ертөнц байдаг гэдгийг мэдэж эхэлнэ." },
  { id: 15, title: "Сүүлчийн хүн", img: "suulchiin-khun.jpg",
    year: 2025, rating: 8.2, quality: "4K", age: "12+", duration: 113, type: "movie",
    genres: ["Уран зөгнөлт", "Драм"], rows: ["ai"],
    desc: "Сансрын станцад ганцаараа үлдсэн сансрын нисгэгч дэлхийтэй холбоо тогтоохыг оролдоно." },
  { id: 16, title: "AI: Эхлэл", img: "ai-ekhlel.jpg",
    year: 2024, rating: 7.7, quality: "HD", age: "16+", duration: 50, type: "series", seasons: 1,
    genres: ["Уран зөгнөлт", "Триллер"], rows: ["ai"],
    desc: "Анхны ухаант робот бүсгүй өөрийгөө бүтээгчээсээ асуулт асууж эхэлдэг." },
  { id: 17, title: "Ирээдүйн хот", img: "ireeduin-khot.jpg",
    year: 2025, rating: 8.3, quality: "4K", age: "12+", duration: 119, type: "movie",
    genres: ["Уран зөгнөлт", "Тулаант"], rows: ["ai"],
    desc: "2150 оны Улаанбаатарт хуучин цэрэг хотын эрчим хүчийг булаах төлөвлөгөөг таслан зогсооно." },
  { id: 18, title: "Сансрын тэмдэг", img: "sansryn-temdeg.jpg",
    year: 2024, rating: 7.8, quality: "HD", age: "12+", duration: 111, type: "movie",
    genres: ["Уран зөгнөлт", "Адал явдал"], rows: ["ai"],
    desc: "Дэлхийн тойрог замд гарч ирсэн үл мэдэгдэх хөлөг хүн төрөлхтөнд мессеж илгээнэ." },

  // ---------- Алдартай кино ----------
  { id: 19, title: "Дайнгүй ертөнц", img: "daingui-yertunts.jpg",
    year: 2023, rating: 8.6, quality: "4K", age: "16+", duration: 124, type: "movie",
    genres: ["Түүхэн", "Драм"], rows: ["popular"],
    desc: "Хоёр улсын дайныг зогсоохоор илгээсэн элч нар хоёр талдаа ч урвагч гэж тооцогдоно." },
  { id: 20, title: "Эх орон", img: "ekh-oron.jpg",
    year: 2022, rating: 8.4, quality: "HD", age: "16+", duration: 131, type: "movie",
    genres: ["Түүхэн", "Тулаант"], rows: ["popular"],
    desc: "Хил хамгаалагч цэргүүдийн нөхөрлөл, золиослолын тухай баатарлаг түүх." },
  { id: 21, title: "Цаг хугацааны хил", img: "tsag-khugatsaany-khil.jpg",
    year: 2024, rating: 8.1, quality: "4K", age: "12+", duration: 117, type: "movie",
    genres: ["Уран зөгнөлт", "Нууцлаг"], rows: ["popular"],
    desc: "Цаг хугацааны хаалгаар орсон эрдэмтэн өөрийн өнгөрсөнтэй нүүр тулна." },
  { id: 22, title: "Далд ертөнц", img: "dald-yertunts.jpg",
    year: 2023, rating: 7.9, quality: "HD", age: "16+", duration: 47, type: "series", seasons: 2,
    genres: ["Уран зөгнөлт", "Триллер"], rows: ["popular"],
    desc: "Шөнийн хотын дор нуугдсан далд ертөнцийг хамгаалагч нууц бүлгийн түүх." },
  { id: 23, title: "Арван гурван өдөр", img: "arvan-gurvan-udur.jpg",
    year: 2024, rating: 8.0, quality: "4K", age: "12+", duration: 103, type: "movie",
    genres: ["Романтик", "Драм"], rows: ["popular"],
    desc: "Хуримаас арван гурван өдрийн өмнө сүйт залуу хуучин хайртайгаа дахин тааралдана." },
  { id: 24, title: "Маргааш", img: "margaash.jpg",
    year: 2023, rating: 7.8, quality: "HD", age: "12+", duration: 99, type: "movie",
    genres: ["Драм"], rows: ["popular"],
    desc: "Ажилгүй болсон аав гэр бүлдээ үнэнээ хэлэхээс өмнө нэг өдрийг дуусгах ёстой." }
];

// Нүүр хуудсан дээрх эгнээнүүд (дарааллаар нь)
const ROWS = [
  { key: "new",     title: "Шинээр нэмэгдсэн" },
  { key: "mongol",  title: "Монгол кино" },
  { key: "ai",      title: "AI бүтээлүүд" },
  { key: "popular", title: "Алдартай кино" }
];
