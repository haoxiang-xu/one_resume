import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  pointerWithin,
  rectIntersection,
  useDroppable,
  useSensor,
  useSensors,
  MeasuringStrategy,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/**
 * Chrome-like Tabs with:
 * - Smooth reordering
 * - Multiple lists (containers)
 * - Magnetic snap into nearby list
 * - Slight tilt based on drag speed (approx)
 */

// ---------- utils ----------
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

function findContainerId(itemsByContainer, id) {
  if (!id) return null;
  if (itemsByContainer[id]) return id; // container id
  for (const cid of Object.keys(itemsByContainer)) {
    if (itemsByContainer[cid].some((t) => t.id === id)) return cid;
  }
  return null;
}

function distancePointToRect(px, py, rect) {
  const dx =
    px < rect.left ? rect.left - px : px > rect.right ? px - rect.right : 0;
  const dy =
    py < rect.top ? rect.top - py : py > rect.bottom ? py - rect.bottom : 0;
  return Math.hypot(dx, dy);
}

function inflateRect(rect, pad) {
  return {
    left: rect.left - pad,
    right: rect.right + pad,
    top: rect.top - pad,
    bottom: rect.bottom + pad,
    width: rect.width + pad * 2,
    height: rect.height + pad * 2,
  };
}

// ---------- Tab component ----------
function Tab({ id, label, index, isOverlay = false, tiltDeg = 0, getZIndex }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  // Chrome-tab-ish overlap: negative margin-left for all but first
  const overlap = 12;
  const baseZ = getZIndex?.(index) ?? index;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 9999 : baseZ,
    marginLeft: index === 0 ? 0 : -overlap,
    cursor: isOverlay ? "grabbing" : "grab",
    // subtle scale like Chrome dragging
    ...(isDragging && !isOverlay ? { opacity: 0.25 } : null),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="tabWrap"
      {...attributes}
      {...listeners}
    >
      <div
        className={`tab ${isDragging && !isOverlay ? "tabGhost" : ""} ${
          isOverlay ? "tabOverlay" : ""
        }`}
        style={isOverlay ? { transform: `rotate(${tiltDeg}deg)` } : undefined}
      >
        <span className="tabTitle">{label}</span>
        <button
          className="tabClose"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // demo: no-op (你可以在外面传 onClose)
          }}
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
}

