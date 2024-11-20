"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';
import {
  addTask,
  clearAllTasks,
  clearCompletedTasks,
  deleteTask,
  fetchTasks,
  Task,
  updateTaskStatus,
} from "@/services/service";
export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const tasks = await fetchTasks();
        setTasks(tasks);
        console.log("Fetched tasks:", tasks);
      } catch (error) {
        console.error("Fail to Fetched :", (error as Error).message);
      }
    };
    loadTasks();
  }, []);
  const handleAddTask = async () => {
    if (newTask.trim() === "") return;
    const addedTask = await addTask(newTask);
    setTasks([
      ...tasks,
      { id: addedTask.id, title: newTask, isCompleted: false },
    ]);
    setNewTask("");
  };

  const toggleComplete = async (id: string) => {
    const taskToUpdate = tasks.find((task) => task.id === id);
    if (!taskToUpdate) return;

    try {
      const updatedTask = await updateTaskStatus(id, !taskToUpdate.isCompleted);
      setTasks(
        tasks.map((task) =>
          task.id === id
            ? { ...task, isCompleted: updatedTask.isCompleted }
            : task
        )
      );
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    // const taskToDelete = tasks.find((task) => task.id === id);
    await deleteTask(id);
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const clearCompleted = async () => {
    await clearCompletedTasks();
    setTasks(tasks.filter((task) => !task.isCompleted));
  };

  const clearAll = async () => {
    await clearAllTasks();
    setTasks([]);
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: "5rem auto",
        padding: 2,
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Tasks ({tasks.length && 0})
      </Typography>
      <Box sx={{ display: "flex", marginBottom: 2 }}>
        <TextField
          fullWidth
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New task"
          variant="outlined"
          size="small"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddTask}
          sx={{ marginLeft: 1 }}
          startIcon={<AddIcon  />}
          
        >
          Add
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          marginBottom: 2,

        }}
        gap={2}
      >
        <Button
          variant="contained"
          color="warning"
          onClick={clearCompleted}
          disabled={!tasks.some((task) => task.isCompleted)}
          startIcon={<CheckIcon  />}
        >
          Clear Completed
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={clearAll}
          disabled={tasks.length > 0 ?false : true}
          startIcon={<DeleteIcon  />}
        >
          Clear All
        </Button>
      </Box>
      <List>
        {tasks?.map((task) => (
          <ListItem
            key={task.id}
            sx={{
              backgroundColor: task.isCompleted ? "#d4edda" : "#dfdfdf",
              textDecoration: task.isCompleted ? "line-through" : "none",
              marginBottom: 1,
              borderRadius: 1,
              cursor : 'pointer',
              ':hover' : {
                backgroundColor: task.isCompleted ? "#DDEBDA" : "#dcdcdc",
              }
            }}
          >
            <ListItemText
              primary={task.title}
              onClick={() => toggleComplete(task.id)}
            />
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => handleDeleteTask(task.id)}
            >
              <DeleteIcon color="error" />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
