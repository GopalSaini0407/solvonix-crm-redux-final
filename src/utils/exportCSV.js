export const exportCSV = async ({
  dispatch,
  action,
  params = {},
  fileName = "export.csv",
  mimeType = "text/csv",
}) => {
  try {
    const result = await dispatch(action(params));

    if (!action.fulfilled.match(result)) {
      console.error("Export failed", result);
      return;
    }

    const blob = new Blob([result.payload], { type: mimeType });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Export error", err);
  }
};
