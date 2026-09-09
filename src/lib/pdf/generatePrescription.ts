import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface PrescriptionData {
  prescriptionId: string;
  doctorName: string;
  doctorTitle: string;
  doctorSpecialization: string;
  clinicAddress: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  date: string;
  medicines: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }>;
  notes: string;
}

export function generateAndDownloadPrescription(data: PrescriptionData) {
  const doc = new jsPDF();
  const primaryColor = [16, 185, 129]; // Emerald 500 equivalent

  // 1. Header
  doc.setFontSize(24);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont("helvetica", "bold");
  doc.text("CARE360", 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.setFont("helvetica", "normal");
  doc.text("Digital Health & Telemedicine Network", 14, 26);
  
  // Doctor details (Top Right)
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  doc.text(data.doctorName, 200, 20, { align: "right" });
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text(`${data.doctorTitle} | ${data.doctorSpecialization}`, 200, 26, { align: "right" });
  doc.text(data.clinicAddress, 200, 32, { align: "right" });

  doc.setLineWidth(0.5);
  doc.setDrawColor(220, 220, 220);
  doc.line(14, 38, 200, 38);

  // 2. Patient Details
  doc.setFontSize(11);
  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  doc.text("PATIENT INFORMATION", 14, 48);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Name: ${data.patientName}`, 14, 56);
  doc.text(`Age/Sex: ${data.patientAge} / ${data.patientGender}`, 14, 62);
  
  doc.text(`Date: ${data.date}`, 200, 56, { align: "right" });
  doc.text(`Prescription ID: ${data.prescriptionId}`, 200, 62, { align: "right" });

  // 3. Rx Symbol
  doc.setFontSize(36);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("Rx", 14, 80);

  // 4. Medicines Table
  const tableData = data.medicines.map((med, index) => [
    (index + 1).toString(),
    med.name,
    med.dosage,
    med.frequency,
    med.duration,
    med.instructions
  ]);

  autoTable(doc, {
    startY: 90,
    head: [['#', 'Medicine Name', 'Dosage', 'Frequency', 'Duration', 'Instructions']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [primaryColor[0], primaryColor[1], primaryColor[2]],
      textColor: 255,
      fontSize: 10,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 10,
      textColor: 50
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250]
    },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 40, fontStyle: 'bold', textColor: 0 },
      2: { cellWidth: 25 },
      3: { cellWidth: 25 },
      4: { cellWidth: 20 },
      5: { cellWidth: 'auto' }
    }
  });

  // 5. Notes / Advice
  const finalY = (doc as any).lastAutoTable.finalY || 100;
  
  doc.setFontSize(11);
  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  doc.text("Clinical Notes & Advice:", 14, finalY + 15);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80);
  
  const splitNotes = doc.splitTextToSize(data.notes, 180);
  doc.text(splitNotes, 14, finalY + 22);

  // 6. Footer & Signature
  doc.setLineWidth(0.5);
  doc.setDrawColor(220, 220, 220);
  doc.line(14, 270, 200, 270);
  
  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text("This is an electronically generated and cryptographically signed prescription.", 14, 276);
  doc.text("Valid only when verified through the CARE360 Pharmacy Network.", 14, 281);

  // Digital Signature
  doc.setFont("helvetica", "italic");
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(14);
  doc.text(data.doctorName, 200, 255, { align: "right" });
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text("Electronically Signed", 200, 260, { align: "right" });
  doc.text(data.date, 200, 265, { align: "right" });

  // Download the PDF
  doc.save(`CARE360_Prescription_${data.prescriptionId}.pdf`);
}
