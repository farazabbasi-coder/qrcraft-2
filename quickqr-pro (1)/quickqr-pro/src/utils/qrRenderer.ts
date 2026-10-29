import QRCode from 'qrcode';
import { BodyPattern, EyePattern, QrStyleConfig } from '../types/qr';

interface FinderOrigin {
  row: number;
  col: number;
}

function isInFinderPattern(row: number, col: number, matrixSize: number): boolean {
  const topLeft = row <= 6 && col <= 6;
  const topRight = row <= 6 && col >= matrixSize - 7;
  const bottomLeft = row >= matrixSize - 7 && col <= 6;
  return topLeft || topRight || bottomLeft;
}

function isInLogoCutout(
  row: number,
  col: number,
  matrixSize: number,
  hasLogo: boolean,
  logoScale: number
): boolean {
  if (!hasLogo) return false;
  const cutoutModules = Math.ceil(matrixSize * logoScale) + 1;
  const half = cutoutModules / 2;
  const center = (matrixSize - 1) / 2;
  return (
    row >= center - half &&
    row <= center + half &&
    col >= center - half &&
    col <= center + half &&
    !isInFinderPattern(row, col, matrixSize)
  );
}

function escapeXmlAttr(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildRoundedCornerPath(
  x: number,
  y: number,
  w: number,
  h: number,
  tl: number,
  tr: number,
  br: number,
  bl: number
): string {
  const f = (n: number) => Number(n.toFixed(3));
  return [
    `M ${f(x + tl)} ${f(y)}`,
    `L ${f(x + w - tr)} ${f(y)}`,
    tr > 0 ? `Q ${f(x + w)} ${f(y)} ${f(x + w)} ${f(y + tr)}` : `L ${f(x + w)} ${f(y)}`,
    `L ${f(x + w)} ${f(y + h - br)}`,
    br > 0 ? `Q ${f(x + w)} ${f(y + h)} ${f(x + w - br)} ${f(y + h)}` : `L ${f(x + w)} ${f(y + h)}`,
    `L ${f(x + bl)} ${f(y + h)}`,
    bl > 0 ? `Q ${f(x)} ${f(y + h)} ${f(x)} ${f(y + h - bl)}` : `L ${f(x)} ${f(y + h)}`,
    `L ${f(x)} ${f(y + tl)}`,
    tl > 0 ? `Q ${f(x)} ${f(y)} ${f(x + tl)} ${f(y)}` : `L ${f(x)} ${f(y)}`,
    'Z',
  ].join(' ');
}

function svgModuleElement(
  pattern: BodyPattern,
  x: number,
  y: number,
  cell: number,
  fill: string
): string {
  const f = (n: number) => Number(n.toFixed(3));
  // Slight overlap on square prevents hairline anti-aliasing gaps in SVG viewers
  switch (pattern) {
    case 'square':
      return `<rect x="${f(x)}" y="${f(y)}" width="${f(cell + 0.25)}" height="${f(cell + 0.25)}" fill="${fill}" />`;
    case 'rounded': {
      const pad = cell * 0.06;
      const s = cell - pad * 2;
      const r = s * 0.36;
      return `<rect x="${f(x + pad)}" y="${f(y + pad)}" width="${f(s)}" height="${f(s)}" rx="${f(r)}" ry="${f(r)}" fill="${fill}" />`;
    }
    case 'dots': {
      const cx = x + cell / 2;
      const cy = y + cell / 2;
      const r = cell * 0.43;
      return `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${fill}" />`;
    }
    case 'diamond': {
      const cx = x + cell / 2;
      const cy = y + cell / 2;
      const half = cell * 0.48;
      return `<polygon points="${f(cx)},${f(cy - half)} ${f(cx + half)},${f(cy)} ${f(cx)},${f(cy + half)} ${f(cx - half)},${f(cy)}" fill="${fill}" />`;
    }
    case 'classy': {
      const pad = cell * 0.05;
      const s = cell - pad * 2;
      const r = s * 0.46;
      const d = buildRoundedCornerPath(x + pad, y + pad, s, s, r, 0, r, 0);
      return `<path d="${d}" fill="${fill}" />`;
    }
  }
}

function svgFinderEyeElements(
  pattern: EyePattern,
  x: number,
  y: number,
  cell: number,
  eyeColor: string,
  bgColor: string
): string {
  const f = (n: number) => Number(n.toFixed(3));
  const outer = cell * 7;
  const mid = cell * 5;
  const inner = cell * 3;

  switch (pattern) {
    case 'square':
      return [
        `<rect x="${f(x)}" y="${f(y)}" width="${f(outer)}" height="${f(outer)}" fill="${eyeColor}" />`,
        `<rect x="${f(x + cell)}" y="${f(y + cell)}" width="${f(mid)}" height="${f(mid)}" fill="${bgColor}" />`,
        `<rect x="${f(x + cell * 2)}" y="${f(y + cell * 2)}" width="${f(inner)}" height="${f(inner)}" fill="${eyeColor}" />`,
      ].join('');

    case 'rounded':
      return [
        `<rect x="${f(x)}" y="${f(y)}" width="${f(outer)}" height="${f(outer)}" rx="${f(cell * 1.8)}" fill="${eyeColor}" />`,
        `<rect x="${f(x + cell)}" y="${f(y + cell)}" width="${f(mid)}" height="${f(mid)}" rx="${f(cell * 1.15)}" fill="${bgColor}" />`,
        `<rect x="${f(x + cell * 2)}" y="${f(y + cell * 2)}" width="${f(inner)}" height="${f(inner)}" rx="${f(cell * 0.7)}" fill="${eyeColor}" />`,
      ].join('');

    case 'circle': {
      const cx = x + outer / 2;
      const cy = y + outer / 2;
      return [
        `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(outer / 2)}" fill="${eyeColor}" />`,
        `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(mid / 2)}" fill="${bgColor}" />`,
        `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(inner / 2)}" fill="${eyeColor}" />`,
      ].join('');
    }

    case 'leaf': {
      const outerPath = buildRoundedCornerPath(x, y, outer, outer, cell * 2.3, cell * 0.4, cell * 2.3, cell * 0.4);
      const midPath = buildRoundedCornerPath(
        x + cell,
        y + cell,
        mid,
        mid,
        cell * 1.6,
        cell * 0.25,
        cell * 1.6,
        cell * 0.25
      );
      const innerPath = buildRoundedCornerPath(
        x + cell * 2,
        y + cell * 2,
        inner,
        inner,
        cell * 1.0,
        cell * 0.15,
        cell * 1.0,
        cell * 0.15
      );
      return [
        `<path d="${outerPath}" fill="${eyeColor}" />`,
        `<path d="${midPath}" fill="${bgColor}" />`,
        `<path d="${innerPath}" fill="${eyeColor}" />`,
      ].join('');
    }
  }
}

export interface RenderedQrInfo {
  svgMarkup: string;
  matrixSize: number;
  effectiveEcc: 'L' | 'M' | 'Q' | 'H';
}

export function generateQrSvgMarkup(payload: string, style: QrStyleConfig): RenderedQrInfo {
  const effectiveEcc = style.logoDataUrl ? 'H' : style.errorCorrection;
  const qr = QRCode.create(payload, { errorCorrectionLevel: effectiveEcc });
  const matrixSize = qr.modules.size;
  const data = qr.modules.data;

  const totalModules = matrixSize + style.margin * 2;
  const size = style.size;
  const cell = size / totalModules;
  const eyeColor = style.useCustomEyeColor ? style.eyeColor : style.fgColor;
  const hasLogo = Boolean(style.logoDataUrl);

  const elements: string[] = [];

  // Background rect
  elements.push(`<rect x="0" y="0" width="${size}" height="${size}" fill="${style.bgColor}" />`);

  // Data modules
  for (let row = 0; row < matrixSize; row++) {
    for (let col = 0; col < matrixSize; col++) {
      const isDark = Boolean(data[row * matrixSize + col]);
      if (!isDark) continue;
      if (isInFinderPattern(row, col, matrixSize)) continue;
      if (isInLogoCutout(row, col, matrixSize, hasLogo, style.logoScale)) continue;

      const x = (col + style.margin) * cell;
      const y = (row + style.margin) * cell;
      elements.push(svgModuleElement(style.bodyPattern, x, y, cell, style.fgColor));
    }
  }

  // Three finder eyes
  const finderOrigins: FinderOrigin[] = [
    { row: 0, col: 0 },
    { row: 0, col: matrixSize - 7 },
    { row: matrixSize - 7, col: 0 },
  ];

  for (const origin of finderOrigins) {
    const fx = (origin.col + style.margin) * cell;
    const fy = (origin.row + style.margin) * cell;
    elements.push(svgFinderEyeElements(style.eyePattern, fx, fy, cell, eyeColor, style.bgColor));
  }

  // Center logo & pad
  let defsMarkup = '';
  if (style.logoDataUrl) {
    const logoPx = matrixSize * cell * style.logoScale;
    const padPx = logoPx + cell * 1.4;
    const padX = (size - padPx) / 2;
    const padY = (size - padPx) / 2;
    const logoX = (size - logoPx) / 2;
    const logoY = (size - logoPx) / 2;
    const f = (n: number) => Number(n.toFixed(3));

    if (style.logoPadShape === 'circle') {
      const cx = size / 2;
      const cy = size / 2;
      elements.push(`<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(padPx / 2)}" fill="${style.bgColor}" />`);
      defsMarkup = `<defs><clipPath id="qrLogoClip"><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(logoPx / 2)}" /></clipPath></defs>`;
    } else {
      const padRadius = padPx * 0.22;
      const logoRadius = logoPx * 0.18;
      elements.push(
        `<rect x="${f(padX)}" y="${f(padY)}" width="${f(padPx)}" height="${f(padPx)}" rx="${f(padRadius)}" fill="${style.bgColor}" />`
      );
      defsMarkup = `<defs><clipPath id="qrLogoClip"><rect x="${f(logoX)}" y="${f(logoY)}" width="${f(logoPx)}" height="${f(logoPx)}" rx="${f(logoRadius)}" /></clipPath></defs>`;
    }

    elements.push(
      `<image x="${f(logoX)}" y="${f(logoY)}" width="${f(logoPx)}" height="${f(logoPx)}" href="${escapeXmlAttr(
        style.logoDataUrl
      )}" preserveAspectRatio="xMidYMid slice" clip-path="url(#qrLogoClip)" />`
    );
  }

  const svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" shape-rendering="geometricPrecision">${defsMarkup}${elements.join(
    ''
  )}</svg>`;

  return {
    svgMarkup,
    matrixSize,
    effectiveEcc,
  };
}

function drawCanvasRoundedCorners(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  tl: number,
  tr: number,
  br: number,
  bl: number
) {
  ctx.beginPath();
  ctx.moveTo(x + tl, y);
  ctx.lineTo(x + w - tr, y);
  if (tr > 0) ctx.quadraticCurveTo(x + w, y, x + w, y + tr);
  else ctx.lineTo(x + w, y);
  ctx.lineTo(x + w, y + h - br);
  if (br > 0) ctx.quadraticCurveTo(x + w, y + h, x + w - br, y + h);
  else ctx.lineTo(x + w, y + h);
  ctx.lineTo(x + bl, y + h);
  if (bl > 0) ctx.quadraticCurveTo(x, y + h, x, y + h - bl);
  else ctx.lineTo(x, y + h);
  ctx.lineTo(x, y + tl);
  if (tl > 0) ctx.quadraticCurveTo(x, y, x + tl, y);
  else ctx.lineTo(x, y);
  ctx.closePath();
  ctx.fill();
}

function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load logo image for export.'));
    img.src = src;
  });
}

export async function renderQrToCanvas(
  canvas: HTMLCanvasElement,
  payload: string,
  style: QrStyleConfig
): Promise<void> {
  const effectiveEcc = style.logoDataUrl ? 'H' : style.errorCorrection;
  const qr = QRCode.create(payload, { errorCorrectionLevel: effectiveEcc });
  const matrixSize = qr.modules.size;
  const data = qr.modules.data;

  const size = style.size;
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable.');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Fill background
  ctx.fillStyle = style.bgColor;
  ctx.fillRect(0, 0, size, size);

  const totalModules = matrixSize + style.margin * 2;
  const cell = size / totalModules;
  const eyeColor = style.useCustomEyeColor ? style.eyeColor : style.fgColor;
  const hasLogo = Boolean(style.logoDataUrl);

  // Draw data modules
  ctx.fillStyle = style.fgColor;
  for (let row = 0; row < matrixSize; row++) {
    for (let col = 0; col < matrixSize; col++) {
      const isDark = Boolean(data[row * matrixSize + col]);
      if (!isDark) continue;
      if (isInFinderPattern(row, col, matrixSize)) continue;
      if (isInLogoCutout(row, col, matrixSize, hasLogo, style.logoScale)) continue;

      const x = (col + style.margin) * cell;
      const y = (row + style.margin) * cell;

      switch (style.bodyPattern) {
        case 'square':
          ctx.fillRect(x, y, cell + 0.35, cell + 0.35);
          break;
        case 'rounded': {
          const pad = cell * 0.06;
          const s = cell - pad * 2;
          const r = s * 0.36;
          drawCanvasRoundedCorners(ctx, x + pad, y + pad, s, s, r, r, r, r);
          break;
        }
        case 'dots': {
          ctx.beginPath();
          ctx.arc(x + cell / 2, y + cell / 2, cell * 0.43, 0, Math.PI * 2);
          ctx.fill();
          break;
        }
        case 'diamond': {
          const cx = x + cell / 2;
          const cy = y + cell / 2;
          const half = cell * 0.48;
          ctx.beginPath();
          ctx.moveTo(cx, cy - half);
          ctx.lineTo(cx + half, cy);
          ctx.lineTo(cx, cy + half);
          ctx.lineTo(cx - half, cy);
          ctx.closePath();
          ctx.fill();
          break;
        }
        case 'classy': {
          const pad = cell * 0.05;
          const s = cell - pad * 2;
          const r = s * 0.46;
          drawCanvasRoundedCorners(ctx, x + pad, y + pad, s, s, r, 0, r, 0);
          break;
        }
      }
    }
  }

  // Draw three finder eyes
  const finderOrigins: FinderOrigin[] = [
    { row: 0, col: 0 },
    { row: 0, col: matrixSize - 7 },
    { row: matrixSize - 7, col: 0 },
  ];

  for (const origin of finderOrigins) {
    const fx = (origin.col + style.margin) * cell;
    const fy = (origin.row + style.margin) * cell;
    const outer = cell * 7;
    const mid = cell * 5;
    const inner = cell * 3;

    switch (style.eyePattern) {
      case 'square':
        ctx.fillStyle = eyeColor;
        ctx.fillRect(fx, fy, outer, outer);
        ctx.fillStyle = style.bgColor;
        ctx.fillRect(fx + cell, fy + cell, mid, mid);
        ctx.fillStyle = eyeColor;
        ctx.fillRect(fx + cell * 2, fy + cell * 2, inner, inner);
        break;

      case 'rounded':
        ctx.fillStyle = eyeColor;
        drawCanvasRoundedCorners(ctx, fx, fy, outer, outer, cell * 1.8, cell * 1.8, cell * 1.8, cell * 1.8);
        ctx.fillStyle = style.bgColor;
        drawCanvasRoundedCorners(
          ctx,
          fx + cell,
          fy + cell,
          mid,
          mid,
          cell * 1.15,
          cell * 1.15,
          cell * 1.15,
          cell * 1.15
        );
        ctx.fillStyle = eyeColor;
        drawCanvasRoundedCorners(
          ctx,
          fx + cell * 2,
          fy + cell * 2,
          inner,
          inner,
          cell * 0.7,
          cell * 0.7,
          cell * 0.7,
          cell * 0.7
        );
        break;

      case 'circle': {
        const cx = fx + outer / 2;
        const cy = fy + outer / 2;
        ctx.fillStyle = eyeColor;
        ctx.beginPath();
        ctx.arc(cx, cy, outer / 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = style.bgColor;
        ctx.beginPath();
        ctx.arc(cx, cy, mid / 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = eyeColor;
        ctx.beginPath();
        ctx.arc(cx, cy, inner / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 'leaf':
        ctx.fillStyle = eyeColor;
        drawCanvasRoundedCorners(ctx, fx, fy, outer, outer, cell * 2.3, cell * 0.4, cell * 2.3, cell * 0.4);
        ctx.fillStyle = style.bgColor;
        drawCanvasRoundedCorners(
          ctx,
          fx + cell,
          fy + cell,
          mid,
          mid,
          cell * 1.6,
          cell * 0.25,
          cell * 1.6,
          cell * 0.25
        );
        ctx.fillStyle = eyeColor;
        drawCanvasRoundedCorners(
          ctx,
          fx + cell * 2,
          fy + cell * 2,
          inner,
          inner,
          cell * 1.0,
          cell * 0.15,
          cell * 1.0,
          cell * 0.15
        );
        break;
    }
  }

  // Draw center logo if uploaded/selected
  if (style.logoDataUrl) {
    const logoImg = await loadImageElement(style.logoDataUrl);
    const logoPx = matrixSize * cell * style.logoScale;
    const padPx = logoPx + cell * 1.4;
    const padX = (size - padPx) / 2;
    const padY = (size - padPx) / 2;
    const logoX = (size - logoPx) / 2;
    const logoY = (size - logoPx) / 2;

    ctx.fillStyle = style.bgColor;
    if (style.logoPadShape === 'circle') {
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, padPx / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const r = padPx * 0.22;
      drawCanvasRoundedCorners(ctx, padX, padY, padPx, padPx, r, r, r, r);
    }

    ctx.save();
    if (style.logoPadShape === 'circle') {
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, logoPx / 2, 0, Math.PI * 2);
      ctx.clip();
    } else {
      const lr = logoPx * 0.18;
      ctx.beginPath();
      ctx.moveTo(logoX + lr, logoY);
      ctx.lineTo(logoX + logoPx - lr, logoY);
      ctx.quadraticCurveTo(logoX + logoPx, logoY, logoX + logoPx, logoY + lr);
      ctx.lineTo(logoX + logoPx, logoY + logoPx - lr);
      ctx.quadraticCurveTo(logoX + logoPx, logoY + logoPx, logoX + logoPx - lr, logoY + logoPx);
      ctx.lineTo(logoX + lr, logoY + logoPx);
      ctx.quadraticCurveTo(logoX, logoY + logoPx, logoX, logoY + logoPx - lr);
      ctx.lineTo(logoX, logoY + lr);
      ctx.quadraticCurveTo(logoX, logoY, logoX + lr, logoY);
      ctx.closePath();
      ctx.clip();
    }

    // Center-crop / cover aspect ratio preservation
    const imgRatio = logoImg.naturalWidth / (logoImg.naturalHeight || 1);
    let drawW = logoPx;
    let drawH = logoPx;
    let drawX = logoX;
    let drawY = logoY;
    if (imgRatio > 1) {
      drawH = logoPx / imgRatio;
      drawY = logoY + (logoPx - drawH) / 2;
    } else if (imgRatio < 1) {
      drawW = logoPx * imgRatio;
      drawX = logoX + (logoPx - drawW) / 2;
    }

    ctx.drawImage(logoImg, drawX, drawY, drawW, drawH);
    ctx.restore();
  }
}

export async function renderQrToPngBlob(payload: string, style: QrStyleConfig): Promise<Blob> {
  const canvas = document.createElement('canvas');
  await renderQrToCanvas(canvas, payload, style);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to encode PNG image.'));
      },
      'image/png',
      1.0
    );
  });
}
