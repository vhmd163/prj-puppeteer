import exceljs from "exceljs";

const headerTitles = {
  clientName: "Client name",
  location: "Client location",
  introduction: "Introduce your business",
  whatClientDo: "What you do there",
  impressiveness:
    "What did you find most impressive or unique about this company?",
  improvement:
    "Are there any areas for improvement or something they could have done differently?",
  selectionProcess: "How did you select this vendor",
  selectionCriteria: "what were the deciding factors?",
};

export const createWorkbook = () => {
  return new exceljs.Workbook();
};

export const createWorksheet = (workbook, workSheetName, data) => {
  const worksheet = workbook.addWorksheet(workSheetName.slice(0, 31));

  const columns = Object.keys(data[0]);
  const headers = columns.map((column) => headerTitles[column]);
  worksheet.addRow(headers);

  data.forEach((item) => {
    const row = [];
    columns.forEach((column) => {
      row.push(item[column]);
    });
    worksheet.addRow(row);
  });

  return workbook;
};

export const exportToExcel = (workbook, workbookName, folderName) => {
  const nameWithoutSpecialChars = workbookName.replace(/[^\w\s]/gi, "");
  return workbook.xlsx.writeFile(
    `data/${folderName}/${nameWithoutSpecialChars}.xlsx`,
  );
};
