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
      {/* Header com logo e info */}
      <div className="px-8 pt-6 pb-4 border-b border-brown/10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 body-14-medium text-brown mb-2">
              <span className="capitalize">{property.transactionType}</span>
              <span className="text-brown/30">•</span>
              <span className="capitalize">{property.propertyType}</span>
              <span className="text-brown/30">•</span>
              <span>{property.distrito}</span>
            </div>
            <div className="flex items-center gap-3 body-14-regular text-brown/70">
              <span>{property.concelho}, {property.distrito}</span>
              <span className="text-brown/30">•</span>
              <span><span className="text-brown/50">#</span>{property.reference}</span>
            </div>
          </div>
          <img
            src="/logo.png"
            alt="Agência Douro"
            className="h-10 w-auto"
          />
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="px-8 py-6">
        {/* Grid de imagens - 2x2 */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="col-span-2 h-64 bg-brown/10 overflow-hidden rounded-md">
            {property.image && (
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="h-32 bg-brown/10 overflow-hidden rounded-md">
            {allImages[0] && (
              <img
                src={allImages[0].url}
                alt={`${property.title} - ${allImages[0].name}`}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="h-32 bg-brown/10 overflow-hidden rounded-md">
            {allImages[1] && (
              <img
                src={allImages[1].url}
                alt={`${property.title} - ${allImages[1].name}`}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>

        {/* Preço */}
        <div className="mb-6">
          <h2 className="text-4xl font-semibold text-brown mb-1">
            {parseFloat(property.price.toString()).toLocaleString('pt-PT')} €
          </h2>
          <p className="body-14-medium text-brown/70">
            {transactionTypeMap[property.transactionType]}
          </p>
        </div>

        {/* Características em grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {property.totalArea && property.totalArea > 0 && (
            <div className="bg-deaf p-3 rounded-md">
              <p className="text-xs text-brown/60 mb-1">Área Total</p>
              <p className="body-16-medium text-brown">{property.totalArea}m²</p>
            </div>
          )}
          {property.builtArea && property.builtArea > 0 && (
            <div className="bg-deaf p-3 rounded-md">
              <p className="text-xs text-brown/60 mb-1">Área Construída</p>
              <p className="body-16-medium text-brown">{property.builtArea}m²</p>
            </div>
          )}
          {property.usefulArea && property.usefulArea > 0 && (
            <div className="bg-deaf p-3 rounded-md">
              <p className="text-xs text-brown/60 mb-1">Área Útil</p>
              <p className="body-16-medium text-brown">{property.usefulArea}m²</p>
            </div>
          )}
          {property.bedrooms > 0 && (
            <div className="bg-deaf p-3 rounded-md">
              <p className="text-xs text-brown/60 mb-1">Quartos</p>
              <p className="body-16-medium text-brown">{property.bedrooms}</p>
            </div>
          )}
          {property.bathrooms > 0 && (
            <div className="bg-deaf p-3 rounded-md">
              <p className="text-xs text-brown/60 mb-1">Casas de Banho</p>
              <p className="body-16-medium text-brown">{property.bathrooms}</p>
            </div>
          )}
          {property.garageSpaces > 0 && (
            <div className="bg-deaf p-3 rounded-md">
              <p className="text-xs text-brown/60 mb-1">Garagem</p>
              <p className="body-16-medium text-brown">
                {property.garageSpaces} {property.garageSpaces === 1 ? 'Lugar' : 'Lugares'}
              </p>
            </div>
          )}
          {property.constructionYear && property.constructionYear > 0 && (
            <div className="bg-deaf p-3 rounded-md">
              <p className="text-xs text-brown/60 mb-1">Ano</p>
              <p className="body-16-medium text-brown">{property.constructionYear}</p>
            </div>
          )}
          {property.energyClass && (
            <div className="bg-deaf p-3 rounded-md">
              <p className="text-xs text-brown/60 mb-1">Classe Energética</p>
              <p className="body-16-medium text-brown">{property.energyClass.toUpperCase()}</p>
            </div>
          )}
          {property.hasOffice && (
            <div className="bg-deaf p-3 rounded-md">
              <p className="text-xs text-brown/60 mb-1">Escritório</p>
              <p className="body-16-medium text-brown">Sim</p>
            </div>
          )}
          {property.hasLaundry && (
            <div className="bg-deaf p-3 rounded-md">
              <p className="text-xs text-brown/60 mb-1">Lavandaria</p>
              <p className="body-16-medium text-brown">Sim</p>
            </div>
          )}
        </div>

        {/* Descrição - limitada */}
        <div className="mb-6">
          <h3 className="body-16-medium text-brown mb-2">Descrição</h3>
          <div
            className="prose prose-brown prose-sm max-w-none text-brown body-14-regular line-clamp-6 overflow-hidden"
            style={{ maxHeight: '120px' }}
            dangerouslySetInnerHTML={{ __html: property.description }}
          />
        </div>

        {/* Informações adicionais */}
        {(property.deliveryDate || property.paymentConditions) && (
          <div className="space-y-3 mb-6">
            {property.deliveryDate && (
              <div>
                <p className="body-14-medium text-brown mb-1">Previsão de entrega:</p>
                <p className="body-14-regular text-brown/70">{property.deliveryDate}</p>
              </div>
            )}
            {property.paymentConditions && (
              <div>
                <p className="body-14-medium text-brown mb-1">Condições de Pagamento:</p>
                <div
                  className="body-14-regular text-brown/70 line-clamp-3"
                  style={{ maxHeight: '60px', overflow: 'hidden' }}
                  dangerouslySetInnerHTML={{ __html: property.paymentConditions }}
                />
              </div>
            )}
          </div>
        )}

        {/* Mapa */}
        <div className="h-48 bg-brown/10 rounded-md overflow-hidden mb-6">
          <iframe
            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(
              `${property.concelho}, ${property.distrito}, Portugal`
            )}`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-brown/10 text-center">
          <p className="body-12-regular text-brown/60">
            www.agenciadouro.pt • contacto@agenciadouro.pt • +351 919 766 323
          </p>
        </div>
      </div>
    </div>
  );
}
