export const getCompany = () => {
  const stored = localStorage.getItem("companyProfile");
  return stored ? JSON.parse(stored) : null;
};

export const saveCompany = (data: any) => {
  localStorage.setItem("companyProfile", JSON.stringify(data));
};