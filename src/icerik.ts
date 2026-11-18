// Sitenin BÜTÜN içeriği: metinler, standlar, süzgeçler, iletişim bilgileri, WhatsApp mesajları.
// Metinler eski siteden alındı; stand adları ve açıklamaları yeni stüdyo fotoğraflarına göre yazıldı.
// Yeni stand eklemek: fotoğrafı yeni-fotograflar/ içine koy, tools/stand-gorselleri/uret.mjs listesine ve
// buradaki STANDLAR'a birer satır ekle, aracı çalıştır, birim testindeki sayıları güncelle.
// Bu dosyayı testler Node ile doğrudan yükler: yalnızca silinebilir TypeScript sözdizimi, göreli içe aktarma yok.

export const SITE = {
  ad: 'Avrasya Toptan Pasta Süsleri',
  adres: 'https://avrasyasus.com/',
} as const

// --- WhatsApp ---

const WA_NUMARA = '905306656373'

export type WaMesaji = 'ust' | 'fiyat' | 'stand' | 'kule'

export const WA_MESAJ: Record<WaMesaji, string> = {
  ust: 'Merhaba, pastanem için süs standı hakkında bilgi almak istiyorum.',
  fiyat: 'Merhaba, pastanem için süs standı fiyatı almak istiyorum.',
  stand: 'Merhaba, süs standı hakkında bilgi almak istiyorum.',
  kule: 'Merhaba, kule stand hakkında bilgi almak istiyorum.',
}

export function waBaglantisi(mesaj: WaMesaji): string {
  return `https://wa.me/${WA_NUMARA}?text=${encodeURIComponent(WA_MESAJ[mesaj])}`
}

// --- Menü ---

export const MENU: readonly { ad: string; hedef: `#${string}` }[] = [
  { ad: 'Stand', hedef: '#stand' },
  { ad: 'Süsler', hedef: '#urunler' },
  { ad: 'Kule stand', hedef: '#kule' },
  { ad: 'Üretim', hedef: '#uretim' },
  { ad: 'İletişim', hedef: '#iletisim' },
]

// --- Açılış ---

export const ACILIS: {
  satirlar: readonly [string, string, string]
  aciklama: string
  cta: string
  ikincil: string
} = {
  satirlar: ['Pastaneniz için', 'süslerle dolu', 'teşhir standı'],
  aciklama:
    'Pleksi pasta süslerini kendi atölyemizde üretiyor, standa dizili olarak pastanelere gönderiyoruz. Stand tezgâhınızın yanında durur, müşteri pastasını alırken süsünü de seçer.',
  cta: 'Stand için fiyat alın',
  ikincil: 'Standları görün',
}

// --- Süs çıkartmaları ---

/** `en` ve `boy` görsel dosyasının piksel ölçüsüdür; sayfa yüklenirken yer ayırmak için. */
export type Sus = { dosya: string; alt: string; en: number; boy: number }

/** İlk altısı açılışta, sekizi birden iletişim bölümünde kullanılır. */
export const SUSLER: readonly Sus[] = [
  { dosya: 'sus-iyi-ki-dogdun', alt: 'Altın taçlı “İyi ki Doğdun” süsü', en: 370, boy: 316 },
  { dosya: 'sus-birthday-queen', alt: 'Pembe kalpli “Birthday Queen” süsü', en: 396, boy: 357 },
  { dosya: 'sus-canim-kizim', alt: 'Pembe “Canım Kızım” süsü', en: 421, boy: 463 },
  { dosya: 'sus-happy-birthday', alt: 'Siyah ve altın balonlu, taçlı “Happy Birthday” süsü', en: 433, boy: 355 },
  { dosya: 'sus-birthday-king', alt: 'Lacivert zeminli, taçlı “Birthday King” süsü', en: 393, boy: 352 },
  { dosya: 'sus-iyi-ki-varsin', alt: 'Papatyalı, altın kalpli “İyi ki Varsın” süsü', en: 402, boy: 299 },
  { dosya: 'sus-canim-babam', alt: 'Mavi balonlu, altın taçlı ve siyah papyonlu “Canım Babam” süsü', en: 405, boy: 383 },
  { dosya: 'sus-iyi-ki-bizimlesin', alt: 'Mavi zeminli, altın kalpli “İyi ki Bizimlesin” süsü', en: 431, boy: 359 },
]

export function susGorseli(dosya: string): string {
  return `/assets/img/susler/${dosya}.webp`
}

// --- Süzgeçler ve standlar ---

export type SuzgecId = 'hepsi' | 'cocuk' | 'rakam' | 'yazi' | 'esprili' | 'kadin' | 'erkek' | 'futbol' | 'ayna'

