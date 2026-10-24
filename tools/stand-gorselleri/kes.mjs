// Arka plan kaldırma: BiRefNet (MIT lisanslı) ONNX modeli bilgisayarda çalışır, fotoğraf hiçbir yere gönderilmez.
// Model dosyası cache/birefnet.onnx (indirme adresi README'de).
import sharp from 'sharp';
import ort from 'onnxruntime-node';

const SIZE = 1024;
const MEAN = [0.485, 0.456, 0.406];
const STD = [0.229, 0.224, 0.225];

let session;

// jpegPath fotoğrafından, aynı boyutta alfa kanallı PNG döndürür.
export async function cutout(jpegPath) {
  session ??= await ort.InferenceSession.create('cache/birefnet.onnx', { executionProviders: ['cpu'] });

  const src = sharp(jpegPath);
  const { width, height } = await src.metadata();
  const rgb = await src.clone().resize(SIZE, SIZE, { fit: 'fill', kernel: 'lanczos3' }).removeAlpha().raw().toBuffer();

  const input = new Float32Array(3 * SIZE * SIZE);
  for (let i = 0; i < SIZE * SIZE; i++) {
    for (let c = 0; c < 3; c++) input[c * SIZE * SIZE + i] = (rgb[i * 3 + c] / 255 - MEAN[c]) / STD[c];
  }
  const feeds = { [session.inputNames[0]]: new ort.Tensor('float32', input, [1, 3, SIZE, SIZE]) };
  const result = await session.run(feeds);
  const out = result[session.outputNames[session.outputNames.length - 1]].data;

  // Çıktı logit ise sigmoid uygula.
  let min = Infinity, max = -Infinity;
  for (const v of out) { if (v < min) min = v; if (v > max) max = v; }
  const logits = min < -0.01 || max > 1.01;
  const mask = Buffer.alloc(SIZE * SIZE);
  for (let i = 0; i < mask.length; i++) {
    const p = logits ? 1 / (1 + Math.exp(-out[i])) : out[i];
    mask[i] = Math.round(Math.max(0, Math.min(1, p)) * 255);
  }

  const alpha = await sharp(mask, { raw: { width: SIZE, height: SIZE, channels: 1 } })
    .resize(width, height, { fit: 'fill', kernel: 'cubic' })
    .extractChannel(0) // sharp tek kanallı raw girdiyi büyütünce 3 kanal döndürebiliyor
    .raw()
    .toBuffer();
  // Kaynak JPEG olduğu için alfa yok; removeAlpha() burada eklenen kanalı da silerdi.
  return src.joinChannel(alpha, { raw: { width, height, channels: 1 } }).png().toBuffer();
}
