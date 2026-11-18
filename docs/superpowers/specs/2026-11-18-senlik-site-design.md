# Avrasya Toptan Pasta Süsleri — "Şenlik" sitesi tasarımı

Tarih: 18 Kasım 2026 · Dal: `v2-react` · Durum: onaylandı (18 Kasım 2026)

## 1. Ne yapıyoruz ve neden

Pastanelere süs standı satan Avrasya Toptan Pasta Süsleri'nin tek sayfalık tanıtım sitesi sıfırdan,
React üzerinde yeniden kuruluyor. İçerik değişmiyor; değişen görünüm ve hareket.

Site sahibinin istediği, kendi sözleriyle:

- "çok daha animasyonlu ve farklı kaliteli gözüken bir web sitesi"
- "premium göstersin beni ama renkler canlı renkler olsun", çünkü konsept üzerine pasta süsü satıyorlar.

Üç açılış taslağı gösterildi; site sahibi üçüncüyü, **Şenlik**'i seçti: kobalt zemin, güneş sarısı ve pembe,
tek kalın yazı ailesi, çıkartma gibi dağılan ve sürüklenebilen süsler, kayan sarı şerit.

Ziyaretçi: pastane sahibi ya da çalışanı. Çoğu, WhatsApp ya da Instagram'daki bir bağlantıdan telefonla gelir.
Sayfanın işi: standı anlatmak ve ziyaretçiyi WhatsApp'tan fiyat sormaya götürmek.

## 2. Hedefler

1. Sayfa ilk bakışta eski siteden ayrışır ve bir üreticinin sitesi gibi durur: canlı, ama düzenli ve temiz.
2. Her bölümde ziyaretçinin gördüğü ya da dokunduğu belirgin bir hareket vardır; bölümler birbirinin tekrarı değildir.
3. WhatsApp'tan yazma düğmesi sayfanın her yerinden tek dokunuşla erişilebilir.
4. Telefonda akıcıdır; orta sınıf bir telefonda takılmaz.
5. Arama motorları ve paylaşım önizlemeleri eski sitedeki kadar iyi çalışır.

## 3. Yapılmayacaklar

- Yeni sayfa, yeni bölüm ya da yeni metin yok. Metinler eski siteden aynen alınır (`eski-site/index.html`).
- Yeni fotoğraf ya da video çekimi yok; `public/assets/` içindeki görseller kullanılır. Yeni çizimler (pasta, tezgâh,
  küçük simgeler) ve mevcut görsellerden derlenen yeni paylaşım görseli bunun dışındadır.
- Fiyat listesi, sepet, sipariş formu, üyelik, yönetim paneli yok.
- İkinci dil yok; site Türkçe.
- Eski sitenin açılış perdesi (ilk ziyarette oynayan logo ve mum) ve finaldeki mum üfleme oyunu taşınmaz.
  Yerlerini Şenlik'in kendi açılışı ve finali alır. *(Benim önerim; site sahibi onaylamalı.)*

## 4. Başarısızlık sayılacak durumlar

Site teknik olarak çalışsa bile şunlardan biri olursa iş başarısızdır:

- Animasyon, ziyaretçiyi içerikten ya da WhatsApp düğmesinden uzak tutuyor; kaydırma "kilitlenmiş" hissi veriyor.
- Sayfa çocuk oyuncağı sitesi gibi görünüyor; üretici ciddiyeti kayboluyor.
- JavaScript yüklenmeden ya da yüklenemediğinde sayfa boş kalıyor.
- Hareket azaltma ayarı açık olan ziyaretçi eksik ya da bozuk bir sayfa görüyor.
- Telefonda yana taşma, üst üste binen yazı ya da takılan kaydırma var.

## 5. Kısıtlar

- **Barındırma:** Düz dosya barındırma. `npm run build` çıktısı (`dist/`) olduğu gibi yüklenir; sunucu tarafında kod çalışmaz.
- **Adres:** `https://www.avrasyasus.com.tr/`. `canonical`, `og:url`, `og:image`, JSON-LD, `robots.txt` ve `sitemap.xml` aynı alan adını gösterir.
- **Altyapı (site sahibinin kararı):** Vite + React + TypeScript; hareket için Motion (`motion/react`); yumuşak kaydırma için Lenis. Hepsi kurulu.
- **Yeni paket:** Yalnızca yazı tipinin siteye gömülmesi için gereken paket (`@fontsource-variable/bricolage-grotesque`) eklenir.
  Başka bir çalışma zamanı paketi gerekirse önce site sahibine sorulur.
