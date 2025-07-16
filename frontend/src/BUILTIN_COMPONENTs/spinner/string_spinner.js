import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';

// 生成振动弦的 SVG 路径
function generatePath(n, t, options) {
  const { R = 50, A0 = 10, omega = 1, cx = 100, cy = 100, points = 100 } = options;
  const A = A0 * Math.sin(omega * t);
  let path = `M `;
  for (let i = 0; i <= points; i++) {
    const theta = (i / points) * 2 * Math.PI;
    const r = R + A * Math.cos(n * theta);
    const x = cx + r * Math.cos(theta);
    const y = cy + r * Math.sin(theta);
    path += `${x},${y} `;
    if (i < points) path += `L `;
  }
  path += `Z`;
  return path;
}

function StringSpinner() {
  const [n, setN] = useState(0); // 默认 n=0
  const [amplitude, setAmplitude] = useState(10); // 可调整的幅度参数

  // 动画 t 从 0 到 2π 循环
  const props = useSpring({
    from: { t: 0 },
    to: { t: 2 * Math.PI },
    loop: true,
    config: { duration: 1000 }, // 每秒一个循环
  });

  // 计算动画路径
  const d = props.t.to((t) => generatePath(n, t, { R: 50, A0: amplitude, omega: 1, cx: 100, cy: 100, points: 100 }));

  return (
    <div style={{ textAlign: 'center' }}>
      <label>
        调整 n (0-5):
        <input
          type="range"
          min="0"
          max="5"
          step="1"
          value={n}
          onChange={(e) => setN(parseInt(e.target.value))}
        />
      </label>
      <label>
        调整幅度 (5-20):
        <input
          type="range"
          min="5"
          max="20"
          value={amplitude}
          onChange={(e) => setAmplitude(parseInt(e.target.value))}
        />
      </label>
      <svg width="200" height="200">
        <defs>
          {/* 发光效果滤镜 */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <animated.path
          d={d}
          fill="none" // 移除填充
          stroke="white"
          strokeWidth="2"
          filter="url(#glow)"
        />
      </svg>
    </div>
  );
}

export default StringSpinner;