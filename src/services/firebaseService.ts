import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  addDoc,
  getDocFromServer,
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json" with { type: "json" };

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {},
    operationType,
    path,
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection() {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
    console.log("[Firebase] Firestore connection test completed.");
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("the client is offline")
    ) {
      console.error("[Firebase] Please check your Firebase configuration.");
    }
  }
}
testConnection();

export interface CampaignData {
  id: string;
  platform: "google-ads" | "meta-ads";
  name: string;
  budget: number;
  status: "Ativa" | "Pausada";
  clicks: number;
  cpc: number;
  roas: number;
  cpa: number;
  strategy: string;
  createdAt?: string;
}

export async function getFirebaseCampaigns(): Promise<CampaignData[]> {
  const path = "campaigns";
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) {
      return [];
    }
    return snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<CampaignData, "id">),
    }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function saveFirebaseCampaign(
  campaign: CampaignData
): Promise<void> {
  const path = `campaigns/${campaign.id}`;
  try {
    await setDoc(doc(db, "campaigns", campaign.id), campaign);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateFirebaseCampaignStatus(
  id: string,
  status: "Ativa" | "Pausada"
): Promise<void> {
  const path = `campaigns/${id}`;
  try {
    await updateDoc(doc(db, "campaigns", id), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function saveChatMessage(msg: {
  sender: "user" | "ai";
  text: string;
  latencyMs?: number;
}): Promise<void> {
  const path = "chatMessages";
  try {
    await addDoc(collection(db, path), {
      ...msg,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}
