import { Property } from "@/types/property";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";

// --- CONFIGURAÇÃO DE DESIGN ---

// Função auxiliar para converter imagem para base64
const imageToBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url, {
      mode: "cors",
      credentials: "omit",
    });
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Erro ao converter imagem:", error);
    return url; // Retorna URL original em caso de erro
  }
};

// Função para pré-carregar todas as imagens do elemento
const preloadImages = async (element: HTMLElement): Promise<void> => {
  const images = element.querySelectorAll("img");
  const promises = Array.from(images).map(async (img) => {
    const originalSrc = img.src;
    if (originalSrc && !originalSrc.startsWith("data:")) {
      const base64 = await imageToBase64(originalSrc);
      img.src = base64;
    }
  });
  await Promise.all(promises);
};

export const generatePropertyPDF = async (property: Property, ref: { current: HTMLDivElement | null }) => {
  const inputData = ref.current;
  if (!inputData) return;

  try {
    // Pré-carregar e converter imagens para base64
    await preloadImages(inputData);

    // Forçar largura fixa para consistência entre dispositivos
    const originalStyle = inputData.style.cssText;
    inputData.style.width = '800px';
    inputData.style.minWidth = '800px';
    inputData.style.maxWidth = '800px';

    const canvas = await html2canvas(inputData, {
      useCORS: true,
      allowTaint: true,
      scale: 2,
      width: 800,
      windowWidth: 800,
    });

    // Restaurar estilo original
    inputData.style.cssText = originalStyle;

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    // Escalar para caber na página mantendo proporção
    const scale = imgHeight > pageHeight ? pageHeight / imgHeight : 1;
    const finalWidth = pageWidth * scale;
    const finalHeight = imgHeight * scale;

    // Centralizar verticalmente se houver espaço
    const yOffset = imgHeight < pageHeight ? (pageHeight - finalHeight) / 2 : 0;

    pdf.addImage(imgData, "PNG", 0, yOffset, finalWidth, finalHeight);
    const sanitizedTitle = property.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    pdf.save(`${sanitizedTitle}.pdf`);
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
  }
};
