export default defineEventHandler((): ApiResponse<undefined> => {
  return {
    error: false,
    ...httpStatusMessage[200],
    message: "Alive",
  };
});
