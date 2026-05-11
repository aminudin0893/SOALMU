/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as XLSX from 'xlsx';
import { ExamData, QuestionType } from '../types';

export function exportToExcel(data: ExamData) {
  const { questions } = data;
  
  const headers = [
    'NO',
    'SOAL',
    'GAMBAR (JIKA SOAL BERGAMBAR DAN KASIH KETERANGAN GAMBAR)',
    'NOMOR',
    'PIL',
    'PILIHAN',
    'PERNYATAAN',
    'JENIS',
    'KUNCI',
    'OPSI PER SOAL'
  ];

  const rows: any[] = [];
  const merges: XLSX.Range[] = [];
  
  rows.push(headers);

  let currentRowIdx = 1; // 0-indexed where row 0 is header

  questions.forEach((q, qIdx) => {
    const questionNum = qIdx + 1;
    const options = q.options || [];
    const optionCount = options.length;
    
    // JENIS: 1 (Multiple Choice), 2 (Essay), 3 (Matching), 4 (True/False)
    let jenis = 1; 
    if (q.options === undefined || q.options.length === 0) jenis = 2;

    const startRowIdx = currentRowIdx;

    options.forEach((opt, oIdx) => {
      const optionLabel = String.fromCharCode(65 + oIdx); // A, B, C, D...
      
      const row = [
        oIdx === 0 ? questionNum : '', // NO (A)
        oIdx === 0 ? q.text : '', // SOAL (B)
        '', // GAMBAR (C)
        questionNum, // NOMOR (D)
        optionLabel, // PIL (E)
        opt, // PILIHAN (F)
        '', // PERNYATAAN (G)
        oIdx === 0 ? jenis : '', // JENIS (H)
        oIdx === 0 ? q.correctAnswer : '', // KUNCI (I)
        oIdx === 0 ? optionCount : '' // OPSI PER SOAL (J)
      ];
      
      rows.push(row);
      currentRowIdx++;
    });

    const endRowIdx = currentRowIdx - 1;

    // Merge Cells to match reference (if question has multiple rows/options)
    if (optionCount > 1) {
      // Column A: NO
      merges.push({ s: { r: startRowIdx, c: 0 }, e: { r: endRowIdx, c: 0 } });
      // Column B: SOAL
      merges.push({ s: { r: startRowIdx, c: 1 }, e: { r: endRowIdx, c: 1 } });
      // Column C: GAMBAR
      merges.push({ s: { r: startRowIdx, c: 2 }, e: { r: endRowIdx, c: 2 } });
      // Column H: JENIS
      merges.push({ s: { r: startRowIdx, c: 7 }, e: { r: endRowIdx, c: 7 } });
      // Column I: KUNCI
      merges.push({ s: { r: startRowIdx, c: 8 }, e: { r: endRowIdx, c: 8 } });
      // Column J: OPSI
      merges.push({ s: { r: startRowIdx, c: 9 }, e: { r: endRowIdx, c: 9 } });
    }
  });

  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  
  // Set Merges
  worksheet['!merges'] = merges;

  // Set Column Widths (Approximation in characters)
  worksheet['!cols'] = [
    { wch: 5 },  // NO
    { wch: 50 }, // SOAL
    { wch: 20 }, // GAMBAR
    { wch: 8 },  // NOMOR
    { wch: 5 },  // PIL
    { wch: 40 }, // PILIHAN
    { wch: 20 }, // PERNYATAAN
    { wch: 8 },  // JENIS
    { wch: 10 }, // KUNCI
    { wch: 10 }  // OPSI
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data-Soal');

  // FileName format
  const fileName = `Template_Soal_${data.identity.subject.replace(/\s+/g, '_')}_Kelas${data.identity.grade}.xls`;
  XLSX.writeFile(workbook, fileName);
}
