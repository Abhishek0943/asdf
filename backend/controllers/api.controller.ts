import { Request, Response, NextFunction } from "express";
import os from "os";
import { Credential } from "../models/credential.model";
import { credentialId } from "../utils/hash";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/errorhandler";

export const issueCredential = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
        return next(new ErrorHandler("Invalid credential JSON", 400))
    }

    const id = credentialId(payload);

    const existing = await Credential.findById(id).lean();
    if (existing) {
        return res.status(200).json({
            message: "credential already issued",
            id,
            worker: `credential issued by ${existing.worker_id}`,
            issued_at: existing.issued_at,
        });
    }

    const workerId = process.env.WORKER_ID || process.env.HOSTNAME || os.hostname() || "worker-1";

    const created = await Credential.create({
        _id: id,
        payload,
        issued_at: new Date(),
        worker_id: workerId,
    });

    return res.status(201).json({
        message: "credential issued",
        id,
        worker: `credential issued by ${created.worker_id}`,
        issued_at: created.issued_at,
    });

});

export const verifyCredential = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
        return next(new ErrorHandler("Invalid credential JSON", 400))
    }

    const id = credentialId(payload);
    const rec = await Credential.findById(id).lean();

    if (!rec) {
        return next(new ErrorHandler("credential not found", 404))
    }

    return res.status(200).json({
        valid: true,
        id,
        issued_at: rec.issued_at,
        worker: `credential issued by ${rec.worker_id}`,
        verified_at: new Date().toISOString(),
    });

});

export const getAllCredentials = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const creds = await Credential.find();

        if (!creds || creds.length === 0) {
            return res.status(200).json({
                message: "No credentials found",
                credentials: [],
            });
        }

        return res.status(200).json({
            message: "All credentials fetched successfully",
            count: creds.length,
            credentials: creds,
        });
    } catch (error) {
        return next(new ErrorHandler("Failed to fetch credentials", 500));
    }
});