import exceljs from "exceljs";

const exportExcel = async (data) => {
    console.log(data)
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    // const headers = Object.keys(data[0]);
    // worksheet.addRow(data[0]);

    data.forEach((item) => {
        // const row = [];
        // headers.forEach((header) => {
        // row.push(item[header]);
        // });
        worksheet.addRow([item]);
    });

    await workbook.xlsx.writeFile('data/data.xlsx');
}

export default exportExcel;