'use client'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'


export default function RotatingWords({ words, interval=2000 }: { words: string[]; interval?: number }) {
const [index, setIndex] = useState(0)
useEffect(() => {
const id = setInterval(() => setIndex((i) => (i + 1) % words.length), interval)
return () => clearInterval(id)
}, [words.length, interval])


return (
<span className="inline-block min-w-[7ch]">{/* reserve space to prevent layout shift */}
<AnimatePresence mode="wait">
<motion.span
key={index}
initial={{ opacity: 0, y: 8 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -8 }}
transition={{ duration: 0.35 }}
>
{words[index]}
</motion.span>
</AnimatePresence>
</span>
)
}