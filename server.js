// 📁 server.js
// ===============================================
// 🌸 Website Kỷ Niệm — Lưu ảnh & video bằng Node.js + Express + Multer
// ===============================================

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();

// ⚙️ Cho phép truy cập từ mọi thiết bị (máy tính, điện thoại, tablet...)
app.use(
  cors({
    origin: "*", // cho phép mọi domain truy cập
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

// Cho phép server đọc JSON và hiển thị file tĩnh (HTML, CSS, JS, ảnh/video)
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // nơi lưu ảnh/video tải lên
app.use(express.static(__dirname)); // ⚠️ Dòng này giúp hiển thị index.html, style.css, script.js

// ===============================================
// 📸 Cấu hình nơi lưu file upload bằng Multer
// ===============================================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // thư mục lưu ảnh/video
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // tên file duy nhất
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // giới hạn tối đa 50MB
});

// ===============================================
// 💾 Bộ nhớ tạm lưu kỷ niệm (RAM)
// ===============================================
let memories = [];

// ===============================================
// 📤 API: Upload ảnh hoặc video
// ===============================================
app.post("/upload", upload.single("file"), (req, res) => {
  const { title, description } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "⚠️ Không có file nào được tải lên!" });
  }

  const memory = {
    id: Date.now(),
    title,
    description,
    filePath: `/uploads/${file.filename}`,
    fileType: file.mimetype,
  };

  memories.push(memory);
  console.log(`✅ Tải lên thành công: ${file.filename}`);

  res.json(memory);
});

// ===============================================
// 📋 API: Lấy danh sách kỷ niệm
// ===============================================
app.get("/memories", (req, res) => {
  res.json(memories);
});

// ===============================================
// ❌ API: Xoá 1 kỷ niệm
// ===============================================
app.delete("/memories/:id", (req, res) => {
  const id = parseInt(req.params.id);
  memories = memories.filter((m) => m.id !== id);
  console.log(`🗑️ Đã xoá kỷ niệm có id = ${id}`);
  res.json({ message: "Đã xoá thành công!" });
});

// ===============================================
// 🚀 Khởi động server (Render tự gán PORT)
// ===============================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server đang chạy tại cổng ${PORT}`));
