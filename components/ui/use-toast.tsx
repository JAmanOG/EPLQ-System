"use client"

// Simplified toast implementation
import { useState, useEffect } from "react"

type ToastProps = {
  title: string
  description?: string
  variant?: "default" | "destructive"
}

let toastQueue: ToastProps[] = []
let listeners: ((toasts: ToastProps[]) => void)[] = []

export function toast(props: ToastProps) {
  toastQueue = [...toastQueue, props]
  listeners.forEach((listener) => listener(toastQueue))

  // Auto-remove toast after 5 seconds
  setTimeout(() => {
    toastQueue = toastQueue.filter((t) => t !== props)
    listeners.forEach((listener) => listener(toastQueue))
  }, 5000)
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>(toastQueue)

  useEffect(() => {
    const listener = (newToasts: ToastProps[]) => {
      setToasts([...newToasts])
    }

    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }, [])

  return { toasts }
}