- **İletişim bilgileri** eski sitedekiyle birebir aynıdır (bölüm 8.7). WhatsApp numarası `905306656373`.
- **Depo kuralı:** Commit ve push yalnızca site sahibi isteyince yapılır.

## 6. Yaklaşımlar

Üç yol değerlendirildi:

| | Yol | Artısı | Eksisi |
|---|---|---|---|
| A | Serbest kaydırma: her bölümün kendi küçük giriş hareketi | En hızlı kurulur, telefonda en rahatı | "Çok daha animasyonlu" isteğini en az karşılayan; eski siteden geri adım |
| B | Baştan sona sahne sahne: her bölüm ekrana sabitlenip kaydırmayla oynar | En gösterişli | Sayfa çok uzar, telefonda yorar, WhatsApp'a ulaşmak gecikir; en uzun kurulum ve test |
| C | Tek büyük sahne + her bölümde ayrı bir etkileşim | Gösteri tek yerde toplanır; sayfa kısa ve hızlı kalır | Sahnenin iyi olması şart; o zayıf kalırsa sayfa A'ya benzer |

**Seçilen: C.** Site sahibi teknik seçimleri bana bıraktı; seçim benim. Gerekçe: ziyaretçinin çoğu telefonda ve
işi fiyat sormak. Cesareti tek yerde harcamak hem daha kaliteli durur hem de sayfayı kullanılır tutar.

İkinci teknik karar (benim): **sayfa derleme sırasında hazır HTML olarak üretilir**, tarayıcıda React onu devralır.
Düz React uygulamasında sunucudan gelen sayfa boştur; bu, arama motorlarını, paylaşım önizlemesini, ilk boyamayı ve
JavaScript'siz görünümü bozar. Ek paket gerekmez (`react-dom/server` kurulu).

## 7. Görsel dil

Açılış taslağı (`src/taslaklar/Taslak3.tsx`, `taslak3.css`) bu dilin başvuru örneğidir. Taslak atılacak koddur;
site ondan öğrenilenlerle yeniden yazılır.

### Renkler

| Ad | Değer | Kullanım |
|---|---|---|
| Kobalt | `#2340FF` | Açılış ve iletişim zemini |
| Güneş | `#FFD60A` | Ana düğme, kayan şerit, sahne zemini |
| Pembe | `#FF3D8B` | Süsler ve standlar bölümünün başlangıç zemini |
| Mürekkep | `#120B3A` | Koyu yazı, sert gölgeler, kule bölümü ve alt bilgi zemini |
| Beyaz | `#FFFFFF` | Kobalt ve mürekkep üzerinde yazı, kart çerçeveleri, üretim bölümü zemini |

Mürekkep tek değerdir: `#120B3A` (taslağın stil dosyasındaki değer). `src/taslaklar/ortak.ts` içindeki `#17132E`,
üç taslağın ortak kullandığı eski sabittir; siteye taşınmaz.

Konsept renkleri (stand süzgecinde ve konsept etiketlerinde): Ayna `#7A3CFF`, Çocuk `#00B8C4`, Futbol `#0FA958`,
Kadın `#E11D74`, Erkek `#2450F5`, Esprili `#FF6A1A`. Rakam ve Yazı süzgeçlerinin rengini kuran kişi seçer.

Yazı rengi kuralı: pembe, güneş, turkuaz, yeşil ve turuncu üzerinde **mürekkep**; kobalt, mor, koyu pembe ve
mürekkep üzerinde **beyaz**. Gövde metni her zeminde en az 4,5:1 karşıtlık taşır.

### Yazı

Tek aile: **Bricolage Grotesque** (değişken; kalınlık 400–800). Türkçe harfler için `latin-ext` alt kümesi şart.
Yazı tipi dosyası siteye gömülür; Google'dan yüklenmez.

| Rol | Boyut | Kalınlık |
|---|---|---|
| Ana başlık (h1) | `clamp(2.25rem, 7.6vw, 7.5rem)`, satır aralığı 1, harf aralığı −0,035em | 800 |
| Bölüm başlığı (h2) | `clamp(2rem, 5vw, 4.25rem)`, satır aralığı 1 | 800 |
| Alt başlık (h3) | 1,5rem dolayı | 700 |
| Gövde | 1,125rem dolayı, satır aralığı 1,55, satır en çok 70 karakter | 500 |

### Biçim kuralları

