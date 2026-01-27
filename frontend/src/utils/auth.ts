// src/utils/auth.ts

// Public user (NO password)
export interface User {
  username: string;
  role: "student" | "teacher";
  name: string;
  email: string;
  phone: string;
  studentId?: string;
  district?: string;
  grade?: string;
  subject?: string;
}

// Stored user (WITH password – internal use only)
interface StoredUser extends User {
  password: string;
}

export const loginUser = (
  username: string,
  password: string
): { success: boolean; user?: User; error?: string } => {
  try {
    const registeredUsers: StoredUser[] = JSON.parse(
      localStorage.getItem("registeredUsers") || "[]"
    );

    const user = registeredUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      return { success: false, error: "Incorrect username or password" };
    }

    // Remove password before storing or returning
    const { password: _, ...userWithoutPassword } = user;

    localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
    localStorage.setItem("userRole", user.role);
    localStorage.setItem("username", user.username);

    return { success: true, user: userWithoutPassword };
  } catch {
    return { success: false, error: "An error occurred during login" };
  }
};

export const logoutUser = () => {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("userRole");
  localStorage.removeItem("username");
};

export const getCurrentUser = (): User | null => {
  try {
    const userStr = localStorage.getItem("currentUser");
    return userStr ? (JSON.parse(userStr) as User) : null;
  } catch {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return !!getCurrentUser();
};

export const getUserRole = (): "student" | "teacher" | null => {
  return localStorage.getItem("userRole") as "student" | "teacher" | null;
};
