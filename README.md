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

"Hazır standlarımızdan örnekler" galerisinde dört stand var: `assets/img/stand-kral`, `stand-pembe`, `stand-yazili`, `stand-ayna` (her biri `-640.webp` galeri, `-1040.webp` büyütülmüş görünüm). Bu fotoğraflar WhatsApp videolarından kare alınarak üretildi: stand arka plandan ayrıldı ve sitenin renklerinde sade bir stüdyo zeminine yerleştirildi. Kaynak videolar 480 px genişliğinde olduğu için büyütüldüğünde hafif yumuşak görünürler; telefonla çekilmiş net fotoğraflar gelirse aynı dosya adlarıyla değiştirilebilir.

Yeni stand eklemek için galerideki bir `<li>` satırını kopyalayıp dosya adlarını ve `alt` metnini değiştirin. Fotoğraflar kare olarak gösterilir.

Sayfanın üstündeki büyük stand fotoğrafı `assets/img/stand-600.webp` ve `stand-1000.webp` dosyalarıdır; yenisi gelirse bunlar değiştirilebilir.

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
