const PlaywrightDemo = () => {
  const downloadPdf = async () => {
    const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; }
    .card { border: 1px solid #ddd; border-radius: 12px; padding: 16px; }
    h1 { margin: 0 0 8px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Hello PDF</h1>
    <div>这段 HTML/CSS 会在 Flask 里渲染成 PDF</div>
  </div>
</body>
</html>`;

    const resp = await fetch("http://localhost:8888/api/resume/build_pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html }),
    });

    if (!resp.ok) throw new Error("PDF failed");

    const blob = await resp.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-page.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  return <button onClick={downloadPdf}>下载成 PDF</button>;
};

export default PlaywrightDemo;
