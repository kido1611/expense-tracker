import { v7 as uuidv7 } from "uuid";
import { eq, and } from "drizzle-orm";

export async function getUsersByEmail(email: string) {
  const users = await useDrizzle()
    .select()
    .from(tables.users)
    .where(eq(tables.users.email, email));

  return users;
}

export async function getUserByEmail(email: string) {
  const user = await useDrizzle().query.users.findFirst({
    where: and(eq(tables.users.email, email)),
  });

  return user;
}

export async function getUserById(id: string) {
  const user = await useDrizzle().query.users.findFirst({
    where: and(eq(tables.users.id, id)),
  });

  return user;
}

export async function createUser(data: UserCreate) {
  const [user] = await useDrizzle()
    .insert(tables.users)
    .values([
      {
        name: data.name,
        id: uuidv7(),
        email: data.email,
        password: await hashPassword(data.password),
      },
    ])
    .returning();

  await useDrizzle()
    .insert(tables.categories)
    .values([
      // Income
      {
        userId: user.id,
        key: "income_salary",
        name: "Salary",
        isExpense: false,
        icon: "i-hugeicons-money-receive-02",
      },
      {
        userId: user.id,
        key: "income_other",
        name: "Other Income",
        isExpense: false,
        icon: "i-hugeicons-money-receive-02",
      },
      {
        userId: user.id,
        key: "income_transfer",
        name: "Incoming Transfer",
        isExpense: false,
        icon: "i-hugeicons-money-receive-02",
      },
      {
        userId: user.id,
        key: "income_balance",
        name: "Adjust Balance",
        isExpense: false,
        icon: "i-hugeicons-money-receive-02",
      },
      // Expense
      {
        userId: user.id,
        key: "expense_other",
        name: "Other Expense",
        isExpense: true,
        icon: "i-hugeicons-money-send-02",
      },
      {
        userId: user.id,
        key: "expense_transfer",
        name: "Outcoming Transfer",
        isExpense: true,
        icon: "i-hugeicons-money-send-02",
      },
      {
        userId: user.id,
        key: "expense_balance",
        name: "Adjust Balance",
        isExpense: true,
        icon: "i-hugeicons-money-send-02",
      },
    ]);

  return user;
}
