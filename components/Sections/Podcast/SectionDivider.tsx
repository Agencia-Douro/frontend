interface SectionDividerProps {
    /** Remove margin-top para o espaçamento em cima e em baixo da secção anterior ficar igual */
    noTopMargin?: boolean;
}

export function SectionDivider({ noTopMargin }: SectionDividerProps = {}) {
    return (
        <div
            className={`h-px w-full bg-linear-to-r from-gold/0 via-gold to-gold/0 ${noTopMargin ? "mt-0 mb-8 md:mb-10 lg:mb-12 xl:mb-16" : "mt-8 md:mt-10 lg:mt-12 xl:mt-16 mb-8 md:mb-10 lg:mb-12 xl:mb-16"}`}
            aria-hidden
        />
    );
}
