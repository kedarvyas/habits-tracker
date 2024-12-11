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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";
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

  // Fixed months array with proper formatting
  const months = [
    { name: 'Jan', number: 0 }, { name: 'Feb', number: 1 },
    { name: 'Mar', number: 2 }, { name: 'Apr', number: 3 },
    { name: 'May', number: 4 }, { name: 'Jun', number: 5 },
    { name: 'Jul', number: 6 }, { name: 'Aug', number: 7 },
    { name: 'Sep', number: 8 }, { name: 'Oct', number: 9 },
    { name: 'Nov', number: 10 }, { name: 'Dec', number: 11 }
  ];

  const generateDates = () => {
    const today = new Date();
    const dates = [];

    switch (timeframe) {
      case 'week':
        // Get the current day of the week (0 = Sunday, 6 = Saturday)
        const currentDay = today.getDay();
        // Calculate the date of the previous Sunday
        const sunday = new Date(today);
        sunday.setDate(today.getDate() - currentDay);

        // Generate 7 days starting from Sunday
        for (let i = 0; i < 7; i++) {
          const date = new Date(sunday);
          date.setDate(sunday.getDate() + i);
          dates.push(date);
        }
        break;
      case 'month':
        // Get the first day of the month
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const startingDay = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.

        // Add empty dates for padding
        for (let i = 0; i < startingDay; i++) {
          dates.push(null);
        }

        // Add actual dates
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        for (let i = 1; i <= daysInMonth; i++) {
          dates.push(new Date(today.getFullYear(), today.getMonth(), i));
        }
        break;
      case 'year':
        // Year view code remains the same
        break;
    }
    return dates;
  };
  const calculateStreak = (entries) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get dates where habit was completed
    const completedDates = Object.entries(entries)
      .filter(([_, completed]) => completed)
      .map(([date]) => new Date(date))
      .sort((a, b) => b - a); // Sort in descending order

    if (completedDates.length === 0) return 0;

    let streak = 0;
    const oneDayMs = 24 * 60 * 60 * 1000;
    let currentDate = today;

    // Check if there's an entry for today
    const todayEntry = completedDates.find(date =>
      date.toDateString() === today.toDateString()
    );

    // If no entry for today, check if there was one yesterday
    if (!todayEntry) {
      const yesterday = new Date(today - oneDayMs);
      const yesterdayEntry = completedDates.find(date =>
        date.toDateString() === yesterday.toDateString()
      );
      if (!yesterdayEntry) return 0;
    }

    // Calculate streak
    for (const date of completedDates) {
      const diff = Math.floor((currentDate - date) / oneDayMs);

      if (diff <= 1) {
        streak++;
        currentDate = date;
      } else {
        break;
      }
    }

    return streak;
  };

  const toggleHabitEntry = (habitId, date) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const newEntries = { ...habit.entries };
        const dateStr = date.toISOString().split('T')[0];
        newEntries[dateStr] = !newEntries[dateStr];

        return {
          ...habit,
          entries: newEntries,
          streak: calculateStreak(newEntries)
        };
      }
      return habit;
    }));
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


  const generateMonthDates = (year, month) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dates = [];
    for (let i = 1; i <= daysInMonth; i++) {
      dates.push(new Date(year, month, i));
    }
    return dates;
  };

  const renderHabitGrid = (habit) => {
    const today = new Date().toDateString();

    if (timeframe === 'year') {
      const today = new Date();
      const lastSixMonths = Array.from({ length: 8 })
        .map((_, i) => {
          const d = new Date();
          d.setMonth(d.getMonth() - (7 - i));
          return {
            name: months[d.getMonth()].name,
            number: d.getMonth(),
            year: d.getFullYear()
          };
        });

      return (
        <div className="space-y-2">
          <div className="grid grid-cols-8 gap-1">
            {lastSixMonths.map((month) => (
              <div key={month.name} className="text-xs text-muted-foreground text-center">
                {month.name}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-8 gap-1">
            {lastSixMonths.map((month) => {
              const isCurrentMonth = month.number === today.getMonth();
              const monthDates = generateMonthDates(month.year, month.number);

              // Calculate grid dimensions based on the number of days
              const totalDays = monthDates.length;
              const cols = 4; // Keep 4 columns for consistent layout
              const rows = Math.ceil(totalDays / cols);

              return (
                <div
                  key={month.name}
                  className={`grid grid-cols-4 gap-0.5 ${isCurrentMonth ? 'bg-secondary/10 rounded-md p-0.5' : ''}`}
                  style={{
                    gridTemplateRows: `repeat(${rows}, 1fr)`
                  }}
                >
                  {monthDates.map((date, i) => {
                    const isToday = date.toDateString() === today.toDateString();
                    const hasEntry = getEntryStatus(habit, date);

                    return (
                      <div key={i} className="relative group">
                        <button
                          onClick={() => toggleHabitEntry(habit.id, date)}
                          className={`
                            aspect-square rounded-[2px] transition-all w-full
                            ${hasEntry
                              ? 'bg-primary hover:bg-primary/90'
                              : isToday
                                ? 'bg-secondary/50 hover:bg-secondary/70'
                                : 'bg-secondary/20 hover:bg-secondary/30'
                            }
                            ${habit.streak > 1 ? 'shadow-sm' : ''}
                          `}
                        />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-card text-card-foreground text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                          {date.toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (timeframe === 'month') {
      const dates = generateDates();
      // Filter out null values (padding days)
      const actualDates = dates.filter(date => date !== null);

      // Calculate optimal grid layout
      const rows = 4;
      const cols = Math.ceil(actualDates.length / rows);

      return (
        <div className="w-full py-4 px-2">
          <div className="grid gap-2" style={{
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            aspectRatio: `${cols} / ${rows}`
          }}>
            {actualDates.map((date, index) => {
              const isToday = date.toDateString() === new Date().toDateString();
              const hasEntry = getEntryStatus(habit, date);

              return (
                <div key={index} className="relative group">
                  <button
                    onClick={() => toggleHabitEntry(habit.id, date)}
                    className={`
    aspect-square rounded-md transition-all w-full
    ${hasEntry
                        ? 'bg-primary hover:bg-primary/90'
                        : isToday
                          ? 'bg-secondary/70 hover:bg-secondary/80'
                          : 'bg-secondary/40 hover:bg-secondary/50'
                      }
  `}
                  />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-card text-card-foreground text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {date.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (timeframe === 'week') {
      return (
        <div className="grid grid-cols-7 gap-1 w-full">
          {generateDates().map((date, index) => {
            const isToday = date.toDateString() === today;
            const hasEntry = getEntryStatus(habit, date);

            return (
              <div key={index} className="relative group">
                <button
                  onClick={() => toggleHabitEntry(habit.id, date)}
                  className={`
                    aspect-square transition-all w-full
                    ${hasEntry
                      ? 'bg-primary hover:bg-primary/90'
                      : isToday
                        ? 'bg-secondary/50 hover:bg-secondary/70'
                        : 'bg-secondary/20 hover:bg-secondary/30'
                    }
                  `}
                />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-card text-card-foreground text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {date.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    return null;
  }

  const getEntryStatus = (habit, date) => {
    const dateStr = date.toISOString().split('T')[0];
    return habit.entries[dateStr];
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
        <div>
          {/* Top row with logo and controls */}
          <div className="flex justify-between items-center">
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
                <DropdownMenuContent
                  align="end"
                  className="bg-card/95 border-none"
                >
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
                  <DropdownMenuItem onClick={() => setTheme("blood")}>
                    <div className="w-4 h-4 rounded-full bg-red-900 mr-2" />
                    Blood
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

          {/* Centered titles below */}
          <div className="text-center mt-6 mb-8">
            <h1 className="text-5xl font-bold tracking-tight mb-2">habits</h1>
            <p className="text-muted-foreground text-sm">Track your habits every day</p>
          </div>
        </div>

        {/* Habits List */}
        {habits.map(habit => (
          <Card key={habit.id} className="mb-4 bg-card border-none shadow-lg">
            <CardContent className="p-6"> {/* Increased padding */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-medium">{habit.name}</h2>
                  <span className={`text-xs px-2 py-1 rounded-full ${habit.streak > 1
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                    }`}>
                    {habit.streak} DAY STREAK
                  </span>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-card/90 border-none sm:max-w-[300px] w-[90%] p-4"> {/* Reduced max-width and added padding */}
                    <AlertDialogHeader className="space-y-2 pb-2">
                      <AlertDialogTitle className="text-base text-center">
                        Delete habit &quot;{habit.name}&quot;?
                      </AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex flex-col gap-2 sm:flex-row sm:gap-2">
                      <AlertDialogAction
                        onClick={() => deleteHabit(habit.id)}
                        className="bg-destructive/40 hover:bg-destructive/60 text-destructive-foreground sm:order-2 w-full"
                      >
                        Delete
                      </AlertDialogAction>
                      <AlertDialogCancel className="bg-secondary/50 hover:bg-secondary/70 sm:order-1 w-full">
                        Cancel
                      </AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              {renderHabitGrid(habit)}
            </CardContent>
          </Card>
        ))}

        {/* Create Button */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full mt-6 bg-card border-none hover:bg-secondary/50 py-6 text-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
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
      {/* Footer */}
      <div className="flex justify-center mt-12 mb-4">
        <p className="text-xs text-muted-foreground font-light tracking-wide">
          built by kv - v1.1
        </p>
      </div>
    </div>
  );
};

export default HabitsTracker;