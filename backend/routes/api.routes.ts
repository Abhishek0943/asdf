import express, { Router } from "express";
import {
  issueCredential,
  verifyCredential,
} from "../controllers/api.controller";

const router: Router = express.Router();

router.post("/issue", issueCredential);

router.post("/verify", verifyCredential);

export default router;


