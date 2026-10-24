# Avrasya Toptan Pasta Süsleri — tanıtım sitesi

Tek sayfalık statik site: `index.html`, `css/style.css`, `js/main.js`, `assets/`.
Derleme adımı yok; klasörü olduğu gibi herhangi bir statik barındırmaya yükleyebilirsiniz.

Yerelde açmak için:

```bash
npx --yes http-server@14.1.1 . -p 5500 -c-1
```

## Sosyal medya

- Instagram: `@avrasyapastasusleri34`, iletişim kartında ve JSON-LD'deki `sameAs` içinde.
- Facebook: "Avrasya Pastasüsleri", `https://www.facebook.com/profile.php?id=61595280272926`; iletişim kartında ve `sameAs` içinde.

## Stand fotoğrafları

Stand ve süs görselleri (`assets/img/standlar/`, `assets/img/susler/`) telefon fotoğraflarından `tools/stand-gorselleri/` hattıyla üretilir; nasıl çalıştığı o klasörün README dosyasında.

"Hazır standlarımızdan örnekler" koleksiyonunda 11 stand var (`#gallery` listesi). Her kart `standlar/stand-…-640.webp` gösterir, tıklanınca `-1040.webp` büyük açılır. Geniş ekranda şerit kaydırdıkça yana kayar, telefonda parmakla kaydırılır.

Yeni stand eklemek için listedeki bir `<li>` satırını kopyalayın; dosya adlarını, `alt` metnini ve kart adını değiştirin. `data-kategori` standın hangi süzgeçlerde görüneceğini belirler; birden fazla konu boşlukla yazılır (`data-kategori="ayna rakam yazi"`). Kullanılabilen konular süzgeç düğmelerindeki `data-filtre` değerleridir: `cocuk`, `rakam`, `yazi`, `esprili`, `kadin`, `erkek`, `futbol`, `ayna`. Yeni bir konu için aynı biçimde bir düğme ekleyin.

"Stand nasıl çalışır" sahnesi `standlar/stand-cocuk-karakter-kesik.webp` ile `susler/sus-canim-kizim.webp` görsellerini kullanır. Raflara tek tek dolan süsler bu stand fotoğrafının raf ve sütun çizgilerine göre kesilir (`js/animations.js` içindeki `rows` ve `cols`); stand fotoğrafı değişirse bu sayıları da yeni fotoğrafa göre güncelleyin.

"Kule stand" bölümü `standlar/kule-stand-kesik.webp` kullanır. Kaydırınca stand yerden yukarı doğru raf raf kurulur; raf çizgileri yine `js/animations.js` içinde (`kule` sahnesindeki `rows`). Fotoğraf değişirse bu sayılar da güncellenmeli.

Eski galeri fotoğrafları (`assets/img/stand-kral`, `stand-pembe`, `stand-yazili`, `stand-ayna`) artık sayfada kullanılmıyor.

Sayfanın üstünde fotoğraf yerine çizim pasta durur; üstündeki süs gerçek bir süs fotoğrafıdır (`assets/img/susler/sus-iyi-ki-dogdun.webp`). Başka bir süs koymak için `tools/svg/ciz.mjs` içindeki `HERO_TOPPER` satırını değiştirip betiği çalıştırın. Eski üst fotoğraf `assets/img/stand-600.webp` ve `stand-1000.webp` şu an sayfada kullanılmıyor.

## Renkler ve çizimler

Renkler `css/style.css` başındaki `:root` içindedir: logodaki lacivert ve altın ana renk, krema, pasta pembesi ve konfeti renkleri kutlama vurgusu.

Doğum günü çizimleri (`assets/svg/`: pasta, mum, balon, yıldız, krema damlası, şeker serpintisi) elle değil `tools/svg/ciz.mjs` ile üretilir. Bu betik `index.html` içindeki `<!-- ciz:sprite -->` (balon sembolü), `<!-- ciz:pasta -->` (üstteki pasta), `<!-- ciz:acilis-mum -->` (açılış mumu) ve `<!-- ciz:final-pasta -->` (iletişim bölümündeki beş mumlu pasta) aralarını da yeniler; oraları elle düzenlemeyin. Değişiklikten sonra proje kökünde:

