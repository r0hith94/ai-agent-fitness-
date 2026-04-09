/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Dumbbell, 
  ChevronRight, 
  ChevronLeft, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Utensils,
  Trophy,
  Info,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { generateFitnessPlan } from "@/lib/gemini";

type UserData = {
  age: string;
  weight: string;
  height: string;
  level: string;
  goal: string;
  injuries: string;
};

export default function App() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData>({
    age: "",
    weight: "",
    height: "",
    level: "beginner",
    goal: "fat loss",
    injuries: "",
  });

  const handleInputChange = (field: keyof UserData, value: string) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    if (!userData.age || !userData.weight || !userData.height) {
      setError("Please fill in all basic measurements.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await generateFitnessPlan(userData);
      setPlan(result || "No plan generated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setPlan(null);
    setStep(1);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-orange-100">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-orange-500 p-2 rounded-xl shadow-lg shadow-orange-200">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">FitCoach <span className="text-orange-500">AI</span></h1>
          </div>
          {plan && (
            <Button variant="ghost" size="sm" onClick={reset} className="text-slate-500 hover:text-orange-500">
              <RefreshCw className="w-4 h-4 mr-2" />
              New Plan
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <AnimatePresence mode="wait">
          {!plan ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 w-full" />
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl">Personalize Your Journey</CardTitle>
                  <CardDescription>Tell us about yourself so we can build the perfect plan for you.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {step === 1 && (
                    <motion.div 
                      className="space-y-4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="age">Age</Label>
                          <Input 
                            id="age" 
                            type="number" 
                            placeholder="e.g. 25" 
                            value={userData.age}
                            onChange={(e) => handleInputChange("age", e.target.value)}
                            className="bg-slate-50 border-slate-200 focus:ring-orange-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="weight">Weight (kg)</Label>
                          <Input 
                            id="weight" 
                            type="number" 
                            placeholder="e.g. 75" 
                            value={userData.weight}
                            onChange={(e) => handleInputChange("weight", e.target.value)}
                            className="bg-slate-50 border-slate-200 focus:ring-orange-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="height">Height (cm)</Label>
                          <Input 
                            id="height" 
                            type="number" 
                            placeholder="e.g. 180" 
                            value={userData.height}
                            onChange={(e) => handleInputChange("height", e.target.value)}
                            className="bg-slate-50 border-slate-200 focus:ring-orange-500"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div 
                      className="space-y-4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Fitness Level</Label>
                          <Select 
                            value={userData.level} 
                            onValueChange={(v) => handleInputChange("level", v)}
                          >
                            <SelectTrigger className="bg-slate-50 border-slate-200">
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner</SelectItem>
                              <SelectItem value="intermediate">Intermediate</SelectItem>
                              <SelectItem value="advanced">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Your Goal</Label>
                          <Select 
                            value={userData.goal} 
                            onValueChange={(v) => handleInputChange("goal", v)}
                          >
                            <SelectTrigger className="bg-slate-50 border-slate-200">
                              <SelectValue placeholder="Select goal" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="fat loss">Fat Loss</SelectItem>
                              <SelectItem value="muscle gain">Muscle Gain</SelectItem>
                              <SelectItem value="endurance">Endurance</SelectItem>
                              <SelectItem value="flexibility">Flexibility</SelectItem>
                              <SelectItem value="general health">General Health</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="injuries">Injuries or Health Concerns (Optional)</Label>
                        <Input 
                          id="injuries" 
                          placeholder="e.g. Lower back pain, knee injury" 
                          value={userData.injuries}
                          onChange={(e) => handleInputChange("injuries", e.target.value)}
                          className="bg-slate-50 border-slate-200 focus:ring-orange-500"
                        />
                      </div>
                    </motion.div>
                  )}

                  {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm border border-red-100">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between border-t border-slate-100 pt-6">
                  {step > 1 ? (
                    <Button variant="outline" onClick={() => setStep(step - 1)} disabled={loading}>
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                  ) : (
                    <div />
                  )}
                  
                  {step < 2 ? (
                    <Button onClick={() => setStep(step + 1)} className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-200">
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleGenerate} 
                      disabled={loading}
                      className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-200 min-w-[140px]"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          Build My Plan
                          <CheckCircle2 className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  )}
                </CardFooter>
              </Card>

              {/* Tips Section */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: Trophy, title: "Stay Consistent", desc: "Small daily actions lead to big results." },
                  { icon: Utensils, title: "Fuel Right", desc: "Nutrition is 70% of the fitness battle." },
                  { icon: Info, title: "Listen to Body", desc: "Rest is as important as the workout." }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center text-center p-4">
                    <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                      <item.icon className="w-6 h-6 text-orange-500" />
                    </div>
                    <h3 className="font-semibold text-slate-800">{item.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="plan"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">Your Personalized Plan</h2>
                  <p className="text-slate-500 flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none">
                      {userData.goal.toUpperCase()}
                    </Badge>
                    <span className="text-slate-300">•</span>
                    <span className="text-sm capitalize">{userData.level} Level</span>
                  </p>
                </div>
                <Button variant="outline" onClick={() => window.print()} className="hidden md:flex">
                  Print Plan
                </Button>
              </div>

              <Card className="border-none shadow-xl shadow-slate-200/50">
                <CardContent className="p-0">
                  <ScrollArea className="h-[70vh] w-full rounded-xl p-6 md:p-8">
                    <div className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-600 prose-li:text-slate-600 prose-strong:text-orange-600 prose-strong:font-semibold">
                      {plan.split('\n').map((line, i) => {
                        if (line.startsWith('Goal:')) {
                          return <h3 key={i} className="text-xl font-bold text-orange-600 mb-4 flex items-center gap-2">
                            <Trophy className="w-5 h-5" />
                            {line}
                          </h3>;
                        }
                        if (line.startsWith('Workout Plan:')) {
                          return <div key={i} className="mt-8 mb-4">
                            <h3 className="text-2xl font-bold flex items-center gap-2">
                              <Dumbbell className="w-6 h-6 text-orange-500" />
                              Workout Routine
                            </h3>
                            <Separator className="my-4" />
                          </div>;
                        }
                        if (line.startsWith('Diet Tips:')) {
                          return <div key={i} className="mt-12 mb-4">
                            <h3 className="text-2xl font-bold flex items-center gap-2">
                              <Utensils className="w-6 h-6 text-orange-500" />
                              Nutrition Guide
                            </h3>
                            <Separator className="my-4" />
                          </div>;
                        }
                        if (line.startsWith('Extra Advice:')) {
                          return <div key={i} className="mt-12 mb-4">
                            <h3 className="text-2xl font-bold flex items-center gap-2">
                              <Info className="w-6 h-6 text-orange-500" />
                              Coach's Notes
                            </h3>
                            <Separator className="my-4" />
                          </div>;
                        }
                        if (line.trim().startsWith('-')) {
                          return <li key={i} className="ml-4 mb-2 list-none flex items-start gap-3">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                            <span>{line.substring(1).trim()}</span>
                          </li>;
                        }
                        return <p key={i} className="mb-4 leading-relaxed">{line}</p>;
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <p className="text-xs text-orange-800 leading-relaxed">
                  <strong>Safety First:</strong> This plan is AI-generated. Always consult with a medical professional before starting a new exercise or nutrition program, especially if you have pre-existing conditions or injuries.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-12 text-center text-slate-400 text-sm">
        <p>© 2026 FitCoach AI • Built for your success</p>
      </footer>
    </div>
  );
}
