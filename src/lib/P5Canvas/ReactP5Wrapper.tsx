import { memo, useEffect, useMemo, useRef } from "react"
import { P5CanvasInstance, P5Wrapper, P5WrapperProps, P5WrapperPropsWithSketch, SketchProps } from "./type";
import { createCanvasInstance, propsAreEqual, removeCanvasInstance } from "./utils";
import { cn } from "@/lib/utils";

export const ReactP5Wrapper = memo(ReactP5WrapperGuard, propsAreEqual);

export function ReactP5WrapperGuard<Props extends SketchProps = SketchProps>(
  props: P5WrapperProps<Props>
) {
  const { sketch, fallback } = props;

  if (sketch === undefined) {
    console.error("[ReactP5Wrapper] The `sketch` prop is required.");

    return fallback !== undefined ? <>{fallback}</> : null;
  }

  return (
    <ReactP5WrapperWithSketch
      /** @see https://github.com/P5-wrapper/react/issues/207 */
      {...(props as unknown as P5WrapperPropsWithSketch<Props>)}
    />
  );
}

export function ReactP5WrapperWithSketch<
  Props extends SketchProps = SketchProps
>(props: P5WrapperPropsWithSketch<Props>) {
  const { sketch, children, wrapperProps, ...rest } = props;
  const wrapperRef = useRef<P5Wrapper | null>(null);
  const canvasInstanceRef = useRef<P5CanvasInstance<Props> | null>(null);
  const handleResize = useRef<(_: number, __: number) => void>()

  const resizeObserver = useMemo(() => new ResizeObserver(entries => {
    // NOTE: Make p5js Sketcher auto resize when the parent Element resized
    handleResize.current?.(entries[0].contentRect.width, entries[0].contentRect.height)
  }), [handleResize])


  useEffect(() => {
    if (wrapperRef.current === null) {
      return;
    }
    // Listen on Resize Event
    resizeObserver.observe(wrapperRef.current)

    removeCanvasInstance(canvasInstanceRef);
    canvasInstanceRef.current = createCanvasInstance(
      sketch,
      wrapperRef.current
    );
    canvasInstanceRef.current.wrapper = wrapperRef.current
    handleResize.current = canvasInstanceRef.current.onWrapperResize
  }, [resizeObserver, sketch]);

  useEffect(() => {
    /** @see https://github.com/P5-wrapper/react/issues/207 */
    canvasInstanceRef.current?.updateWithProps?.(rest as unknown as Props);
    // pass new Props to Sketcher when Props changed
  }, [rest]);

  useEffect(() => () => {
    removeCanvasInstance(canvasInstanceRef)
    if (wrapperRef.current) {
      resizeObserver.unobserve(wrapperRef.current)
    }
  }, [resizeObserver]);

  return (
    <div ref={wrapperRef} className={cn("h-full w-full", wrapperProps?.className ?? "")}
      {...wrapperProps}
    >
      {children}
    </div>
  );
}
