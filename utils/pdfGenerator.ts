import jsPDF from "jspdf";
import { Property } from "@/types/property";

// Cores da Agência Douro
const COLORS = {
  brown: "#553B1E",
  gold: "#DCB053",
  deaf: "#FBF9F6",
  muted: "#F4F0E9",
  grey: "#6A6561",
  black: "#0B090C",
  white: "#FFFFFF",
  red: "#FB2C36",
};

// Função auxiliar para converter cor hex para RGB
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

// Função para carregar imagem e converter para base64
const loadImage = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      } else {
        reject("Failed to get canvas context");
      }
    };
    img.onerror = () => reject("Failed to load image");
    img.src = url;
  });
};

export const generatePropertyPDF = async (property: Property) => {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;

  // Definir background bege claro
  const bgColor = hexToRgb(COLORS.deaf);
  pdf.setFillColor(bgColor.r, bgColor.g, bgColor.b);
  pdf.rect(0, 0, pageWidth, pageHeight, "F");

  // ===== HEADER - Logo e Tipo do Imóvel =====
  const logoColor = hexToRgb(COLORS.brown);
  pdf.setTextColor(logoColor.r, logoColor.g, logoColor.b);
  pdf.setFontSize(22);
  pdf.setFont("helvetica", "bold");
  pdf.text("AGÊNCIA", margin, 12);

  const goldColor = hexToRgb(COLORS.gold);
  pdf.setTextColor(goldColor.r, goldColor.g, goldColor.b);
  pdf.text("DOURO", margin + 30, 12);

  // Tipo do Imóvel no canto superior direito
  const propertyTypeMap: Record<string, string> = {
    apartamento: "Apartamento",
    moradia: "Moradia",
    terreno: "Terreno",
    comercial: "Comercial",
    escritorio: "Escritório",
    armazem: "Armazém",
    garagem: "Garagem",
    outro: "Outro",
  };

  const transactionTypeMap: Record<string, string> = {
    comprar: "Venda",
    arrendar: "Arrendamento",
    vender: "Venda",
  };

  const stateMap: Record<string, string> = {
    novo: "Novo",
    usado: "Usado",
    renovado: "Renovado",
    em_construcao: "Em Construção",
  };

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(logoColor.r, logoColor.g, logoColor.b);
  const headerText = `${propertyTypeMap[property.propertyType] || property.propertyType} ${
    property.propertyType.toLowerCase() === "apartamento" ? `T${property.bedrooms}` : ""
  }  Habitação / ${property.propertyState ? stateMap[property.propertyState] : "Novo"} / ${
    transactionTypeMap[property.transactionType]
  }`;
  pdf.text(headerText, pageWidth - margin, 8, { align: "right" });

  pdf.setFontSize(9);
  pdf.text(
    `${property.concelho} - ${property.distrito}`,
    pageWidth - margin,
    13,
    { align: "right" }
  );

  // Referência
  if (property.reference) {
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text(property.reference, pageWidth - margin, 18, { align: "right" });
  }

  // ===== SEÇÃO ESQUERDA - Consultor (placeholder) =====
  let yPos = 25;

  // Box para foto do consultor (placeholder com cor marrom)
  const consultorBoxX = margin;
  const consultorBoxY = yPos;
  const consultorBoxWidth = 60;
  const consultorBoxHeight = 35;

  pdf.setFillColor(logoColor.r, logoColor.g, logoColor.b);
  pdf.rect(consultorBoxX, consultorBoxY, consultorBoxWidth, consultorBoxHeight, "F");

  // Nome do consultor (placeholder)
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(logoColor.r, logoColor.g, logoColor.b);
  pdf.text("Consultor Imobiliário", consultorBoxX, consultorBoxY + consultorBoxHeight + 7);

  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  const greyColor = hexToRgb(COLORS.grey);
  pdf.setTextColor(greyColor.r, greyColor.g, greyColor.b);
  pdf.text("Agência Douro", consultorBoxX, consultorBoxY + consultorBoxHeight + 12);

  // Telefone
  pdf.setFontSize(9);
  pdf.setTextColor(logoColor.r, logoColor.g, logoColor.b);
  pdf.text("☎ +351 XXX XXX XXX", consultorBoxX, consultorBoxY + consultorBoxHeight + 17);

  pdf.setFontSize(7);
  pdf.setTextColor(greyColor.r, greyColor.g, greyColor.b);
  pdf.text("(Chamada para a rede móvel nacional)", consultorBoxX, consultorBoxY + consultorBoxHeight + 21);

  // Email
  pdf.setFontSize(9);
  pdf.setTextColor(logoColor.r, logoColor.g, logoColor.b);
  pdf.text("contacto@agenciadouro.pt", consultorBoxX, consultorBoxY + consultorBoxHeight + 26);

  // ===== SEÇÃO DIREITA - Galeria de Fotos do Imóvel =====
  const galleryX = consultorBoxX + consultorBoxWidth + 10;
  const galleryWidth = pageWidth - margin - galleryX;

  // Foto principal (maior)
  const mainPhotoHeight = 60;

  try {
    if (property.image) {
      const imageData = await loadImage(property.image);
      pdf.addImage(imageData, "JPEG", galleryX, yPos, galleryWidth, mainPhotoHeight);
    } else {
      // Placeholder para foto principal
      pdf.setFillColor(200, 200, 200);
      pdf.rect(galleryX, yPos, galleryWidth, mainPhotoHeight, "F");
      pdf.setTextColor(150, 150, 150);
      pdf.setFontSize(10);
      pdf.text("Foto do Imóvel", galleryX + galleryWidth / 2, yPos + mainPhotoHeight / 2, {
        align: "center",
      });
    }
  } catch (error) {
    // Fallback para placeholder
    pdf.setFillColor(200, 200, 200);
    pdf.rect(galleryX, yPos, galleryWidth, mainPhotoHeight, "F");
  }

  // Fotos menores (grid 2x2)
  const smallPhotoSize = (galleryWidth - 5) / 2;
  const smallPhotosY = yPos + mainPhotoHeight + 5;

  // Tentar carregar fotos das seções de imagens
  const imagesToLoad =
    property.imageSections && property.imageSections.length > 0
      ? property.imageSections.flatMap((section) => section.images).slice(0, 4)
      : [];

  const photoPositions = [
    { x: galleryX, y: smallPhotosY },
    { x: galleryX + smallPhotoSize + 5, y: smallPhotosY },
    { x: galleryX, y: smallPhotosY + smallPhotoSize + 5 },
    { x: galleryX + smallPhotoSize + 5, y: smallPhotosY + smallPhotoSize + 5 },
  ];

  for (let i = 0; i < 4; i++) {
    const pos = photoPositions[i];
    try {
      if (imagesToLoad[i]) {
        const imageData = await loadImage(imagesToLoad[i]);
        pdf.addImage(imageData, "JPEG", pos.x, pos.y, smallPhotoSize, smallPhotoSize);
      } else {
        // Placeholder
        pdf.setFillColor(220, 220, 220);
        pdf.rect(pos.x, pos.y, smallPhotoSize, smallPhotoSize, "F");
      }
    } catch (error) {
      // Placeholder
      pdf.setFillColor(220, 220, 220);
      pdf.rect(pos.x, pos.y, smallPhotoSize, smallPhotoSize, "F");
    }
  }

  // ===== TÍTULO DO IMÓVEL E PREÇO =====
  yPos = smallPhotosY + 2 * smallPhotoSize + 15;

  // Box destacado para título
  const titleBoxColor = hexToRgb(COLORS.brown);
  pdf.setFillColor(titleBoxColor.r, titleBoxColor.g, titleBoxColor.b);
  pdf.rect(margin, yPos - 8, contentWidth, 22, "F");

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text(
    `${propertyTypeMap[property.propertyType] || property.propertyType} ${
      property.propertyType.toLowerCase() === "apartamento" ? `T${property.bedrooms}` : ""
    }`,
    margin + 3,
    yPos - 2
  );

  // Preço
  pdf.setFontSize(22);
  const priceText = `${parseFloat(property.price.toString()).toLocaleString("pt-PT")} €`;
  pdf.text(priceText, margin + 3, yPos + 8);

  yPos += 18;

  // Localização completa
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(logoColor.r, logoColor.g, logoColor.b);
  pdf.text(
    `${property.concelho}`,
    margin,
    yPos + 5
  );
  pdf.text(
    `${property.address || `${property.distrito}`}, Porto`,
    margin,
    yPos + 10
  );

  // ===== CARACTERÍSTICAS EM GRID =====
  yPos += 20;

  const characteristics = [
    { label: "Quartos", value: property.bedrooms.toString() },
    { label: "WCs", value: property.bathrooms.toString() },
    {
      label: property.garageSpaces > 0 ? "Garagem aberta" : "Garagem",
      value: property.garageSpaces > 0 ? `${property.garageSpaces} lugar${property.garageSpaces > 1 ? "es" : ""}` : "N/A",
    },
    {
      label: "Parqueamento",
      value: property.garageSpaces > 0 ? `${property.garageSpaces} lugar${property.garageSpaces > 1 ? "es" : ""}` : "N/A",
    },
    {
      label: "Área útil de hab.",
      value: property.usefulArea ? `${property.usefulArea} m²` : "N/A",
    },
    {
      label: "Área bruta de const.",
      value: property.builtArea ? `${property.builtArea} m²` : "N/A",
    },
    {
      label: "Ano de construção",
      value: property.constructionYear ? property.constructionYear.toString() : "N/A",
    },
  ];

  // Desenhar características em grid 4 colunas
  const charColWidth = contentWidth / 4;
  characteristics.forEach((char, index) => {
    const col = index % 4;
    const row = Math.floor(index / 4);
    const xPos = margin + col * charColWidth;
    const charYPos = yPos + row * 15;

    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(logoColor.r, logoColor.g, logoColor.b);
    pdf.text(char.label, xPos, charYPos);

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text(char.value, xPos, charYPos + 5);
  });

  yPos += 40;

  // ===== DESCRIÇÃO DO IMÓVEL =====
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(logoColor.r, logoColor.g, logoColor.b);

  // Remove HTML tags from description
  const cleanDescription = property.description
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const descriptionLines = pdf.splitTextToSize(cleanDescription, contentWidth);

  const maxLinesPage1 = Math.floor((pageHeight - yPos - 60) / 5);
  const page1DescriptionLines = descriptionLines.slice(0, maxLinesPage1);

  page1DescriptionLines.forEach((line: string) => {
    pdf.text(line, margin, yPos);
    yPos += 5;
  });

  // ===== SEÇÃO "3 RAZÕES PARA ESCOLHER A AGÊNCIA DOURO" =====
  yPos = pageHeight - 55;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(logoColor.r, logoColor.g, logoColor.b);
  pdf.text("3 razões para escolher a Agência Douro", margin, yPos);

  yPos += 7;

  // Razão 1
  pdf.setFontSize(8);
  pdf.setTextColor(goldColor.r, goldColor.g, goldColor.b);
  pdf.text("+ acompanhamento", margin, yPos);

  pdf.setFontSize(7);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(logoColor.r, logoColor.g, logoColor.b);
  const reason1 = pdf.splitTextToSize(
    "Com experiência única no mercado imobiliário, os nossos consultores dedicam-se a dar-lhe o melhor acompanhamento, orientando-o com confiança na direção das suas necessidades e ambições.",
    contentWidth
  );
  yPos += 4;
  reason1.slice(0, 3).forEach((line: string) => {
    pdf.text(line, margin, yPos);
    yPos += 3;
  });

  yPos += 2;

  // Razão 2
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(goldColor.r, goldColor.g, goldColor.b);
  pdf.text("+ simples", margin, yPos);

  pdf.setFontSize(7);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(logoColor.r, logoColor.g, logoColor.b);
  const reason2 = pdf.splitTextToSize(
    "Os consultores da Agência Douro têm formação única, ancorada na experiência prática, que permite simplificar e tornar mais eficaz a sua experiência imobiliária.",
    contentWidth
  );
  yPos += 4;
  reason2.slice(0, 2).forEach((line: string) => {
    pdf.text(line, margin, yPos);
    yPos += 3;
  });

  // Footer
  pdf.setFontSize(6);
  pdf.setTextColor(greyColor.r, greyColor.g, greyColor.b);
  pdf.text(
    "Dados válidos salvo erro tipográfico. Processado automaticamente por computador.",
    margin,
    pageHeight - 10
  );

  pdf.setFontSize(7);
  pdf.setFont("helvetica", "bold");
  pdf.text("AGÊNCIA DOURO", margin, pageHeight - 5);
  pdf.setFont("helvetica", "normal");
  pdf.text(
    "Porto - Rua Principal",
    margin + 30,
    pageHeight - 5
  );

  // Salvar o PDF
  const fileName = property.reference
    ? `AgenciaDouro_${property.reference}.pdf`
    : `AgenciaDouro_Imovel_${property.id}.pdf`;

  pdf.save(fileName);
};
