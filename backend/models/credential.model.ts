import mongoose, { Schema, Document } from "mongoose";

export interface ICredential extends Document {
  _id: string;                
  payload: any;          
  issued_at: Date;
  worker_id: string;
}

const CredentialSchema: Schema<ICredential> = new Schema(
  {
    payload: { type: Schema.Types.Mixed, required: true },
    issued_at: { type: Date, required: true, default: () => new Date() },
    worker_id: { type: String, required: true },
  },
  { timestamps: true,  }
);

CredentialSchema.index({ worker_id: 1, issued_at: -1 });

export const Credential = mongoose.model<ICredential>("Credential", CredentialSchema);
