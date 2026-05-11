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
  rows.push(headers);

  questions.forEach((q, qIdx) => {
    const questionNum = qIdx + 1;
    const options = q.options || [];
    const optionCount = options.length;
    
    // Determine JENIS (1 for MCQ, 2 for Essay - based on typical patterns)
    const jenis = 1; // Assuming mostly MCQ based on the UI flow

    options.forEach((opt, oIdx) => {
      const optionLabel = String.fromCharCode(65 + oIdx); // A, B, C, D...
      
      const row = [
        oIdx === 0 ? questionNum : '', // NO (only on first row)
        oIdx === 0 ? q.text : '', // SOAL (only on first row)
        '', // GAMBAR
        questionNum, // NOMOR (repeats)
        optionLabel, // PIL
        opt, // PILIHAN
        '', // PERNYATAAN
        oIdx === 0 ? jenis : '', // JENIS (only on first row)
        oIdx === 0 ? q.correctAnswer : '', // KUNCI (only on first row)
        oIdx === 0 ? optionCount : '' // OPSI PER SOAL (only on first row)
      ];
      
      rows.push(row);
    });

    // Add an empty row between questions for better readability if needed,
    // though the reference image has them contiguous.
  });

  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Exam Questions');

  // Generate XLS file
  XLSX.writeFile(workbook, `Soal_${data.identity.subject.replace(/\s+/g, '_')}_Kelas${data.identity.grade}.xls`);
}
