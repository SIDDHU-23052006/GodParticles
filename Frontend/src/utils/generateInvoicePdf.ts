import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { getCompany } from "./companyStorage";

export const generateInvoicePdf = async (invoice:any) => {

  const company = getCompany();

  const element = document.createElement("div");
  element.style.width = "800px";
  element.style.padding = "30px";
  element.style.fontFamily = "Arial";
  element.style.background = "white";

  element.innerHTML = `
  <div>
    <div style="display:flex;justify-content:space-between;align-items:center">
      <div>
        <h2>${company.tradeName || "Company Name"}</h2>
        <p>${company.address || ""}</p>
        <p>${company.phone || ""}</p>
        <p>${company.email || ""}</p>
        <p>GSTIN: ${company.gstin || "-"}</p>
      </div>
      ${
        company.logo
          ? `<img src="${company.logo}" width="90" height="90"/>`
          : ""
      }
    </div>

    <hr/>

    <h3>Invoice #: ${invoice.number}</h3>
    <p>Client: ${invoice.clientName}</p>
    <p>Issue Date: ${invoice.issueDate}</p>
    <p>Due Date: ${invoice.dueDate || "-"}</p>

    <table border="1" width="100%" cellspacing="0" cellpadding="8" style="margin-top:20px">
      <tr>
        <th>Item</th>
        <th>Qty</th>
        <th>Price</th>
        <th>Total</th>
      </tr>

      ${invoice.items
        .map(
          (i:any) => `
        <tr>
          <td>${i.name}</td>
          <td>${i.qty}</td>
          <td>₹${i.price}</td>
          <td>₹${i.total.toFixed(2)}</td>
        </tr>
      `
        )
        .join("")}
    </table>

    <h2 style="text-align:right;margin-top:20px">Grand Total: ₹${invoice.total.toFixed(2)}</h2>

    <p style="margin-top:40px">Thank you for your business!</p>
  </div>
  `;

  document.body.appendChild(element);

  const canvas = await html2canvas(element);
  const img = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  pdf.addImage(img, "PNG", 5, 5, 200, 287);
  pdf.save(`Invoice-${invoice.number}.pdf`);

  document.body.removeChild(element);
};