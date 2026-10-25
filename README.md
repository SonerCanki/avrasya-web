# Avrasya Toptan Pasta Süsleri — tanıtım sitesi

Pastanelere süs standı tanıtan, doğum günü temalı, kaydırdıkça ilerleyen tek sayfalık statik site.
Derleme adımı yok: dosyalar olduğu gibi yayına girer.

| Yol | Ne |
|---|---|
| `index.html` | Sayfanın tamamı: içerik, açılış perdesi, sahneler, iletişim |
| `css/style.css` | Renkler (`:root`), düzen, animasyonların başlangıç hâlleri |
| `js/main.js` | Animasyon dışı davranışlar: WhatsApp bağlantıları, menü, video, süzgeç, büyük görsel, mumlar |
| `js/animations.js` | Kaydırma hikâyesi: açılış, sahneler, konfeti |
| `assets/` | Görseller, videolar, SVG çizimler ve sabit sürümlü kütüphaneler (`assets/vendor/`) |
| `robots.txt`, `sitemap.xml` | Arama motorlarına sitenin taranabileceğini ve sayfanın adresini bildirir |
| `tools/stand-gorselleri/` | Telefon fotoğraflarından stand ve süs görsellerini üreten hat |
| `tools/svg/ciz.mjs` | Doğum günü çizimlerini (pasta, mum, balon…) üreten betik |
| `tools/test/` | Tarayıcı testleri ve Lighthouse ölçümü |
| `PLAN.md` | Animasyonlu sitenin planı ve alınan kararlar |