```bash
node tools/svg/ciz.mjs
```

## Animasyonlar

`js/animations.js` kaydırma hikâyesini kurar (GSAP, ScrollTrigger, Lenis yumuşak kaydırma, konfeti). Kütüphaneler `assets/vendor/` içinde sabit sürümlerle durur; sürümler ve lisanslar o klasörün README dosyasında. Ziyaretçi "hareketi azalt" ayarını açtıysa, JavaScript kapalıysa ya da bir kütüphane yüklenmezse sayfa animasyonsuz, son hâliyle görünür.

İletişim bölümündeki pastanın mumları tıklayınca (ya da fare üzerlerinden geçince) söner; son mum sönünce konfeti patlar ve WhatsApp butonu parlar. Pastaya yeniden tıklamak mumları yakar. Mum söndürme `js/main.js` içindedir ve hareket azaltma açıkken de çalışır (konfeti ve titreme olmadan).

Açılış perdesi (logo, mum, perde kalkışı) her tarayıcıda yalnızca ilk ziyarette oynar; tarayıcının yerel deposuna `avrasya-acilis` kaydı düşer. Yeniden görmek için tarayıcı konsolunda `localStorage.removeItem('avrasya-acilis')` çalıştırıp sayfayı yenileyin.

Animasyon betikleri sayfanın ilk çiziminden hemen sonra yüklenir; `index.html` sonundaki küçük betik onları sırayla ekler. Yeni bir betik eklenecekse oradaki listeye yazın.

## Testler

`tools/test/` içinde tarayıcı testleri (Playwright ve axe erişilebilirlik denetimi) ve Lighthouse ölçümü var. Testler masaüstü ve telefonda, "hareketi azalt" açıkken ve JavaScript kapalıyken çalışır. Son sonuçlar ve yapılan düzeltmeler [tools/test/RAPOR.md](tools/test/RAPOR.md) dosyasında. Makinede Google Chrome kurulu olmalı.

```bash
cd tools/test
npm install
npx playwright test
npm run lighthouse
```

Sayfada bir bölüm, süzgeç konusu ya da stand sayısı değişirse `tools/test/tests/site.spec.mjs` içindeki ilgili beklentiyi de güncelleyin; örneğin süzgeç sayıları ve 11 stand.

## Logo

Logo, lacivert-altın "Avrasya Toptan Pasta Süsleri" görselinden üretildi.

- `assets/img/logo-160.webp`: ortadaki yuvarlak amblem; üst menüde ve alt bilgide kullanılır.
- `assets/img/logo.png`: aynı amblemin 512 px PNG'si (arama motorları için, JSON-LD içinde).
- `assets/img/favicon-32.png`, `favicon-180.png`, `favicon-512.png`: amblemdeki pasta ve yıldızlar; küçük boyutta yazı okunmadığı için yalnızca bu kısım alındı.
- `assets/img/og.jpg`: görselin tamamı, 1200×670; site WhatsApp'ta veya sosyal medyada paylaşıldığında görünen kapak.

## İletişim bilgileri nerede

- WhatsApp numarası `<body data-wa="905306656373">` içinde (ülke koduyla, boşluksuz, `+` olmadan). Hazır mesajlı butonların bağlantılarını `js/main.js` bu numarayla oluşturur. `href` içindeki numaralar JavaScript kapalıyken kullanılır; numara değişirse ikisini birlikte güncelleyin.
- Telefon, e-posta ve adres hem iletişim kartında hem de sayfanın başındaki JSON-LD bloğunda yer alır.
- Alan adı `https://www.avrasyasus.com/` olarak `<link rel="canonical">` içinde. Site başka bir adreste yayınlanacaksa burayı değiştirin.
