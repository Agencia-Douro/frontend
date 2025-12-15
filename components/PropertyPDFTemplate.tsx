import { Property } from "@/types/property";

interface PropertyPDFTemplateProps {
  property: Property;
}

export default function PropertyPDFTemplate({ property }: PropertyPDFTemplateProps) {
  const transactionTypeMap: Record<string, string> = {
    comprar: "Compra",
    arrendar: "Arrendamento",
    vender: "Venda"
  };

  // Coletar todas as imagens disponíveis
  const allImages = property.imageSections
    ?.filter(section => section.images && section.images.length > 0)
    .flatMap(section => section.images.map(img => ({
      url: img,
      name: section.sectionName
    }))) || [];

  return (
    <div className="w-[1920px] h-[1080px] bg-white p-16 relative">
      {/* Logo e Header */}
      <div className="absolute top-8 right-8">
        <img
          src="/logo.png"
          alt="Agência Douro"
          className="h-16 w-auto"
        />
      </div>

      <div className="flex gap-8 h-full">
        {/* Coluna Esquerda - Imagens */}
        <div className="w-1/2 flex flex-col gap-4">
          {/* Imagem Principal */}
          {property.image && (
            <div className="h-2/3 rounded-lg overflow-hidden">
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Imagens Secundárias */}
          <div className="h-1/3 grid grid-cols-3 gap-4">
            {allImages.slice(0, 3).map((img, idx) => (
              <div key={idx} className="rounded-lg overflow-hidden">
                <img
                  src={img.url}
                  alt={`${property.title} - ${img.name}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Coluna Direita - Informações */}
        <div className="w-1/2 flex flex-col justify-between">
          {/* Informações do Imóvel */}
          <div>
            <div className="flex items-center gap-3 text-[#553B1E] mb-4">
              <span className="text-lg capitalize">{property.propertyType}</span>
              <div className="h-4 w-px bg-[#553B1E]/30"></div>
              <span className="text-lg">{property.concelho}, {property.distrito}</span>
              <div className="h-4 w-px bg-[#553B1E]/30"></div>
              <p className="text-lg"><span className="text-[#553B1E]/50">#</span>{property.reference}</p>
            </div>

            <h1 className="text-6xl font-bold text-[#553B1E] mb-2">
              {parseFloat(property.price.toString()).toLocaleString('pt-PT')} €
            </h1>

            <p className="text-lg text-[#553B1E] mb-6">
              {transactionTypeMap[property.transactionType]}
            </p>

            {/* Descrição */}
            <div className="max-h-48 overflow-hidden mb-6">
              <div
                className="text-[#553B1E] text-base leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: property.description }}
              />
            </div>
          </div>

          {/* Características */}
          <div className="grid grid-cols-2 gap-4">
            {property.totalArea && property.totalArea > 0 && (
              <div className="bg-[#FAFAFA] p-4 rounded-lg">
                <p className="text-sm text-[#888888] mb-1">Área Total</p>
                <p className="text-xl font-semibold text-[#553B1E]">{property.totalArea}m²</p>
              </div>
            )}
            {property.builtArea && property.builtArea > 0 && (
              <div className="bg-[#FAFAFA] p-4 rounded-lg">
                <p className="text-sm text-[#888888] mb-1">Área Construída</p>
                <p className="text-xl font-semibold text-[#553B1E]">{property.builtArea}m²</p>
              </div>
            )}
            {property.usefulArea && property.usefulArea > 0 && (
              <div className="bg-[#FAFAFA] p-4 rounded-lg">
                <p className="text-sm text-[#888888] mb-1">Área Útil</p>
                <p className="text-xl font-semibold text-[#553B1E]">{property.usefulArea}m²</p>
              </div>
            )}
            {property.bedrooms > 0 && (
              <div className="bg-[#FAFAFA] p-4 rounded-lg">
                <p className="text-sm text-[#888888] mb-1">Quartos</p>
                <p className="text-xl font-semibold text-[#553B1E]">{property.bedrooms}</p>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div className="bg-[#FAFAFA] p-4 rounded-lg">
                <p className="text-sm text-[#888888] mb-1">Casas de Banho</p>
                <p className="text-xl font-semibold text-[#553B1E]">{property.bathrooms}</p>
              </div>
            )}
            {property.garageSpaces > 0 && (
              <div className="bg-[#FAFAFA] p-4 rounded-lg">
                <p className="text-sm text-[#888888] mb-1">Garagem</p>
                <p className="text-xl font-semibold text-[#553B1E]">
                  {property.garageSpaces} {property.garageSpaces === 1 ? 'Lugar' : 'Lugares'}
                </p>
              </div>
            )}
            {property.constructionYear && property.constructionYear > 0 && (
              <div className="bg-[#FAFAFA] p-4 rounded-lg">
                <p className="text-sm text-[#888888] mb-1">Ano de Construção</p>
                <p className="text-xl font-semibold text-[#553B1E]">{property.constructionYear}</p>
              </div>
            )}
            {property.energyClass && (
              <div className="bg-[#FAFAFA] p-4 rounded-lg">
                <p className="text-sm text-[#888888] mb-1">Classe Energética</p>
                <p className="text-xl font-semibold text-[#553B1E]">{property.energyClass.toUpperCase()}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-[#553B1E]/10">
            <p className="text-sm text-[#888888]">www.agenciadouro.pt • contacto@agenciadouro.pt</p>
          </div>
        </div>
      </div>
    </div>
  );
}