/** `renk`: süzgeç seçilince bölümün zemini; `uzeri`: o zeminde okunan yazı rengi. */
export type Suzgec = { id: SuzgecId; ad: string; renk: string; uzeri: string }

const MUREKKEP = '#120B3A'
const BEYAZ = '#FFFFFF'

export const SUZGECLER: readonly Suzgec[] = [
  { id: 'hepsi', ad: 'Tümü', renk: '#FF3D8B', uzeri: MUREKKEP },
  { id: 'cocuk', ad: 'Çocuk', renk: '#00B8C4', uzeri: MUREKKEP },
  { id: 'rakam', ad: 'Rakam', renk: '#FF4438', uzeri: MUREKKEP },
  { id: 'yazi', ad: 'Yazı', renk: '#B4E61D', uzeri: MUREKKEP },
  { id: 'esprili', ad: 'Esprili', renk: '#FF6A1A', uzeri: MUREKKEP },
  { id: 'kadin', ad: 'Kadın', renk: '#E11D74', uzeri: BEYAZ },
  { id: 'erkek', ad: 'Erkek', renk: '#2450F5', uzeri: BEYAZ },
  { id: 'futbol', ad: 'Futbol', renk: '#0FA958', uzeri: MUREKKEP },
  { id: 'ayna', ad: 'Ayna', renk: '#7A3CFF', uzeri: BEYAZ },
]

export type Stand = { dosya: string; ad: string; alt: string; konular: readonly Exclude<SuzgecId, 'hepsi'>[] }

export const STANDLAR: readonly Stand[] = [
  {
    dosya: 'stand-cocuk-karakter',
    ad: 'Çocuk karakterleri',
    alt: 'Beyaz basamaklı standda karakterli çocuk süsleri: “Prenses”, “Deniz Kızı”, “Minik Peri”, “Aslanım”, “Kaptan”, “Kahraman”',
    konular: ['cocuk'],
  },
  {
    dosya: 'stand-rakam-karakter',
    ad: 'Taçlı rakamlar ve karakterler',
    alt: 'Standda taçlı pembe ve mavi rakamlar; altında tek boynuzlu at, itfaiye aracı, uçak ve çizgi karakterli “İyiki Doğdun” süsleri',
    konular: ['cocuk', 'rakam'],
  },
  {
    dosya: 'stand-rakam-balon',
    ad: 'Balon rakamlar ve taçlı yazılar',
    alt: 'Standda taçlı balon rakamlar ve “İyi ki Doğdun”, “Canım Annem”, “Birthday King”, “Prenses” gibi renkli, taçlı yazı süsleri',
    konular: ['rakam', 'yazi'],
  },
  {
    dosya: 'stand-esprili-yazi',
    ad: 'Esprili yazılar',
    alt: 'Standda esprili süsler: “Bugün Beni Konuşun”, “Level Atladım”, “Nazar Değmesin”, “Ana Karakter Benim”, “Kral Geri Döndü”',
    konular: ['esprili', 'yazi'],
  },
  {
    dosya: 'stand-esprili-balon',
    ad: 'Konuşma balonları',
    alt: 'Standda konuşma balonu biçiminde esprili süsler: “Kocam da Kocam”, “Baba Bank”, “Hem Harbi Hem Barbie”, “Her Zerrene”',
    konular: ['esprili', 'yazi'],
  },
  {
    dosya: 'stand-kadin',
    ad: 'Kadınlara',
    alt: 'Standda pembe ve altın tonlu kadın süsleri: “Efsane Kadın”, “Diva”, “Sultanım”, “Ortamın Kraliçesi”, “Kraliçe”',
    konular: ['kadin', 'yazi'],
  },
  {
    dosya: 'stand-erkek',
    ad: 'Erkeklere',
    alt: 'Standda lacivert ve altın tonlu erkek süsleri: “Karizma”, “Delikanlı”, “İmparator”, “Patron”, “Baba”, “Reis”',
    konular: ['erkek', 'yazi'],
  },
  {
    dosya: 'stand-futbol',
    ad: 'Futbol',
    alt: 'Standda futbol temalı süsler: sarı lacivert, sarı kırmızı, siyah beyaz ve bordo mavi renklerde “İyi ki Doğdun” ve “Happy Birthday”',
    konular: ['futbol'],
  },
  {
    dosya: 'stand-ayna-renkli',
    ad: 'Renkli ayna yazılar',
    alt: 'Standda renkli ayna pleksi rakamlar ve “Canım Aşkım”, “Happy Birthday”, “İyiki Doğdun”, “Mutlu Yıllar” yazıları',
    konular: ['ayna', 'rakam', 'yazi'],
  },
  {
    dosya: 'stand-renkli-yazi',
    ad: 'Siyah zeminli renkli yazılar',
    alt: 'Standda renkli ayna rakamlar ve siyah zemin üzerinde renkli “Canım Annem”, “Canım Babam”, “Seni Seviyorum” yazıları, yıldız ve kalp süsler',
    konular: ['ayna', 'rakam', 'yazi'],
  },
  {
    dosya: 'stand-altin-gumus',
    ad: 'Altın ve gümüş ayna',
    alt: 'Standda altın ve gümüş ayna pleksi rakamlar ve “Canım Babam”, “Canım Annem”, “İyiki Doğdun”, “Mutlu Yıllar” yazıları',
    konular: ['ayna', 'rakam', 'yazi'],
  },
  {
    dosya: 'stand-ayna-katli',
    ad: 'Çift katlı ayna yazılar',
    alt: 'Standda altın, gümüş ve bakır tonlu ayna rakamlar ve siyah katmanlı “Happy Birthday”, “Canım Aşkım”, “Gönlümün Sultanı” yazıları',
    konular: ['ayna', 'rakam', 'yazi'],
  },
]

