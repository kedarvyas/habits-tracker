"use client";
import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Moon, Sun, Paintbrush, Trash2 } from 'lucide-react';
import {
  Card,
  CardContent,
} from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { useTheme } from "next-themes";

const HabitsTracker = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [timeframe, setTimeframe] = useState('month');
  const [newHabit, setNewHabit] = useState({ name: '', frequency: 1, period: 'week' });
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [habits, setHabits] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('habits');
      return saved ? JSON.parse(saved) : [
        { id: 1, name: 'Daily Leetcode', streak: 0, entries: {}, frequency: 1, period: 'day' }
      ];
    }
    return [
      { id: 1, name: 'Daily Leetcode', streak: 0, entries: {}, frequency: 1, period: 'day' }
    ];
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('habits', JSON.stringify(habits));
    }
  }, [habits]);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const generateDates = () => {
    const today = new Date();
    const dates = [];

    switch (timeframe) {
      case 'week':
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          dates.push(date.getDate());
        }
        break;
      case 'month':
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        for (let i = 1; i <= daysInMonth; i++) {
          dates.push(i);
        }
        break;
      case 'year':
        dates.push(...months);
        break;
    }
    return dates;
  };

  const handleCreateHabit = () => {
    if (newHabit.name.trim()) {
      setHabits([
        ...habits,
        {
          id: Date.now(),
          name: newHabit.name,
          streak: 0,
          entries: {},
          frequency: parseInt(newHabit.frequency),
          period: newHabit.period
        }
      ]);
      setNewHabit({ name: '', frequency: 1, period: 'week' });
      setIsCreateOpen(false);
    }
  };

  const toggleHabitEntry = (habitId, date) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const newEntries = { ...habit.entries };
        const dateStr = new Date(2024, new Date().getMonth(), date).toISOString().split('T')[0];
        newEntries[dateStr] = !newEntries[dateStr];

        let streak = 0;
        const today = new Date();
        for (let i = 0; i < 31; i++) {
          const checkDate = new Date(today);
          checkDate.setDate(today.getDate() - i);
          const checkDateStr = checkDate.toISOString().split('T')[0];
          if (newEntries[checkDateStr]) streak++;
          else break;
        }

        return { ...habit, entries: newEntries, streak };
      }
      return habit;
    }));
  };

  const deleteHabit = (habitId) => {
    setHabits(habits.filter(habit => habit.id !== habitId));
  };

  if (!mounted) {
    return null; // or a loading skeleton
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto p-4">
        {/* Header */}
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-2">
            <div className="bg-primary/20 p-2 rounded-md">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-xl font-medium">habits</h1>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="w-8 h-8">
                  <Paintbrush className="h-4 w-4" aria-label={`Current theme: ${theme}`} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <Sun className="mr-2 h-4 w-4" />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <Moon className="mr-2 h-4 w-4" />
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("purple")}>
                  <div className="w-4 h-4 rounded-full bg-purple-500 mr-2" />
                  Purple
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("mint")}>
                  <div className="w-4 h-4 rounded-full bg-emerald-500 mr-2" />
                  Mint
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-28 bg-card border-none">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="year">Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-muted-foreground text-sm mb-8">Track your habits every day</p>

        {/* Habits List */}
        {habits.map(habit => (
          <Card key={habit.id} className="mb-4 bg-card border-none shadow-lg">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-medium">{habit.name}</h2>
                  <span className="text-xs px-2 py-1 bg-secondary rounded-full">
                    {habit.streak} DAY STREAK
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteHabit(habit.id)}
                  className="h-8 w-8 p-0 hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>

              <div className={`grid gap-2 ${timeframe === 'week'
                ? 'grid-cols-7 w-full max-w-2xl mx-auto'
                : timeframe === 'month'
                  ? 'grid-cols-31'
                  : 'grid-cols-12'
                }`}>
                {generateDates().map(date => (
                  <button
                    key={date}
                    onClick={() => toggleHabitEntry(habit.id, date)}
                    className={`
            aspect-square rounded-md transition-all
            ${habit.entries[new Date(2024, new Date().getMonth(), date).toISOString().split('T')[0]]
                        ? 'bg-primary shadow-lg scale-95'
                        : 'bg-secondary/30 hover:bg-secondary/50'
                      }
          `}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Create Button */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full mt-6 bg-card border-none hover:bg-secondary/50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-none">
            <DialogHeader>
              <DialogTitle>New Habit</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  placeholder="e.g., Read, Exercise, Meditate"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                  className="bg-secondary/30 border-none"
                />
              </div>
              <div className="flex gap-4">
                <div>
                  <Label>Frequency</Label>
                  <Input
                    type="number"
                    min="1"
                    value={newHabit.frequency}
                    onChange={(e) => setNewHabit({ ...newHabit, frequency: e.target.value })}
                    className="w-20 bg-secondary/30 border-none"
                  />
                </div>
                <div className="flex-1">
                  <Label>Period</Label>
                  <Select
                    value={newHabit.period}
                    onValueChange={(value) => setNewHabit({ ...newHabit, period: value })}
                  >
                    <SelectTrigger className="bg-secondary/30 border-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Day</SelectItem>
                      <SelectItem value="week">Week</SelectItem>
                      <SelectItem value="month">Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                onClick={handleCreateHabit}
                className="w-full bg-primary hover:bg-primary/90"
              >
                Create Habit
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default HabitsTracker;