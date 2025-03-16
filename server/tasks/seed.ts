import { v4 as uuidv4 } from "uuid";

export default defineTask({
  meta: {
    name: "db:seed",
    description: "Run database seed task",
  },
  async run() {
    console.log("Running DB seed task...");
    const users = [
      {
        name: "Test User",
        uuid: uuidv4(),
        email: "test@email.com",
        password: await hashPassword("password"),
      },
    ];

    const [user] = await useDrizzle()
      .insert(tables.users)
      .values(users)
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

    return {
      result: "success",
    };
  },
});
