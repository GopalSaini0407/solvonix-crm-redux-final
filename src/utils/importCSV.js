export const importFromCSV = (file, callback) => {
    if (!file) return;
  
    const reader = new FileReader();
  
    reader.onload = (e) => {
      const text = e.target.result;
  
      const lines = text.split("\n").filter(Boolean);
  
      // 🔹 Headers (first row)
      const headers = lines[0]
        .replace("\r", "")
        .split(",")
        .map(h => h.trim());
  
      // 🔹 Data rows
      const data = lines.slice(1).map(line => {
        const values = line.replace("\r", "").split(",");
  
        const obj = {};
        headers.forEach((h, i) => {
          obj[h] = values[i]?.replace(/"/g, "").trim() || "";
        });
  
        return obj;
      });
  
      callback(data);
    };
  
    reader.readAsText(file);
  };
  



//   import { importFromCSV } from "@/utils/importCSV";

// const ContactImport = () => {
//   const handleImport = (e) => {
//     const file = e.target.files[0];

//     importFromCSV(file, (data) => {
//       console.log("Imported Data:", data);

//       // 🔥 Yahin se:
//       // dispatch(addContacts(data))
//       // OR api call
//       importFromCSV(file, (data) => {
//         dispatch(importContacts(data));
//       });
      
//     });
//   };

//   return (
//     <input
//       type="file"
//       accept=".csv"
//       onChange={handleImport}
//       className="block"
//     />
//   );
// };

// export default ContactImport;
