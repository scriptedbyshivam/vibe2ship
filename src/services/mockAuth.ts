import { User } from "../context/AuthContext";

const DEMO_ACCOUNTS = [
  {
    id: "demo-citizen",
    email: "citizen@civicmind.com",
    password: "Citizen@123",
    fullName: "Jane Citizen",
    role: "citizen",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    id: "demo-officer",
    email: "officer@civicmind.com",
    password: "Officer@123",
    fullName: "Officer Smith",
    role: "officer",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    id: "demo-admin",
    email: "admin@civicmind.com",
    password: "Admin@123",
    fullName: "System Admin",
    role: "admin",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&h=150&q=80",
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockAuth = {
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    await delay(1000); // Simulate network

    // Check demo accounts
    let user = DEMO_ACCOUNTS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      // Check registered accounts in localStorage
      const registeredUsers = JSON.parse(localStorage.getItem("demo_registered_users") || "[]");
      user = registeredUsers.find(
        (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
    }

    if (user) {
      const token = `demo_jwt_token_${user.id}_${Date.now()}`;
      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role as any,
          status: user.status as any,
          avatar: user.avatar,
        },
      };
    }

    throw new Error("Invalid email or password.");
  },

  async register(data: any): Promise<{ token: string; user: User }> {
    await delay(1000);

    const registeredUsers = JSON.parse(localStorage.getItem("demo_registered_users") || "[]");
    
    if (DEMO_ACCOUNTS.find((u) => u.email.toLowerCase() === data.email.toLowerCase()) || 
        registeredUsers.find((u: any) => u.email.toLowerCase() === data.email.toLowerCase())) {
      throw new Error("Email already in use.");
    }

    const newUser = {
      id: `user_${Date.now()}`,
      email: data.email,
      password: data.password, // Storing raw password for demo only
      fullName: data.fullName,
      role: data.role,
      status: data.role === "officer" ? "pending" : "active",
      avatar: data.avatar,
    };

    registeredUsers.push(newUser);
    localStorage.setItem("demo_registered_users", JSON.stringify(registeredUsers));

    const token = `demo_jwt_token_${newUser.id}_${Date.now()}`;
    return {
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role as any,
        status: newUser.status as any,
        avatar: newUser.avatar,
      },
    };
  }
};
