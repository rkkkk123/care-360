"use client";

import * as React from "react";
import { demoTrendData } from "@/features/patient/data/demoData";
import { Activity, Scale } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  LineChart
} from "recharts";

export function HealthCharts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Blood Pressure Chart */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col group relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="flex items-start justify-between mb-6 relative z-10">
          <div>
            <h3 className="text-base font-semibold text-foreground tracking-tight">Blood Pressure Trend</h3>
            <p className="text-xs text-muted-foreground mt-1">Systolic & Diastolic (mmHg)</p>
          </div>
          <div className="p-2.5 bg-primary/10 rounded-2xl border border-primary/20 shadow-sm shadow-primary/10 text-primary">
            <Activity className="w-5 h-5" />
          </div>
        </div>
        
        <div className="h-56 w-full relative z-10 mt-auto">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={demoTrendData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSystolic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorDiastolic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} 
                domain={['dataMin - 10', 'dataMax + 10']}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: '1px solid hsl(var(--border))',
                  backgroundColor: 'hsl(var(--card))',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
                }}
                itemStyle={{ fontSize: '13px', fontWeight: 500 }}
                labelStyle={{ color: 'hsl(var(--muted-foreground))', fontSize: '12px', marginBottom: '4px' }}
              />
              <Area 
                type="monotone" 
                dataKey="systolic" 
                name="Systolic"
                stroke="var(--primary)" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorSystolic)" 
                activeDot={{ r: 6, strokeWidth: 0, fill: "var(--primary)" }}
              />
              <Area 
                type="monotone" 
                dataKey="diastolic" 
                name="Diastolic"
                stroke="#8b5cf6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorDiastolic)" 
                activeDot={{ r: 6, strokeWidth: 0, fill: "#8b5cf6" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Weight Chart */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col group relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="flex items-start justify-between mb-6 relative z-10">
          <div>
            <h3 className="text-base font-semibold text-foreground tracking-tight">Body Weight Trend</h3>
            <p className="text-xs text-muted-foreground mt-1">Weight over time (kg)</p>
          </div>
          <div className="p-2.5 bg-blue-500/10 rounded-2xl border border-blue-500/20 shadow-sm shadow-blue-500/10 text-blue-500">
            <Scale className="w-5 h-5" />
          </div>
        </div>
        
        <div className="h-56 w-full relative z-10 mt-auto">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={demoTrendData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} 
                domain={['dataMin - 2', 'dataMax + 2']}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: '1px solid hsl(var(--border))',
                  backgroundColor: 'hsl(var(--card))',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                }}
                itemStyle={{ fontSize: '13px', fontWeight: 500, color: '#3b82f6' }}
                labelStyle={{ color: 'hsl(var(--muted-foreground))', fontSize: '12px', marginBottom: '4px' }}
                formatter={(value: number) => [`${value} kg`, 'Weight']}
              />
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke="#3b82f6" 
                strokeWidth={4}
                dot={{ r: 4, strokeWidth: 2, fill: "hsl(var(--card))", stroke: "#3b82f6" }}
                activeDot={{ r: 7, strokeWidth: 0, fill: "#3b82f6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
