import exceljs from "exceljs";

const headerTitles = {
    clientName: "Client name",
    location: "Client location",
}

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
    return workbook.xlsx.writeFile(`data/${folderName}/${workbookName}.xlsx`);
}