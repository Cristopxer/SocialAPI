import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import authRoute from "./routes/auth.js";
import { register } from "./controllers/auth.js";

// MIDDLEWARE CONFIGS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// file local storage configs
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Routes with files
app.post("/api/v1/auth/register", upload.single("picture"), register);

// Routes
app.use("/api/v1/auth", authRoute);

// Mongoose configuration
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`SERVER RUNNING ON PORT ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));
