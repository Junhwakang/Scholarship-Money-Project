export default function Footer() {
return (
<footer className="border-t border-black/5 py-10">
<div className="container-max flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
<div className="font-extrabold tracking-tight text-gray-900">UniOp<span className="text-lemon-300">.</span></div>
<nav className="flex items-center gap-6">
<a href="#" className="hover:underline">이용약관</a>
<a href="#" className="hover:underline">개인정보처리방침</a>
<a href="#" className="hover:underline">문의</a>
</nav>
<p>© {new Date().getFullYear()} UniOp</p>
</div>
</footer>
)
}