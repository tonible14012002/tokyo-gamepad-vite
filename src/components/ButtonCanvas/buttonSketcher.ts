import { SketchProps, Sketcher } from "@/lib/P5Canvas/type";
import { createAutoResizeSketcher, createAutoUpdatePropsSketcher, createMobileTouchManagerSketcher } from "@/lib/P5Canvas/utils";

export interface ButtonSketcherProps extends SketchProps {
    onPressed?: () => void
    onReleased?: () => void
}

export const buttonSketcher: Sketcher<ButtonSketcherProps> = 
createAutoUpdatePropsSketcher(
    createAutoResizeSketcher(
        createMobileTouchManagerSketcher((p5) => {
            p5.registerTouchHandler?.({
                key: "Button",
                // Touch everywhere in the canvas to active
                activator: () => true ,
                onStart(){
                    p5.props?.onPressed?.()
                },
                onLeave() {
                    p5.props?.onReleased?.()
                }
            })
            p5.draw = () => {
                // Background transparent
                p5.background(0, 0)
            }
        })
    )
)