export function standlariSuz(suzgec: SuzgecId): readonly Stand[] {
  if (suzgec === 'hepsi') return STANDLAR
  return STANDLAR.filter(s => s.konular.includes(suzgec))
}

/** 640 ve 1040: stüdyo zeminli kare fotoğraf (her standda var); 'kesik': şeffaf zeminli (yalnızca sahnedeki standda var). */
export function standGorseli(dosya: string, boyut: 640 | 1040 | 'kesik'): string {
  return `/assets/img/standlar/${dosya}-${boyut}.webp`
}

// --- Stand nasıl çalışır ---

export const STAND_SAHNESI: {
  baslik: string
  adimlar: readonly { baslik: string; metin: string }[]
  cta: string
  standAlt: string
  /** Sahnede duran standın şeffaf zeminli görseli ve ölçüsü. */
  stand: { dosya: string; en: number; boy: number }
} = {
  baslik: 'Stand nasıl çalışır',
  adimlar: [
    { baslik: 'Dolu gelir', metin: 'Stand, süsler kademelere dizilmiş olarak gönderilir.' },
    { baslik: 'Tezgâhın yanına konur', metin: 'Müşteri pastasını beklerken süsleri görür.' },
    { baslik: 'Müşteri süsünü seçer', metin: 'Pastasına uygun yazıyı ya da rakamı standdan kendisi seçer.' },
  ],
  cta: 'Stand için bilgi alın',
  standAlt: 'Karakterli çocuk süsleriyle dolu stand, pastane tezgâhında pastanın yanında duruyor',
  stand: { dosya: 'stand-cocuk-karakter', en: 1040, boy: 949 },
}

// --- Süsler ve standlar ---

export const URUNLER: {
  baslik: string
  metin: string
  turler: readonly { baslik: string; metin: string }[]
  galeriBasligi: 'Her konsepte ayrı stand'
} = {
  baslik: 'Standdaki süsler',
  metin: 'Standın kademelerinde yazılar, rakamlar ve baskılı süsler bir arada durur.',
  turler: [
    {
      baslik: 'Ayna pleksi yazılar',
      metin: 'Altın ve gümüş ayna pleksiden “Canım Annem”, “İyi ki Doğdun”, “Mutlu Yıllar” gibi hazır yazılar.',
    },
    {
      baslik: 'Rakam süsleri',
      metin: '0’dan 9’a rakamlar, ayna ve renkli pleksi seçenekleriyle. Yaş pastaları için tek tek ya da yan yana kullanılır.',
    },
    {
      baslik: 'Baskılı pleksi süsler',
      metin: 'Desen pleksinin üzerine tam renkli basılır, süs kendi şeklinden kesilir ve etrafında ince bir şeffaf kenar kalır.',
    },
    { baslik: 'Karakterli çocuk süsleri', metin: 'Çocuk doğum günleri için renkli baskılı, karakterli süsler.' },
  ],
  galeriBasligi: 'Her konsepte ayrı stand',
}

// --- Kule stand ---

