import React, { useState } from 'react';
import { ArrowRight, Menu, UploadCloud, SlidersHorizontal, MousePointerClick, ShieldCheck, Map as MapIcon, Palette } from 'lucide-react';
import logo from '../../Maple_Leaf_Green_PNG_Clip_Art_Image.png';

interface HomeStepProps {
    onStart: () => void;
}

export const HomeStep: React.FC<HomeStepProps> = ({ onStart }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="w-full">
            {/* Navigation */}
            <nav className="fixed w-full z-50 top-0 transition-all duration-300 bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">

                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <img src={logo} alt="MAPLE Logo" className="w-9 h-9 object-contain drop-shadow-sm" />
                            <span className="font-bold text-xl tracking-tight text-slate-900">MAPLE</span>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-8">
                            <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">How it Works</a>
                            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Features</a>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center">
                            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-500 hover:text-slate-900 focus:outline-none p-2">
                                <Menu className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Dropdown */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1 shadow-lg animate-in slide-in-from-top-2">
                        <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-emerald-600 hover:bg-emerald-50">How it Works</a>
                        <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-emerald-600 hover:bg-emerald-50">Features</a>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
                {/* Soft background blur elements */}
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-200/40 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

                    {/* Brand Name */}
                    <div className="font-brand text-emerald-600 font-black tracking-tight text-6xl md:text-8xl mb-2 drop-shadow-sm font-['Outfit',sans-serif]">
                        MAPLE
                    </div>

                    {/* Acronym / Tagline */}
                    <h2 className="text-emerald-700/80 font-bold tracking-widest uppercase text-xs md:text-sm mb-8">
                        Mapping Application for Private Local Exploration
                    </h2>

                    {/* Headline */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 max-w-4xl mx-auto leading-[1.15]">
                        Turn your spreadsheets into <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                            interactive maps.
                        </span> Securely.
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Whether you're a student, journalist, or researcher, MAPLE helps you instantly visualize spatial data directly in your browser. No complex GIS software required.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                        <button
                            onClick={onStart}
                            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-semibold transition-all shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
                        >
                            Start Mapping for Free
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Badge Moved to Bottom */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-sm font-medium text-slate-600 mb-8">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                        100% Private Client-Side Processing
                    </div>
                </div>
            </section>

            {/* How it Works Section */}
            <section id="how-it-works" className="py-24 bg-white border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">From raw data to beautiful map in three steps</h2>
                        <p className="text-lg text-slate-600">Our streamlined, intuitive workflow means you spend less time configuring tools and more time understanding your data.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-px bg-gradient-to-r from-emerald-100 via-emerald-300 to-emerald-100 -z-10"></div>

                        {/* Step 1 */}
                        <div className="relative flex flex-col items-center text-center p-6 sm:p-8 bg-slate-50 rounded-3xl border border-slate-100 transition-transform hover:-translate-y-1">
                            <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mb-6 text-emerald-600">
                                <UploadCloud className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">1. Bring your data</h3>
                            <p className="text-slate-600 leading-relaxed">Simply drag and drop your spreadsheet into the browser. We natively support standard formats like CSV, Excel (.xlsx), and GeoJSON.</p>
                        </div>

                        {/* Step 2 */}
                        <div className="relative flex flex-col items-center text-center p-6 sm:p-8 bg-slate-50 rounded-3xl border border-slate-100 transition-transform hover:-translate-y-1">
                            <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mb-6 text-emerald-600">
                                <SlidersHorizontal className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">2. Configure</h3>
                            <p className="text-slate-600 leading-relaxed">MAPLE automatically detects coordinates. Just choose the columns you want to visualize and pick a color palette that suits your style.</p>
                        </div>

                        {/* Step 3 */}
                        <div className="relative flex flex-col items-center text-center p-6 sm:p-8 bg-slate-50 rounded-3xl border border-slate-100 transition-transform hover:-translate-y-1">
                            <div className="w-20 h-20 bg-emerald-600 rounded-2xl shadow-md border border-emerald-500 flex items-center justify-center mb-6 text-white">
                                <MousePointerClick className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">3. Explore & Export</h3>
                            <p className="text-slate-600 leading-relaxed">Interact with your dynamic map. Click on features to inspect their attributes, pan around, and export the view when you're done.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-slate-900 text-slate-50 relative overflow-hidden">
                {/* Decor */}
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none translate-x-1/3 translate-y-1/3"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">

                        {/* Feature Card 1 */}
                        <div className="bg-slate-800/60 backdrop-blur border border-slate-700 p-8 rounded-3xl hover:bg-slate-800 transition-colors">
                            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-6">
                                <ShieldCheck className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">Complete Privacy</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Built with a strict privacy-first architecture. Your files are read and processed entirely on your own device. Sensitive research or personal data never gets sent to a server.
                            </p>
                        </div>

                        {/* Feature Card 2 */}
                        <div className="bg-slate-800/60 backdrop-blur border border-slate-700 p-8 rounded-3xl hover:bg-slate-800 transition-colors">
                            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-6">
                                <MapIcon className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">Fluid Interaction</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Powered by modern mapping libraries, guaranteeing buttery-smooth zooming and panning. Your data feels alive and responsive, even with thousands of points.
                            </p>
                        </div>

                        {/* Feature Card 3 */}
                        <div className="bg-slate-800/60 backdrop-blur border border-slate-700 p-8 rounded-3xl hover:bg-slate-800 transition-colors">
                            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-6">
                                <Palette className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">Thematic Styling</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Create functional categorical point maps or choropleths. Easily apply color palettes and select attributes to include without writing a line of code.
                            </p>
                        </div>

                    </div>
                </div>
            </section>

        </div>
    );
};
