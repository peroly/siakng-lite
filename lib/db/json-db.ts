import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');

interface User {
  id: number;
  username: string;
  password: string;
  role: 'dosen' | 'mahasiswa';
  nama: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Course {
  id: number;
  kode: string;
  nama: string;
  sks: number;
  dosen_id: number;
  createdAt?: string;
  updatedAt?: string;
}

function getUsersFile() {
  return path.join(dataDir, 'users.json');
}

function getCoursesFile() {
  return path.join(dataDir, 'courses.json');
}

// Users operations
export async function findUserByUsername(username: string): Promise<User | null> {
  const filePath = getUsersFile();
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  return data.find((u: User) => u.username === username) || null;
}

export async function findUserById(id: number): Promise<User | null> {
  const filePath = getUsersFile();
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  return data.find((u: User) => u.id === id) || null;
}

export async function getAllUsers(): Promise<User[]> {
  const filePath = getUsersFile();
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

// Courses operations
export async function findCourseById(id: number): Promise<Course | null> {
  const filePath = getCoursesFile();
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  return data.find((c: Course) => c.id === id) || null;
}

export async function findCourseByKode(kode: string): Promise<Course | null> {
  const filePath = getCoursesFile();
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  return data.find((c: Course) => c.kode === kode) || null;
}

export async function getAllCourses(): Promise<Course[]> {
  const filePath = getCoursesFile();
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

export async function getCoursesByDosenId(dosenId: number): Promise<Course[]> {
  const filePath = getCoursesFile();
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  return data.filter((c: Course) => c.dosen_id === dosenId);
}

export async function createCourse(course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<Course> {
  const filePath = getCoursesFile();
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  const newCourse: Course = {
    id: Math.max(...data.map((c: Course) => c.id), 0) + 1,
    ...course,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  data.push(newCourse);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  
  return newCourse;
}

export async function updateCourse(id: number, updates: Partial<Course>): Promise<Course | null> {
  const filePath = getCoursesFile();
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  const index = data.findIndex((c: Course) => c.id === id);
  if (index === -1) return null;
  
  const updatedCourse = {
    ...data[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  data[index] = updatedCourse;
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  
  return updatedCourse;
}

export async function deleteCourse(id: number): Promise<boolean> {
  const filePath = getCoursesFile();
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  const filteredData = data.filter((c: Course) => c.id !== id);
  
  if (filteredData.length === data.length) {
    return false; // Course not found
  }
  
  fs.writeFileSync(filePath, JSON.stringify(filteredData, null, 2));
  return true;
}
