export default function Sidebar() {
    return (
        <aside className="w-[300px] border-x border-[#EAE6DF] h-full bg-deaf">
            <form className="w-full flex flex-col">
                <div className="grow">1</div>
                <div className="flex gap-2.5 w-full">
                    <input type="reset" value="Limpar" />
                    <input type="submit" value="Filtrar" className="group flex items-center justify-center gap-2 whitespace-nowrap transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive button-14-semibold bg-brown hover:bg-brown-muted text-white px-3 py-2 cursor-pointer" />
                </div>
            </form>
        </aside>
    )
}