import express from "express";
import fs from "fs";
import { exec } from "child_process";

const app = express();
app.use(express.json({ limit: "10mb" }));

app.options("/print", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  return res.sendStatus(200);
});

app.post("/print", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
  const { image } = req.body;
  
  if (!image) {
    console.error("이미지 데이터 없음");
    return res.status(400).send("No image");
  }

  const prefix = "data:image/png;base64,";
  let base64Data = image;
  if (image.startsWith(prefix)) {
    base64Data = image.slice(prefix.length);
  }

  const filePath = "./photo.png";
  
  try {
    fs.writeFileSync(filePath, base64Data, "base64");
    console.log("사진 저장 완료:", filePath);
  } catch (err) {
    console.error("파일 저장 실패:", err);
    return res.status(500).send("File write error");
  }

  exec(`lp -d POS__Receipt_Printer -o Brightness=-30 -o HalftoneType=JarvisJudiceNinke -o PrintDensity=3 ${filePath}`, (err, stdout, stderr) => {
    if (err) {
      console.error("인쇄 실패:", err);
      console.error(stderr);
      return res.status(500).send("Print error");
    }
    console.log("인쇄 명령 완료:", stdout);
    res.send("Printed");
  });
});

app.listen(3000, () => {
  console.log("프린트 서버 실행중 → http://localhost:3000");
});
