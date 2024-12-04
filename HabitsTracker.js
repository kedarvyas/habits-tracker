import React, { useState } from 'react';
import { Calendar, Plus, Settings } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const HabitsTracker = () => {
  const [timeframe, setTimeframe] = useState('month');
  const [habits, setHabits] = useState([
    { id: 1, name: 'Daily Leetcode', streak: 0, entries: {} }
  ]);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const generateDates = () => {
    const today = new Date();
    const dates = [];
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    
    for (let i = 1; i <= daysInMonth; i++) {
      dates.push(i);
    }
    return dates;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-500" />
            <h1 className="text-2xl font-bold">habits</h1>
          </div>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="year">Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Habits Grid */}
        {habits.map(habit => (
          <Card key={habit.id} className="mb-4 bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{habit.name}</span>
                <span className="text-sm bg-gray-800 px-2 py-1 rounded">
                  {habit.streak} DAY STREAK
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-31 gap-1">
                {generateDates().map(date => (
                  <div
                    key={date}
                    className="w-6 h-6 bg-gray-800 rounded cursor-pointer hover:bg-blue-600 transition-colors"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add Habit Button */}
        <button className="w-full mt-4 p-4 bg-gray-900 rounded-lg border border-gray-800 flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
          <Plus className="w-5 h-5" />
          <span>Create</span>
        </button>
      </div>
    </div>
  );
};

export default HabitsTracker;