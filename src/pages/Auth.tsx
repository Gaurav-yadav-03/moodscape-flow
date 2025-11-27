import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Heart, Sparkles, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import authBg from "@/assets/auth-bg.jpg";

interface AuthProps {
  onAuthSuccess: () => void;
}

const Auth = ({ onAuthSuccess }: AuthProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Welcome to Journal+",
        description: "Your personal space for reflection and growth",
      });
      // Navigate to dashboard after successful auth
      onAuthSuccess();
    }, 1500);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Hero background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${authBg})` }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 gradient-bg opacity-90" />

      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-secondary/20 rounded-full blur-2xl animate-pulse-soft"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 animate-slide-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-warm rounded-2xl shadow-medium">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-playfair font-semibold text-foreground">
              Journal<span className="text-primary">+</span>
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Your personal space for reflection and growth
          </p>
        </div>

        <Card className="journal-card animate-scale-in border-0">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50 p-1 rounded-xl">
              <TabsTrigger
                value="login"
                className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-soft transition-smooth"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-soft transition-smooth"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-0">
              <CardHeader className="space-y-2 pb-6">
                <CardTitle className="text-2xl font-playfair text-center">Welcome Back</CardTitle>
                <CardDescription className="text-center">
                  Continue your journaling journey
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      className="h-12 rounded-xl border-border bg-card/50 backdrop-blur-sm transition-smooth focus:shadow-soft"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="h-12 rounded-xl border-border bg-card/50 backdrop-blur-sm transition-smooth focus:shadow-soft pr-12"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-12 w-12 rounded-xl"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4 pt-6">
                  <Button
                    type="submit"
                    variant="gradient"
                    size="lg"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Signing In...
                      </div>
                    ) : (
                      <>
                        <Heart className="w-4 h-4" />
                        Sign In
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Forgot your password? <span className="text-primary hover:underline cursor-pointer">Reset it here</span>
                  </p>
                </CardFooter>
              </form>
            </TabsContent>

            <TabsContent value="register" className="space-y-0">
              <CardHeader className="space-y-2 pb-6">
                <CardTitle className="text-2xl font-playfair text-center">Join MoodScape</CardTitle>
                <CardDescription className="text-center">
                  Start your personal growth journey today
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your full name"
                      className="h-12 rounded-xl border-border bg-card/50 backdrop-blur-sm transition-smooth focus:shadow-soft"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-email" className="text-sm font-medium">Email</Label>
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="your@email.com"
                      className="h-12 rounded-xl border-border bg-card/50 backdrop-blur-sm transition-smooth focus:shadow-soft"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-password" className="text-sm font-medium">Password</Label>
                    <div className="relative">
                      <Input
                        id="reg-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        className="h-12 rounded-xl border-border bg-card/50 backdrop-blur-sm transition-smooth focus:shadow-soft pr-12"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-12 w-12 rounded-xl"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4 pt-6">
                  <Button
                    type="submit"
                    variant="gradient"
                    size="lg"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Creating Account...
                      </div>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Create Account
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By signing up, you agree to our{" "}
                    <span className="text-primary hover:underline cursor-pointer">Terms of Service</span>
                    {" "}and{" "}
                    <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>
                  </p>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        <div className="text-center mt-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <p className="text-sm text-muted-foreground">
            Join thousands of people on their growth journey
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;