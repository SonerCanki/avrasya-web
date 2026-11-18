# Stand ve süs görselleri

Fotoğraflardan site görsellerini üreten iki araç. Her şey bu bilgisayarda çalışır; fotoğraflar hiçbir servise
gönderilmez. Bu klasör siteye yüklenmez.

| Araç | Ne üretir | Kurulum |
|---|---|---|
| `uret.mjs` | Stand fotoğrafları: `public/assets/img/standlar/` | İstemez |
| `susler.mjs` | Tek tek süsler: `public/assets/img/susler/` | İster (aşağıda) |

## Stand fotoğrafları (`uret.mjs`)

Kaynak: proje kökündeki `yeni-fotograflar/` (stüdyo çekimi, düz gri zemin). Proje kökünde:

```bash
node tools/stand-gorselleri/uret.mjs
```

Yeni bir şey kurmaz: `tools/test` içindeki Playwright ile bilgisayardaki Google Chrome'u kullanır. Bu yüzden önce
test araçlarının kurulu olması gerekir (`npm --prefix tools/test ci`, bir kez).

Her stand için şunları yazar:

- `<ad>-640.webp`: galeri kartı;
- `<ad>-1040.webp`: tıklanınca açılan büyük görsel;
- `<ad>-kesik.webp`: zemini silinmiş, şeffaf görsel. Yalnızca listede `kesik: true` olan stand için üretilir;
  sayfada onu "Stand nasıl çalışır" sahnesi kullanır.

### Yeni stand eklemek

1. Fotoğrafı `yeni-fotograflar/` içine koyun.
2. `uret.mjs` içindeki `STANDLAR` listesine bir satır ekleyin: `saat` (dosya adındaki saat) ve `ad` (sitedeki adı).
3. Aracı çalıştırın. Her stand için bir satır yazar: karenin ölçüsü ve standın fotoğrafta bulunduğu yer.
4. Satırın sonunda "UYARI: stand fotoğrafın kenarına değiyor" çıkarsa araç standı zeminden ayıramamıştır. O satıra
   standın fotoğraftaki yerini elle verin: `kutu: [x, y, en, boy]` (piksel). Stand fotoğrafın alt kenarında
   kesiliyorsa `altaDayali: true` ekleyin.
5. Standı sayfaya eklemek için `src/icerik.ts` içindeki `STANDLAR` listesine de bir satır yazın
   (ayrıntı [ana README dosyasında](../../README.md)).

Sitedeki stand klasöründe listede olmayan dosya kalırsa içerik testi hata verir; adı değişen bir standın eski
dosyalarını silin.

## Tek süsler (`susler.mjs`)

Açılışta ve iletişim bölümünde çıkartma gibi duran sekiz süsü, hepsinin beyaz bir levha üzerinde durduğu tek bir
fotoğraftan keser. Süsler `SUSLER` listesindeki `box` dikdörtgenlerine göre (yüzde olarak `[x0, y0, x1, y1]`) kesilir,
arka planı kaldırılır ve en uzun kenarı en fazla 640 piksel olacak şekilde `sus-<ad>.webp` olarak yazılır.

Bu araç ayrı kurulum ister ve kaynak fotoğrafı depoda değildir:

1. Kaynak fotoğrafı `sirket-bilgileri/stant-gorseleri/` içine koyun (bu klasör git'e girmez). Dosya adı
   `susler.mjs` içinde `SRC` satırındadır.
2. Bu klasörde bir kez `npm install` çalıştırın.
3. Arka plan kaldırma modelini (BiRefNet, MIT lisanslı, yaklaşık 970 MB) `cache/birefnet.onnx` olarak indirin:

   ```bash
   curl -L -o cache/birefnet.onnx https://huggingface.co/onnx-community/BiRefNet-ONNX/resolve/main/onnx/model.onnx
   ```

4. `npm run susler` çalıştırın.

Modeli `kes.mjs` çalıştırır; `alfa.mjs` maskenin yarı saydam kalan içini sertleştirir ve kopuk kırıntıları siler.

Yeni bir süs fotoğrafı için `SRC` satırını ve `SUSLER` listesini değiştirin. Sitedeki süs listesi
`src/icerik.ts` içindeki `SUSLER` kaydıdır; ölçüler (`en`, `boy`) üretilen dosyanın ölçüleriyle aynı olmalıdır.

Eski stand hattı (`build.mjs`, `maske.mjs`, `standlar.mjs`, `izgara.mjs`) kaldırıldı; yerini `uret.mjs` aldı.
Gerekirse git geçmişinden geri alınabilir.
