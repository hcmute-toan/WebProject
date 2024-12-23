
document.addEventListener("DOMContentLoaded", () => {
  const { jsPDF } = window.jspdf;

  function ensureImagesLoaded(container, callback) {
    const images = container.querySelectorAll("img");
    const totalImages = images.length;
    let loadedCount = 0;

    if (totalImages === 0) {
      callback();
      return;
    }

    images.forEach((img) => {
      if (img.complete) {
        loadedCount++;
        if (loadedCount === totalImages) callback();
      } else {
        img.onload = img.onerror = () => {
          loadedCount++;
          if (loadedCount === totalImages) callback();
        };
      }
    });
  }

  const downloadBtn = document.getElementById("download-btn");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      const articleContainer = document.querySelector(".article-container");
      const title = document.querySelector(".article-header").innerText; // Lấy tiêu đề bài viết

      // Tạm thời ẩn nút Download PDF
      downloadBtn.style.display = "none";

      ensureImagesLoaded(articleContainer, () => {
        html2canvas(articleContainer, { useCORS: true }).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");

          const doc = new jsPDF({
            orientation: "portrait",
            unit: "px",
            format: "a4",
          });

          const pdfWidth = doc.internal.pageSize.getWidth();
          const pdfHeight = doc.internal.pageSize.getHeight();
          const imgWidth = canvas.width;
          const imgHeight = canvas.height;

          const scaleFactor = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
          const scaledWidth = imgWidth * scaleFactor;
          const scaledHeight = imgHeight * scaleFactor;

          doc.addImage(imgData, "PNG", 0, 0, scaledWidth, scaledHeight);

          const sanitizedTitle = title.replace(/[^a-zA-Z0-9-_ ]/g, "");
          doc.save(`${sanitizedTitle || "article"}.pdf`);

          // Hiển thị lại nút Download PDF
          downloadBtn.style.display = "block";
        });
      });
    });
  }
});
