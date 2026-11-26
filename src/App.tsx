import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, Check, CheckCircle2, ChevronDown, Clock3, Instagram, MapPin, MessageCircle, Minus, Plus, ShoppingBag, Sparkles, Truck, Upload, X } from 'lucide-react'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { BUSINESS_LOCATION, DISPLAY_PHONE, INSTAGRAM_HANDLE, INSTAGRAM_URL } from './config/business'
import { copy, type Language } from './data/translations'
import { openWhatsApp, whatsappUrl } from './lib/whatsapp'
import basketClose from './assets/shopper-basket-close.jpg'
import marketWide from './assets/shopper-market-wide.jpg'
import heroMarket from './assets/hero-market-shopper.jpg'
import fashionBoutique from './assets/fashion-boutique.jpg'

type Product = { id: number; name: string; description: string; quantity: number; category: string }
const emptyProduct = (id: number): Product => ({ id, name: '', description: '', quantity: 1, category: '' })
const serviceImages = [
  'photo-1441986300917-64674bd600d8', 'photo-1542838132-92c53300491e', 'photo-1483985988355-763728e1935b',
  'photo-1596462502278-27bfdc403348', 'photo-1600210492486-724fe5c67fb0', 'photo-1513201099705-a9746e1e201f',
]
const imageUrl = (id: string, width = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=82`

function SectionLabel({ children }: { children: string }) { return <span className="section-label"><i/>{children}</span> }

export default function App() {
  const [lang, setLang] = useState<Language>('en')
  const [products, setProducts] = useState<Product[]>([emptyProduct(1)])
  const [customer, setCustomer] = useState({ name: '', phone: '', location: '', budget: '', instructions: '' })
  const [contact, setContact] = useState({ name: '', phone: '', message: '' })
  const [feedback, setFeedback] = useState('')
  const [referenceImage, setReferenceImage] = useState<{ file: File; previewUrl: string } | null>(null)
  const t = copy[lang]
  useEffect(() => { document.documentElement.lang = lang === 'en' ? 'en' : 'sw' }, [lang])
  useEffect(() => () => { if (referenceImage) URL.revokeObjectURL(referenceImage.previewUrl) }, [referenceImage])

  const updateProduct = (id: number, key: keyof Omit<Product, 'id'>, value: string | number) => {
    setProducts(current => current.map(product => product.id === id ? { ...product, [key]: value } : product))
  }
  const chooseService = (categoryIndex: number) => {
    setProducts(current => current.map((product, index) => index === 0 ? { ...product, category: String(categoryIndex) } : product))
    document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' })
  }
  const onReferenceImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { setFeedback(t.badImage); event.target.value = ''; return }
    if (file.size > 5 * 1024 * 1024) { setFeedback(t.imageTooLarge); event.target.value = ''; return }
    setReferenceImage({ file, previewUrl: URL.createObjectURL(file) })
    setFeedback('')
  }
  const clearReferenceImage = () => {
    setReferenceImage(null)
    const input = document.getElementById('reference-image') as HTMLInputElement | null
    if (input) input.value = ''
  }
  const submitOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.reportValidity() || products.some(p => !p.name.trim() || !p.category)) {
      setFeedback(t.formError)
      return
    }
    const rows = products.map((p, i) => `${i + 1}. ${p.name} (${t.categories[Number(p.category)]})\n   ${lang === 'en' ? 'Description' : 'Maelezo'}: ${p.description || (lang === 'en' ? 'No extra details' : 'Hakuna maelezo ya ziada')}\n   ${t.quantity}: ${p.quantity}`)
    const message = `${lang === 'en' ? 'SHOPPING ORDER' : 'ODA YA MANUNUZI'} · Dydah Personal Shopper\n\n${t.customerName}: ${customer.name}\n${t.customerPhone}: ${customer.phone}\n${t.location}: ${customer.location}\n${t.budget}: ${customer.budget ? `TZS ${customer.budget}` : (lang === 'en' ? 'Not specified' : 'Haijatajwa')}\n\n${lang === 'en' ? 'PRODUCTS' : 'BIDHAA'}\n${rows.join('\n\n')}\n\n${t.instructions}: ${customer.instructions || (lang === 'en' ? 'None' : 'Hakuna')}\n\n${lang === 'en' ? 'Please confirm product availability and the estimated total before purchasing. Thank you.' : 'Tafadhali thibitisha upatikanaji na makadirio ya jumla kabla ya kununua. Asante.'}`
    const messageToSend = referenceImage ? `${message}\n\n${t.attachImage} (${referenceImage.file.name})` : message
    openWhatsApp(messageToSend)
    setFeedback(referenceImage ? t.attachImage : (lang === 'en' ? 'Your order is ready in WhatsApp. Review it and press Send to complete your request.' : 'Oda yako iko tayari WhatsApp. Ikague kisha bonyeza Tuma kukamilisha ombi.'))
  }
  const submitContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const message = `${lang === 'en' ? 'CONTACT MESSAGE' : 'UJUMBE'} · Dydah Personal Shopper\n\n${t.customerName}: ${contact.name}\n${t.customerPhone}: ${contact.phone}\n${t.message}: ${contact.message}`
    openWhatsApp(message)
  }

  return <div className="app-shell">
    <Header lang={lang} setLang={setLang} t={t}/>
    <main>
      <section className="hero" id="home">
        <div className="hero-photo" role="img" aria-label={lang === 'en' ? 'A shopper choosing fresh groceries at an Arusha market' : 'Mnunuzi akichagua bidhaa safi katika soko la Arusha'} style={{ backgroundImage: `url(${heroMarket})` }}/><div className="hero-wash"/>
        <div className="hero-content"><SectionLabel>{t.heroTag}</SectionLabel><h1>{t.heroTitleA}<br/><em>{t.heroTitleB}</em></h1><p>{t.heroText}</p><div className="hero-actions"><a className="button button-gold" href="#order">{t.shopNow}<ArrowRight size={16}/></a><a className="button button-whatsapp" href={whatsappUrl(lang === 'en' ? 'Hello Dydah, I would like to place a shopping order.' : 'Habari Dydah, ningependa kuagiza bidhaa.')} target="_blank" rel="noreferrer"><MessageCircle size={17}/>{t.orderWhatsApp}</a></div><div className="hero-trust"><span><Check size={13}/></span>{lang === 'en' ? 'You approve the estimate before we buy' : 'Unakubali makadirio kabla hatujanunua'}</div></div>
        <a className="hero-down" href="#about" aria-label={t.scrollDiscover}><span>{t.scrollDiscover}</span><ArrowDown size={14}/></a><div className="hero-location"><MapPin size={13}/>{BUSINESS_LOCATION}</div>
      </section>

      <section className="intro-section" id="about"><div className="intro-image"><img src={basketClose} alt={lang === 'en' ? 'A shopper carefully selecting fresh produce from a basket' : 'Mnunuzi akichagua kwa uangalifu bidhaa safi kutoka kwenye kapu'}/><span className="image-caption"><Sparkles size={14}/>{lang === 'en' ? 'PERSONAL CARE, EVERYDAY' : 'HUDUMA BINAFSI, KILA SIKU'}</span></div><div className="intro-copy"><SectionLabel>{t.introLabel}</SectionLabel><h2>{t.introTitle}</h2><p>{t.introText}</p><a className="under-link" href="#process">{t.process}<ArrowRight size={15}/></a><div className="intro-facts"><div><span>01</span><b>{lang === 'en' ? 'Local to Arusha' : 'Huduma ya Arusha'}</b></div><div><span>02</span><b>{lang === 'en' ? 'Always confirmed first' : 'Thibitisho kabla ya kununua'}</b></div></div></div></section>

      <section className="services-section" id="services"><div className="section-head"><div><SectionLabel>{t.servicesTag}</SectionLabel><h2>{t.servicesTitle}</h2><p>{t.servicesText}</p></div><a className="under-link" href="#order">{t.shopNow}<ArrowRight size={15}/></a></div><div className="service-grid">{t.serviceNames.map((name, i) => <article className="service-card" key={name}><div className="service-photo"><img loading="lazy" src={i === 1 ? basketClose : i === 2 ? fashionBoutique : imageUrl(serviceImages[i], 720)} alt={i === 2 ? (lang === 'en' ? 'Customer browsing clothing in a boutique' : 'Mteja akichagua nguo dukani') : ''}/><span>0{i + 1}</span><span className="service-arrow"><ArrowUpRight size={16}/></span></div><div className="service-copy"><h3>{name}</h3><p>{t.serviceDesc[i]}</p></div><button className="service-order-link" type="button" onClick={() => chooseService(i)}>{t.serviceAction}<ArrowRight size={14}/></button></article>)}</div></section>

      <section className="process-section" id="process"><div className="process-heading"><SectionLabel>{t.processTag}</SectionLabel><h2>{t.processTitle}</h2><p>{lang === 'en' ? 'You stay in control from your first message to delivery.' : 'Unaendelea kuwa na maamuzi kuanzia ujumbe wa kwanza hadi kupokea bidhaa.'}</p></div><div className="process-steps">{t.steps.map((step, i) => <article className="process-step" key={step}><span className="step-number">0{i + 1}</span><div className="step-icon">{[<ShoppingBag/>, <MessageCircle/>, <CheckCircle2/>, <Sparkles/>, <Truck/>][i]}</div><p>{step}</p></article>)}</div><div className="process-bottom"><span><Clock3 size={15}/>{lang === 'en' ? 'We only purchase after you approve the estimate.' : 'Tunanunua baada tu ya kupata idhini yako.'}</span><a className="under-link" href="#order">{t.shopNow}<ArrowRight size={15}/></a></div></section>

      <section className="why-section"><div className="why-photo"><img loading="lazy" src={marketWide} alt={lang === 'en' ? 'A local shopper with a basket of groceries' : 'Mnunuzi wa Arusha akiwa na kapu la bidhaa'}/><span>{lang === 'en' ? 'A PERSONAL TOUCH, EVERY TIME' : 'HUDUMA BINAFSI, KILA MARA'}</span></div><div className="why-copy"><SectionLabel>{t.whyTag}</SectionLabel><h2>{t.whyTitle}</h2><ul>{t.whyReasons.map((reason, i) => <li key={reason}><span>0{i + 1}</span>{reason}<CheckCircle2 size={17}/></li>)}</ul><a href="#order" className="button button-green">{t.shopNow}<ArrowRight size={16}/></a></div></section>

      <section className="review-note"><div className="review-mark">“</div><SectionLabel>{t.reviewsTag}</SectionLabel><h2>{t.reviewsTitle}</h2><p>{t.reviewsText}</p></section>

      <section className="about-detail"><div><SectionLabel>{t.aboutTag}</SectionLabel><h2>{t.aboutTitle}</h2><p>{t.aboutText}</p><a href="#contact" className="under-link">{t.contact}<ArrowRight size={15}/></a></div><div className="mission-grid"><article><span>01 / {t.missionLabel}</span><p>{t.mission}</p></article><article><span>02 / {t.visionLabel}</span><p>{t.vision}</p></article></div></section>

      <section className="pricing-section" id="pricing"><div className="section-head"><div><SectionLabel>{t.priceTag}</SectionLabel><h2>{t.priceTitle}</h2><p>{t.priceText}</p></div><div className="price-symbol">✳</div></div><div className="price-items"><article><span>01</span><div><h3>{t.fee}</h3><p>{t.feeText}</p></div><b>{t.placeholder}</b></article><article><span>02</span><div><h3>{t.delivery}</h3><p>{t.deliveryText}</p></div><b>{t.placeholder}</b></article><article><span>03</span><div><h3>{t.goods}</h3><p>{t.goodsText}</p></div><b>{lang === 'en' ? 'Shop price' : 'Bei ya dukani'}</b></article></div><div className="price-confirm"><CheckCircle2 size={17}/>{lang === 'en' ? 'We confirm your estimate and get your approval before purchasing.' : 'Tunathibitisha makadirio na kupata idhini yako kabla ya kununua.'}</div></section>

      <section className="order-section" id="order"><div className="order-intro"><SectionLabel>{t.orderTag}</SectionLabel><h2>{t.orderTitle}</h2><p>{t.orderText}</p><div className="order-callout"><span><MessageCircle size={19}/></span><div><b>{t.orderWhatsApp}</b><small>{DISPLAY_PHONE}</small></div><ArrowUpRight size={17}/></div><p className="order-privacy">{t.orderHint}</p></div><form className="order-form" onSubmit={submitOrder} noValidate><div className="form-title"><h3>{lang === 'en' ? 'Your shopping list' : 'Orodha yako ya manunuzi'}</h3><span>{lang === 'en' ? 'REQUIRED FIELDS *' : 'SEHEMU MUHIMU *'}</span></div>
        {products.map((product, i) => <fieldset className="product-fieldset" key={product.id}><legend><span>{t.product} 0{i + 1}</span>{products.length > 1 && <button type="button" onClick={() => setProducts(current => current.filter(p => p.id !== product.id))}>{t.remove}<Minus size={13}/></button>}</legend><label>{t.productName} *<input required value={product.name} onChange={e => updateProduct(product.id, 'name', e.target.value)} placeholder={lang === 'en' ? 'e.g. Fresh bananas' : 'mf. Ndizi mbivu'}/></label><label>{t.productDescription}<textarea rows={2} value={product.description} onChange={e => updateProduct(product.id, 'description', e.target.value)} placeholder={lang === 'en' ? 'Size, brand, colour or other preferences' : 'Ukubwa, chapa, rangi au mapendeleo'}/></label><div className="product-row"><label>{t.category} *<span className="select-box"><select required value={product.category} onChange={e => updateProduct(product.id, 'category', e.target.value)}><option value="">{t.chooseCategory}</option>{t.categories.map((category, categoryIndex) => <option key={categoryIndex} value={String(categoryIndex)}>{category}</option>)}</select><ChevronDown size={15}/></span></label><label>{t.quantity}<span className="quantity-box"><button type="button" aria-label={lang === 'en' ? 'Decrease quantity' : 'Punguza idadi'} onClick={() => updateProduct(product.id, 'quantity', Math.max(1, product.quantity - 1))}><Minus size={13}/></button><input aria-label={t.quantity} type="number" min="1" required value={product.quantity} onChange={e => updateProduct(product.id, 'quantity', Number(e.target.value))}/><button type="button" aria-label={lang === 'en' ? 'Increase quantity' : 'Ongeza idadi'} onClick={() => updateProduct(product.id, 'quantity', product.quantity + 1)}><Plus size={13}/></button></span></label></div></fieldset>)}
        <button className="add-product" type="button" onClick={() => setProducts(current => [...current, emptyProduct(Math.max(0, ...current.map(p => p.id)) + 1)])}><Plus size={15}/>{t.addProduct}</button><div className="customer-fields"><label>{t.customerName} *<input required autoComplete="name" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})}/></label><label>{t.customerPhone} *<input required type="tel" minLength={7} autoComplete="tel" placeholder="+255 7xx xxx xxx" value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})}/></label><label>{t.location} *<input required autoComplete="street-address" value={customer.location} onChange={e => setCustomer({...customer, location: e.target.value})}/></label><label>{t.budget}<input type="number" min="0" value={customer.budget} onChange={e => setCustomer({...customer, budget: e.target.value})} placeholder={lang === 'en' ? 'Optional' : 'Si lazima'}/></label><label className="full-field">{t.instructions}<textarea rows={3} value={customer.instructions} onChange={e => setCustomer({...customer, instructions: e.target.value})}/></label></div><div className="reference-upload"><label className="reference-picker" htmlFor="reference-image"><Upload size={18}/><span>{referenceImage ? referenceImage.file.name : t.referenceImage}</span><small>{t.referenceHint}</small></label><input className="reference-input" id="reference-image" aria-label={t.referenceImage} type="file" accept="image/jpeg,image/png,image/webp" onChange={onReferenceImage}/>{referenceImage && <div className="reference-preview"><img src={referenceImage.previewUrl} alt={lang === 'en' ? 'Preview of selected product reference' : 'Muonekano wa picha ya mfano iliyochaguliwa'}/><div><span>{referenceImage.file.name}</span><button type="button" aria-label={t.removeImage} onClick={clearReferenceImage}><X size={15}/>{t.removeImage}</button></div></div>}</div>{feedback && <p className="form-feedback" role="status">{feedback}</p>}<button className="button button-green order-submit" type="submit">{t.submitOrder}<ArrowUpRight size={16}/></button></form></section>

      <section className="contact-section" id="contact"><div className="contact-copy"><SectionLabel>{t.contactTag}</SectionLabel><h2>{t.contactTitle}</h2><p>{t.contactText}</p><div className="contact-lines"><a href={whatsappUrl(lang === 'en' ? 'Hello Dydah, I have a question.' : 'Habari Dydah, nina swali.')} target="_blank" rel="noreferrer"><span><MessageCircle size={17}/></span><div><small>{t.phone}</small><b>{DISPLAY_PHONE}</b></div><ArrowUpRight size={15}/></a><a href={`tel:${DISPLAY_PHONE.replace(/\s/g, '')}`}><span><ShoppingBag size={17}/></span><div><small>{t.locationLabel}</small><b>{BUSINESS_LOCATION}</b></div><ArrowUpRight size={15}/></a><a href={INSTAGRAM_URL} target="_blank" rel="noreferrer"><span><Instagram size={17}/></span><div><small>{t.socials}</small><b>{INSTAGRAM_HANDLE}</b></div><ArrowUpRight size={15}/></a></div></div><form className="contact-form" onSubmit={submitContact}><SectionLabel>{t.contactFormLabel}</SectionLabel><label>{t.customerName}<input required autoComplete="name" value={contact.name} onChange={e => setContact({...contact, name: e.target.value})}/></label><label>{t.customerPhone}<input required type="tel" value={contact.phone} onChange={e => setContact({...contact, phone: e.target.value})}/></label><label>{t.message}<textarea required rows={3} value={contact.message} onChange={e => setContact({...contact, message: e.target.value})}/></label><button className="button button-green" type="submit">{t.sendMessage}<ArrowRight size={16}/></button></form></section>
      <section className="last-call"><img loading="lazy" src={imageUrl('photo-1472851294608-062f824d29cc', 1600)} alt=""/><div className="last-call-shade"/><div><SectionLabel>{lang === 'en' ? 'ARUSHA, TANZANIA' : 'ARUSHA, TANZANIA'}</SectionLabel><h2>{lang === 'en' ? 'Let us take the list from here.' : 'Tuachie orodha yako.'}</h2><a className="button button-gold" href="#order">{t.shopNow}<ArrowRight size={16}/></a></div></section>
    </main>
    <Footer t={t} lang={lang}/>
    <a className="floating-whatsapp" href={whatsappUrl(lang === 'en' ? 'Hello Dydah, I would like help with shopping.' : 'Habari Dydah, naomba msaada wa manunuzi.')} target="_blank" rel="noreferrer" aria-label={t.orderWhatsApp}><MessageCircle size={21}/><span>WhatsApp</span></a>
  </div>
}
