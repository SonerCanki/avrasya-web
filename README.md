# Avrasya Toptan Pasta Süsleri — tanıtım sitesi

Pastanelere süs standı tanıtan tek sayfalık site. React ile yazıldı; yayına girmeden önce derlenir ve sayfanın
hazır HTML'i üretilir. Bu yüzden sayfa JavaScript çalışmadan da okunur, arama motorları içeriği doğrudan görür.

| Yol | Ne |
|---|---|
| `src/icerik.ts` | Sitenin **bütün içeriği**: metinler, standlar, süzgeçler, iletişim bilgileri, WhatsApp mesajları |
| `src/bolumler/` | Sayfanın bölümleri: açılış, stand sahnesi, süsler (galeri), kule stand, üretim, iletişim, üst çubuk, alt bilgi. Her bölümün yanında kendi `.css` dosyası durur |
| `src/ortak/` | Bölümlerin ortak parçaları: düğmeler, video, kayan şerit, süs çıkartması, kancalar |
| `src/stil/temel.css` | Renkler, yazı tipi, gölgeler ve "son hâl kuralı" (aşağıda) |
| `index.html` | Sayfa başı: başlık, açıklama, paylaşım önizlemesi, Google için işletme bilgisi |
| `public/` | Olduğu gibi yayına giren dosyalar: görseller, videolar, `robots.txt`, `sitemap.xml` |
| `netlify.toml` | Netlify'a sitenin nasıl derleneceğini söyler |
| `tools/onceden-uret.mjs` | Derlemenin son adımı: hazır HTML'i `dist/index.html` içine yerleştirir |
| `tools/stand-gorselleri/` | Fotoğraflardan stand ve süs görsellerini üreten araçlar |
| `tools/test/` | Tarayıcı testleri, Lighthouse ölçümü ve paylaşım görselinin şablonu |
| `docs/superpowers/` | Sitenin tasarım belgesi ve uygulama planı |

`yeni-fotograflar/` standların ham stüdyo fotoğraflarıdır; site görselleri bunlardan üretilir.

## Yerelde çalıştırmak

Node.js 22.13 ya da daha yenisi gerekir. Proje kökünde bir kez:

```bash
npm install
```

Sonra:

```bash
npm run dev
```

Tarayıcıda `http://localhost:5173` açın. Dosyaları kaydettikçe sayfa kendiliğinden yenilenir.

## Derlemek

```bash
npm run build
```

Yayına girecek site `dist/` klasöründe oluşur. Yayındaki hâline yerelde bakmak için:

```bash
npm run preview
```

## Yayına almak (Netlify)

Site Netlify'da yayınlanır. Yeni sitenin önce derlenmesi gerekir; bunu `netlify.toml` Netlify'a söyler
(`npm run build` çalıştır, `dist/` klasörünü yayınla, Node 22 kullan). Netlify panelinde ayar değiştirmek gerekmez.

Aşağıdaki adımlar, Netlify projesinin GitHub deposuna bağlı olduğunu ve canlı sitenin `main` dalından yayınlandığını
varsayar.

1. **Önizleme:** Değişiklikleri kaydedip dalı GitHub'a gönderin:

   ```bash
   git push -u origin v2-react
   ```

   Netlify'da dal yayınları ("Branch deploys") açıksa bu dal için ayrı bir önizleme adresi üretilir; `main` için açılan
   her "pull request" de kendi önizleme adresini alır ("Deploy Preview"). Canlı site bu sırada değişmez.
2. **Kontrol:** Önizleme adresini bilgisayarda ve telefonda açıp bakın.
3. **Canlıya alma:** GitHub'da `v2-react` → `main` için bir "pull request" açıp birleştirin. Netlify `main` dalını
   yeniden derler ve `avrasyasus.com` yeni siteyi göstermeye başlar.
4. **Geri dönmek:** Bir sorun çıkarsa Netlify panelinde "Deploys" altında eski yayını açıp "Publish deploy" seçin;
   eski site saniyeler içinde geri gelir.

