import QRCode from "qrcode";

export const generateQRCode = async (data, options = {}) => {
  try {
    const defaultOptions = {
      errorCorrectionLevel: "M",
      type: "image/png",
      quality: 0.92,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
      width: 256,
    };

    const qrOptions = { ...defaultOptions, ...options };

    // Generate QR code as data URL
    const qrDataURL = await QRCode.toDataURL(data, qrOptions);

    // Generate QR code as SVG
    const qrSVG = await QRCode.toString(data, {
      type: "svg",
      errorCorrectionLevel: "M",
      margin: 1,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
      width: 256,
    });

    return {
      dataURL: qrDataURL,
      svg: qrSVG,
      data: data,
    };
  } catch (error) {
    console.error("QR Code generation error:", error);
    throw new Error("Failed to generate QR code");
  }
};

export const generateProductQRCode = async (
  productId,
  baseUrl = "http://localhost:5173"
) => {
  const qrData = `${baseUrl}/product/${productId}`;
  return await generateQRCode(qrData);
};

export const generateCredentialQRCode = async (
  credentialId,
  baseUrl = "http://localhost:5173"
) => {
  const qrData = `${baseUrl}/credential/${credentialId}`;
  return await generateQRCode(qrData);
};
