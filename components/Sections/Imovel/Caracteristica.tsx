interface CaracteristicaProps {
    titulo: string
    valor: string
}
export default function Caracteristica({ titulo, valor }: CaracteristicaProps) {
    return (
        <div className="text-brown body-14-medium md:body-16-medium border-b last:border-b-0 border-brown/20 py-2.5 flex justify-between items-center">
            <span>{titulo}</span>
            <span>{valor}</span>
        </div>
    )
}