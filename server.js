// 📁 server.js
// ===========================
// Website Kỷ Niệm - Lưu ảnh & video bằng Node.js + Express + Multer
// ===========================

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();

// Cho phép kết nối từ mọi nơi (máy tính, điện thoại...)
app.use(cors());
app.use(express.json());

// Cung cấp quyền truy cập các file tĩnh (HTML, CSS, JS, ảnh/video)
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // thư mục ảnh/video tải lên
app.use(express.static(__dirname)); // ⚠️ dòng quan trọng để hiển thị index.html, style.css, script.js

// ===========================
// Cấu hình nơi lưu file upload
// ===========================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // nơi lưu ảnh/video
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // tên file duy nhất
  },
});

const upload = multer({ storage });

// ===========================
// Dữ liệu kỷ niệm (lưu tạm trên RAM)
// Nếu muốn lưu vĩnh viễn, có thể dùng database sau này
// ===========================
let memories = [];

// ===========================
// API: Upload ảnh/video
// ===========================
app.post("/upload", upload.single("file"), (req, res) => {
  const { title, description } = req.body;
  const file = req.file;

  if (!file) return res.status(400).json({ message: "Không có file!" });

  const memory = {
    id: Date.now(),
    title,
    description,
    filePath: `/uploads/${file.filename}`,
    fileType: file.mimetype,
  };

  memories.push(memory);
  res.json(memory);
});

// ===========================
// API: Lấy danh sách kỷ niệm
// ===========================
app.get("/memories", (req, res) => {
  res.json(memories);
});

// ===========================
// API: Xoá kỷ niệm
// ===========================
app.delete("/memories/:id", (req, res) => {
  const id = parseInt(req.params.id);
  memories = memories.filter((m) => m.id !== id);
  res.json({ message: "Đã xoá!" });
});

// ===========================
// Chạy server (Render tự đặt PORT)
// ===========================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server đang chạy tại cổng ${PORT}`));
