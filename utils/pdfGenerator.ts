import { Property } from "@/types/property";
import jsPDF from "jspdf";

// --- CONFIGURAÇÃO DE DESIGN ---
const COLORS = {
  brown: "#553B1E",
  gold: "#DCB053", // Dourado para detalhes finos
  bg_light: "#FAFAFA", // Fundo muito suave
  grey_dark: "#333333",
  grey_light: "#888888",
  black: "#000000",
  white: "#FFFFFF",
};

// URL do Logo
const AGENCY_LOGO_URL = "/Logo.svg"; // Certifique-se que este arquivo existe em public/

/**
 * Carrega a imagem e trata erros de CORS.
 * IMPORTANTE: O servidor da imagem deve retornar o header 'Access-Control-Allow-Origin: *'
 */
const loadImage = (url: string): Promise<string | null> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // Crucial para imagens externas
    img.src = url;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Preenche fundo branco para evitar PNGs transparentes ficarem pretos
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        try {
          const dataURL = canvas.toDataURL("image/jpeg", 0.9);
          resolve(dataURL);
        } catch (e) {
          console.error("Erro CORS ao converter imagem:", url, e);
          resolve(null);
        }
      } else {
        resolve(null);
      }
    };

    img.onerror = () => {
      console.warn(`Erro ao carregar imagem (verifique URL/CORS): ${url}`);
      resolve(null);
    };
  });
};

