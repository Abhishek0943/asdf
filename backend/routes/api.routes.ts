import express, { Router } from "express";
import {
  getAllCredentials,
  issueCredential,
  verifyCredential,
} from "../controllers/api.controller";

const router: Router = express.Router();

router.post("/issue", issueCredential);

router.post("/verify", verifyCredential);
router.get("/all-credentials", getAllCredentials);

export default router;


