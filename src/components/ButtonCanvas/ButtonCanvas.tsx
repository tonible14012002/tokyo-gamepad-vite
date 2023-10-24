import { ReactP5Wrapper } from "@/lib/P5Canvas"
import { InputProps } from "@/lib/P5Canvas/type"
import { ButtonSketcherProps, buttonSketcher } from "./buttonSketcher"

export function ButtonCanvas (props: InputProps<ButtonSketcherProps> ) {

    return (
        <ReactP5Wrapper
            sketch={buttonSketcher}
            {...props}
        />
    )
}