// ---------- Container (tab strip) ----------
function TabStrip({ id, title, items, containerRefMap }) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { type: "container" },
  });

  // store DOM ref so we can compute magnetic snapping by container rect
  const refCb = (node) => {
    setNodeRef(node);
    containerRefMap.current[id] = node;
  };

  return (
    <div className="stripBlock">
      <div className="stripTitle">{title}</div>
      <div ref={refCb} className={`strip ${isOver ? "stripOver" : ""}`}>
        <SortableContext
          items={items.map((t) => t.id)}
          strategy={horizontalListSortingStrategy}
        >
          {items.map((t, idx) => (
            <Tab
              key={t.id}
              id={t.id}
              label={t.label}
              index={idx}
              getZIndex={(i) => i + 1}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

// ---------- App ----------
export default function App() {
  const [itemsByContainer, setItemsByContainer] = useState(() => ({
    left: [
      { id: "t1", label: "YouTube" },
      { id: "t2", label: "GitHub" },
      { id: "t3", label: "Docs" },
      { id: "t4", label: "SAP" },
    ],
    right: [
      { id: "t5", label: "Jira" },
      { id: "t6", label: "Calendar" },
      { id: "t7", label: "Mail" },
    ],
  }));

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Chrome 느낌：轻微拖动才触发，减少误触
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor)
  );

  const containerRefMap = useRef({});
  const containerRectsRef = useRef({});
  const lastPointerRef = useRef({ x: 0, y: 0, t: 0 });
  const velocityRef = useRef({ vx: 0, vy: 0 });

  const [activeId, setActiveId] = useState(null);
  const [activeFromContainer, setActiveFromContainer] = useState(null);

  // magnetic overlay offset: pull overlay toward strip centerline when near
  const [magnetDY, setMagnetDY] = useState(0);
  const magnetTargetRef = useRef(0);

  const [tiltDeg, setTiltDeg] = useState(0);

  const activeTab = useMemo(() => {
    if (!activeId) return null;
    for (const cid of Object.keys(itemsByContainer)) {
      const found = itemsByContainer[cid].find((t) => t.id === activeId);
      if (found) return found;
    }
    return null;
  }, [activeId, itemsByContainer]);

  // Measure container rects (for magnetic snapping)
  const measureContainerRects = () => {
    const rects = {};
    for (const [cid, node] of Object.entries(containerRefMap.current)) {
      if (!node) continue;
      const r = node.getBoundingClientRect();
      rects[cid] = r;
    }
    containerRectsRef.current = rects;
  };

  useLayoutEffect(() => {
    measureContainerRects();
    const onResize = () => measureContainerRects();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Custom collision detection:
  // 1) Prefer pointerWithin (natural)
  // 2) If not inside any, use expanded container rects (magnet zone)
  // 3) fallback to rectIntersection/closestCenter
  const collisionDetection = (args) => {
    const pointerHits = pointerWithin(args);
    if (pointerHits?.length) return pointerHits;

    // magnetic: if pointer is near a container rect (inflated),
    // treat it as "over" that container so it snaps in easier
    const { active, collisionRect } = args;
    const px = lastPointerRef.current.x;
    const py = lastPointerRef.current.y;

    const rects = containerRectsRef.current;
    const MAGNET_PAD = 80; // 磁吸范围（越大越“吸”）
    let best = null;

    for (const cid of Object.keys(rects)) {
      const r = rects[cid];
      if (!r) continue;
      const inflated = inflateRect(r, MAGNET_PAD);
      const inside =
        px >= inflated.left &&
        px <= inflated.right &&
        py >= inflated.top &&
        py <= inflated.bottom;

      if (inside) {
        const dist = distancePointToRect(px, py, r);
        if (!best || dist < best.dist) best = { cid, dist };
      }
    }

    if (best) {
      // return a "collision" that points to the container id
      return [{ id: best.cid, data: { value: best.dist } }];
    }

    // fallback
    const intersections = rectIntersection(args);
    if (intersections?.length) return intersections;
    return closestCenter(args);
  };

  const onDragStart = (event) => {
    const id = event.active.id;
    setActiveId(id);

    const fromCid = findContainerId(itemsByContainer, id);
    setActiveFromContainer(fromCid);

    // ensure fresh rects
    measureContainerRects();

    // reset motion
    magnetTargetRef.current = 0;
    setMagnetDY(0);
    setTiltDeg(0);
    velocityRef.current = { vx: 0, vy: 0 };
    lastPointerRef.current = {
      ...lastPointerRef.current,
      t: performance.now(),
    };
  };

  const onDragMove = (event) => {
    // Track pointer & approximate velocity -> small tilt
    const ev = event.activatorEvent;
    const now = performance.now();

    let x = lastPointerRef.current.x;
    let y = lastPointerRef.current.y;

    if (ev && "clientX" in ev && "clientY" in ev) {
      x = ev.clientX;
      y = ev.clientY;
      const dt = Math.max(8, now - (lastPointerRef.current.t || now));
      const vx = (x - (lastPointerRef.current.x || x)) / dt;
      const vy = (y - (lastPointerRef.current.y || y)) / dt;
      velocityRef.current = { vx, vy };
      lastPointerRef.current = { x, y, t: now };
    } else {
      // fallback: keep last pointer
      lastPointerRef.current = { ...lastPointerRef.current, t: now };
    }

    const speedX = velocityRef.current.vx; // px/ms
    const targetTilt = clamp(speedX * 18, -8, 8); // tune feel
    setTiltDeg((prev) => prev + (targetTilt - prev) * 0.25);

    // Magnetic "pull to strip centerline" for overlay
    const rects = containerRectsRef.current;
    const MAGNET_PAD = 80;
    let nearest = null;

    for (const cid of Object.keys(rects)) {
      const r = rects[cid];
      if (!r) continue;

      const inflated = inflateRect(r, MAGNET_PAD);
      const inside =
        x >= inflated.left &&
        x <= inflated.right &&
        y >= inflated.top &&
        y <= inflated.bottom;

      if (!inside) continue;

      // prefer closest real rect
      const dist = distancePointToRect(x, y, r);
      if (!nearest || dist < nearest.dist) nearest = { cid, dist, rect: r };
    }

    if (nearest) {
      // pull Y toward centerline of strip (Chrome tab strip feel)
      const centerY = nearest.rect.top + nearest.rect.height / 2;
      const dy = clamp((centerY - y) * 0.35, -16, 16);
      magnetTargetRef.current = dy;
    } else {
      magnetTargetRef.current = 0;
    }

    setMagnetDY((prev) => prev + (magnetTargetRef.current - prev) * 0.2);
  };

  const onDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeItemId = active.id;
    const overId = over.id;

    const fromCid = findContainerId(itemsByContainer, activeItemId);
    const toCid = findContainerId(itemsByContainer, overId);

    if (!fromCid || !toCid) return;

    // ✅ 关键改动 1：如果 over 的是 container 本身（list 空白区域 / 拖出时磁吸命中 container）
    // 不要把它当成“插到最后”，直接什么都不做
    if (itemsByContainer[overId]) {
      return;
    }

    if (fromCid === toCid) {
      // reorder within same strip（只有 over 到具体 tab 才 reorder）
      const fromIndex = itemsByContainer[fromCid].findIndex(
        (t) => t.id === activeItemId
      );
      const overIndex = itemsByContainer[toCid].findIndex(
        (t) => t.id === overId
      );

      if (fromIndex !== overIndex) {
        setItemsByContainer((prev) => ({
          ...prev,
          [fromCid]: arrayMove(prev[fromCid], fromIndex, overIndex),
        }));
      }
      return;
    }

    // ✅ 关键改动 2：跨 strip 时，也只在 over 到具体 tab 才移动
    setItemsByContainer((prev) => {
      const fromItems = [...prev[fromCid]];
      const toItems = [...prev[toCid]];

      const fromIndex = fromItems.findIndex((t) => t.id === activeItemId);
      if (fromIndex === -1) return prev;

      const overIndex = toItems.findIndex((t) => t.id === overId);
      if (overIndex === -1) {
        // over 不是具体 tab（理论上不会走到这里了，但保守一下）
        return prev;
      }

      const [moved] = fromItems.splice(fromIndex, 1);
      toItems.splice(overIndex, 0, moved);

      return {
        ...prev,
        [fromCid]: fromItems,
        [toCid]: toItems,
      };
    });
  };

  const onDragEnd = (event) => {
    const { active, over } = event;

    // If dropped outside any container: return to origin
    if (!over) {
      const id = active.id;
      const fromCid = activeFromContainer;
      if (fromCid) {
        // Ensure it still exists somewhere; if moved away during over, bring back
        setItemsByContainer((prev) => {
          const currentCid = findContainerId(prev, id);
          if (!currentCid) return prev;

          if (currentCid === fromCid) return prev;

          const currentItems = [...prev[currentCid]];
          const idx = currentItems.findIndex((t) => t.id === id);
          if (idx === -1) return prev;
          const [moved] = currentItems.splice(idx, 1);

          const backItems = [...prev[fromCid], moved];
          return { ...prev, [currentCid]: currentItems, [fromCid]: backItems };
        });
      }
    }

    setActiveId(null);
    setActiveFromContainer(null);
    magnetTargetRef.current = 0;
    setMagnetDY(0);
    setTiltDeg(0);
  };

  return (
    <div className="page">
      <style>{styles}</style>

      <div className="header">
        <div className="logoDot" />
        <div className="headerText">
          <div className="h1">Chrome-like Tabs (dnd-kit)</div>
          <div className="h2">多列表拖拽 + 顺滑补位动画 + 磁吸靠近效果</div>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetection}
        measuring={{
          droppable: { strategy: MeasuringStrategy.Always },
        }}
        onDragStart={onDragStart}
        onDragMove={onDragMove}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
        onDragCancel={() => {
          setActiveId(null);
          setActiveFromContainer(null);
          magnetTargetRef.current = 0;
          setMagnetDY(0);
          setTiltDeg(0);
        }}
      >
        <div className="board">
          <TabStrip
            id="left"
            title="Window A"
            items={itemsByContainer.left}
            containerRefMap={containerRefMap}
          />
          <TabStrip
            id="right"
            title="Window B"
            items={itemsByContainer.right}
            containerRefMap={containerRefMap}
          />
        </div>

        <DragOverlay dropAnimation={null}>
          {activeTab ? (
            // inner wrapper adds magnetic pull + tilt without fighting overlay positioning
            <div style={{ transform: `translate3d(0, ${magnetDY}px, 0)` }}>
              <div style={{ transform: `rotate(${tiltDeg}deg)` }}>
                <div className="tabWrap" style={{ marginLeft: 0 }}>
                  <div className="tab tabOverlay">
                    <span className="tabTitle">{activeTab.label}</span>
                    <button className="tabClose" aria-label="Close">
                      ×
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <div className="tips">
        <div className="tipTitle">可调参数（想更“像 Chrome”可以改这里）</div>
        <ul>
          <li>
            <code>MAGNET_PAD</code>：磁吸范围（更大更吸）
          </li>
          <li>
            <code>overlap</code>：tab 之间重叠程度
          </li>
          <li>
            <code>activationConstraint.distance</code>
            ：按下后移动多少才开始拖（减少误触）
          </li>
          <li>
            <code>targetTilt</code>：拖动时的轻微倾斜幅度
          </li>
        </ul>
      </div>
    </div>
  );
}

// ---------- styles ----------
const styles = `
  * { box-sizing: border-box; }
  body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; background: #0b0f17; color: #e7eefc; }
  code { background: rgba(255,255,255,0.08); padding: 2px 6px; border-radius: 6px; }

  .page { padding: 24px; max-width: 1100px; margin: 0 auto; }
  .header { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; }
  .logoDot { width: 12px; height: 12px; border-radius: 999px; background: #6ea8ff; box-shadow: 0 0 0 6px rgba(110,168,255,0.14); }
  .h1 { font-size: 18px; font-weight: 700; }
  .h2 { font-size: 13px; opacity: 0.8; margin-top: 2px; }

  .board { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
  .stripBlock { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 14px; box-shadow: 0 10px 30px rgba(0,0,0,0.35); }
  .stripTitle { font-size: 12px; opacity: 0.8; margin-bottom: 10px; }
  .strip {
    display: flex;
    align-items: center;
    padding: 10px;
    height: 56px;
    border-radius: 12px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    overflow: hidden;
  }
  .stripOver {
    border-color: rgba(110,168,255,0.55);
    box-shadow: 0 0 0 4px rgba(110,168,255,0.12) inset;
  }

  .tabWrap { display: inline-flex; align-items: center; }

  /* Chrome-ish tab shape */
  .tab {
    position: relative;
    height: 36px;
    min-width: 110px;
    max-width: 220px;
    padding: 0 34px 0 14px;
    display: inline-flex;
    align-items: center;
    border-radius: 12px 12px 10px 10px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.10);
    box-shadow: 0 6px 18px rgba(0,0,0,0.28);
    user-select: none;
    white-space: nowrap;
    overflow: hidden;
    transform-origin: 50% 70%;
    transition: box-shadow 160ms ease, background 160ms ease;
  }

  .tab::before,
  .tab::after {
    content: "";
    position: absolute;
    top: 0;
    width: 16px;
    height: 100%;
    background: inherit;
    border-top: 1px solid rgba(255,255,255,0.10);
    border-bottom: 1px solid rgba(255,255,255,0.10);
    opacity: 0.9;
  }
  .tab::before {
    left: -10px;
    transform: skewX(-18deg);
    border-left: 1px solid rgba(255,255,255,0.10);
    border-radius: 12px 0 0 10px;
  }
  .tab::after {
    right: -10px;
    transform: skewX(18deg);
    border-right: 1px solid rgba(255,255,255,0.10);
    border-radius: 0 12px 10px 0;
  }

  .tabTitle { font-size: 13px; opacity: 0.95; text-overflow: ellipsis; overflow: hidden; }
  .tabClose {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    width: 22px;
    height: 22px;
    border-radius: 999px;
    border: none;
    background: rgba(255,255,255,0.10);
    color: rgba(255,255,255,0.8);
    cursor: pointer;
  }
  .tabClose:hover { background: rgba(255,255,255,0.16); }

  .tab:hover {
    background: rgba(255,255,255,0.10);
    box-shadow: 0 10px 24px rgba(0,0,0,0.32);
  }

  .tabGhost { filter: saturate(0.7); }
  .tabOverlay {
    background: rgba(110,168,255,0.18);
    border-color: rgba(110,168,255,0.30);
    box-shadow: 0 14px 40px rgba(0,0,0,0.45);
  }

  .tips {
    margin-top: 18px;
    padding: 14px 14px;
    border-radius: 14px;
    background: rgba(255,255,255,0.035);
    border: 1px solid rgba(255,255,255,0.08);
  }
  .tipTitle { font-size: 13px; font-weight: 700; margin-bottom: 8px; }
  .tips ul { margin: 0; padding-left: 18px; opacity: 0.9; }
  .tips li { margin: 6px 0; font-size: 13px; }
`;
