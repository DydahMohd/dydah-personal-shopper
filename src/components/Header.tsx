import { useState } from 'react'
import { ArrowUpRight, Menu, ShoppingBag, X } from 'lucide-react'
import type { Language } from '../data/translations'
import type { copy } from '../data/translations'

type Props = { lang: Language; setLang: (l: Language) => void; t: typeof copy.en | typeof copy.sw }
const anchors = ['home', 'about', 'services', 'process', 'pricing', 'contact']

export function Header({ lang, setLang, t }: Props) {
  const [open, setOpen] = useState(false)
  const labels = [t.home, t.about, t.services, t.process, t.pricing, t.contact]
  return <>
    <div className="announcement"><span className="announcement-dot"/>{t.notice}<a href="https://www.instagram.com/dydahs_kitchen/" target="_blank" rel="noreferrer">Instagram <ArrowUpRight size={13}/></a></div>
    <header className="site-header">
      <a href="#home" className="brand" onClick={() => setOpen(false)}><span className="brand-icon"><ShoppingBag size={19}/></span><span><b>Dydah</b><small>PERSONAL SHOPPER</small></span></a>
      <nav className={open ? 'main-nav nav-open' : 'main-nav'} aria-label="Main navigation">{labels.map((label, i) => <a key={anchors[i]} href={`#${anchors[i]}`} onClick={() => setOpen(false)}>{label}</a>)}</nav>
      <div className="header-controls"><div className="language-switch" aria-label="Choose language"><button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')} aria-pressed={lang === 'en'}>EN</button><span>/</span><button className={lang === 'sw' ? 'active' : ''} onClick={() => setLang('sw')} aria-pressed={lang === 'sw'}>SW</button></div><a className="header-order" href="#order">{t.shopNow}<ArrowUpRight size={15}/></a><button className="mobile-menu" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>{open ? <X/> : <Menu/>}</button></div>
    </header>
  </>
}
