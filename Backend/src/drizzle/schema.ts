import { pgTable, serial, text, varchar, timestamp, integer, date, time, boolean, pgEnum, check } from "drizzle-orm/pg-core";

import { relations, sql } from "drizzle-orm";
import { use } from "react";


//Enums
export const roleEnum = pgEnum("role", ["patient", "support_partner", "admin"]);
export const riskLevelEnum = pgEnum("risk_level", ["low", "medium", "high"]);


// Tables
export const userTable = pgTable("users", {
  userId: serial("userId").primaryKey(),
  userName: text("userName").notNull(),
  email: varchar("email").unique(),
  password: varchar("password").notNull(),
  contactPhone: varchar("contact_phone", { length: 20 }).notNull(),
  streak_days: integer("streak_days").default(0),
  longest_streak: integer("longest_streak").default(0),
  address: text("address"),
  userType: roleEnum("userType").default("patient"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const checkinTable = pgTable("daily-checkins",{
    checkinId: serial("checkinId").primaryKey(),
    userId: integer("userId").references(() => userTable.userId),
    checkinAt: timestamp("checkinAt").defaultNow().notNull(),
    cravings: integer("cravings").notNull(),
    control: integer("control").notNull(),
    selfEfficacy: integer("self_efficacy").notNull(),
    consequences: boolean("consequences").notNull(),
    copingUsed: boolean("coping_used").notNull(),
    notes: text("notes"),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow(),
},
(table) => ({
    cravingRange: check("craving_range",
        sql`${table.cravings} BETWEEN 1 AND 10`
    ),

    controlRange: check("control_range",
        sql`${table.control} BETWEEN 1 AND 10`
    ),
    selfEfficacyRange: check("self_efficacy_range",
        sql`${table.selfEfficacy} BETWEEN 1 AND 10 `
    )
}))

export const riskScoreTable = pgTable("risk-Scores", {
    scoreId: serial("riskScore").primaryKey(),
    userId: integer("userId").references(() => userTable.userId),
    score: integer("score").notNull(),
    riskLevel: riskLevelEnum("riskLevel").default("low"),
    createdAt: timestamp("createdAt").defaultNow()
})

export const supportpartnersTable = pgTable("support-partners", {
    partnerId: serial("partnerId").primaryKey(),
    userId: integer("user").references(() => userTable.userId),
    partnerName: text("partnerName").notNull(),
    contactInfo: text("contactInfo").notNull(),
    relationship: text("relationship").notNull(),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow(),
})

export const supportPartnersActionsTable = pgTable("support-partners-actions", ({
    actionId: serial("actionId").primaryKey(),
    partnerId: integer("partnerId").references(() => supportpartnersTable.partnerId),
    userId: integer("userId").references(() => userTable.userId),
    success: boolean("success").notNull(),
    actionDescription: text("actionDescription").notNull(),
    createdAt: timestamp("createdAt").defaultNow(),
}))

export const chatRoomTable = pgTable("chatRoom", {
    roomId: serial("roomId").primaryKey(),
    isPersistent: boolean("isPersistent").default(true),
    description: text("description"),
    createdAt: timestamp("createdAt").defaultNow(),
})

export const messagesTable = pgTable("chats", {
    messagesId: serial("chatsId").primaryKey(),
    roomId: integer("roomId").references(() => chatRoomTable.roomId),
    userId: integer("userId").references(() => userTable.userId),
    message: text("message").notNull(),
    sender: roleEnum("sender").notNull(),
    createdAt: timestamp("createdAt").defaultNow(),
})

//Relations
//userRelations
export const userRelations = relations(userTable, ({ many}) => ({
    checkins: many(checkinTable),
    riskScores: many(riskScoreTable),
    supportPartners: many(supportpartnersTable),
    supportPartnerActions: many(supportPartnersActionsTable),
    messages: many(messagesTable),
}));

//CheckinRelations
export const checkInRelations = relations(checkinTable, ({one}) =>({
    user: one(userTable,{
        fields: [checkinTable.userId],
        references: [userTable.userId],
    }),
}));

//RiskScoreRelations
export const riskscoreRelations = relations(riskScoreTable, ({one }) => ({
    user: one(userTable, {
        fields: [riskScoreTable.userId],
        references: [userTable.userId],
    }),
}) );

//SupportPartnerRelations
export const supportPartnerRelations = relations(supportpartnersTable, ({one, many}) => ({
    user: one(userTable, {
        fields: [supportpartnersTable.userId],
        references: [userTable.userId],
    }),
    actions: many(supportPartnersActionsTable),
}));

//SupportPartnerActionsRelations
export const supportPartnerActionsRelations = relations(supportPartnersActionsTable, ({one}) => ({
    user: one(userTable, {
        fields: [supportPartnersActionsTable.userId],
        references: [userTable.userId],
    }),
    partner: one(supportpartnersTable, {
        fields: [supportPartnersActionsTable.partnerId],
        references: [supportpartnersTable.partnerId],
    }),
}));

//chatRoomRelations
export const chatRoomRelations = relations(chatRoomTable, ({many}) => ({
    messages: many(messagesTable),
}));

//message relations
export const messagesRelations = relations(messagesTable, ({one}) => ({
    user: one(userTable, {
        fields: [messagesTable.userId],
        references: [userTable.userId],
    }),
    chatRoom: one(chatRoomTable, {
        fields: [messagesTable.roomId],
        references: [chatRoomTable.roomId],
    }),
}));

//Types
export type TUserInsert = typeof userTable.$inferInsert;
export type TUserSelect = typeof userTable.$inferSelect;

export type TCheckinSelect = typeof checkinTable.$inferSelect;
export type TCheckinInsert = typeof checkinTable.$inferInsert;

export type TRiskScoreSelect = typeof riskScoreTable.$inferSelect;
export type TRiskScoreInsert = typeof riskScoreTable.$inferInsert;

export type TPartnerSelect = typeof supportpartnersTable.$inferSelect;
export type TPartnerInsert = typeof supportpartnersTable.$inferInsert;

export type TSupportPartnerActionsSelect = typeof supportPartnersActionsTable.$inferSelect;
export type TSupportPartnerActionsInsert = typeof supportPartnersActionsTable.$inferInsert;

export type TChatRoomSelect = typeof chatRoomTable.$inferSelect;
export type TChatRoomInsert = typeof chatRoomTable.$inferInsert;

export type TMessageSelect = typeof messagesTable.$inferSelect;
export type TMessageInsert = typeof messagesTable.$inferInsert;
