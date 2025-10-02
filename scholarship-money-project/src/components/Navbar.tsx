'use client'
import { useEffect, useState } from 'react'


export default function Navbar() {
const [scrolled, setScrolled] = useState(false)
useEffect(() => {
const onScroll = () => setScrolled(window.scrollY > 8)
window.addEventListener('scroll', onScroll)
return () => window.removeEventListener('scroll', onScroll)
}, [])


return (
<header className={`fixed top-0 inset-x-0 z-50 transition-all ${scrolled ? 'backdrop-blur bg-lemon-50/80 border-b border-black/5' : 'bg-transparent'}`}>
<nav className="container-max flex h-16 items-center justify-between">
<div className="font-extrabold tracking-tight text-lg">UniOp<span className="text-lemon-300">.</span></div>
<div className="hidden md:flex items-center gap-6 text-sm">
<a className="hover:underline" href="#search">검색</a>
<a className="hover:underline" href="#value">추천원리</a>
<a className="hover:underline" href="#reviews">후기</a>
<a className="hover:underline" href="#how">이용방법</a>
</div>
<a href="#start" className="btn-primary text-sm">시작하기</a>
</nav>
</header>
)
}