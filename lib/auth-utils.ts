import { verify, sign } from "jsonwebtoken"
import type { ResponseCookies } from "next/dist/server/web/spec-extension/cookies"

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-do-not-use-in-production"

export interface JWTPayload {
  id: string
  email: string
  role: string
}

export function signToken(payload: JWTPayload): string {
  return sign(payload, JWT_SECRET, { expiresIn: "24h" })
}

export function verifyToken(token: string): JWTPayload {
  try {
    return verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    throw new Error("Invalid token")
  }
}

export function setAuthCookie(token: string, cookieStore: ResponseCookies) {
  cookieStore.set({
    name: "auth_token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  })
}

export function removeAuthCookie(cookieStore: ResponseCookies) {
  cookieStore.set({
    name: "auth_token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0, // Expire immediately
  })
}

// import * as jose from 'jose'
// import type { ResponseCookies } from "next/dist/server/web/spec-extension/cookies"

// const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-do-not-use-in-production"

// export interface JWTPayload {
//   id: string
//   email: string
//   role: string
// }

// export async function signToken(payload: JWTPayload): Promise<string> {
//   const encoder = new TextEncoder()
//   const secretKey = encoder.encode(JWT_SECRET)
  
//   return await new jose.SignJWT(payload)
//     .setProtectedHeader({ alg: 'HS256' })
//     .setIssuedAt()
//     .setExpirationTime('24h')
//     .sign(secretKey)
// }

// export async function verifyToken(token: string): Promise<JWTPayload> {
//   try {
//     const encoder = new TextEncoder()
//     const secretKey = encoder.encode(JWT_SECRET)
    
//     const { payload } = await jose.jwtVerify(token, secretKey)
//     return payload as JWTPayload
//   } catch (error) {
//     throw new Error("Invalid token")
//   }
// }

// export function setAuthCookie(token: string, cookieStore: ResponseCookies) {
//   cookieStore.set({
//     name: "auth_token",
//     value: token,
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "lax",
//     path: "/",
//     maxAge: 60 * 60 * 24, // 24 hours
//   })
// }

// export function removeAuthCookie(cookieStore: ResponseCookies) {
//   cookieStore.set({
//     name: "auth_token",
//     value: "",
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "lax",
//     path: "/",
//     maxAge: 0, // Expire immediately
//   })
// }