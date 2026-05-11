/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import XLSX from 'xlsx-js-style';
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
    
    // JENIS: 1 (Multiple Choice), 2 (Essay)
    let jenis = 1; 
    if (q.options === undefined || q.options.length === 0) jenis = 2;

    const startRowIdx = currentRowIdx;

    // Find key label (A, B, C...)
    let keyLabel = q.correctAnswer;
    if (options.length > 0) {
      const correctIdx = options.findIndex(opt => 
        opt.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()
      );
      
      if (correctIdx !== -1) {
        keyLabel = String.fromCharCode(65 + correctIdx);
      } else {
        if (q.correctAnswer.length > 1 && q.correctAnswer.includes('.')) {
          keyLabel = q.correctAnswer.split('.')[0].trim();
        } else if (q.correctAnswer.length === 1) {
          keyLabel = q.correctAnswer.toUpperCase();
        }
      }
    }

    // Reference pattern: 1 row per option (A-E)
    const displayOptions = [...options];
    while (displayOptions.length < 5) displayOptions.push('');

    displayOptions.forEach((opt, oIdx) => {
      const optionLabel = String.fromCharCode(65 + oIdx);
      
      const row = [
        oIdx === 0 ? questionNum : '', // NO (A)
        oIdx === 0 ? q.text : '', // SOAL (B)
        '', // GAMBAR (C)
        questionNum, // NOMOR (D)
        optionLabel, // PIL (E)
        opt.replace(/^[A-E][.\)]\s*/i, ''), // PILIHAN (F)
        '', // PERNYATAAN (G)
        oIdx === 0 ? jenis : '', // JENIS (H)
        oIdx === 0 ? keyLabel : '', // KUNCI (I)
        oIdx === 0 ? 5 : '' // OPSI PER SOAL (J)
      ];
      
      rows.push(row);
      currentRowIdx++;
    });

    const endRowIdx = currentRowIdx - 1;

    // Merge Cells to match reference
    merges.push({ s: { r: startRowIdx, c: 0 }, e: { r: endRowIdx, c: 0 } }); // NO
    merges.push({ s: { r: startRowIdx, c: 1 }, e: { r: endRowIdx, c: 1 } }); // SOAL
    merges.push({ s: { r: startRowIdx, c: 2 }, e: { r: endRowIdx, c: 2 } }); // GAMBAR
    merges.push({ s: { r: startRowIdx, c: 7 }, e: { r: endRowIdx, c: 7 } }); // JENIS
    merges.push({ s: { r: startRowIdx, c: 8 }, e: { r: endRowIdx, c: 8 } }); // KUNCI
    merges.push({ s: { r: startRowIdx, c: 9 }, e: { r: endRowIdx, c: 9 } }); // OPSI
  });

  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  worksheet['!merges'] = merges;

  // Add borders and colors
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell_address = { c: C, r: R };
      const cell_ref = XLSX.utils.encode_cell(cell_address);
      if (!worksheet[cell_ref]) worksheet[cell_ref] = { t: 's', v: '' };
      
      const style: any = {
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } }
        },
        alignment: {
          vertical: "center",
          wrapText: true
        }
      };

      if (R === 0) {
        style.fill = { fgColor: { rgb: "FFFF00" } };
        style.font = { bold: true };
        style.alignment.horizontal = "center";
      }

      worksheet[cell_ref].s = style;
    }
  }

  worksheet['!cols'] = [
    { wch: 5 }, { wch: 50 }, { wch: 20 }, { wch: 8 }, { wch: 5 }, 
    { wch: 40 }, { wch: 20 }, { wch: 8 }, { wch: 10 }, { wch: 10 }
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data-Soal');
  XLSX.writeFile(workbook, `Template_Soal_${data.identity.subject.replace(/\s+/g, '_')}.xls`);
}