- **Düz renk bantları.** Her bölüm uçtan uca tek renk zemindir; geçişlerde degrade yok.
- **Çıkartma.** Süs görselleri ve fotoğraf kartları çıkartma gibidir: beyaz kalın çerçeve, hafif eğim,
  mürekkep renkli **sert** gölge (bulanıksız, sağ alta kaymış).
- **Düğmeler** hap biçimindedir, sert gölgelidir; üzerine gelince gölgenin içine doğru "basılır".
- **Kayan şerit** sayfada en çok iki yerde kullanılır (açılışın altı ve iletişimin üstü).
- **Ciddiyet nereden gelir:** geniş boşluk, tek yazı ailesi, tek gölge sistemi, gerçek ürün fotoğrafları,
  yumuşak yaylı hareket. Süs ve renk dışında bezeme eklenmez.
- **Kaçınılacaklar:** her bölümde aynı "aşağıdan belirme" girişi; başlıkların üstünde küçük büyük harfli etiketler;
  başlıkta tek kelimeyi renklendirme; düğme metnine ok ekleme; sıra olmayan şeyleri numaralama.

## 8. Sayfa: bölüm bölüm

Sıra ve zemin renkleri:

```
┌──────────────────────────────────────────────┐
│ Üst çubuk (sabit, yüzen)                     │
├──────────────────────────────────────────────┤
│ 1 Açılış              kobalt                 │  süsler dağılır, sürüklenir
│ ═══ kayan sarı şerit ═══                     │
├──────────────────────────────────────────────┤
│ 2 Stand nasıl çalışır güneş   ◄ BÜYÜK SAHNE  │  ekrana sabitlenir, 3 adım oynar
│   tanıtım videosu                            │
├──────────────────────────────────────────────┤
│ 3 Süsler ve standlar  pembe → konsept rengi  │  süzgeç zemini boyar, kartlar yer değiştirir
├──────────────────────────────────────────────┤
│ 4 Kule stand          mürekkep               │  kule kat kat yükselir, katlar sırayla yanar
├──────────────────────────────────────────────┤
│ 5 Atölyeden vitrine   beyaz                  │  dört adımın çizgisi kaydırdıkça çizilir
│ ═══ kayan sarı şerit ═══                     │
├──────────────────────────────────────────────┤
│ 6 Stand için fiyat alın  kobalt              │  süsler geri döner, büyük WhatsApp düğmesi
├──────────────────────────────────────────────┤
│ Alt bilgi             mürekkep               │
└──────────────────────────────────────────────┘
```

### 8.0 Üst çubuk

- Sayfanın en üstünde açılışın üzerine şeffaf oturur: logo ve ad, menü, WhatsApp düğmesi (taslaktaki gibi).
- Açılış geçilince beyaz, sert gölgeli, yüzen bir hapa dönüşür ve ekranın üstünde kalır.
- Menü: Stand (`#stand`), Süsler (`#urunler`), Kule stand (`#kule`), Üretim (`#uretim`), İletişim (`#iletisim`).
  Bağlantılar bölüme yumuşak kaydırır. Bölüm kimlikleri eski siteyle aynıdır.
- Telefonda: logo, WhatsApp düğmesi ve "Menü" düğmesi. Menü tam ekran kobalt bir örtü olarak açılır;
  bağlantılar büyük yazıyla sırayla gelir. Esc ve bağlantıya basmak kapatır; açıkken odak örtünün içinde kalır.
- WhatsApp düğmesi her genişlikte üst çubukta görünür kaldığı için eski sitedeki yüzen WhatsApp düğmesi taşınmaz.
- İlk Tab, "İçeriğe geç" bağlantısına gider.

### 8.1 Açılış (kobalt)

Taslaktaki hâliyle: üç satırlık başlık yaylanarak gelir, altında açıklama, sarı "Stand için fiyat alın" düğmesi
(WhatsApp) ve "Standları görün" bağlantısı (`#urunler`). Altı süs çıkartması kenarlara dağılır, hafifçe salınır,
fareyle tutulup sürüklenebilir. Altta eğik sarı şeritte konsept adları kayar.

- Sürükleme yalnızca fareyle çalışır; dokunmatik ekranda süsler sabittir ve kaydırmayı engellemez.
- Telefonda dört süs görünür, köşelere yerleşir; başlıkla üst üste binmez.

### 8.2 Stand nasıl çalışır (güneş) — büyük sahne

Sayfanın tek sabitlenen bölümü. Bölüm ekrana oturur; kaydırma ilerledikçe üç adım sırayla oynar, sonra sayfa
normal akışına döner. Adımlar gerçekten sıralı olduğu için numaralanır (1, 2, 3).

