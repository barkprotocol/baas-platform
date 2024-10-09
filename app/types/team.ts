// Define a type for Team members
export interface TeamMember {
    id: string;  // Unique identifier for the member
    name: string;  // Member's name
    email: string;  // Member's email address
    role: string;  // Role in the team (e.g., Admin, Member)
  }
  
  // Define the Team type
  export interface Team {
    id: string;  // Unique identifier for the team
    ownerEmail: string;  // Email of the team owner
    name: string;  // Team name
    members: TeamMember[];  // List of team members
    createdAt: Date;  // Date the team was created
    updatedAt: Date;  // Date the team information was last updated
  }
  