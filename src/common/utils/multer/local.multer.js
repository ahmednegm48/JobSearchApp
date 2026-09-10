import { existsSync, mkdirSync } from "fs";
import multer from "multer";
import { resolve } from "path";

export const fileValidation = {
    images: ["image/jpeg", "image/png", "image/jpg", "image/heic","application/octet-stream"],
    videos: ["video/mp4", "video/mkv", "video/avi"],
    audio: ["audio/mpeg", "audio/wav", "audio/mp3"],
    documents: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
}

export const localFileUpload = ({ customPath = "general" , validation = []}) => {
  const basePath = `./uploads/${customPath}`;

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let userBasePath = basePath;
      if (req.user?.id) userBasePath += `/${req.user?.id}`;
      const fullPath = resolve(`./src/${userBasePath}`);
      if (!existsSync(fullPath)) mkdirSync(fullPath, { recursive: true });
      cb(null, resolve(fullPath));
    },
    filename: (req, file, cb) => {
      const uniqueFileName =
        Date.now() +
        "-" +
        Math.round(Math.random() * 1000) +
        "-" +
        file.originalname;
        file.finalPath = `${basePath}/${req.user?.id}/${uniqueFileName}`;
      cb(null, uniqueFileName);
    },
  });

  const fileFilter = (req,file,cb)=>{
    if(validation.includes(file.mimetype)){
        cb(null , true);
    }else{
        cb(new Error("Invalid File Extention") , false);
    }
  }

  return multer({ fileFilter , storage });
};