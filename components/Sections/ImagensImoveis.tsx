import { useState } from "react";
import { Button } from "../ui/button";

interface ImagensImoveisProps {
    showPanel?: boolean;
    panelClosing?: boolean;
    panelOpening?: boolean;
    handleOpenPanel?: () => void;
    handleClosePanel?: () => void;
    handleTransitionEnd?: () => void;
}

export default function ImagensImoveis({ 
    showPanel: showPanelProp, 
    panelClosing: panelClosingProp, 
    panelOpening: panelOpeningProp,
    handleOpenPanel,
    handleClosePanel: handleClosePanelProp,
    handleTransitionEnd: handleTransitionEndProp
}: ImagensImoveisProps) {
    // Estados locais como fallback quando não há props
    const [showPanelLocal, setShowPanelLocal] = useState(false)
    const [panelClosingLocal, setPanelClosingLocal] = useState(false)
    const [panelOpeningLocal, setPanelOpeningLocal] = useState(false)

    // Usar props se fornecidas, caso contrário usar estados locais
    const showPanel = showPanelProp !== undefined ? showPanelProp : showPanelLocal;
    const panelClosing = panelClosingProp !== undefined ? panelClosingProp : panelClosingLocal;
    const panelOpening = panelOpeningProp !== undefined ? panelOpeningProp : panelOpeningLocal;

    const handleOpen = () => {
        if (handleOpenPanel) {
            handleOpenPanel();
            console.log("aberto")
        } else {
            // Fallback para quando não há prop
            setShowPanelLocal(true)
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setPanelOpeningLocal(true)
                })
            })
            console.log("fechado")
        }
    }
    
    const handleClosePanel = () => {
        if (handleClosePanelProp) {
            handleClosePanelProp();
        } else {
            // Fallback para quando não há prop
            setPanelClosingLocal(true)
            setPanelOpeningLocal(false)
        }
    }
    return (
        <>
            <Button variant="outline" onClick={handleOpen}>
                Ver Todas
            </Button>
            {(showPanel || panelClosing) && (
                <div className={`z-50 bg-deaf fixed inset-0 l transition-transform duration-300 ease-in-out overflow-hidden ${panelOpening && !panelClosing ? 'translate-y-0' : 'translate-y-full'}`}>
                    <div className="container py-8 relative"
                    onTransitionEnd={() => {
                        if (panelClosing) {
                            if (handleTransitionEndProp) {
                                handleTransitionEndProp();
                            } else {
                                // Fallback para quando não há prop
                                setPanelClosingLocal(false);
                                setShowPanelLocal(false);
                                setPanelOpeningLocal(false);
                            }
                        }}}>
                        <button
                            className="body-14-medium text-brown hover:bg-muted flex items-center gap-2 px-1.5 py-1"
                            onClick={handleClosePanel}
                            disabled={panelClosing}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M5.16725 9.12965L2.19555 5.80428L5.16336 2.5M2 5.81495H11.0427C12.676 5.81495 14 7.31142 14 9.1575C14 11.0035 12.676 12.5 11.0427 12.5H7.38875" stroke="currentColor" strokeWidth="1.5" />
                            </svg>Voltar
                        </button>
                        <div className="h-full">
                            <div className="grid grid-cols-12">
                                <p className="col-start-1 col-end-4 text-end text-brown body-18-medium">Cozinha</p>
                                <div className="grid-rows-2 col-start-6 col-end-13 gap-4">
                                    <div className="row-start-1 row-end-3 h-[406px] bg-red col-span-2">s</div>
                                    <div className="grid grid-col-2 gap-4">
                                        <div className="col-span-2 h-[406px] bg-red">s</div>
                                        <div className="h-[406px] bg-red">s</div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}