Canlıya almadan önce `public/sitemap.xml` içindeki `<lastmod>` tarihini o günün tarihi yapın (`YYYY-AA-GG`).
Yayından sonra bağlantıyı WhatsApp'ta kendinize gönderip kapak görselinin göründüğünü kontrol edin.

Başka bir barındırmada yayınlanacaksa `npm run build` çalıştırıp `dist/` klasörünün içini yüklemek yeterlidir.

## Alan adı ve arama motorları

Site `https://avrasyasus.com/` adresine göre ayarlı. Adres değişirse şunları birlikte değiştirin:

- `index.html`: `canonical`, `og:url`, `og:image` ve JSON-LD içindeki `url`, `image`, `logo`;
- `public/robots.txt` içindeki `Sitemap:` satırı ve `public/sitemap.xml` içindeki `<loc>`;
- `src/icerik.ts` içindeki `SITE.adres`.

Testler bu adreslerin hepsinin aynı alan adını gösterdiğini denetler.

Sayfanın içeriği değiştiğinde (yeni stand, yeni bilgi) `sitemap.xml` içindeki `<lastmod>` tarihini güncelleyin.

Yayından sonra, site sahibinin hesabıyla:

1. **Google Search Console:** Siteyi ekleyin, alan adını doğrulayın ve "Site haritaları" bölümüne `sitemap.xml` yazın.
2. **Google İşletme Profili:** İşletmeyi Haritalar'a ekleyip web sitesi olarak bu adresi yazın. Profildeki ad, adres
   ve telefon sayfadakiyle birebir aynı olmalı.

## İçeriği güncellemek

Metinlerin, standların ve iletişim bilgilerinin hepsi `src/icerik.ts` dosyasındadır. Bir yazıyı değiştirmek için
yalnızca o dosyayı düzenlemek yeter; bölümlerin koduna dokunmak gerekmez.

### Yeni stand eklemek

1. **Fotoğraf:** Standın fotoğrafını `yeni-fotograflar/` içine koyun. Düz gri zeminde, önden ve standın tamamı
   kadrajda olsun.
2. **Görseller:** `tools/stand-gorselleri/uret.mjs` içindeki `STANDLAR` listesine bir satır ekleyin (fotoğrafın dosya
   adındaki saat ve sitedeki adı), sonra proje kökünde çalıştırın:

   ```bash
   node tools/stand-gorselleri/uret.mjs
   ```

   `public/assets/img/standlar/` içinde `<ad>-640.webp` (kart) ve `<ad>-1040.webp` (büyük görsel) oluşur.
   Ayrıntılar [o klasörün README dosyasında](tools/stand-gorselleri/README.md).
3. **Sayfaya ekleme:** `src/icerik.ts` içindeki `STANDLAR` listesine bir satır ekleyin: `dosya` (az önceki ad),
   `ad` (kartta görünen), `alt` (görme engelli ziyaretçiler için standda ne olduğunu anlatan bir cümle) ve
   `konular` (hangi süzgeçlerde görüneceği: `cocuk`, `rakam`, `yazi`, `esprili`, `kadin`, `erkek`, `futbol`, `ayna`).
4. **Testler:** Stand sayısı ve süzgeç sayıları testlerde yazılıdır. `tools/test/birim/icerik.test.mjs` ve
   `tools/test/tests/urunler.spec.mjs` içindeki sayıları güncelleyip testleri çalıştırın.

### Görseller

- **Stand fotoğrafları** (`public/assets/img/standlar/`): her stand için `-640` ve `-1040`. Yalnızca "Stand nasıl
  çalışır" sahnesindeki standın bir de şeffaf zeminli `-kesik` görseli vardır.
- **Süsler** (`public/assets/img/susler/`): açılışta ve iletişim bölümünde çıkartma gibi duran sekiz süs.
- **Kule stand** bir fotoğraf değil, çizimdir (`public/assets/img/kule-stand.svg`). Kule standın fotoğrafı
  çekildiğinde `src/icerik.ts` içindeki `KULE.gorsel` ve kat çizgileri (`bant`) ona göre değiştirilir.

