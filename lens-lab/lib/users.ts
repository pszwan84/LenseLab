import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

export interface User {
    id: string;
    email: string;
    username: string;
    passwordHash: string;
    apiBaseUrl: string;
    apiKey: string;
    createdAt: string;
}

/**
 * Ensure the data directory and users file exist
 */
function ensureDataFile() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(USERS_FILE)) {
        fs.writeFileSync(USERS_FILE, '[]', 'utf-8');
    }
}

/**
 * Read all users from disk
 */
function readUsers(): User[] {
    ensureDataFile();
    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    try {
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

/**
 * Write all users to disk
 */
function writeUsers(users: User[]) {
    ensureDataFile();
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

/**
 * Find a user by email
 */
export function findUserByEmail(email: string): User | null {
    const users = readUsers();
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

/**
 * Find a user by ID
 */
export function findUserById(id: string): User | null {
    const users = readUsers();
    return users.find((u) => u.id === id) || null;
}

/**
 * Create a new user
 */
export function createUser(email: string, username: string, passwordHash: string): User {
    const users = readUsers();

    // Check duplicate
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('该邮箱已注册');
    }

    const newUser: User = {
        id: randomUUID(),
        email: email.toLowerCase(),
        username,
        passwordHash,
        apiBaseUrl: '',
        apiKey: '',
        createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    writeUsers(users);
    return newUser;
}

/**
 * Update a user's API configuration
 */
export function updateUserApiConfig(userId: string, apiBaseUrl: string, apiKey: string): User {
    const users = readUsers();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) throw new Error('用户不存在');

    users[index].apiBaseUrl = apiBaseUrl;
    users[index].apiKey = apiKey;
    writeUsers(users);
    return users[index];
}
