import { ArrowRight, ArrowUpRight, Instagram, ShoppingBag } from 'lucide-react'
import { BUSINESS_LOCATION, DISPLAY_PHONE, INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../config/business'
import { whatsappUrl } from '../lib/whatsapp'
import type { Language } from '../data/translations'
import type { copy } from '../data/translations'

type Props = { t: typeof copy.en | typeof copy.sw; lang: Language }
export function Footer({ t, lang }: Props) {
  const ids = ['home', 'about', 'services', 'process', 'pricing', 'contact']
  const labels = [t.home, t.about, t.services, t.process, t.pricing, t.contact]
  return <footer className="footer"><div className="footer-top"><div className="footer-about"><a href="#home" className="brand footer-brand"><span className="brand-icon"><ShoppingBag size={19}/></span><span><b>Dydah</b><small>PERSONAL SHOPPER</small></span></a><p>{t.footerLine}</p><a className="footer-social" href={INSTAGRAM_URL} target="_blank" rel="noreferrer"><Instagram size={15}/>{INSTAGRAM_HANDLE}<ArrowUpRight size={13}/></a></div><div><h3>{t.explore}</h3>{labels.map((label, i) => <a className="footer-link" key={ids[i]} href={`#${ids[i]}`}>{label}</a>)}</div><div><h3>{t.serviceLabel}</h3>{t.serviceNames.slice(0, 5).map(x => <a className="footer-link" key={x} href="#services">{x}</a>)}</div><div className="footer-contact"><h3>{t.contact}</h3><span>{BUSINESS_LOCATION}</span><a href={`tel:${DISPLAY_PHONE.replace(/\s/g, '')}`}>{DISPLAY_PHONE}</a><a className="footer-whatsapp" href={whatsappUrl(lang === 'en' ? 'Hello Dydah, I have a question.' : 'Habari Dydah, nina swali.')} target="_blank" rel="noreferrer">WhatsApp <ArrowRight size={14}/></a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Dydah Personal Shopper</span><span>{t.footerLine}</span><a href="#home">{t.backTop} ↑</a></div></footer>
}
