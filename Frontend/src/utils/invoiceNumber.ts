export const generateInvoiceNumber = () => {
  const last = localStorage.getItem("invoice_number");
  const next = last ? parseInt(last) + 1 : 1;
  localStorage.setItem("invoice_number", next.toString());
  return `INV-${next.toString().padStart(4, "0")}`;
};
