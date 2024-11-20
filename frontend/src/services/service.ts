const API_BASE_URL = "http://localhost:8080/task";

export interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
}
export const fetchTasks = async (): Promise<Task[]> => {
  try {
    const response = await fetch(API_BASE_URL);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch tasks: HTTP ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    throw new Error(
      `Failed to fetch tasks: ${(error as Error).message || error}`
    );
  }
};

export const addTask = async (title: string) => {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  return response.json();
};

export const updateTaskStatus = async (id: string, isCompleted: boolean) => {
  const response = await fetch(`${API_BASE_URL}/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isCompleted }),
  });
  return response.json();
};

export const deleteTask = async (id: string) => {
  await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
};

export const clearCompletedTasks = async () => {
  await fetch(`${API_BASE_URL}/clear/completed`, { method: "DELETE" });
};

export const clearAllTasks = async () => {
  await fetch(`${API_BASE_URL}/clear/all`, { method: "DELETE" });
};
