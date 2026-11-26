import { WHATSAPP_NUMBER } from '../config/business'

export function whatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export function openWhatsApp(message: string) {
  window.open(whatsappUrl(message), '_blank', 'noopener,noreferrer')
}
