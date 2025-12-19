import { Property } from "@/types/property";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";

// --- CONFIGURAÇÃO DE DESIGN ---
const COLORS = {
  brown: "#553B1E",
  gold: "#DCB053",
  bg_light: "#FAFAFA",
  grey_dark: "#333333",
  grey_light: "#888888",
  black: "#000000",
  white: "#FFFFFF",
};

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

export const generatePropertyPDF = async (property: Property, ref: any) => {
  const inputData = ref.current;

  try {
    // Pré-carregar e converter imagens para base64
    await preloadImages(inputData);

    const canvas = await html2canvas(inputData, {
      useCORS: true,
      allowTaint: true,
      scale: 2,
    });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);
    pdf.save(`brochura-imovel-${property.id}.pdf`);
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
  }
};
