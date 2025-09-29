const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();

// ⚙️ Cho phép truy cập từ mọi thiết bị (Safari, Chrome, mobile)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Accept"],
    credentials: true,
  })
);

// Cho phép Safari gửi yêu cầu OPTIONS trước khi POST
app.options("*", cors());

// Cho phép đọc JSON và phục vụ file tĩnh (HTML, CSS, JS, uploads)
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(__dirname));

// 📸 Cấu hình lưu file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

// 💾 Bộ nhớ tạm (RAM)
let memories = [];

// 📤 Upload ảnh/video
app.post("/upload", upload.single("file"), (req, res) => {
  const { title, description } = req.body;
  const file = req.file;

  if (!file) return res.status(400).json({ message: "⚠️ Không có file!" });

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

// 📋 Lấy danh sách kỷ niệm
app.get("/memories", (req, res) => {
  res.json(memories);
});

// 🗑️ Xoá kỷ niệm
app.delete("/memories/:id", (req, res) => {
  const id = parseInt(req.params.id);
  memories = memories.filter((m) => m.id !== id);
  res.json({ message: "🗑️ Đã xoá!" });
});

// 🚀 Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server đang chạy tại cổng ${PORT}`));
