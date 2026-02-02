import { Property } from "@/types/property";

interface PropertyPDFTemplateProps {
  property: Property;
}

export default function PropertyPDFTemplate({ property }: PropertyPDFTemplateProps) {
  const transactionTypeMap: Record<string, string> = {
    comprar: "Compra",
    arrendar: "Arrendamento",
  };

  // Coletar todas as imagens disponíveis
  const allImages = property.imageSections
    ?.filter(section => section.images && section.images.length > 0)
    .flatMap(section => section.images.map(img => ({
      url: img,
      name: section.sectionName
    }))) || [];

  return (
    <div className="w-[800px] bg-white">
      <div className="px-6 py-5">
        {/* Grid de imagens */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <div className="col-span-2 h-52 bg-brown/10 overflow-hidden rounded">
            {property.image && (
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-[102px] bg-brown/10 overflow-hidden rounded">
              {allImages[0] && (
                <img
                  src={allImages[0].url}
                  alt={`${property.title} - ${allImages[0].name}`}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="h-[102px] bg-brown/10 overflow-hidden rounded">
              {allImages[1] && (
                <img
                  src={allImages[1].url}
                  alt={`${property.title} - ${allImages[1].name}`}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>
        </div>

        {/* Título e Preço */}
        <div className="mb-4">
          <h1 className="text-xl font-semibold text-brown mb-1 line-clamp-2">
            {property.title}
          </h1>
          <div className="flex items-baseline gap-3">
            <h2 className="text-3xl font-bold text-brown">
              {parseFloat(property.price.toString()).toLocaleString('pt-PT')} €
            </h2>
            <span className="text-sm text-brown/60">
              {transactionTypeMap[property.transactionType]} • {property.concelho}, {property.distrito} • #{property.reference}
            </span>
          </div>
        </div>

        {/* Características em grid */}
        <div className="grid grid-cols-5 gap-2 mb-4">
          {property.totalArea && property.totalArea > 0 && (
            <div className="bg-deaf px-2 py-1.5 rounded text-center">
              <p className="text-[10px] text-brown/60">Área Total</p>
              <p className="text-sm font-medium text-brown">{property.totalArea}m²</p>
            </div>
          )}
          {property.builtArea && property.builtArea > 0 && (
            <div className="bg-deaf px-2 py-1.5 rounded text-center">
              <p className="text-[10px] text-brown/60">Área Construída</p>
              <p className="text-sm font-medium text-brown">{property.builtArea}m²</p>
            </div>
          )}
          {property.usefulArea && property.usefulArea > 0 && (
            <div className="bg-deaf px-2 py-1.5 rounded text-center">
              <p className="text-[10px] text-brown/60">Área Útil</p>
              <p className="text-sm font-medium text-brown">{property.usefulArea}m²</p>
            </div>
          )}
          {property.bedrooms > 0 && (
            <div className="bg-deaf px-2 py-1.5 rounded text-center">
              <p className="text-[10px] text-brown/60">Quartos</p>
              <p className="text-sm font-medium text-brown">{property.bedrooms}</p>
            </div>
          )}
          {property.bathrooms > 0 && (
            <div className="bg-deaf px-2 py-1.5 rounded text-center">
              <p className="text-[10px] text-brown/60">Casas de Banho</p>
              <p className="text-sm font-medium text-brown">{property.bathrooms}</p>
            </div>
          )}
          {property.garageSpaces > 0 && (
            <div className="bg-deaf px-2 py-1.5 rounded text-center">
              <p className="text-[10px] text-brown/60">Garagem</p>
              <p className="text-sm font-medium text-brown">{property.garageSpaces}</p>
            </div>
          )}
          {property.constructionYear && property.constructionYear > 0 && (
            <div className="bg-deaf px-2 py-1.5 rounded text-center">
              <p className="text-[10px] text-brown/60">Ano</p>
              <p className="text-sm font-medium text-brown">{property.constructionYear}</p>
            </div>
          )}
          {property.energyClass && (
            <div className="bg-deaf px-2 py-1.5 rounded text-center">
              <p className="text-[10px] text-brown/60">Classe Energética</p>
              <p className="text-sm font-medium text-brown">{property.energyClass.toUpperCase()}</p>
            </div>
          )}
          {property.hasOffice && (
            <div className="bg-deaf px-2 py-1.5 rounded text-center">
              <p className="text-[10px] text-brown/60">Escritório</p>
              <p className="text-sm font-medium text-brown">Sim</p>
            </div>
          )}
          {property.hasLaundry && (
            <div className="bg-deaf px-2 py-1.5 rounded text-center">
              <p className="text-[10px] text-brown/60">Lavandaria</p>
              <p className="text-sm font-medium text-brown">Sim</p>
            </div>
          )}
        </div>

        {/* Descrição */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-brown mb-1">Descrição</h3>
          <div
            className="text-xs text-brown/80 leading-relaxed line-clamp-6"
            dangerouslySetInnerHTML={{ __html: property.description }}
          />
        </div>

        {/* Características/Features */}
        {property.features && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-brown mb-1">Características</h3>
            <div
              className="text-[11px] text-brown/70 leading-relaxed line-clamp-4"
              dangerouslySetInnerHTML={{ __html: property.features }}
            />
          </div>
        )}

        {/* Informações adicionais */}
        {(property.deliveryDate || property.paymentConditions) && (
          <div className="flex flex-col gap-1 mb-4 text-xs">
            {property.deliveryDate && (
              <div>
                <span className="font-medium text-brown">Previsão de Entrega:</span>
                <span className="text-brown/70 ml-1">{property.deliveryDate}</span>
              </div>
            )}
            {property.paymentConditions && (
              <div>
                <span className="font-medium text-brown">Condições de Pagamento:</span>
                <span
                  className="text-brown/70 ml-1 line-clamp-1"
                  dangerouslySetInnerHTML={{ __html: property.paymentConditions }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
