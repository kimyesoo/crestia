"use client";

import { useState } from "react";
import { login, signup } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(true);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        try {
            const action = isLogin ? login : signup;
            const result = await action(formData);

            if (result?.error) {
                toast.error("Authentication Failed", {
                    description: result.error,
                });
            } else {
                toast.success(isLogin ? "Welcome back" : "Account created", {
                    description: "Redirecting...",
                });
            }
        } catch (error) {
            toast.error("Something went wrong", {
                description: "Please try again later.",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-black/95 p-4 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-500/10 via-black to-black opacity-50 pointer-events-none" />

            <Card className="w-full max-w-md border-gold-500/30 bg-black/80 backdrop-blur-xl shadow-2xl shadow-gold-900/10 z-10">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-3xl font-serif text-primary-foreground tracking-tight">
                        CRESTIA
                    </CardTitle>
                    <CardDescription className="text-muted-foreground uppercase tracking-widest text-xs">
                        Manage your legacy
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div className="space-y-2">
                                <Label htmlFor="full_name" className="text-muted-foreground">Full Name</Label>
                                <Input
                                    id="full_name"
                                    name="full_name"
                                    placeholder="John Doe"
                                    required
                                    className="bg-secondary/50 border-input/50 focus:border-gold-500/50 transition-colors"
                                />
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-muted-foreground">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                required
                                className="bg-secondary/50 border-input/50 focus:border-gold-500/50 transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-muted-foreground">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="bg-secondary/50 border-input/50 focus:border-gold-500/50 transition-colors"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-gold-500 text-black hover:bg-gold-400 transition-colors font-semibold"
                            disabled={isLoading}
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLogin ? "Sign In" : "Create Account"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <div className="relative w-full">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-muted/20" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-black px-2 text-muted-foreground">Or</span>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        className="w-full text-muted-foreground hover:text-gold-400"
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
