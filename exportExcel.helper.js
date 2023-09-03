import exceljs from "exceljs";

   
export const createWorkbook = () => {
    return new exceljs.Workbook();
};

export const createWorksheet = (workbook, workSheetName, data) => {
    const worksheet = workbook.addWorksheet(workSheetName);

    // const headers = Object.keys(data[0]);
    // worksheet.addRow(data[0]);

    data.forEach((item) => {
        // const row = [];
        // headers.forEach((header) => {
        // row.push(item[header]);
        // });
        worksheet.addRow([item]);
    });

    return workbook;
};

export const exportToExcel = (workbook, workbookName) => {
    return workbook.xlsx.writeFile(`data/${workbookName}.xlsx`);
}