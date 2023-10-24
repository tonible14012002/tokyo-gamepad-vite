import { SketchProps, Sketcher } from "@/lib/P5Canvas/type";
import { createAutoResizeSketcher, createAutoUpdatePropsSketcher, createMobileTouchManagerSketcher } from "@/lib/P5Canvas/utils";

export interface JoystickStatus {
  distance: number
  maxDistance: number
  direcVector: {
    x: number
    y: number
  }
}

interface joystickSketcherProps extends SketchProps {
  lockScreen?: boolean
  onStart?: (_: JoystickStatus) => void
  onMove?: (_: JoystickStatus) => void
  onStop?: (_: JoystickStatus) => void
}

export const joystickSketcher:Sketcher<joystickSketcherProps> = 
createAutoUpdatePropsSketcher(
  createAutoResizeSketcher(
    createMobileTouchManagerSketcher(
      (p5) => {
        const joystickSizeRatio = 1/3

        // // Joystick
        const joystickPos = p5.createVector(0, 0)
        let joystickSize = 0

        // Joystick thumb
        const joystickThumbPos = p5.createVector(0, 0)
        let joystickThumbSize = 0

        p5.registerTouchHandler?.({
          key: "joystick_touched",
          activator(pos) {
            return true
            return pos.dist(joystickPos) < joystickSize / 2
          },
          onStart: () => {
            p5.props?.onStart?.(getJoystickStatus())
          },
          onDrag(pos) {
            console.log(pos, joystickPos)
            const joystickCenterPos = joystickPos.copy()
            const distanceToCenter = pos.dist(joystickCenterPos) // correct

            if (distanceToCenter > joystickSize/2 * (1-joystickSizeRatio)) {
              const ratio = (joystickSize / 2) * (1-joystickSizeRatio) / distanceToCenter // 

              joystickThumbPos.set(pos.copy().sub(joystickCenterPos).mult(ratio).add(joystickPos.copy()))
            } else {
              joystickThumbPos.set(pos)
            }
            p5.props?.onMove?.(getJoystickStatus())
          },
          onLeave: () => {
            joystickThumbPos.set(
              p5.width / 2,
              p5.height / 2
            )
            p5.props?.onStop?.(getJoystickStatus())
          }
        })

        p5.draw = () => {
          p5.background(0, 0)
          p5.ellipseMode(p5.CENTER)
          p5.circle(joystickPos.x, joystickPos.y, joystickSize)
          p5.circle(joystickThumbPos.x, joystickThumbPos.y, joystickThumbSize)
        }

        // Prevent screen move while dragging
        p5.touchMoved = () => {
          if (p5.props?.lockScreen) {
            return false
          }
        }

        p5.onWrapperResize = (_: number, __: number) => {
          updateJoystickPos()
        }

        function updateJoystickPos () {
          joystickSize = p5.min([p5.width * 2/3, p5.height * 2/3])
          joystickThumbSize = joystickSize * joystickSizeRatio
          joystickPos.set(
            p5.width/2,
            p5.height/2
          )
          joystickThumbPos.set(
            p5.width/2,
            p5.height/2
          )
        }

        function getJoystickStatus () {
          const distance = joystickThumbPos.dist(joystickPos)
          const maxDistance = joystickSize / 2 * (1 - joystickSizeRatio)
          if (distance == 0 ) {
            return {
              distance, 
              maxDistance,
              direcVector: {x: 0, y: 0}
            }
          }
          const { x, y } = joystickThumbPos.copy().sub(joystickPos).div(distance)
          return ({
            distance, 
            maxDistance,
            direcVector: {
              x: x,
              y: y
            }
          })
        }
      }
    )
  )
)
