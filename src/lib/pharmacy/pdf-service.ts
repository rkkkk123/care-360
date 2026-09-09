import { Prescription } from "@/types/models/prescription";

export class PrescriptionPdfService {
  static generatePrescriptionHtml(prescription: Prescription): string {
    const itemsHtml = prescription.items
      .map(
        (item, index) => `
      <div style="border-bottom: 1px solid #e2e8f0; padding: 16px 0;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px;">
          <span style="font-size: 16px; font-weight: 600; color: #0f172a;">${index + 1}. ${item.name} (${item.strength})</span>
          <span style="font-size: 13px; font-weight: 600; color: #3b82f6;">Qty: ${item.quantity} ${item.form}s • Refills: ${item.refills}</span>
        </div>
        <div style="font-size: 14px; color: #334155; line-height: 1.5; margin-bottom: 4px;">
          <strong>Sig:</strong> ${item.instructions}
        </div>
        <div style="font-size: 12px; color: #64748b;">
          <strong>Indication:</strong> ${item.indication} • <strong>Substitution Allowed:</strong> ${item.substitutionAllowed ? "Yes" : "Dispense as Written (DAW)"}
        </div>
      </div>
    `
      )
      .join("");

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Official Prescription - ${prescription.prescriptionNumber}</title>
  <style>
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none !important; }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #f8fafc;
      color: #0f172a;
      margin: 0;
      padding: 32px 16px;
    }
    .prescription-box {
      max-width: 750px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }
    .header {
      display: flex;
      justify-content: space-between;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 20px;
      margin-bottom: 24px;
    }
    .rx-symbol {
      font-family: Georgia, serif;
      font-size: 38px;
      font-weight: bold;
      color: #0f172a;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      background: #f1f5f9;
      padding: 16px;
      border-radius: 12px;
      font-size: 13px;
      margin-bottom: 24px;
    }
    .footer {
      margin-top: 32px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 12px;
      color: #64748b;
    }
    .signature-line {
      width: 240px;
      border-bottom: 1px solid #0f172a;
      padding-bottom: 4px;
      font-family: cursive;
      font-size: 18px;
      color: #0f172a;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="no-print" style="max-width: 750px; margin: 0 auto 16px; display: flex; justify-content: space-between; align-items: center;">
    <span style="font-size: 13px; color: #64748b;">CARE360 Official Telehealth e-Prescription (NCPDP Compliant)</span>
    <button onclick="window.print()" style="background: #0f172a; color: white; border: none; padding: 8px 16px; border-radius: 9999px; font-size: 12px; font-weight: 500; cursor: pointer;">
      Print / Save PDF
    </button>
  </div>

  <div class="prescription-box">
    <div class="header">
      <div>
        <h1 style="margin: 0; font-size: 22px; font-weight: 600; color: #0f172a;">CARE360 CLINICAL TELEHEALTH</h1>
        <p style="margin: 4px 0 0; font-size: 13px; color: #475569;">Verified Physician Healthcare Network</p>
      </div>
      <div style="text-align: right;">
        <span style="font-family: monospace; font-size: 16px; font-weight: bold; color: #0f172a;">${prescription.prescriptionNumber}</span>
        <p style="margin: 4px 0 0; font-size: 12px; color: #64748b;">Issued: ${new Date(prescription.issuedAt || prescription.createdAt).toLocaleDateString()}</p>
      </div>
    </div>

    <div class="meta-grid">
      <div>
        <strong>Patient:</strong> ${prescription.patientName}<br>
        <strong>DOB:</strong> ${prescription.patientDob || "N/A"}<br>
        <strong style="color: #dc2626;">Known Allergies:</strong> ${(prescription.patientAllergies || []).join(", ") || "None"}
      </div>
      <div>
        <strong>Prescribing Doctor:</strong> ${prescription.doctorName}, ${prescription.doctorTitle}<br>
        <strong>License:</strong> ${prescription.doctorLicense}<br>
        <strong>Diagnosis:</strong> ${prescription.clinicalDiagnosis}
      </div>
    </div>

    <div style="margin-bottom: 24px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
        <span class="rx-symbol">℞</span>
        <span style="font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #475569;">Prescribed Medication Order</span>
      </div>
      ${itemsHtml}
    </div>

    ${prescription.doctorNotes ? `<div style="background: #fffbeb; border: 1px solid #fef3c7; padding: 12px; border-radius: 8px; font-size: 12px; color: #92400e; margin-bottom: 24px;"><strong>Doctor Instructions:</strong> ${prescription.doctorNotes}</div>` : ""}

    <div class="footer">
      <div>
        <p style="margin: 0 0 4px; font-family: monospace; font-size: 11px;">Cryptographic Seal: ${prescription.immutableHash}</p>
        <p style="margin: 0; font-size: 11px;">Valid for fulfillment at any verified CARE360 pharmacy partner within 365 days.</p>
      </div>
      <div style="text-align: center;">
        <div class="signature-line">${prescription.doctorName}</div>
        <span style="font-size: 11px; color: #64748b; margin-top: 4px; display: block;">Authorized Digital Signature</span>
      </div>
    </div>
  </div>
  <script>
    window.onload = function() {
      // Auto-trigger the print/save-as-pdf dialog in the new tab
      setTimeout(() => {
        window.print();
      }, 500);
    }
  </script>
</body>
</html>`;
  }
}