export const generatePropertyPDF = async (property: Property) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Dimensões & Layout Clean
  const PAGE_WIDTH = 210;
  const PAGE_HEIGHT = 297;
  const MARGIN = 15; // Margem maior = mais premium
  const COL_GAP = 10;

  // Coluna esquerda mais estreita para texto, direita mais larga para imagens (65%)
  const LEFT_COL_WIDTH = 70;
  const RIGHT_COL_START = MARGIN + LEFT_COL_WIDTH + COL_GAP;
  const RIGHT_COL_WIDTH = PAGE_WIDTH - RIGHT_COL_START - MARGIN;

  let cursorY = MARGIN;

  // --- 1. CARREGAMENTO DE ASSETS ---
  const imageUrls: string[] = [];
  if (property.image) imageUrls.push(property.image);
  if (property.imageSections) {
    property.imageSections.forEach((s) => imageUrls.push(...s.images));
  }

  // Tenta carregar imagens
  const imagesToLoad = imageUrls.slice(0, 5);
  const loadedImages = await Promise.all(
    imagesToLoad.map((url) => loadImage(url))
  );
  // Remove falhas
  const validImages = loadedImages.filter((img): img is string => img !== null);

  // --- 2. CABEÇALHO MINIMALISTA ---
  const logoBase64 = await loadImage(AGENCY_LOGO_URL);

  if (logoBase64) {
    const logoW = 45;
    const logoH = 18;
    doc.addImage(
      logoBase64,
      "PNG",
      MARGIN,
      cursorY,
      logoW,
      logoH,
      undefined,
      "FAST"
    );
  } else {
    doc.setTextColor(COLORS.brown);
    doc.setFont("times", "bold");
    doc.setFontSize(18);
    doc.text("AGÊNCIA DOURO", MARGIN, cursorY + 8);
  }

  // Info rápida no topo direito (Data/Ref)
  doc.setFont("courier", "normal"); // Fonte Mono para dados técnicos
  doc.setFontSize(8);
  doc.setTextColor(COLORS.grey_light);
  doc.text(
    `REF: ${property.reference} | ${new Date().toLocaleDateString()}`,
    PAGE_WIDTH - MARGIN,
    cursorY + 5,
    { align: "right" }
  );

  cursorY += 25;

  // --- 3. TÍTULO E PREÇO (CLEAN) ---

  // Tags (Minimalistas, sem fundo pesado)
  const tags = [
    property.transactionType,
    property.propertyState,
    property.propertyType,
  ]
    .filter(Boolean)
    .map((t) => t?.toUpperCase());

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(COLORS.gold);
  doc.text(tags.join("  //  "), MARGIN, cursorY); // Separador estilo código

  cursorY += 6;

  // Título
  doc.setFont("times", "roman"); // Times dá o toque clássico/premium
  doc.setFontSize(20);
  doc.setTextColor(COLORS.black);
  const titleLines = doc.splitTextToSize(property.title, LEFT_COL_WIDTH);
  doc.text(titleLines, MARGIN, cursorY);

  cursorY += titleLines.length * 8 + 2;

  // Localização
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(COLORS.grey_dark);
  doc.text(`${property.concelho}, ${property.distrito}`, MARGIN, cursorY);
  cursorY += 10;

  // Linha separadora fina
  doc.setDrawColor(COLORS.gold);
  doc.setLineWidth(0.2); // Linha super fina
  doc.line(MARGIN, cursorY, MARGIN + 20, cursorY);
  cursorY += 8;

  // --- 4. PREÇO (DESTAQUE) ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(COLORS.brown);
  const priceFormatted = new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  }).format(Number(property.price));
  doc.text(priceFormatted, MARGIN, cursorY);

  cursorY += 15;

  // --- 5. GRID DE ESPECIFICAÇÕES (ESTILO MONO/TECH) ---
  // Usaremos Courier para parecer dados técnicos de arquitetura

  const drawSpec = (label: string, value: string | number, yPos: number) => {
    doc.setFont("courier", "normal");
    doc.setFontSize(8);
    doc.setTextColor(COLORS.grey_light);
    doc.text(label.toUpperCase(), MARGIN, yPos);

    doc.setFont("courier", "bold");
    doc.setFontSize(10);
    doc.setTextColor(COLORS.grey_dark);
    doc.text(String(value), MARGIN + 35, yPos); // Alinhamento tabular
  };

  drawSpec("QUARTOS", property.bedrooms, cursorY);
  cursorY += 6;
  drawSpec("CASAS DE BANHO", property.bathrooms, cursorY);
  cursorY += 6;

  const areaVal = property.usefulArea || property.builtArea;
  drawSpec("ÁREA", `${areaVal ?? "-"} m²`, cursorY);
  cursorY += 6;

  if (property.garageSpaces) {
    drawSpec("ESTACIONAMENTO", property.garageSpaces, cursorY);
    cursorY += 6;
  }
  if (property.energyClass) {
    drawSpec("ENERGIA", property.energyClass.toUpperCase(), cursorY);
    cursorY += 6;
  }

  cursorY += 10;

  // --- 6. DESCRIÇÃO ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(COLORS.black);
  doc.text("SOBRE O IMÓVEL", MARGIN, cursorY);
  cursorY += 5;

  doc.setFont("helvetica", "normal"); // Fonte limpa para leitura
  doc.setFontSize(9);
  doc.setTextColor(COLORS.grey_dark);
  doc.setLineHeightFactor(1.5); // Mais espaço entre linhas (Premium)

  const maxDescHeight = PAGE_HEIGHT - cursorY - 20;
  const descLines = doc.splitTextToSize(property.description, LEFT_COL_WIDTH);

  // Lógica de corte de texto
  const lineHeightMm = 4.5;
  const maxLines = Math.floor(maxDescHeight / lineHeightMm);
  const printLines =
    descLines.length > maxLines
      ? [...descLines.slice(0, maxLines - 1), "[...]"]
      : descLines;

  doc.text(printLines, MARGIN, cursorY);

  // --- 7. IMAGENS (COLUNA DIREITA - VISUAL MAGAZINE) ---
  let imgY = MARGIN + 20; // Começa um pouco abaixo para alinhar com título

  if (validImages.length > 0) {
    // Imagem Principal (Grande e impactante)
    const mainImgH = 100;
    doc.addImage(
      validImages[0],
      "JPEG",
      RIGHT_COL_START,
      MARGIN,
      RIGHT_COL_WIDTH,
      mainImgH,
      undefined,
      "FAST"
    );

    // Pequena legenda na imagem (opcional, visual chique)
    // doc.setFillColor(COLORS.white);
    // doc.rect(RIGHT_COL_START, MARGIN + mainImgH - 8, 30, 8, "F");
    // doc.setFontSize(6);
    // doc.text("VISTA PRINCIPAL", RIGHT_COL_START + 2, MARGIN + mainImgH - 3);

    let currentImgY = MARGIN + mainImgH + COL_GAP;

    // Restante das imagens em coluna única larga ou mosaico
    const remainingImages = validImages.slice(1);

    // Layout mosaico assimétrico para visual moderno
    if (remainingImages.length > 0) {
      remainingImages.forEach((img) => {
        const h = 55;
        if (currentImgY + h < PAGE_HEIGHT - MARGIN) {
          doc.addImage(
            img,
            "JPEG",
            RIGHT_COL_START,
            currentImgY,
            RIGHT_COL_WIDTH,
            h,
            undefined,
            "FAST"
          );
          currentImgY += h + COL_GAP;
        }
      });
    }
  } else {
    // Placeholder se não carregar imagens (evita espaço vazio feio)
    doc.setFillColor(COLORS.bg_light);
    doc.setDrawColor(COLORS.grey_light);
    doc.rect(RIGHT_COL_START, MARGIN, RIGHT_COL_WIDTH, 150, "FD");
    doc.setFontSize(10);
    doc.setTextColor(COLORS.grey_light);
    doc.text("Imagens indisponíveis", RIGHT_COL_START + 10, MARGIN + 75);
  }

  // --- 8. RODAPÉ ---
  const footerY = PAGE_HEIGHT - 10;

  doc.setDrawColor(COLORS.grey_light);
  doc.setLineWidth(0.1);
  doc.line(MARGIN, footerY - 4, PAGE_WIDTH - MARGIN, footerY - 4);

  doc.setFont("courier", "normal");
  doc.setFontSize(7);
  doc.setTextColor(COLORS.grey_light);

  doc.text("AGÊNCIA DOURO REAL ESTATE", MARGIN, footerY);
  doc.text("WWW.AGENCIADOURO.PT", PAGE_WIDTH - MARGIN, footerY, {
    align: "right",
  });

  doc.save(`Douro_${property.reference}.pdf`);
};
