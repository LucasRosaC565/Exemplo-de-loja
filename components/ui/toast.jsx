"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { X } from "lucide-react"

// Contexto para o sistema de toast
const ToastContext = createContext(null)

// Tipos de toast
const TOAST_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  INFO: "info",
  WARNING: "warning",
}

// Provedor do toast
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  // Função para adicionar um novo toast
  const addToast = (message, type = TOAST_TYPES.INFO, duration = 5000) => {
    const id = Date.now()
    setToasts((prevToasts) => [...prevToasts, { id, message, type, duration }])
    return id
  }

  // Funções de conveniência para diferentes tipos de toast
  const success = (message, duration) => addToast(message, TOAST_TYPES.SUCCESS, duration)
  const error = (message, duration) => addToast(message, TOAST_TYPES.ERROR, duration)
  const info = (message, duration) => addToast(message, TOAST_TYPES.INFO, duration)
  const warning = (message, duration) => addToast(message, TOAST_TYPES.WARNING, duration)

  // Função para remover um toast
  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, info, warning }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

// Hook para usar o toast
export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast deve ser usado dentro de um ToastProvider")
  }
  return context
}

// Componente de container de toast
function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

// Componente de toast individual
function Toast({ toast, onClose }) {
  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(() => {
        onClose()
      }, toast.duration)
      return () => clearTimeout(timer)
    }
  }, [toast, onClose])

  // Definir classes com base no tipo
  const getTypeClasses = () => {
    switch (toast.type) {
      case TOAST_TYPES.SUCCESS:
        return "bg-green-100 border-green-500 text-green-800"
      case TOAST_TYPES.ERROR:
        return "bg-red-100 border-red-500 text-red-800"
      case TOAST_TYPES.WARNING:
        return "bg-yellow-100 border-yellow-500 text-yellow-800"
      case TOAST_TYPES.INFO:
      default:
        return "bg-blue-100 border-blue-500 text-blue-800"
    }
  }

  return (
    <div
      className={`max-w-md w-full p-4 rounded-lg shadow-md border-l-4 flex items-start justify-between ${getTypeClasses()}`}
      role="alert"
    >
      <div className="flex-1">{toast.message}</div>
      <button
        onClick={onClose}
        className="ml-4 text-gray-500 hover:text-gray-700 focus:outline-none"
        aria-label="Fechar"
      >
        <X size={18} />
      </button>
    </div>
  )
}