export const KULE: {
  baslik: string
  metin: string
  cta: string
  /** Kule standın resmi. Elimizde kule fotoğrafı olmadığı için bir çizimdir; fotoğraf gelince yalnızca burası ve `bant` değerleri değişir. */
  gorsel: { yol: string; en: number; boy: number }
  gorselAlt: string
  /** `bant`: katın resimdeki yeri, üstten yüzde olarak [başlangıç, bitiş]. Bir katın bittiği yerde sonraki başlar. */
  katlar: readonly { baslik: string; metin: string; bant: readonly [number, number] }[]
} = {
  baslik: 'Kule stand',
  metin: 'Tezgâhta yer yoksa kule stand yere konur. Dört katında rakamlar, yazılar ve karakterli süsler bir arada durur.',
  cta: 'Kule stand için bilgi alın',
  gorsel: { yol: '/assets/img/kule-stand.svg', en: 400, boy: 880 },
  gorselAlt:
    'Dört katlı beyaz kule standın çizimi: üst katta renkli rakamlar ve yazılar, ikinci katta altın ve gümüş ayna süsler, üçüncü katta kalpler ve renkli yazılar, alt katta karakterli çocuk süsleri',
  katlar: [
    { baslik: 'Üst kat', metin: 'Renkli rakamlar ve “İyi ki Doğdun”, “Happy Birthday” gibi renkli yazılar.', bant: [4, 27] },
    { baslik: 'İkinci kat', metin: 'Altın ve gümüş ayna rakamlar ve yazılar.', bant: [27, 50] },
    { baslik: 'Üçüncü kat', metin: 'Renkli ayna yazılar ve kalp süsler.', bant: [50, 73] },
    { baslik: 'Alt kat', metin: 'Karakterli çocuk süsleri.', bant: [73, 96] },
  ],
}

// --- Atölyeden vitrine ---

export const URETIM: {
  baslik: string
  metin: string
  adimlar: readonly { baslik: string; metin: string }[]
} = {
  baslik: 'Atölyeden vitrine',
  metin: 'Standdaki her süs aynı yolu izler. Baskı da kesim de kendi atölyemizde yapılır.',
  adimlar: [
    { baslik: 'UV baskı', metin: 'Renkler doğrudan pleksinin üzerine basılır ve UV ışıkla anında kurur.' },
    {
      baslik: 'Kesim',
      metin: 'Her süs kendi şeklinden kesilir; etrafında şeffaf bir kenar ve pastaya batan çubuğu kalır.',
    },
    { baslik: 'Standa dizme', metin: 'Süsler standın kademelerine yerleştirilir.' },
    {
      baslik: 'Paketleme ve gönderim',
      metin: 'Stand, süsler çizilmeyecek şekilde paketlenir ve pastanenize gönderilir.',
    },
  ],
}

// --- Videolar ---

export type VideoBilgisi = { kaynak: string; poster: string; en: number; boy: number; baslik: string }

export const VIDEOLAR: { stand: VideoBilgisi; uv: VideoBilgisi } = {
  stand: {
    kaynak: '/assets/video/stand-tanitim.mp4',
    poster: '/assets/video/stand-tanitim-poster.jpg',
    en: 848,
    boy: 480,
    baslik: 'Standın tanıtım videosu',
  },
  uv: {
    kaynak: '/assets/video/uv-baski.mp4',
    poster: '/assets/video/uv-baski-poster.jpg',
    en: 404,
    boy: 720,
    baslik: 'UV baskı videosu',
  },
}

// --- İletişim ---

export type Baglanti = { yazi: string; href: string }

export const ILETISIM: {
  ust: string
  baslik: string
  metin: string
  cta: string
  telefon: Baglanti
  whatsapp: Baglanti
  eposta: Baglanti
  instagram: Baglanti
  facebook: Baglanti
  adres: readonly string[]
} = {
  ust: 'Kutlamaya hazır mısınız?',
  baslik: 'Stand için fiyat alın',
  metin: 'Stand fiyatı ve içeriği için WhatsApp’tan yazın ya da arayın.',
  cta: 'WhatsApp’tan yazın',
  telefon: { yazi: '+90 530 665 63 73', href: 'tel:+905306656373' },
  whatsapp: { yazi: '+90 530 665 63 73', href: `https://wa.me/${WA_NUMARA}` },
  eposta: { yazi: 'mustafa.kuscu@avrasyasus.com.tr', href: 'mailto:mustafa.kuscu@avrasyasus.com.tr' },
  instagram: { yazi: '@avrasyapastasusleri34', href: 'https://www.instagram.com/avrasyapastasusleri34/' },
  facebook: { yazi: 'Avrasya Pastasüsleri', href: 'https://www.facebook.com/profile.php?id=61595280272926' },
  adres: ['Orta Mahalle, Maltepe Caddesi', 'Çağlayan Alba Sanayi Sitesi', 'B Blok No: 12/B F', 'Bayrampaşa / İstanbul'],
}