### Videolar

`public/assets/video/` içinde iki video var: stand tanıtımı ve UV baskı. Sesleri kapalıdır; ekrana gelince
kendiliğinden oynar, ekrandan çıkınca durur. Video oynayana kadar indirilmez; o sırada `-poster.jpg` kapak görseli
görünür. Bir videoyu değiştirirken kapağını da yenileyin ve `src/icerik.ts` içindeki `VIDEOLAR` kaydında `en` ve
`boy` değerlerini videonun boyutuna göre güncelleyin.

### İletişim bilgileri

- **WhatsApp numarası** `src/icerik.ts` içinde `WA_NUMARA` (ülke koduyla, boşluksuz, `+` olmadan). Hazır mesajlar
  `WA_MESAJ` içindedir.
- **Telefon, e-posta, adres, Instagram ve Facebook** `src/icerik.ts` içindeki `ILETISIM` kaydındadır. Aynı bilgiler
  Google için `index.html` başındaki JSON-LD bloğunda da yazılıdır; ikisini birlikte değiştirin.

## Hareket ve "son hâl kuralı"

Sayfadaki hareketler [Motion](https://motion.dev) ve CSS ile yapılır; yumuşak kaydırmayı Lenis sağlar.

İçerik hiçbir zaman harekete bağlı kalmaz. Sayfa şu durumlarda hareketsiz, son hâliyle görünür:

- ziyaretçi cihazında "hareketi azalt" ayarını açtıysa;
- JavaScript kapalıysa;
- site betiği yüklenemediyse.

Bunu `index.html` başındaki küçük betik ile `src/stil/temel.css` birlikte sağlar: hareketlerin başlangıç hâlleri
yalnızca `<html>` öğesinde `hareketli` sınıfı varken uygulanır. Yeni bir hareket yazarken hareket eden öğeye
`data-hareket` verin; böylece bu kural onu da kapsar.

## Testler

Testler için makinede Google Chrome kurulu olmalı. Test araçlarını bir kez kurun:

```bash
npm --prefix tools/test ci
```

Sonra proje kökünde:

```bash
npm test
```

Bu komut sırayla içerik testlerini çalıştırır, siteyi derler ve tarayıcı testlerini beş durumda koşar: masaüstü,
telefon, ikisinde "hareketi azalt" açıkken ve JavaScript kapalıyken. Erişilebilirlik denetimi (axe) de bunların
içindedir.

Hız ve kalite ölçümü (Lighthouse, telefon ve masaüstü):

```bash
npm run lighthouse
```

Son sonuçlar [tools/test/RAPOR.md](tools/test/RAPOR.md) dosyasında. Yayına almadan önce testlerin geçtiğini görün.

## Paylaşım görseli

Site WhatsApp'ta ya da sosyal medyada paylaşılınca bağlantının yanında `public/assets/img/paylasim.jpg` görünür
(1200×630). Bu görsel elle çizilmez; `tools/test/paylasim-sablon.html` şablonundan üretilir. Başlık ya da görseller
değişirse şablonu düzenleyip yeniden üretin:

```bash
npm --prefix tools/test run paylasim
```

WhatsApp küçük önizlemede görselin ortasındaki kareyi gösterir; firma adı bu yüzden alttaki şeritte, ortada durur.

## Logo

- `public/assets/img/logo-160.webp`: yuvarlak amblem; üst çubukta ve alt bilgide kullanılır.
- `public/assets/img/logo.png`: aynı amblemin 512 piksellik PNG'si; Google için JSON-LD içinde kullanılır.
- `public/assets/img/favicon-32.png` ve `favicon-180.png`: tarayıcı sekmesinde ve iPhone ana ekranında görünen simge.

## Eski site

Animasyonlu ilk site (derleme istemeyen, GSAP ile yazılmış sürüm) git geçmişinde ve `main` dalının eski
kayıtlarında durur; gerekirse oradan geri alınabilir.