| Adım | Metin (eski siteden) | Ekranda olan |
|---|---|---|
| 1 Dolu gelir | Stand, süsler kademelere dizilmiş olarak gönderilir. | Çocuk karakterleri standı kademe kademe belirir; süs çıkartmaları kenarlardan uçup standa girer. |
| 2 Tezgâhın yanına konur | Müşteri pastasını beklerken süsleri görür. | Altına tezgâh kayar, yanına pasta gelir; stand tezgâhta yerine oturur. |
| 3 Müşteri süsünü seçer | Pastasına uygun yazıyı ya da rakamı standdan kendisi seçer. | "Canım Kızım" süsü standdan çıkar, yaylanarak pastanın üstüne iner. |

- O anki adımın metni büyük, diğerleri soluk görünür. Sahnenin sonunda "Stand için bilgi alın" düğmesi (WhatsApp) belirir.
- Pasta ve tezgâh, Şenlik'in düz renkli diline uygun yeni çizimlerdir (eski `pasta.svg` degradeli; uymaz).
- Stand tek bir fotoğraftır (`stand-cocuk-karakter-kesik.webp`); "kademe kademe belirme" fotoğrafın alttan yukarı
  maskeyle açılmasıdır. Standa uçan süsler ayrı çıkartma görselleridir (`public/assets/img/susler/`, sekiz adet).
- Sahne kaydırmaya bağlıdır: geri kaydırınca geri oynar. Kaydırmayı ele geçirmez, hızını değiştirmez.
- Kaydırma mesafesi kısa tutulur: masaüstünde yaklaşık üç, telefonda yaklaşık iki ekran boyu.
- Hareket azaltma açıksa sabitleme yoktur: sahnenin son görüntüsü ve üç adım alt alta durur.
- Sahnenin altında tanıtım videosu (`stand-tanitim.mp4`, 848×480): eğik çıkartma çerçevesinde, görünür olunca
  sessiz ve döngüde oynar, görünmezken durur. Duraklat/oynat düğmesi vardır. Video ancak yaklaşıldığında indirilir.

### 8.3 Süsler ve standlar (pembe → konsept rengi)

İki parça:

**Standdaki süsler.** Dört süs türü büyük yazılı bir liste olarak (metinler eski siteden): Ayna pleksi yazılar,
Rakam süsleri, Baskılı pleksi süsler, Karakterli çocuk süsleri.

**Her konsepte ayrı stand.** Eski sitedeki 11 stand, adları ve alt metinleriyle (bkz. bölüm 9).

- Süzgeç düğmeleri: Tümü, Çocuk, Rakam, Yazı, Esprili, Kadın, Erkek, Futbol, Ayna. Stand–süzgeç eşleşmesi eski sitedekiyle aynı.
- Bir süzgece basınca **bölümün zemini o konseptin rengine boyanır**, uymayan kartlar çıkar, kalanlar yeni yerlerine kayar.
  Kaç stand gösterildiği yazıyla da bildirilir ("4 stand").
- Kartlar eğik çıkartmalardır (taslaktaki gibi); üzerine gelince düzelir.
- Karta basınca fotoğrafın büyüğü (`-1040.webp`) açılır; kart büyüyerek açılıyormuş gibi görünür. Esc, "Kapat" ve dışına basmak kapatır.
- Masaüstünde ızgara (dört sütun dolayı). Telefonda yana parmakla kaydırılan tek sıra; sayfa uzamaz.

### 8.4 Kule stand (mürekkep)

Koyu zemin, sayfanın dinlenme anı; kule fotoğrafı (`kule-stand-kesik.webp`, 471×1040) burada öne çıkar.

- Kule alttan yukarı kat kat yükselerek belirir (tek fotoğraf; maskeyle dört adımda açılır).
  Katların fotoğraftaki yerini kuran kişi fotoğraftan ölçer.
- Yanında dört kat sıralı durur (Üst kat, İkinci kat, Üçüncü kat, Alt kat; metinler eski siteden).
  Sayfa kaydıkça katlar sırayla vurgulanır: fotoğrafta o katı gösteren bir işaret, listede o satır.
  Satırın üzerine gelmek ya da dokunmak da o katı vurgular.
- Bölüm ekrana sabitlenmez.
- Düğme: "Kule stand için bilgi alın" (WhatsApp).

### 8.5 Atölyeden vitrine (beyaz)

