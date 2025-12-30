import {
  createContext,
  useState,
  useCallback,
  useEffect,
  useContext,
  useRef,
  cloneElement,
  isValidElement,
} from "react";
import { useMouse } from "./mini_react.js";
import VanillaTilt from "vanilla-tilt";

/* { Contexts } -------------------------------------------------------------------------------------------------------------- */
const DnDContext = createContext();
/* { Contexts } -------------------------------------------------------------------------------------------------------------- */

const Draggable = ({
  render = () => {
    return <div></div>;
  },
  tilt = false,
  tilt_config = {
    vanilla_max_deg: 10,
    x_max_deg: 30,
    y_max_deg: 30,
    z_max_deg: 20,
  },
  scale = 1.05,
}) => {
  const {
    draggableComponentRender,
    setDraggableSize,
    setDraggableComponentRender,
    setDraggableInnerPosition,
    setDraggableOutterPosition,
    setDraggableConfig,
  } = useContext(DnDContext);
  const tiltRef = useRef(null);
  const hasCapturedRef = useRef(false);

  const initialize_draggable_component_render = useCallback(() => {
    setDraggableComponentRender(render());
  }, [render, setDraggableComponentRender]);
  const capturePosition = (e) => {
    const rect = (
      e.target instanceof Element ? e.target : e.currentTarget
    ).getBoundingClientRect();
    hasCapturedRef.current = true;
    setDraggableInnerPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setDraggableOutterPosition({
      x: rect.left,
      y: rect.top,
    });
    setDraggableConfig({ tilt, tilt_config, scale });
    setDraggableSize({ width: rect.width, height: rect.height });
    initialize_draggable_component_render();
  };
  const handleDragStart = (e) => {
    if (!hasCapturedRef.current) {
      capturePosition(e);
    } else {
      initialize_draggable_component_render();
    }
  };

  useEffect(() => {
    if (!tiltRef.current) return;
    if (tilt !== true) return;
    VanillaTilt.init(tiltRef.current, {
      reverse: true,
      reset: true,
      max: tilt_config.vanilla_max_deg,
      scale: scale,
    });
  }, [scale, tilt_config, tiltRef]);
  useEffect(() => {
    if (draggableComponentRender === null) {
      hasCapturedRef.current = false;
    }
  }, [draggableComponentRender]);

  return (
    <div onMouseDown={handleDragStart} style={{ cursor: "grab" }}>
      {(() => {
        const rendered_component = render();
        if (isValidElement(rendered_component)) {
          return cloneElement(rendered_component, { ref: tiltRef });
        }
        return <div ref={tiltRef}>{rendered_component}</div>;
      })()}
    </div>
  );
};
const Droppable = ({ draggables, style, draggable_style }) => {
  return (
    <div style={{ ...(style || {}) }}>
      {draggables && draggables.length > 0
        ? draggables.map((item, index) => {
            return (
              <Draggable
                key={index}
                render={() => {
                  const rendered_component = item.render();
                  if (isValidElement(rendered_component)) {
                    const merged_style = {
                      ...(rendered_component.props.style || {}),
                      ...(draggable_style || {}),
                    };
                    return cloneElement(rendered_component, {
                      style: merged_style,
                    });
                  } else {
                    return (
                      <div style={draggable_style}>{rendered_component}</div>
                    );
                  }
                }}
                tilt={item.tilt}
                scale={item.scale}
              />
            );
          })
        : null}
    </div>
  );
};
const DnDGhost = ({ debug = false }) => {
  const mouse = useMouse();
  const {
    draggableSize,
    draggableInnerPosition,
    draggableComponentRender,
    draggableConfig,
    setDraggableComponentRender,
    setDraggableInnerPosition,
    setDraggableOutterPosition,
  } = useContext(DnDContext);

  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [ghostComponent, setGhostComponent] = useState(null);

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const normTanh = (v, vAtMax = 1200) => Math.tanh(v / vAtMax);
  const velocityToDegTanh = (v, { maxDeg = 18, vAtMax = 1200 } = {}) => {
    const normalized = Math.tanh(v / vAtMax);
    return normalized * maxDeg;
  };
  const computeRotateZ = (
    vx,
    vy,
    originPct,
    size,
    {
      maxDeg = 10, // rotateZ 最大角度一般别太大，3~12之间舒服
      vAtMax = 1400, // 速度到这附近基本饱和
      lever = 1.0, // “抓角落更容易拧”的倍率
    } = {}
  ) => {
    if (!size?.width || !size?.height) return 0;

    const ox = originPct.x / 100 - 0.5;
    const oy = originPct.y / 100 - 0.5;

    // 杠杆长度：离中心越远越大（0~0.707）
    const r = Math.sqrt(ox * ox + oy * oy);
    const leverFactor = 1 + lever * (r / 0.707); // 1..(1+lever)

    // 速度归一化
    const nx = normTanh(vx, vAtMax);
    const ny = normTanh(vy, vAtMax);

    // 扭矩方向：2D 叉积（origin 向量 × 速度向量）
    // z = ox*vy - oy*vx
    const torque = ox * ny - oy * nx;

    // 映射到角度
    const deg = clamp(torque * maxDeg * leverFactor, -maxDeg, maxDeg);
    return deg;
  };
  const smooth = (prev, next, alpha = 0.18) => {
    return prev + (next - prev) * alpha;
  };
  const handle_drag_end = () => {
    setDraggableInnerPosition({ x: 0, y: 0 });
    setDraggableOutterPosition({ x: 0, y: 0 });
    setDraggableComponentRender(null);
  };

  useEffect(() => {
    if (draggableComponentRender) {
      setGhostComponent(() => {
        const ghost_component = draggableComponentRender;
        const mergedStyle = {
          ...(ghost_component.props.style || {}),
          position: "absolute",
          top: 0,
          left: 0,
          margin: 0,
          padding: 0,
          transform: "translate(0%, 0%)",
          width: draggableSize.width,
          height: draggableSize.height,
        };
        if (isValidElement(ghost_component)) {
          return cloneElement(ghost_component, {
            style: mergedStyle,
          });
        } else {
          return <div style={mergedStyle}>{ghost_component}</div>;
        }
      });
    }
  }, [draggableComponentRender]);
  useEffect(() => {
    if (draggableConfig?.tilt === true) {
      if (mouse.vx !== undefined && mouse.vy !== undefined) {
        if (mouse.vx === 0 && mouse.vy === 0) {
          setRotate((prev) => ({
            x: 0,
            y: 0,
            z: 0,
          }));
          return;
        }
        setRotate((prev) => ({
          x: smooth(prev.x, velocityToDegTanh(mouse.vy, { maxDeg: 45 })),
          y: smooth(prev.y, -velocityToDegTanh(mouse.vx, { maxDeg: 45 })),
          z: computeRotateZ(mouse.vx, mouse.vy, origin, draggableSize, {
            maxDeg: 45,
            vAtMax: 1400,
            lever: 1.2,
          }),
        }));
      }
    }
  }, [mouse.vx, mouse.vy, origin, draggableSize, draggableConfig]);
  useEffect(() => {
    setOrigin({
      x: clamp(
        (draggableInnerPosition.x / draggableSize.width) * 100,
        0,
        100
      ).toFixed(2),
      y: clamp(
        (draggableInnerPosition.y / draggableSize.height) * 100,
        0,
        100
      ).toFixed(2),
    });
    setScale(draggableConfig.scale || 1);
  }, [draggableSize, draggableInnerPosition, draggableConfig]);

  return (
    <div
      style={{
        display: ghostComponent ? "inline-block" : "none",
        position: "fixed",
        top: mouse.y - draggableInnerPosition.y,
        left: mouse.x - draggableInnerPosition.x,
        width: draggableSize.width,
        height: draggableSize.height,
        border: debug ? "2px dashed rgba(255, 255, 255, 0.75)" : "none",
        zIndex: 2048,
        transformOrigin: `${origin.x}% ${origin.y}%`,
        transition: "transform 420ms cubic-bezier(0.22, 1.18, 0.36, 1)",
        transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) rotateZ(${rotate.z}deg) scale(${scale})`,
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
      onMouseUp={handle_drag_end}
    >
      {ghostComponent}
      {debug ? (
        <>
          <div
            id={"DnDGhost-debug-x-origin"}
            style={{
              position: "absolute",
              top: `${origin.y}%`,
              left: 0,
              width: "100%",
              height: "2px",
              border: "2px dashed rgba(255, 255, 255, 0.75)",
              opacity: 0.5,
            }}
          ></div>
          <div
            id={"DnDGhost-debug-y-origin"}
            style={{
              position: "absolute",
              top: 0,
              left: `${origin.x}%`,
              width: "2px",
              height: "100%",
              border: "2px dashed rgba(255, 255, 255, 0.75)",
              opacity: 0.5,
            }}
          ></div>
        </>
      ) : null}
    </div>
  );
};
const DnDWrapper = ({ children }) => {
  const [draggableSize, setDraggableSize] = useState({ width: 0, height: 0 });
  const [draggableInnerPosition, setDraggableInnerPosition] = useState({
    x: 0,
    y: 0,
  });
  const [draggableOutterPosition, setDraggableOutterPosition] = useState({
    x: 0,
    y: 0,
  });
  const [draggableComponentRender, setDraggableComponentRender] =
    useState(null);
  const [draggableConfig, setDraggableConfig] = useState({
    tilt: false,
    tilt_config: {
      x_max_deg: 45,
      y_max_deg: 45,
      z_max_deg: 20,
    },
  });

  return (
    <DnDContext.Provider
      value={{
        draggableSize,
        setDraggableSize,
        draggableComponentRender,
        setDraggableComponentRender,
        draggableInnerPosition,
        setDraggableInnerPosition,
        draggableOutterPosition,
        setDraggableOutterPosition,
        draggableConfig,
        setDraggableConfig,
      }}
    >
      {children}
      {draggableComponentRender ? <DnDGhost /> : null}
    </DnDContext.Provider>
  );
};

export { Draggable, Droppable, DnDGhost, DnDWrapper };
