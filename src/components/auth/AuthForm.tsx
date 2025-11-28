import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Loader2, Sparkles, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface AuthFormProps {
  onBack?: () => void;
}

export function AuthForm({ onBack }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
  });
  const { signIn, signUp } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await signIn(formData.email, formData.password);
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await signUp(formData.email, formData.password, formData.displayName);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9] p-4 selection:bg-[#69A297]/20">
      {/* Abstract Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-[#E0F2FE] to-[#F0FDFA] blur-3xl opacity-60 animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-[#FDF4FF] to-[#FAE8FF] blur-3xl opacity-60 animate-float delay-1000" />
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Back Button - Desktop */}
        {onBack && (
          <div className="absolute -left-24 top-0 hidden md:block">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          </div>
        )}

        {/* Logo and Brand */}
        <div className="text-center space-y-6 pt-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#69A297] to-[#558b80] rounded-2xl flex items-center justify-center shadow-lg shadow-[#69A297]/20">
            <Sparkles className="h-8 w-8 text-white" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Welcome to MoodScape
            </h1>
            <p className="text-slate-500 text-lg">
              Your sanctuary for reflection
            </p>
          </div>
        </div>

        <Card className="backdrop-blur-xl bg-white/80 border-slate-200/60 shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="space-y-1 pb-6 border-b border-slate-100/50 bg-white/50">
            {onBack && (
              <div className="md:hidden mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-500 hover:text-slate-800 -ml-2"
                  onClick={onBack}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
                </Button>
              </div>
            )}
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 p-1 bg-slate-100/80 rounded-xl">
                <TabsTrigger
                  value="signin"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all duration-200 font-medium text-slate-500"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all duration-200 font-medium text-slate-500"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="signin" className="space-y-4 focus-visible:outline-none">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email" className="text-slate-700 font-medium">Email</Label>
                      <Input
                        id="signin-email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="bg-white/50 border-slate-200 focus:border-[#69A297] focus:ring-[#69A297]/20 transition-all duration-200 h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="signin-password" className="text-slate-700 font-medium">Password</Label>
                        <a href="#" className="text-xs text-[#69A297] hover:text-[#558b80] font-medium">Forgot password?</a>
                      </div>
                      <div className="relative">
                        <Input
                          id="signin-password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          className="pr-10 bg-white/50 border-slate-200 focus:border-[#69A297] focus:ring-[#69A297]/20 transition-all duration-200 h-11"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-slate-400 hover:text-slate-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#2D3436] hover:bg-[#000000] text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl h-12 font-medium text-base mt-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4 focus-visible:outline-none">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name" className="text-slate-700 font-medium">Display Name</Label>
                      <Input
                        id="signup-name"
                        name="displayName"
                        type="text"
                        placeholder="Your name"
                        value={formData.displayName}
                        onChange={handleInputChange}
                        className="bg-white/50 border-slate-200 focus:border-[#69A297] focus:ring-[#69A297]/20 transition-all duration-200 h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-slate-700 font-medium">Email</Label>
                      <Input
                        id="signup-email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="bg-white/50 border-slate-200 focus:border-[#69A297] focus:ring-[#69A297]/20 transition-all duration-200 h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-slate-700 font-medium">Password</Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          className="pr-10 bg-white/50 border-slate-200 focus:border-[#69A297] focus:ring-[#69A297]/20 transition-all duration-200 h-11"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-slate-400 hover:text-slate-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#2D3436] hover:bg-[#000000] text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl h-12 font-medium text-base mt-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </div>
            </Tabs>
          </CardHeader>
        </Card>

        <p className="text-center text-sm text-slate-400">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}