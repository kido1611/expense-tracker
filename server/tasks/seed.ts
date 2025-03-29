import { createUser } from "~~/server/database/actions/users";

export default defineTask({
  meta: {
    name: "db:seed",
    description: "Run database seed task",
  },
  async run() {
    console.log("Running DB seed task...");

    await createUser({
      name: "Test User",
      email: "test@email.com",
      password: "password",
      passwordConfirmation: "password",
    });

    return {
      result: "success",
    };
  },
});
