// Alfa maskesi düzeltme (build.mjs ve susler.mjs ortak kullanır).

// Beyaz stand açık zeminde çekildiğinde maskenin içi yarı saydam kalabilir.
// Seviye eğrisiyle alfa sertleştirilir; ardından en büyük parçaya göre küçük kırıntılar silinir.
export function refineAlpha(data, width, height, { low = 24, high = 110, keep = 0.004 } = {}) {
  const n = width * height;
  const mask = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    const a = data[i * 4 + 3];
    const v = Math.max(0, Math.min(255, Math.round(((a - low) / (high - low)) * 255)));
    data[i * 4 + 3] = v;
    mask[i] = v > 0 ? 1 : 0;
  }

  // Bağlı bileşenler (4-komşuluk).
  const label = new Int32Array(n);
  const sizes = [0];
  const stack = new Int32Array(n);
  for (let i = 0; i < n; i++) {
    if (!mask[i] || label[i]) continue;
    const id = sizes.length;
    let top = 0, size = 0;
    stack[top++] = i; label[i] = id;
    while (top) {
      const p = stack[--top]; size++;
      const x = p % width, y = (p - x) / width;
      if (x > 0 && mask[p - 1] && !label[p - 1]) { label[p - 1] = id; stack[top++] = p - 1; }
      if (x < width - 1 && mask[p + 1] && !label[p + 1]) { label[p + 1] = id; stack[top++] = p + 1; }
      if (y > 0 && mask[p - width] && !label[p - width]) { label[p - width] = id; stack[top++] = p - width; }
      if (y < height - 1 && mask[p + width] && !label[p + width]) { label[p + width] = id; stack[top++] = p + width; }
    }
    sizes.push(size);
  }
  const largest = Math.max(...sizes);
  for (let i = 0; i < n; i++) {
    if (label[i] && sizes[label[i]] < largest * keep) data[i * 4 + 3] = 0;
  }
}
