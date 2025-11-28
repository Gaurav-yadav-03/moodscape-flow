import { Button } from "@/components/ui/button";
import { Sparkles, Brain, Palette, Lock, ArrowRight, CheckCircle2, Star } from "lucide-react";

interface LandingProps {
    onGetStarted: () => void;
}

export const Landing = ({ onGetStarted }: LandingProps) => {
    return (
        <div className="min-h-screen bg-[#FAFAF9] text-slate-900 overflow-hidden selection:bg-[#69A297]/20">
            {/* Abstract Background Elements */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-[#E0F2FE] to-[#F0FDFA] blur-3xl opacity-60 animate-float" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-[#FDF4FF] to-[#FAE8FF] blur-3xl opacity-60 animate-float delay-1000" />
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-gradient-to-bl from-[#FEF3C7] to-[#FFFBEB] blur-3xl opacity-40 animate-pulse-soft" />
            </div>

            {/* Navigation */}
            <nav className="relative z-50 px-6 py-6 max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-2 group cursor-pointer" onClick={onGetStarted}>
                    <div className="w-8 h-8 bg-gradient-to-br from-[#69A297] to-[#558b80] rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
                        <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-800 group-hover:text-[#69A297] transition-colors">
                        MoodScape
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <Button
                        onClick={onGetStarted}
                        variant="ghost"
                        className="hidden sm:flex text-slate-600 hover:text-slate-900 hover:bg-slate-100/50 font-medium"
                    >
                        Log in
                    </Button>
                    <Button
                        onClick={onGetStarted}
                        className="bg-[#2D3436] hover:bg-[#000000] text-white rounded-full px-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 font-medium"
                    >
                        Get Started
                    </Button>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
                <div className="text-center space-y-8 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-slate-200/60 backdrop-blur-sm shadow-sm mb-4 animate-slide-up">
                        <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                        <span className="text-sm font-medium text-slate-600">Reimagine your daily journaling</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-slate-900 leading-[1.1] animate-slide-up [animation-delay:100ms]">
                        Master your mood. <br />
                        <span className="bg-gradient-to-r from-[#69A297] to-[#4A8A7D] bg-clip-text text-transparent">Clarify your mind.</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-2xl mx-auto font-light animate-slide-up [animation-delay:200ms]">
                        The AI-powered sanctuary for your thoughts. Track emotions, reflect deeply, and find clarity in a safe, private space.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 animate-slide-up [animation-delay:300ms]">
                        <Button
                            onClick={onGetStarted}
                            size="lg"
                            className="bg-[#69A297] hover:bg-[#558b80] text-white rounded-full px-10 h-16 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 font-semibold"
                        >
                            Start Journaling Free <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <p className="text-sm text-slate-500 mt-4 sm:mt-0 sm:ml-4 opacity-0">

                        </p>
                    </div>
                </div>

                {/* Spacer instead of App Preview */}
                <div className="mt-24"></div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8 mt-32 px-4">
                    <FeatureCard
                        icon={<Brain className="h-6 w-6 text-[#69A297]" />}
                        title="Intelligent Reflections"
                        description="Our AI analyzes your entries to provide deep insights and personalized prompts that help you grow."
                    />
                    <FeatureCard
                        icon={<Palette className="h-6 w-6 text-[#69A297]" />}
                        title="Expressive Canvas"
                        description="Customize your writing environment with calming themes, typography, and layouts that match your mood."
                    />
                    <FeatureCard
                        icon={<Lock className="h-6 w-6 text-[#69A297]" />}
                        title="Private Sanctuary"
                        description="Your thoughts are sacred. We use end-to-end encryption to ensure your journal remains yours alone."
                    />
                </div>

                {/* Social Proof */}
                {/* Quote Section */}
                <div className="mt-32 text-center space-y-8 border-t border-slate-200 pt-20 max-w-3xl mx-auto">
                    <div className="relative">
                        <span className="text-6xl text-[#69A297]/20 font-serif absolute -top-8 -left-4">"</span>
                        <p className="text-2xl md:text-3xl font-serif text-slate-700 leading-relaxed italic">
                            Keep a diary, and someday it will keep you.
                        </p>
                        <span className="text-6xl text-[#69A297]/20 font-serif absolute -bottom-12 -right-4">"</span>
                    </div>
                    <p className="text-slate-500 font-medium">— Mae West</p>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-100 py-12 mt-20">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-[#69A297] rounded-md flex items-center justify-center">
                            <Sparkles className="h-3 w-3 text-white" />
                        </div>
                        <span className="font-bold text-slate-800">MoodScape</span>
                    </div>
                    <p className="text-slate-500 text-sm">
                        © {new Date().getFullYear()} All rights reserved to Gaurav Yadav.
                    </p>
                    <div className="flex gap-6 text-sm text-slate-500">
                        <a href="#" className="hover:text-[#69A297] transition-colors">Privacy</a>
                        <a href="#" className="hover:text-[#69A297] transition-colors">Terms</a>
                        <a href="#" className="hover:text-[#69A297] transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="group p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#69A297]/20 transition-all duration-300 hover:-translate-y-1">
        <div className="mb-6 bg-[#F0FDFA] w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">{title}</h3>
        <p className="text-slate-600 leading-relaxed">
            {description}
        </p>
    </div>
);
