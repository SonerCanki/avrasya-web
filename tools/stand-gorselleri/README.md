# Stand görselleri hattı

`sirket-bilgileri/stant-gorseleri/` içindeki telefon fotoğraflarından site görsellerini üretir.
Her şey bu bilgisayarda çalışır; fotoğraflar hiçbir servise gönderilmez. Bu klasör siteye yüklenmez.

## Kurulum (bir kez)

```bash
npm install
```

Arka plan kaldırma modeli (BiRefNet, MIT lisanslı, ~970 MB) `cache/birefnet.onnx` olarak indirilir:

```bash
curl -L -o cache/birefnet.onnx https://huggingface.co/onnx-community/BiRefNet-ONNX/resolve/main/onnx/model.onnx
```

## Çalıştırma

```bash
npm run build
```

Tüm standları üretir. `npm run build -- futbol` yalnızca adında "futbol" geçenleri üretir.
`npm run susler` ise #26 fotoğrafındaki tek süsleri `assets/img/susler/` altına keser.

## Nasıl çalışır

1. **Kırpma ve damga silme:** `standlar.mjs` içindeki `crop` ve `erase` uygulanır, sonuç `work/girdi/` altına yazılır.
2. **Model (`kes.mjs`):** BiRefNet süsleri çok iyi bulur ama beyaz stand iskeletini çoğu zaman arka plan sayar.
   Sonucu `work/kesim/` altında saklanır; yeniden hesaplatmak için oradaki PNG'yi silin.
3. **Stand maskesi (`maske.mjs`):** Her standın kaba dış hattı `standlar.mjs` içinde `outline` olarak yüzde
   koordinatlarla yazılıdır. GrabCut bu hattın çevresindeki dar şeritte kenarı piksel düzeyinde bulur;
   panelin üstüne taşan süsler modelin maskesinden eklenir.
4. **Alfa düzeltme (`alfa.mjs`):** Maskenin yarı saydam kalan içi sertleştirilir, standdan kopuk küçük kırıntılar silinir.
   `build.mjs` ve `susler.mjs` ikisi de kullanır.
5. **Renk ve çıktı (`build.mjs`):** Beyaz denge standın beyaz panellerine göre düzeltilir, hafif keskinleştirilir.
   Her stand için `assets/img/standlar/<ad>-640.webp`, `-1040.webp` (stüdyo zemini) ve `-kesik.webp` (şeffaf) yazılır.
   Stüdyo karesinde stand varsayılan olarak genişliğin %84'ünü kaplar; uzun kule stand gibi dar olanlar için
   `standlar.mjs` içinde `fit` küçültülür.

Sitede kullanılanlar: koleksiyon kartları `-640` ve `-1040` dosyalarını, "Stand nasıl çalışır" ve "Kule stand"
sahneleri `stand-cocuk-karakter-kesik.webp` ile `kule-stand-kesik.webp` dosyalarını gösterir. Diğer `-kesik`
dosyaları ileride başka sahnelerde kullanılmak üzere duruyor.

## Tek süsler (`susler.mjs`)

#26 fotoğrafındaki sekiz süs `SUSLER` listesindeki `box` dikdörtgenlerine göre (yüzde olarak `[x0, y0, x1, y1]`)
kesilir, arka planı kaldırılır ve en uzun kenarı en fazla 640 px olacak şekilde `assets/img/susler/sus-<ad>.webp` olarak yazılır.
Yeni bir süs fotoğrafı için `SRC` satırını ve listeyi değiştirip `npm run susler` çalıştırın.

## Yeni stand eklemek

1. Fotoğrafı `sirket-bilgileri/stant-gorseleri/` içine koyun, `standlar.mjs` içine `name` ve `src` ile ekleyin.
2. `npm run build -- <ad>` bir kez çalıştırın (dış hat olmadan yalnızca model kullanılır).
3. `node izgara.mjs <ad>` ile `work/izgara-<ad>.jpg` üzerinde %5 ızgara çıkar. Standın köşelerini okuyup
   `outline` dizisine yazın: arka panelin üst kenarından başlayıp saat yönünde dolaşın.
4. Yeniden üretin ve şeffaf çıktıyı koyu bir zeminde kontrol edin. Standa değen arka plan nesneleri için
   `mask: { reach, exclude }` ayarları kullanılabilir (`maske.mjs` içinde açıklanıyor).