- Dört adım sıralıdır ve numaralanır: UV baskı, Kesim, Standa dizme, Paketleme ve gönderim (metinler eski siteden).
- Adımları birleştiren kalın çizgi, sayfa kaydıkça çizilir; çizgi ulaştığı adımı "yakar".
  Masaüstünde yatay, telefonda dikey.
- UV baskı videosu (`uv-baski.mp4`, 404×720, dikey): eğik çıkartma çerçevesinde; 8.2'deki videoyla aynı kurallar.

### 8.6 Stand için fiyat alın (kobalt)

Açılışın eşi; sayfa başladığı renkle biter.

- Üstünde ikinci ve son kayan şerit.
- "Kutlamaya hazır mısınız?" satırı, dev "Stand için fiyat alın" başlığı, "Stand fiyatı ve içeriği için WhatsApp'tan
  yazın ya da arayın." metni ve sayfanın en büyük düğmesi: sarı "WhatsApp'tan yazın".
- Açılıştaki süs çıkartmaları başlığın çevresinde yeniden belirir (bu kez sekizi de); fareyle sürüklenebilir.
  Düğmenin üzerine gelince hepsi kısa bir an kıpırdar.
- İletişim kartı beyaz bir çıkartmadır (bölüm 8.7'deki bilgiler).

### 8.7 İletişim bilgileri ve alt bilgi

| | |
|---|---|
| Telefon | +90 530 665 63 73 (`tel:+905306656373`) |
| WhatsApp | +90 530 665 63 73 (`https://wa.me/905306656373`) |
| E-posta | mustafa.kuscu@avrasyasus.com.tr |
| Instagram | @avrasyapastasusleri34 (`https://www.instagram.com/avrasyapastasusleri34/`) |
| Facebook | Avrasya Pastasüsleri (`https://www.facebook.com/profile.php?id=61595280272926`) |
| Adres | Orta Mahalle, Maltepe Caddesi, Çağlayan Alba Sanayi Sitesi, B Blok No: 12/B F, Bayrampaşa / İstanbul |

Alt bilgi (mürekkep): logo, "© 2026 Avrasya Toptan Pasta Süsleri", menü bağlantıları.

### WhatsApp'ın hazır mesajları

Her düğme kendi mesajını taşır (eski sitedeki gibi):

| Düğme | Mesaj |
|---|---|
| Üst çubuk | Merhaba, pastanem için süs standı hakkında bilgi almak istiyorum. |
| Açılış ve iletişim | Merhaba, pastanem için süs standı fiyatı almak istiyorum. |
| Stand sahnesi | Merhaba, süs standı hakkında bilgi almak istiyorum. |
| Kule stand | Merhaba, kule stand hakkında bilgi almak istiyorum. |

## 9. İçerik kaynağı

- Bütün metinler, stand listesi (dosya adı, ad, alt metin, süzgeçler) ve iletişim bilgileri **tek bir içerik dosyasında** durur;
  bileşenlerin içine dağılmaz. Yeni stand eklemek o dosyaya bir satır eklemektir.
- Kaynak: `eski-site/index.html`. Metinler aynen alınır, yeniden yazılmaz.
- Sayfa başı da oradan taşınır: başlık, açıklama, `canonical`, `og:` etiketleri, `LocalBusiness` JSON-LD, simgeler.
  `theme-color` kobalt olur.
- **Paylaşım görseli yenilenir.** Mevcut `og.jpg` lacivert–altın eski kimliktedir; yeni siteyle uyuşmaz. Yerine Şenlik
  dilinde 1200×630 yeni bir görsel hazırlanır: kobalt zemin, firma adı, başlık ve mevcut stand ve süs görselleri.
  Yeni çekim gerekmez. *(Benim önerim; site sahibi onaylamalı.)*
- **Logo ve site simgeleri değişmez.** Logo firmanın kendi logosudur; açılış taslağındaki gibi beyaz halka içinde kullanılır.
- `public/robots.txt` ve `public/sitemap.xml` yerinde kalır. `sitemap.xml` içindeki tarih (şu an 2026-10-25) kurulum
  sırasında değişmez; yayına alma adımlarının biri olarak elle güncellenir ve bu adım `README.md`'ye yazılır.
- `eski-site/` klasörü kurulum boyunca başvuru için durur; yeni site yayına hazır olduğunda dalda silinir
  (eski site `main` dalında zaten duruyor).

## 10. Hareket kuralları

- Otomatik (ziyaretçinin başlatmadığı) hareket yalnızca şuralarda: açılış girişi, kayan şeritler, süslerin hafif salınımı, videolar.
- Diğer her hareket ziyaretçinin kaydırmasına ya da dokunuşuna yanıt verir.
- Giriş hareketleri bir kez oynar; geri kaydırınca tekrarlanmaz (kaydırmaya bağlı olanlar hariç).
- **Hareket azaltma açıkken:** kayan şeritler durur, salınım ve giriş hareketleri kapanır, büyük sahne sabitlenmez,
  her bölüm son görüntüsüyle durur. Hiçbir içerik eksilmez.
- **JavaScript yokken:** bütün metinler, fotoğraflar ve bağlantılar görünür. Süzgeç, büyük görsel ve menü düğmesi gibi
  JavaScript'e bağlı denetimler gizlenir. Giriş hareketleri içeriği JavaScript gelmeden gizlemez.
- Kaydırmaya bağlı hareketlerde yerleşimi yeniden hesaplatan özellikler (genişlik, yükseklik, konum, kenar boşluğu) kullanılmaz.
  Serbest olanlar: `transform`, `opacity`, `clip-path`/maske ve SVG çizgi çizimi. Süzgece basınca zemin renginin değişmesi
  kaydırmaya bağlı değildir; tek seferlik bir renk geçişidir. *(Benim kararım.)*
- **Yumuşak kaydırma (Lenis)** yalnızca fare tekerleğinde çalışır; dokunmatik ekranda tarayıcının kendi kaydırması kalır,
  hareket azaltma açıkken Lenis hiç başlatılmaz. Menü bağlantıları bölüme yumuşak kaydırır (Lenis yoksa tarayıcının kendi kaydırmasıyla).
  "Kaydırmayı ele geçirmez" şu demektir: kaydırma hiçbir yerde durdurulmaz, bir noktaya yapıştırılmaz, yönü ya da hızı değiştirilmez.
  Lenis büyük sahnenin sabitlenmesiyle çakışırsa Lenis'ten vazgeçilir, sahneden değil. *(Benim kararım.)*

## 11. Nasıl anlaşılır ki bitti

- `npm run build` hatasız; üretilen `dist/index.html` içinde bütün bölümlerin metni hazır HTML olarak var.
- Tarayıcı testleri (`tools/test/`, Playwright) yeni siteye göre yeniden yazılır ve geçer. Testler derlenmiş çıktıya
  (`dist/`) karşı çalışır; eski sitenin kök klasörü sunan ayarı ve `window.animReady` beklentisi kalkar. En az şunları kapsar:
  yana taşma yok (375, 768, 1440 genişlik); büyük sahne kaydırınca son hâline varır ve geri oynar; süzgeç doğru sayıda
  stand gösterir; kart büyük görseli açar, Esc kapatır; kule katları vurgulanır; WhatsApp bağlantıları numarayı ve doğru
  mesajı taşır; telefonda menü açılır ve kapanır; ilk Tab "İçeriğe geç"e gider; hareket azaltılınca sayfa son hâliyle
  görünür; JavaScript kapalıyken içerik görünür; adresler aynı alan adını gösterir; axe ciddi ya da kritik ihlal bulmaz.
- Lighthouse (telefon profili) ölçülür ve raporlanır. Hedef: Erişilebilirlik, En İyi Uygulamalar ve SEO 95 ve üzeri;
  Performans 85 ve üzeri. Hedefin altında kalan olursa nedeniyle birlikte yazılır.
- Konsolda hata yok.
- `README.md` yeni siteyi anlatır: yerelde açma, derleme, yayına alma (`dist/` yüklenir), içerik güncelleme.
  `PLAN.md` eski siteye aittir; kaldırılır.

## 12. Kuran kişiye bırakılanlar

- Dosya ve bileşen düzeni; stil dosyalarının bölünmesi; Tailwind'in ne kadar kullanılacağı.
- Hazır HTML üretiminin (derleme sırasında) nasıl kurulacağı.
- Sürelerin, yay ayarlarının ve kırılma noktalarının tam değerleri.
- Büyük sahnenin telefonda sabitlenmesi takılma yaratırsa telefonda sabitlemesiz, adım adım beliren düzene geçmek.
- Yeni pasta çiziminin ve küçük simgelerin biçimi.
- Rakam ve Yazı süzgeçlerinin rengi.
- GSAP ve `@gsap/react` kurulu ama kullanılmıyor; site Motion ile kuruluyor. Kullanılmadan kalırlarsa kaldırılırlar.
- Geçici taslak dosyaları (`src/taslaklar/`) site kurulurken silinir.
