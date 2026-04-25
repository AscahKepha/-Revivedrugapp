import { userTable, TUserInsert, TUserSelect } from "../drizzle/schema";
import db from "../drizzle/db";
import {eq} from "drizzle-orm"


//register a new user
export const createUserService = async (userData: TUserInsert) : Promise<string> =>{
    await db.insert(userTable).values(userData).returning();
    return "User Created Successfully 😎"
}

export const getUserByEmailService = async (email:string):Promise<TUserSelect | undefined> => {
    return await db.query.userTable.findFirst({
        where:(eq(userTable.email, email))
    })
}