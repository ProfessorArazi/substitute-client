export const getBlob = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      const byteCharacters = atob(
        fileReader.result.slice(fileReader.result.indexOf(",") + 1)
      );
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/gif" });

      const img = URL.createObjectURL(blob);
      resolve(img);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};