`sirket-bilgileri/` (ham fotoğraflar, logo PDF'i, WhatsApp arşivleri) depoya girmez; yalnızca bu bilgisayarda durur.

## Yerelde açmak

Proje kökünde:

```bash
npx --yes http-server@14.1.1 . -p 5500 -c-1
```

Ardından tarayıcıda `http://localhost:5500` açın. `index.html` dosyasına çift tıklamak yetmez; bazı tarayıcılar yerel dosyada betik ve video yüklemeyi kısıtlar.

## Yayına almak

Barındırmaya yalnızca şunları yükleyin: `index.html`, `robots.txt`, `sitemap.xml`, `css/`, `js/`, `assets/`. `tools/`, `sirket-bilgileri/`, `PLAN.md` ve `README.md` sitenin parçası değil.

- **HTTPS:** Site HTTPS ile açılmalı. WhatsApp ve sosyal medya önizlemeleri ile kopyala-yapıştır bağlantıları buna güveniyor.
- **Sıkıştırma:** Barındırmanın gzip ya da brotli sıkıştırması açık olsun. Netlify, Cloudflare Pages, GitHub Pages ve çoğu cPanel hostingde varsayılan olarak açıktır. Lighthouse ölçümleri sıkıştırma açıkken yapıldı.
- **Önbellek:** Uzun önbellek süresi verilecekse `assets/` için verin. `index.html`, `css/` ve `js/` dosyalarının adı değişmediği için onlara kısa süre ya da `no-cache` uygundur. Aksi hâlde güncellemeler ziyaretçiye geç ulaşır.
- **Alan adı:** Site `https://www.avrasyasus.com/` adresine göre ayarlı. Başka bir adreste yayınlanacaksa `index.html` başındaki şu yerleri birlikte değiştirin:
  - `<link rel="canonical">`;
  - `og:url` ve `og:image`;
  - JSON-LD'deki `url`, `image`, `logo`;
  - `robots.txt` içindeki `Sitemap:` satırı ve `sitemap.xml` içindeki `<loc>`.

  WhatsApp ve Facebook önizlemesindeki kapak görseli yalnızca tam adresle (`https://…`) çalışır. Testler bu adreslerin hepsinin aynı alan adını gösterdiğini denetler.

Yayından sonra bağlantıyı WhatsApp'ta kendinize gönderip kapak görselinin göründüğünü kontrol edin.

## Arama motorları (SEO)

Sayfada şunlar hazır:
- Türkçe başlık ve arama sonucunda görünen açıklama (`<title>`, `meta description`);
- `canonical` adresi;
- paylaşım önizlemesi (`og:` etiketleri);
- Google için işletme bilgisi (JSON-LD, `LocalBusiness`): ad, telefon, e-posta, adres, logo, sosyal medya.

Kök klasördeki iki dosya arama motorları içindir:
- `robots.txt`: bütün arama motorlarının siteyi taramasına izin verir ve site haritasının yerini bildirir.
- `sitemap.xml`: sayfanın adresini ve son güncellenme tarihini (`<lastmod>`) verir. Sayfanın içeriği değiştiğinde (yeni stand, yeni bilgi) bu tarihi `YYYY-AA-GG` biçiminde güncelleyin. Google, ne zaman yeniden bakacağına karar verirken bu tarihe de bakar.

İşletme adı, telefon ya da adres değişirse hem iletişim kartını hem de JSON-LD bloğunu güncelleyin (aşağıda, "İletişim bilgileri nerede").

Yayından sonra yapılacaklar (site sahibinin hesabıyla):
1. **Google Search Console:** Siteyi ekleyin, alan adının size ait olduğunu doğrulayın ve "Site haritaları" bölümüne `sitemap.xml` yazın. Sayfanın dizine girip girmediği ve hangi aramalarda göründüğü buradan izlenir.
2. **Google İşletme Profili:** İşletmeyi Haritalar'a ekleyip web sitesi olarak bu adresi yazın. Yerel aramalarda ("Bayrampaşa pasta süsü toptan" gibi) görünmenin en etkili yolu budur. Profildeki ad, adres ve telefon sayfadakiyle birebir aynı olmalı.

## Yeni stand eklemek (baştan sona)

1. **Fotoğraf:** Standın fotoğrafını `sirket-bilgileri/stant-gorseleri/` içine koyun.
   - Düz, önden ve standın tamamı kadrajda olsun.
   - Arka planı sade olursa kesim daha temiz çıkar.
2. **Görseller:** `tools/stand-gorselleri/` hattıyla görselleri üretin; adımlar [o klasörün README dosyasında](tools/stand-gorselleri/README.md).
   - Kısaca: `standlar.mjs` listesine ekleyin, `npm run build -- <ad>` çalıştırın, gerekirse dış hattı çizip yeniden üretin.
   - Sonuçta `assets/img/standlar/<ad>-640.webp` ve `<ad>-1040.webp` oluşur.
3. **Sayfaya ekleme:** `index.html` içindeki koleksiyon listesinde (`id="gallery"`) bir `<li>` satırını kopyalayın. Şunları değiştirin:
   - iki dosya adını (`data-full` içinde `-1040`, `<img src>` içinde `-640`);
   - `alt` metnini: görme engelli ziyaretçiler için standda ne olduğunu bir cümleyle anlatın;
   - kart adını (`kart-ad`).
4. **Süzgeç:** `data-kategori` standın hangi süzgeçlerde görüneceğini belirler.
   - Birden fazla konu boşlukla yazılır: `data-kategori="ayna rakam yazi"`.
   - Kullanılabilen konular süzgeç düğmelerindeki `data-filtre` değerleridir: `cocuk`, `rakam`, `yazi`, `esprili`, `kadin`, `erkek`, `futbol`, `ayna`.
   - Yeni bir konu için aynı biçimde bir düğme ekleyin.
5. **Testler:** `tools/test/tests/site.spec.mjs` içinde iki sayıyı güncelleyin:
   - toplam stand sayısı (şu an 11);
   - eklediğiniz konuların süzgeç sayıları.

   Sonra testleri çalıştırın (aşağıda, "Testler").

## Stand fotoğrafları

Stand ve süs görselleri (`assets/img/standlar/`, `assets/img/susler/`) telefon fotoğraflarından `tools/stand-gorselleri/` hattıyla üretilir. Her stand için üç dosya çıkar:
- `-640`: koleksiyon kartı;
- `-1040`: tıklanınca açılan büyük görsel;
- `-kesik`: şeffaf zeminli, animasyon sahneleri için.

"Hazır standlarımızdan örnekler" koleksiyonunda 11 stand var. Geniş ekranda şerit kaydırdıkça yana kayar, telefonda parmakla kaydırılır.

**"Stand nasıl çalışır" sahnesi** `standlar/stand-cocuk-karakter-kesik.webp` ile `susler/sus-canim-kizim.webp` görsellerini kullanır.
- Raflara tek tek dolan süsler, bu stand fotoğrafının raf ve sütun çizgilerine göre kesilir: `js/animations.js` içinde `stand` sahnesindeki `rows` ve `cols`.
- Sayılar 1040 px genişliğindeki kesik görselin piksel koordinatlarıdır. Stand fotoğrafı değişirse yeni fotoğrafa göre güncelleyin.

**"Kule stand" bölümü** `standlar/kule-stand-kesik.webp` kullanır. Kaydırınca stand yerden yukarı doğru raf raf kurulur.
- Raf çizgileri `kule` sahnesindeki `rows` içindedir.
- Fotoğraf değişirse bu sayılar da güncellenmeli.

**Sayfanın üstündeki pasta** fotoğraf değil, çizimdir; üstündeki süs ise gerçek bir süs fotoğrafıdır (`assets/img/susler/sus-iyi-ki-dogdun.webp`). Başka bir süs koymak için `tools/svg/ciz.mjs` içindeki `HERO_TOPPER` satırını değiştirip betiği çalıştırın.

## Videolar

`assets/video/` içinde iki video var:
- stand tanıtımı (`stand-tanitim.mp4`);
- UV baskı (`uv-baski.mp4`).

Videoların sesi kapalıdır ve ekrana gelince kendiliğinden oynar, ekrandan çıkınca durur. Bunu `js/main.js` yönetir. Video, oynayana kadar hiç indirilmez; o sırada `-poster.jpg` kapak görseli görünür.

"Hareketi azalt" açıksa videolar kendiliğinden oynamaz; oynatma düğmeleri görünür. Bir videoyu değiştirirken kapak görselini de ilk kareden yeniden çıkarın, `width` ve `height` değerlerini videonun boyutuna göre güncelleyin.

## Renkler ve çizimler

Renkler `css/style.css` başındaki `:root` içindedir. Logodaki lacivert ve altın ana renktir; krema, pasta pembesi ve konfeti renkleri kutlama vurgusudur.

Doğum günü çizimleri (`assets/svg/`: pasta, mum, balon, yıldız, krema damlası, şeker serpintisi) elle değil `tools/svg/ciz.mjs` ile üretilir. Bu betik `index.html` içindeki şu aralıkları da yeniler; oraları elle düzenlemeyin:
- `<!-- ciz:sprite -->`: balon sembolü;
- `<!-- ciz:pasta -->`: üstteki pasta;
- `<!-- ciz:acilis-mum -->`: açılış mumu;
- `<!-- ciz:final-pasta -->`: iletişim bölümündeki beş mumlu pasta.

Değişiklikten sonra proje kökünde:

```bash
node tools/svg/ciz.mjs
```

## Animasyonlar

`js/animations.js` kaydırma hikâyesini kurar: GSAP, ScrollTrigger, Lenis yumuşak kaydırma ve konfeti. Kütüphaneler `assets/vendor/` içinde sabit sürümlerle durur; sürümler, lisanslar ve güncelleme yolu [o klasörün README dosyasında](assets/vendor/README.md).

Her sahne `scene('<ad>', …)` ile ayrı bir bölümde yazılı:

| Sahne | Bölüm | Ne olur |
|---|---|---|
| `serpinti`, `balonlar`, `mumlar` | Üst kısım | Şeker serpintisi ve balonlar kaydırınca süzülür, mumların alevi titrer |
| `stand` | Stand nasıl çalışır | Boş stand süslerle dolar, bir süs standdan kalkıp pastaya iner |
| `koleksiyon` | Hazır standlar | Geniş ekranda şerit sabitlenip yana kayar |
| `kule` | Kule stand | Stand yerden yukarı raf raf kurulur |
| `uretim` | Atölyeden vitrine | Adımlar sırayla gelir, aralarındaki çizgi çizilir |
| `final` | İletişim | Mumların alevi titrer; hepsi sönünce konfeti patlar, WhatsApp butonu parlar |

Açılış perdesi (logo, mum, perde kalkışı) ve üstteki ilk giriş, sahnelerden önce `Entrances` bölümünde kurulur.
- Perde her tarayıcıda yalnızca ilk ziyarette oynar; tarayıcının yerel deposuna `avrasya-acilis` kaydı düşer.
- Yeniden görmek için tarayıcı konsolunda `localStorage.removeItem('avrasya-acilis')` çalıştırıp sayfayı yenileyin.

**Mumlar.** İletişim bölümündeki pastanın mumları tıklayınca ya da fare üzerlerinden geçince söner. Son mum sönünce konfeti patlar ve WhatsApp butonu parlar; pastaya yeniden tıklamak mumları yakar. Mum söndürme `js/main.js` içindedir ve hareket azaltma açıkken de çalışır, yalnızca konfeti ve titreme olmadan.

**Animasyonsuz son hâl.** Sayfa üç durumda animasyonsuz, son hâliyle görünür:
- ziyaretçi "hareketi azalt" ayarını açtıysa;
- JavaScript kapalıysa;
- kütüphaneler 3 saniye içinde yüklenmezse.

İçerik hiçbir zaman animasyona bağlı kalmaz. Animasyonların başlangıç hâlleri yalnızca `html.anim` sınıfı varken uygulanır (`css/style.css`); bu sınıfı `index.html` başındaki küçük betik ekler.

**Betiklerin yüklenmesi.** Animasyon betikleri sayfanın ilk çiziminden hemen sonra yüklenir: `index.html` sonundaki küçük betik onları sırayla ekler. Böylece telefonda sayfa, kütüphaneleri beklemeden görünür. Yeni bir betik eklenecekse oradaki listeye yazın; `<script defer>` ile eklemeyin.

**Animasyon yazarken:**
- Yalnızca `transform` ve `opacity` canlandırın.
- Okunacak yazıları saydamdan başlatmayın, kaydırarak getirin. Yarı saydam yazı renk karşıtlığı denetiminden geçmez.
- Telefonda sabitlenen sahneleri kısa tutun.

## Testler

`tools/test/` içinde tarayıcı testleri (Playwright ve axe erişilebilirlik denetimi) ve Lighthouse ölçümü var. Testler beş durumda çalışır:
- masaüstü;
- telefon;
- masaüstü ve telefonda "hareketi azalt" açıkken;
- JavaScript kapalıyken.

Son sonuçlar ve yapılan düzeltmeler [tools/test/RAPOR.md](tools/test/RAPOR.md) dosyasında. Testler için makinede Google Chrome kurulu olmalı.

```bash
cd tools/test
npm install
npx playwright test
npm run lighthouse
```

Sayfada bir bölüm, süzgeç konusu ya da stand sayısı değişirse `tools/test/tests/site.spec.mjs` içindeki ilgili beklentiyi de güncelleyin. Yayına almadan önce testlerin geçtiğini görün.

## Logo

Logo, lacivert-altın "Avrasya Toptan Pasta Süsleri" görselinden üretildi.

- `assets/img/logo-160.webp`: ortadaki yuvarlak amblem; üst menüde, alt bilgide ve açılış perdesinde kullanılır.
- `assets/img/logo.png`: aynı amblemin 512 px PNG'si. Arama motorları için JSON-LD içinde kullanılır.
- `assets/img/favicon-32.png` ve `favicon-180.png`: amblemdeki pasta ve yıldızlar; küçük boyutta yazı okunmadığı için yalnızca bu kısım alındı.
  - 32 px olan tarayıcı sekmesinde görünür.
  - 180 px olan, iPhone'da ana ekrana eklenince görünür.
- `assets/img/og.jpg`: görselin tamamı, 1200×670. Site WhatsApp'ta ya da sosyal medyada paylaşıldığında görünen kapak.

## İletişim bilgileri nerede

- **WhatsApp numarası** `<body data-wa="905306656373">` içinde: ülke koduyla, boşluksuz, `+` olmadan.
  - Hazır mesajlı butonların bağlantılarını `js/main.js` bu numarayla oluşturur. Mesajlar her bağlantının `data-wa-text` değerindedir.
  - `href` içindeki numaralar JavaScript kapalıyken kullanılır. Numara değişirse ikisini birlikte güncelleyin.
- **Telefon, e-posta ve adres** hem iletişim kartında hem de sayfanın başındaki JSON-LD bloğunda yer alır; ikisini birlikte değiştirin.
- **Sosyal medya:**
  - Instagram `@avrasyapastasusleri34`;
  - Facebook "Avrasya Pastasüsleri", `https://www.facebook.com/profile.php?id=61595280272926`.

  İkisi de iletişim kartında ve JSON-LD'deki `sameAs` içinde.
- **Alan adı** için yukarıdaki "Yayına almak" bölümüne bakın.

## Kullanılmayan dosyalar

Şu dosyalar depoda duruyor ama sayfada kullanılmıyor:
- `assets/img/standlar/kule-stand-640.webp` ve `kule-stand-1040.webp`;
- kesik stand ve süs görsellerinin sahnelerde yer almayanları.

Hepsi stand hattının çıktısıdır ve ileride kart ya da sahne olarak kullanılabilir. Yüklenseler de ziyaretçiye inmezler.

Eski galeri fotoğrafları (`stand-kral`, `stand-pembe`, `stand-yazili`, `stand-ayna`), eski üst fotoğraf (`stand-600`, `stand-1000`) ve `favicon-512.png` silindi. Gerekirse git geçmişinden geri alınabilir.
