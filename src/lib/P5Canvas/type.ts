import type p5 from "p5";
import { HTMLProps, PropsWithChildren, ReactNode } from "react";
import { Vector } from "p5";

export type SketchProps = {
  [key: string]: unknown
}

export type AutoResizeSketchProps<Props extends SketchProps = SketchProps> = Props & {
  onLoad?: (_: P5CanvasInstance<Props>) => void
  onResize?: (_: number, __: number) => void
}

export type  P5Wrapper= HTMLDivElement

// Basic P5 Canva
export type P5CanvasInstance<Props extends SketchProps = SketchProps> = p5 & {
  updateWithProps?: (_: Props) => void
  wrapper?: P5Wrapper
  onWrapperResize?: (_: number, __: number) => void
  props?: Props
}

export type MobileTouchP5CanvasInstance<Props extends SketchProps=SketchProps> = P5CanvasInstance<Props> & {
  registerTouchHandler?: (_: TouchHandler) => void
}

export type AutoUpdatePropsP5CanvasInstance<Props extends SketchProps=SketchProps> = P5CanvasInstance<Props> & {
  props?: Props
}

export type Sketcher<Props extends SketchProps=SketchProps> = (_: P5CanvasInstance<Props>) => void
export type AutoResizeEnhancedSketcher<Props extends AutoResizeSketchProps=AutoResizeSketchProps> = Sketcher<AutoResizeSketchProps<Props>>
export type MobileTouchEnhancedSketcher<Props extends SketchProps=SketchProps> = (_: MobileTouchP5CanvasInstance<Props>) => void
export type AutoUpdatePropsEnhacnedSKetcher<Props extends SketchProps=SketchProps> = (_: AutoUpdatePropsP5CanvasInstance<Props>) => void

export type InputProps<Props extends SketchProps = SketchProps> = Props & {
  sketch?: Sketcher<Props>;
  fallback?: ReactNode;
  wrapperProps?: HTMLProps<P5Wrapper>
}

// for P5Wrapper
export type P5WrapperProps<Props extends SketchProps = SketchProps> =
  PropsWithChildren<InputProps<Props>>;

// for P5WrapperGuard
export type P5WrapperPropsWithSketch<Props extends SketchProps = SketchProps> =
  P5WrapperProps<Props> & { sketch: Sketcher<Props> };

export type TouchHandler = {
  key: string,
  activator: (_: Vector) => boolean,
  onLeave?: (_: Vector) => void,
  onStart?: (_: Vector) => void,
  onDrag?: (_: Vector) => void
}

export interface P5Touch {
  id: number
  x: number
  y: number 
  winX: number
  winY: number
}

