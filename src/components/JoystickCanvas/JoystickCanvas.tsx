import { ReactP5Wrapper } from "@/lib/P5Canvas"
import { joystickP5Sketcher, type JoystickSketcherProps  } from "./joystickP5Sketcher"
import { InputProps } from "@/lib/P5Canvas/type"

export function JoystickCanvas (props: InputProps<JoystickSketcherProps> ) {
    return (
        <ReactP5Wrapper
            sketch={joystickP5Sketcher}
            {...props}
        />
    )
}