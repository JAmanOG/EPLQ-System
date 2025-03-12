import { createCipheriv, createDecipheriv, randomBytes, createHash } from "crypto"
// Use environment variable with proper fallback
const rawKey = process.env.ENCRYPTION_KEY || "fallback-key-32-bytes-long-secure"
const key = Buffer.alloc(32)  // Create a 32-byte buffer filled with zeros
Buffer.from(rawKey).copy(key, 0, 0, 32)  // Copy up to 32 bytes from raw key
const IV_LENGTH = 16

interface EncryptedData {
  iv: string
  content: string
}

export function encrypt(text: string): EncryptedData {
  const iv = randomBytes(IV_LENGTH)
  const cipher = createCipheriv("aes-256-cbc", key, iv)
    let encrypted = cipher.update(text)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return {
    iv: iv.toString("hex"),
    content: encrypted.toString("hex"),
  }
}

export function decrypt(data: EncryptedData): string {
  try {
    if (!data?.content) {
      console.log("Empty content received in decrypt function");
      return "[Empty-Data]";
    }
    
    // Add debug logging
    console.log("Decrypting data:", typeof data.content, data.content.substring(0, 20) + "...");
    
    // Check if content is a JSON string and try to parse it
    let parsedData = data;
    try {
      if (typeof data.content === 'string' && data.content.startsWith('{')) {
        console.log("Content appears to be JSON, attempting to parse");
        const parsed = JSON.parse(data.content);
        if (parsed.iv && parsed.content) {
          console.log("Successfully parsed JSON with iv and content");
          parsedData = parsed;
        }
      }
    } catch (e) {
      console.log("Failed to parse content as JSON:", e.message);
    }

    // Handle iv
    let iv: Buffer;
    if (!parsedData.iv || parsedData.iv === "") {
      console.log("Using zero IV for missing IV");
      iv = Buffer.alloc(IV_LENGTH, 0);
    } else {
      console.log("Using provided IV:", parsedData.iv.substring(0, 10) + "...");
      iv = Buffer.from(parsedData.iv, "hex");
    }

    try {
      console.log("Attempting decryption with content:", parsedData.content.substring(0, 10) + "...");
      const encryptedText = Buffer.from(parsedData.content, "hex");
      const decipher = createDecipheriv("aes-256-cbc", key, iv);
      let decrypted = decipher.update(encryptedText);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      const result = decrypted.toString();
      console.log("Decryption successful, result:", result);
      console.log("Decryption successful, result length:", result.length);
      return result;
    } catch (error) {
      console.error("Inner decryption error:", error);
      return `[Decrypt-Error]`;
    }
  } catch (error) {
    console.error("Decryption error:", error, "Data:", data);
    return `[Encrypted-${data?.content?.substring(0, 8) || 'Unknown'}]`;
  }
}

// POI specific encryption
export function encryptPOI(poi: {
  name: string
  latitude: number
  longitude: number
  description: string
}): {
  name: string
  latitude: string
  longitude: string
  description: string
} {
  const nameEncrypted = encrypt(poi.name);
  const latEncrypted = encrypt(poi.latitude.toString());
  const longEncrypted = encrypt(poi.longitude.toString());
  const descEncrypted = encrypt(poi.description);
  
  return {
    name: JSON.stringify(nameEncrypted),
    latitude: JSON.stringify(latEncrypted),
    longitude: JSON.stringify(longEncrypted),
    description: JSON.stringify(descEncrypted),
  }
}

// Update decryptPOI to accept EncryptedData for each field
export function decryptPOI(encryptedPOI: {
  name: string
  latitude: string
  longitude: string
  description: string
}) {
  return {
    name: decrypt(JSON.parse(encryptedPOI.name)),
    latitude: Number.parseFloat(decrypt(JSON.parse(encryptedPOI.latitude))),
    longitude: Number.parseFloat(decrypt(JSON.parse(encryptedPOI.longitude))),
    description: decrypt(JSON.parse(encryptedPOI.description)),
  }
}

// Location encryption for queries
export function encryptLocation(latitude: number, longitude: number) {
  const latEncrypted = encrypt(latitude.toString());
  const longEncrypted = encrypt(longitude.toString());
  
  return {
    latitude: {
      iv: latEncrypted.iv,
      content: latEncrypted.content
    },
    longitude: {
      iv: longEncrypted.iv,
      content: longEncrypted.content
    }
  }
}

// Spatial query encryption
export function encryptSpatialQuery(query: {
  latitude: number
  longitude: number
  radius: number
}) {
  return {
    location: encryptLocation(query.latitude, query.longitude),
    radius: encrypt(query.radius.toString()).content,
  }
}

