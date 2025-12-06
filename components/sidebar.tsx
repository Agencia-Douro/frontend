import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";

export default function Sidebar() {
    return (
        <aside className="w-[300px] border-x border-[#EAE6DF] h-full bg-deaf">
            <form className="flex flex-col">
                <div className="flex flex-col flex-1">
                    <div className="p-4 border-b border-[#EAE6DF]">
                        <div className="flex">
                            <button className="grow body-14-medium text-white bg-brown py-1.5">Comprar</button>
                            <button className="grow body-14-medium text-brown bg-muted py-1.5">Arrendar</button>
                            <button className="grow body-14-medium text-brown bg-muted py-1.5">Vender</button>
                        </div>
                    </div>
                    <div className="p-4 border-b border-[#EAE6DF] flex gap-2">
                        <Switch />
                        <p className="text-black-muted body-14-medium">Empreendimentos</p>
                    </div>
                    <div className="p-4 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <p className="body-16-medium text-black">Imóvel</p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gold">
                                <path d="M9.99996 9.14777L13.8889 13.125L15 11.9886L9.99996 6.875L5 11.9886L6.11111 13.125L9.99996 9.14777Z" fill="currentColor"/>
                            </svg>
                        </div>
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <Label htmlFor="tipo">Tipo de Imóvel</Label>
                                <Select>
                                    <SelectTrigger id="tipo" name="tipo">
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent className="[&>div]:flex [&>div]:flex-col gap-1">
                                        <SelectItem value="moradia">Moradia</SelectItem>
                                        <SelectItem value="apartamento">Apartamento</SelectItem>
                                        <SelectItem value="predio">Prédio</SelectItem>
                                        <SelectItem value="terreno">Terreno</SelectItem>
                                        <SelectItem value="escritorio">Escritório</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="tipo">Estado do Imóvel</Label>
                                <Select>
                                    <SelectTrigger id="tipo" name="tipo">
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent className="[&>div]:flex [&>div]:flex-col gap-1">
                                        <SelectItem value="moradia">Moradia</SelectItem>
                                        <SelectItem value="apartamento">Apartamento</SelectItem>
                                        <SelectItem value="predio">Prédio</SelectItem>
                                        <SelectItem value="terreno">Terreno</SelectItem>
                                        <SelectItem value="escritorio">Escritório</SelectItem>
                                    </SelectContent>
                            </Select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2.5 p-4">
                    <input type="reset" value="Limpar" className="shadow-pretty grow flex text-center gap-2 whitespace-nowrap transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive button-14-semibold bg-white text-black-muted px-3 py-2 cursor-pointer" />
                    <input type="submit" value="Filtrar" className="grow flex text-center gap-2 whitespace-nowrap transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive button-14-semibold bg-brown hover:bg-brown-muted text-white px-3 py-2 cursor-pointer" />
                </div>
            </form>
        </aside>
    )
}