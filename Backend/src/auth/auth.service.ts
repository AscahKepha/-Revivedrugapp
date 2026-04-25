import { userTable, type TUserInsert, type TUserSelect } from "../drizzle/schema";
import db from "../drizzle/db";
import { eq } from "drizzle-orm";

/**
 * Registers a new user and returns the full user object.
 * We change the return type from string to TUserSelect so the 
 * controller can access the auto-generated 'userId'.
 */
export const createUserService = async (userData: TUserInsert): Promise<TUserSelect> => {
    const [newUser] = await db.insert(userTable).values(userData).returning();
    
    if (!newUser) {
        throw new Error("Failed to create user record.");
    }

    return newUser;
};

/**
 * Retrieves a user by their email address.
 * findFirst is used here to match your schema's unique email constraint.
 */
export const getUserByEmailService = async (email: string): Promise<TUserSelect | undefined> => {
    return await db.query.userTable.findFirst({
        where: eq(userTable.email, email),
    });
};

/**
 * Optional: Retrieves a user by ID 
 * Useful for 'get profile' or 'check auth' middleware.
 */
export const getUserByIdService = async (userId: number): Promise<TUserSelect | undefined> => {
    return await db.query.userTable.findFirst({
        where: eq(userTable.userId, userId),
    });
};