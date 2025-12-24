'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, MapPin, Route, Sparkles, Instagram, Zap, Globe, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      {/* Hero Section */}
      <section className="relative flex-1 flex items-center justify-center p-8 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-5xl w-full space-y-10 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="p-4 rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg"
              >
                <MapPin className="h-10 w-10 text-primary-foreground" />
              </motion.div>
              <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Route-Aware AI
              </h1>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Travel Planner
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light">
              Transform your Instagram saves into perfectly optimized travel itineraries
            </p>
            <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto">
              No backtracking. No mental math. Just paste, mark, and go.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
          >
            <Button asChild size="lg" className="text-lg px-10 py-7 h-auto shadow-xl hover:shadow-2xl transition-all">
              <Link href="/context" className="flex items-center gap-2">
                Start Planning
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-10 py-7 h-auto border-2">
              <Link href="/itinerary">
                View Example
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">4</div>
              <div className="text-sm text-muted-foreground mt-1">Simple Steps</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">0</div>
              <div className="text-sm text-muted-foreground mt-1">Backtracking</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground mt-1">Route Optimized</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-8 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From Instagram saves to optimized itinerary in minutes
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Instagram,
                title: 'Share Inspiration',
                description: 'Paste Instagram links or type place names. We extract everything automatically.',
                color: 'from-pink-500 to-rose-500',
                delay: 0.1,
              },
              {
                icon: Sparkles,
                title: 'Mark Anchors',
                description: 'Select your must-visit places. Set time-locks for specific events.',
                color: 'from-yellow-500 to-amber-500',
                delay: 0.2,
              },
              {
                icon: Route,
                title: 'Auto-Optimize',
                description: 'Our AI creates route-optimized day-by-day plans. No backtracking.',
                color: 'from-blue-500 to-cyan-500',
                delay: 0.3,
              },
              {
                icon: MapPin,
                title: 'Explore & Export',
                description: 'View on map, see timeline, and export your perfect itinerary.',
                color: 'from-green-500 to-emerald-500',
                delay: 0.4,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: feature.delay, duration: 0.5 }}
              >
                <Card className="h-full border-2 hover:border-primary/50 transition-all hover:shadow-xl group">
                  <CardHeader className="space-y-4">
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${feature.color} w-fit shadow-lg group-hover:scale-110 transition-transform`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-primary mb-1">Step {index + 1}</div>
                      <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                      <CardDescription className="text-base leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose Us?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Get your itinerary in minutes, not hours.',
              },
              {
                icon: Globe,
                title: 'Route Optimized',
                description: 'Minimize travel time and maximize experiences.',
              },
              {
                icon: Clock,
                title: 'Time-Aware',
                description: 'Perfect timing for morning, afternoon, and evening activities.',
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8 rounded-2xl bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 border border-zinc-200 dark:border-zinc-800"
              >
                <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
                  <benefit.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-8 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center space-y-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to plan your perfect trip?
          </h2>
          <p className="text-xl text-muted-foreground">
            Get started in minutes. No sign-up required. No credit card needed.
          </p>
          <Button asChild size="lg" className="text-lg px-12 py-8 h-auto shadow-2xl hover:shadow-3xl transition-all">
            <Link href="/context" className="flex items-center gap-2">
              Start Planning Now
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </section>
    </main>
  );
}

