"use client";

import {
  Activity,
  Bot,
  Camera,
  CheckCircle2,
  Cloud,
  Database,
  HeartPulse,
  LockKeyhole,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
  Utensils,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const nutritionResult = {
  score: 78,
  category: "Good",
  calories: 620,
  protein: 32,
  carbs: 72,
  fat: 18,
  fibre: 6,
  sodium: 890,
  confidence: 0.91,
};

const foods = [
  { name: "Chicken Rice", portion: "1 serving", calories: 620, protein: 32, carbs: 72, fat: 18 },
  { name: "Cucumber garnish", portion: "0.5 serving", calories: 12, protein: 0.4, carbs: 2, fat: 0 },
  { name: "Chilli sauce", portion: "1 tbsp", calories: 24, protein: 0.3, carbs: 4, fat: 0.8 },
];

const recommendations = [
  "Swap half the white rice for brown rice to increase whole grains.",
  "Ask for sauce on the side to reduce sodium and sugar.",
  "Add one serving of vegetables, such as chye sim or kai lan.",
  "Choose steamed or roasted protein more often than deep-fried options.",
];

const clinicianPatients = [
  { name: "Amirah T.", adherence: 86, risk: "Low", hpbScore: 82 },
  { name: "Daniel L.", adherence: 62, risk: "Moderate", hpbScore: 59 },
  { name: "Lim S. H.", adherence: 44, risk: "High", hpbScore: 41 },
];

const adminMetrics = [
  { label: "AI analyses today", value: "1,284", icon: Bot },
  { label: "WhatsApp messages", value: "482", icon: MessageCircle },
  { label: "Audit events", value: "9,318", icon: ShieldCheck },
  { label: "System health", value: "99.96%", icon: Activity },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-background to-white">
      <section className="container grid gap-10 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:py-16">
        <div className="flex flex-col justify-center">
          <div className="mb-5 flex flex-wrap gap-2">
            <Badge className="bg-emerald-600">Singapore HPB aligned</Badge>
            <Badge variant="secondary">OpenAI Vision ready</Badge>
            <Badge variant="outline">AWS ap-southeast-1</Badge>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 md:text-6xl">
            Food AI platform for healthier Singapore meals.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Upload a meal photo, send a WhatsApp message, or chat with an AI nutrition coach to estimate
            calories, macros, sodium, fibre, and a Healthy Eating Index based on Singapore HPB guidance.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
              <Camera className="mr-2" /> Analyse meal
            </Button>
            <Button size="lg" variant="outline">
              <Stethoscope className="mr-2" /> Clinician dashboard
            </Button>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              ["PDPA controls", "RBAC, audit logs, encrypted secrets"],
              ["Food AI workflow", "Vision, structured JSON, pgvector"],
              ["Clinical views", "Risk alerts, adherence, reports"],
            ].map(([title, body]) => (
              <Card key={title} className="border-emerald-100 bg-white/80">
                <CardHeader className="p-4">
                  <CheckCircle2 className="mb-2 h-5 w-5 text-emerald-600" />
                  <CardTitle className="text-base">{title}</CardTitle>
                  <CardDescription>{body}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        <Card className="overflow-hidden border-emerald-100 shadow-elevated">
          <CardHeader className="bg-slate-950 text-white">
            <CardTitle className="flex items-center gap-2">
              <Utensils className="text-emerald-300" /> Example AI nutrition result
            </CardTitle>
            <CardDescription className="text-slate-300">
              Structured output stored against the user's secure meal record.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 p-6">
            <div className="rounded-2xl bg-emerald-50 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Healthy Eating Score</p>
                  <p className="text-4xl font-bold text-emerald-700">{nutritionResult.score}/100</p>
                </div>
                <Badge className="bg-emerald-600">{nutritionResult.category}</Badge>
              </div>
              <Progress value={nutritionResult.score} className="mt-4" />
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {[
                ["Calories", `${nutritionResult.calories} kcal`],
                ["Protein", `${nutritionResult.protein} g`],
                ["Carbs", `${nutritionResult.carbs} g`],
                ["Fat", `${nutritionResult.fat} g`],
                ["Fibre", `${nutritionResult.fibre} g`],
                ["Sodium", `${nutritionResult.sodium} mg`],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border bg-card p-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
                  <p className="text-lg font-semibold">{value}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl border bg-slate-50 p-4">
              <p className="mb-2 text-sm font-semibold">Detected foods ({Math.round(nutritionResult.confidence * 100)}% confidence)</p>
              <pre className="overflow-x-auto text-xs text-slate-700">
                {JSON.stringify({ foods }, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="container pb-16">
        <Tabs defaultValue="user" className="w-full">
          <TabsList className="grid h-auto w-full grid-cols-1 gap-2 bg-transparent p-0 md:grid-cols-3">
            <TabsTrigger value="user" className="rounded-xl border bg-white data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              User dashboard
            </TabsTrigger>
            <TabsTrigger value="clinician" className="rounded-xl border bg-white data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Clinician dashboard
            </TabsTrigger>
            <TabsTrigger value="admin" className="rounded-xl border bg-white data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Admin dashboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="user" className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="text-emerald-600" /> AI Nutrition Coach
                </CardTitle>
                <CardDescription>Personalized Singapore food recommendations.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recommendations.map((item) => (
                  <div key={item} className="rounded-xl bg-emerald-50 p-3 text-sm">
                    {item}
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Weekly trends</CardTitle>
                <CardDescription>Calories, macros, sodium, fruit and vegetable servings.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-3">
                {[
                  ["Daily calories", "1,845", 72],
                  ["Vegetable servings", "1.8/day", 60],
                  ["Sodium limit", "78% used", 78],
                ].map(([label, value, progress]) => (
                  <div key={label as string} className="rounded-xl border p-4">
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="mb-3 text-2xl font-bold">{value}</p>
                    <Progress value={progress as number} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clinician" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HeartPulse className="text-emerald-600" /> Patient adherence and risk
                </CardTitle>
                <CardDescription>Role-protected review queue for clinicians and dietitians.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                {clinicianPatients.map((patient) => (
                  <div key={patient.name} className="rounded-xl border p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{patient.name}</p>
                      <Badge variant={patient.risk === "High" ? "destructive" : "secondary"}>{patient.risk}</Badge>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">Adherence</p>
                    <Progress value={patient.adherence} className="mt-2" />
                    <p className="mt-3 text-sm text-muted-foreground">HPB score: {patient.hpbScore}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admin" className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {adminMetrics.map(({ label, value, icon: Icon }) => (
              <Card key={label}>
                <CardHeader>
                  <Icon className="h-6 w-6 text-emerald-600" />
                  <CardDescription>{label}</CardDescription>
                  <CardTitle>{value}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </section>

      <section className="border-t bg-slate-950 py-12 text-white">
        <div className="container grid gap-6 md:grid-cols-4">
          {[
            [Database, "PostgreSQL + pgvector", "Structured meal records and food embeddings."],
            [MessageCircle, "WhatsApp Business API", "Photo and text meal intake via webhook."],
            [Cloud, "AWS Singapore", "ECS Fargate, RDS, ElastiCache, S3, CloudFront."],
            [LockKeyhole, "Healthcare security", "JWT, RBAC, audit logs, TLS, encrypted storage."],
          ].map(([Icon, title, body]) => (
            <div key={title as string} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <Icon className="mb-3 h-6 w-6 text-emerald-300" />
              <p className="font-semibold">{title as string}</p>
              <p className="mt-2 text-sm text-slate-300">{body as string}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
